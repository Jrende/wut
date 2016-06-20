/*

export function throwOnGLError(err, funcName, args) {
  throw WebGLDebugUtils.glEnumToString(err) + ' was caused by call to: ' + funcName;
}

export function logGLCalls(functionName, args) {
  console.log(`gl.${functionName} (${WebGLDebugUtils.glFunctionArgsToString(functionName, args)})`);
}

export function logAndValidate(functionName, args) {
  logGLCalls(functionName, args);
  validateNoneOfTheArgsAreUndefined(functionName, args);
}

export function validateNoneOfTheArgsAreUndefined(functionName, args) {
  for(let ii = 0; ii < args.length; ++ii) {
    if (args[ii] === undefined) {
      console.error('undefined passed to gl.' +
      functionName + '(' + WebGLDebugUtils.glFunctionArgsToString(functionName, args) + ')');
    }
  }
}
*/
