function createUnknownTaskClassError(execlib){
  'use strict';
  var lib = execlib.lib;
  function UnknownTaskClassError(classname){
    var ret = new lib.Error('UNKNOWN_TASK_CLASS','Task Class has not been registered under name '+classname);
    ret.classname = classname;
    return ret;
  }
  lib.inherit(UnknownTaskClassError,lib.Error);
  return UnknownTaskClassError;
}

module.exports = createUnknownTaskClassError;
