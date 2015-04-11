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

function initGL(elm) {
  var gl = elm.getContext("webgl");
  if(!gl) {
    console.log("unable to initialize gl");
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
      alert("Could not initialise shaders");
    }
    gl.useProgram(shaderProgram);
    return shaderProgram;
  }

  function createShader(name) {
    return new Promise(function(resolve, reject) {
      var shaderSources = [];
      var progs = {};
      var promise = ["glsl/" + name + ".frag", "glsl/" + name + ".vert"]
      .map(getShaderSource)
      .reduce(function(sequence, promise) {
        return sequence.then(function() {
          return promise;
        })
        .then(function(shaderSrc) {
          console.log("create program " + name + " of type " + shaderSrc.type);
          var program = compileShader(shaderSrc.src, shaderSrc.type);
          progs[shaderSrc.type] = program;
          shaderSources.push(shaderSrc);
        })
      }, Promise.resolve())
      .then(function(e) {
        var shader = {
          object: createShaderProgram(progs["x-shader/x-vertex"], progs["x-shader/x-fragment"])
        }
        resolve(shader)
      });
    });
  }

  return {
    gl: gl,
    createShader: createShader
  }
}
module.exports = initGL;
