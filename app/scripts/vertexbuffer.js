var gl = require('./gl.js').gl;
function VertexArray(vertexData, indexData, attrs) {
  if(vertexData instanceof Array) {
    this.vertexData = new Float32Array(vertexData);
  } else {
    this.vertexData = vertexData;
  }
  if(indexData instanceof Array) {
    this.indexData = new Uint16Array(indexData);
  } else {
    this.indexData = indexData;
  }
  this.attrs = attrs;

  this.vertBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuf);
  gl.bufferData(gl.ARRAY_BUFFER, this.vertexData, gl.STATIC_DRAW);

  this.indexBuf = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuf);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indexData, gl.STATIC_DRAW);

  this.bind = function() {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuf);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuf);
    var pointer = 0;
    for(var i = 0; i < this.attrs.length; i++) {
      gl.vertexAttribPointer(i, this.attrs[i], gl.FLOAT, false, pointer, 0);
      gl.enableVertexAttribArray(i);
      pointer += attrs[i];
    }
  }

  this.unbind = function() {
    for(var i = 0; i < this.attrs.length; i++) {
      gl.disableVertexAttribArray(i);
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

}
module.exports = VertexArray;
