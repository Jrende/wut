attribute vec2 aVertexPosition;
attribute vec2 reference;

uniform sampler2D position;
uniform sampler2D velocity;
varying vec2 ref0;

float rand(vec2 co){
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main(void) {
  ref0 = reference;
  vec2 texPos = texture2D(position, vec2(reference)).xy;
  gl_Position = vec4(vec3(aVertexPosition + texPos, 0.0), 1.0);
}
