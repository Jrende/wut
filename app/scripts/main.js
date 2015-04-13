var context = require('./gl.js')(document.querySelector("#canvas"));
var Shader = require('./shader.js')
Promise.all(["test", "other"].map(Shader.createShader)).then((shaders) => {
  var s = shaders[0];
  console.log("all shaders created");
});
