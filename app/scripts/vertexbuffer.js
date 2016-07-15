export default class VertexArray {
  constructor(vertexData, indexData, attrs) {
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
    this.isInitialized = false;
  }

  initialize(gl) {
    this.vertBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuf);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertexData, gl.STATIC_DRAW);

    this.indexBuf = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuf);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indexData, gl.STATIC_DRAW);
    this.isInitialized = true;
  }

  bind(gl) {
    if(this.isInitialized !== true) {
      console.error('Tried to use uninitialized VertexArray!');
      return;
    }
    const attrSum = this.attrs.reduce((a, b) => a + b);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuf);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuf);
    let pointer = 0;
    for(let i = 0; i < this.attrs.length; i++) {
      gl.enableVertexAttribArray(i);
      gl.vertexAttribPointer(i, this.attrs[i], gl.FLOAT, false, attrSum * 4, pointer * 4);
      pointer += this.attrs[i];
    }
  }

  unbind(gl) {
    for(let i = 0; i < this.attrs.length; i++) {
      gl.disableVertexAttribArray(i);
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }
}
