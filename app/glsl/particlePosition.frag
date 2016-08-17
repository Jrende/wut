precision mediump float;

uniform sampler2D position;
uniform sampler2D velocity;
uniform vec2 resolution;

void main(void) {
  vec2 uv = gl_FragCoord.xy / resolution;
  vec3 positionValue = texture2D(position, uv).rgb;
  gl_FragColor = vec4(positionValue, 1.0);
}
