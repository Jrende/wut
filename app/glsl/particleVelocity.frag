precision highp float;

uniform sampler2D position;
uniform sampler2D velocity;
uniform vec2 resolution;
 
float rand(vec2 co){
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main(void) {
  vec2 uv = gl_FragCoord.xy / resolution;
  float r = rand(uv);
  vec3 velocityValue = texture2D(velocity, uv).rgb;
  gl_FragColor = vec4(velocityValue, 1.0);
}
