attribute vec3 pos;
attribute vec3 dir;
attribute float speed;
attribute vec3 vertexPos;

struct thingy {
  float a;
  float b;
  vec3 c;
} inst;

vec3 userFunction() {
  //#userFunction
  return vec3(0, 0, 0);
  //#EndUserFunction
}

void main(void) {

  gl_Position = vec4(vertexPos + pos + dir*speed + userFunction(), 1.0);
}
