precision mediump float;

varying vec2 uvCoords;
uniform sampler2D sampler;

void main(void) {
  gl_FragColor = vec4(texture2D(sampler, uvCoords).rgb, 1.0);
}
