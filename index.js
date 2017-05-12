function createTaskSuite(execlib){
  'use strict';
  var execSuite = execlib.execSuite,
      taskSuite = {
        UnknownTaskClassError: require('./unknowntaskclasserrorcreator')(execlib),
        NotATaskDescriptorError: require('./notataskdescriptorerrorcreator')(execlib),
        ResolvableTaskError: require('./resolvableerrorcreator')(execlib)
      };
  require('./registrycreator')(execlib,taskSuite);
  execSuite.ResolvableTaskError = taskSuite.ResolvableTaskError;
  execSuite.Task = require('./creator')(execlib);
  execSuite.DestroyableTask = require('./destroyabletaskcreator')(execlib);
  execSuite.MultiDestroyableTask = require('./multidestroyabletaskcreator')(execlib);
  execSuite.SinkTask = require('./sinktaskcreator')(execlib);
}

module.exports = createTaskSuite;
