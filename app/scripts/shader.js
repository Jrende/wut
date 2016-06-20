function compileShader(gl, src, type) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    return null;
  }
  return shader;
}

function createShaderProgram(gl, vertexShader, fragmentShader) {
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.error('Could not initialise shaders');
  }
  gl.useProgram(shaderProgram);
  const loc = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
  gl.enableVertexAttribArray(loc);
  return shaderProgram;
}

function getUniformGetter(gl, uniformHandle, shader) {
  return () => gl.getActiveUniform(shader.program, uniformHandle);
}

function getUniformSetter(gl, uniformHandle, type) {
  switch(type) {
    case 'float':return value => gl.uniform1f(uniformHandle, value);
    case 'vec2': return value => gl.uniform2fv(uniformHandle, value);
    case 'vec3': return value => gl.uniform3fv(uniformHandle, value);
    case 'vec4': return value => gl.uniform4fv(uniformHandle, value);
    case 'mat3': return value => gl.uniformMatrix3fv(uniformHandle, false, value);
    case 'mat4': return value => gl.uniformMatrix4fv(uniformHandle, false, value);
    default: return undefined;
  }
}

function getUniforms(sources) {
  const uniforms = [];
  sources.forEach(source => {
    const matches = source.match(/uniform.*/g);
    if(matches) {
      matches
        .map(u => u.substring(8, u.length - 1))
        .map(u => u.split(' '))
        .forEach(u => {
          uniforms.push({
            type: u[0],
            name: u[1]
          });
        });
    }
  });
  return uniforms;
}

function createUniformFunction(gl, name, type, shader) {
  const uniformHandle = gl.getUniformLocation(shader.program, name);
  Object.defineProperty(shader.uniforms, name, {
    enumerable: true,
    configurable: false,
    get: getUniformGetter(gl, uniformHandle, type),
    set: getUniformSetter(gl, uniformHandle, type)
  });
}

function createUniforms(gl, shader) {
  const uniforms = getUniforms([shader.vert, shader.frag]);
  uniforms.forEach(u => createUniformFunction(gl, u.name, u.type, shader));
}

export default class Shader {
  constructor(src) {
    this.vert = src.vert;
    this.frag = src.frag;
    this.program = undefined;
    this.gl = undefined;
    this.uniforms = {};
    this.compiled = false;
  }

  use() {
    this.gl.useProgram(this.program);
  }

  compile(gl) {
    this.gl = gl;
    const vertProgram = compileShader(gl, this.vert, gl.VERTEX_SHADER);
    const fragProgram = compileShader(gl, this.frag, gl.FRAGMENT_SHADER);
    this.program = createShaderProgram(gl, vertProgram, fragProgram);
    createUniforms(gl, this);
    this.compiled = true;
  }
}
