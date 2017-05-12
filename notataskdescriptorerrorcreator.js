function createNotATaskDescriptorError(execlib){
  'use strict';
  var lib = execlib.lib;
  function NotATaskDescriptorError(descriptor){
    var ret = new lib.Error('NOT_A_TASK_DESCRIPTOR','Provided object does not have the name, klass and optional errorhandlers properties');
    ret.descriptor = descriptor;
    return ret;
  }
  lib.inherit(NotATaskDescriptorError,lib.Error);
  return NotATaskDescriptorError;
}

module.exports = createNotATaskDescriptorError;
