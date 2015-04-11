var initGL = require('./gl.js')
var context = initGL(document.querySelector("#canvas"));
Promise.all(["test", "other"].map(context.createShader)).then((shaders) => {
  console.log("all shaders created");
});
