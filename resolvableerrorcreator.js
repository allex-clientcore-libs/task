function createResolvableError(execlib){
  'use strict';
  var lib = execlib.lib;
  function ResolvableError(){
    var ret = lib.Error.call(this,'RESOLVABLE_TASK_ERROR','Task Error that can be resolved by manual intervention');
    return ret;
  }
  lib.inherit(ResolvableError,lib.Error);
  return ResolvableError;
}

module.exports = createResolvableError;
