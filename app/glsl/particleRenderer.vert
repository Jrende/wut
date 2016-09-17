attribute vec2 aVertexPosition;
attribute vec2 reference;

uniform sampler2D position;
uniform sampler2D velocity;
varying vec2 ref0;

void main(void) {
  ref0 = reference;
  vec2 texPos = (texture2D(position, reference).xy - vec2(0.5, 0.5)) * 2.0;
  gl_Position = vec4(vec3(aVertexPosition + texPos, 0.0), 1.0);
}
