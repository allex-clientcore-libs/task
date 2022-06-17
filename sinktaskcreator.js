function createSinkTask(execlib){
  'use strict';
  var lib = execlib.lib,
      DestroyableTask = execlib.execSuite.DestroyableTask;
  function SinkTask(prophash){
    if(this.compulsoryConstructionProperties.indexOf('sink')<0){
      throw new lib.Error('NO_SINK_IN_COMPULSORY_CONSTRUCTION_PROPERTIES',"This class has to have 'sink' in the prototype.compulsoryConstructionProperties array");
    }
    DestroyableTask.call(this,prophash,'sink');
  }
  lib.inherit(SinkTask,DestroyableTask);
  SinkTask.prototype.__cleanUp = function(){
    DestroyableTask.prototype.__cleanUp.call(this);
  };
  SinkTask.prototype.onAboutToDie = function () {
    if (this.__dyingException && lib.isFunction(this.onError)) {
      this.onError(this.__dyingException);
      this.onError = null;
    }
  };

  return SinkTask;
}

module.exports = createSinkTask;
