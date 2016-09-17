precision highp float;

uniform sampler2D position;
uniform sampler2D velocity;
uniform vec2 resolution;

void main(void) {
  vec2 uv = gl_FragCoord.xy / resolution;
  vec3 positionValue = texture2D(position, uv).rgb;
  vec3 velocityValue = (texture2D(velocity, uv).rgb - 0.5) * 2.0;
  gl_FragColor = vec4(positionValue + velocityValue, 1.0);
}
