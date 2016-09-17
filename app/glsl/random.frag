precision highp float;

 
float rand(vec2 co){
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

uniform float seed;
uniform float scale;

void main(void) {
  float r = rand(gl_FragCoord.xy * seed);
  float g = rand(gl_FragCoord.xy * seed * 2.0);
  float b = rand(gl_FragCoord.xy * seed * 4.0);
  float a = rand(gl_FragCoord.xy * seed * 8.0);
  vec4 color = (vec4(r, g, b, a) - 0.5) * 2.0;
  color = color * scale;
  color = color / 2.0 + 0.5;
  gl_FragColor = vec4(0, 0, 0, 1.0);
}
