precision highp float;

uniform sampler2D position;
uniform sampler2D velocity;
varying vec2 ref0;

void main(void) {
  vec3 color = texture2D(velocity, ref0).rgb;
  gl_FragColor = vec4(color, 1.00);
}
