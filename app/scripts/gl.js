var context = {
  createContext: function(elm) {
    var gl = elm.getContext("webgl");
    if(!gl) {
      console.log("unable to initialize gl");
    }
    this.gl = gl;
    return gl;
  }
}
module.exports = context;
