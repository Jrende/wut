attribute vec2 aVertexPosition;
uniform vec2 pos;
void main(void) {
  gl_Position = vec4(vec3(aVertexPosition + pos, 0.0), 1.0);
}
