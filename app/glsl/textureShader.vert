attribute vec2 aVertexPosition;
attribute vec2 uvCoordsIn;
varying vec2 uvCoords;
void main(void) {
  uvCoords = uvCoordsIn;
  gl_Position = vec4(vec3(aVertexPosition, 0.0), 1.0);
}
