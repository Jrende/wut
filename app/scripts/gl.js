function throwOnGLError(err, funcName, args) {
  throw WebGLDebugUtils.glEnumToString(err) + ' was caused by call to: ' + funcName;
}

function logGLCalls(functionName, args) {
  console.log('gl.' + functionName + '(' + WebGLDebugUtils.glFunctionArgsToString(functionName, args) + ')');
}

function logAndValidate(functionName, args) {
  logGLCalls(functionName, args);
  validateNoneOfTheArgsAreUndefined(functionName, args);
}

function validateNoneOfTheArgsAreUndefined(functionName, args) {
  for (var ii = 0; ii < args.length; ++ii) {
    if (args[ii] === undefined) {
      console.error('undefined passed to gl.' + functionName + '(' + WebGLDebugUtils.glFunctionArgsToString(functionName, args) + ')');
    }
  }
}

function createContext(elm, debugMode) {
  if(debugMode === null) {
    debugMode = false;
  }

  var gl = null;
  if(debugMode) {
    gl = WebGLDebugUtils.makeDebugContext(elm.getContext('webgl'), throwOnGLError, logAndValidate);
  } else {
    gl = elm.getContext('webgl');
  }

  if(!gl) {
    console.log('unable to initialize gl');
  }
  createContext.gl = gl;

  return gl;
}
module.exports = createContext;
