var context = require('./gl.js');
var gl = context.gl;
function getUniformName(parts) {
  var name = parts[2].substring(0, parts[2].length - 1);
  return name;
}

function getShaderSource(path) {
  var p = new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", path);
    xhr.onload = function() {
      if(this.status === 200) {
        var parser = new DOMParser();
        var elm = parser.parseFromString(this.responseText, "application/xml").firstChild;
        var result = {
          name: path,
          type: elm.getAttribute("type"),
          src: elm.textContent
        }
        resolve(result);
      } else {
        reject(this.statusText)
      }
      }
    xhr.setRequestHeader("accepts", "application/xml")
    xhr.send();
  });
  return p;
}

function getShaderSources(name) {
  return Promise.all([getShaderSource("glsl/" + name + ".frag"), getShaderSource("glsl/" + name + ".vert")]);
}
function compileShader(src, typeStr) {
  var type = null;
  if(typeStr === "x-shader/x-vertex") {
    type = gl.VERTEX_SHADER;
  } else if(typeStr === "x-shader/x-fragment") {
    type = gl.FRAGMENT_SHADER;
  } else {
    return null;
  }

  var shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    return null;
  }
  return shader;
}

function createShaderProgram(vertexShader, fragmentShader) {
  var shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.err("Could not initialise shaders");
  }
  gl.useProgram(shaderProgram);
  return shaderProgram;
}

function Shader(vertData, fragData) {
  this.object = createShaderProgram(vertData.program, fragData.program);
  gl.useProgram(this.object);

  var uniforms = [];
  vertData.uniforms.forEach((u) => uniforms.push(u));
  fragData.uniforms.forEach((u) => uniforms.push(u));
  for(var i = 0; i < uniforms.length; i++) {
    var parts = uniforms[i].split(" ");
    let name = getUniformName(parts);
    let type = parts[1];
    let uniform = gl.getUniformLocation(this.object, name);
    this[name] = {};
    this[name].type = parts[1];
    Object.defineProperty(this, name, {
      enumerable: true,
      configurable: false,
      get: function() {
        return type;
      },
      set: function(newValue) {
        console.log("set uniform " + name);
        //setUniform(newValue, parts[1]);
      }
    });
  }
}

Shader.createShader = function(name) {
  return new Promise(function(resolve, reject) {
    var shaderSources = [];
    var progs = {};
    var shaders = [];
    var promise = ["glsl/" + name + ".frag", "glsl/" + name + ".vert"]
    .map(getShaderSource)
    .reduce(function(sequence, promise) {
      return sequence.then(function() {
        return promise;
      })
      .then(function(shaderSrc) {
        console.log("create program " + name + " of type " + shaderSrc.type);
        var program = compileShader(shaderSrc.src, shaderSrc.type);
        if(program == null) {
          //Which promise actually gets rejected?
          reject();
          return;
        }
        var uniforms = shaderSrc.src.match(/uniform.*/g);
        if(uniforms == null) uniforms = [];
        shaders[shaderSrc.type] = {
          program: program,
        src: shaderSrc.src,
        uniforms: uniforms
        }
      })
    }, Promise.resolve())
    .then(function(e) {
      var vert = shaders["x-shader/x-vertex"]
      var frag = shaders["x-shader/x-fragment"]
      var shader = new Shader(vert, frag);
    resolve(shader)
    });
  });
}


module.exports = Shader;
