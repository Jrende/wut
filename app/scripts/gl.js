function createContext(elm) {
  var gl = elm.getContext("webgl");
  if(!gl) {
    console.log("unable to initialize gl");
  }
  createContext.gl = gl;
  return gl;
}
module.exports = createContext;
