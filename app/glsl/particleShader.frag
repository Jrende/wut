precision mediump float;

float rand(vec2 co){
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

varying vec2 uvCoords;
uniform sampler2D state;
uniform float time;

void main(void) {
  //float f = rand(gl_FragCoord.xy * time);
  gl_FragColor = vec4(texture2D(state, uvCoords).rgb, 1.0);
  //gl_FragColor = vec4(f, f, f, 1.0);

}
