function createDestroyableTask(execlib){
  'use strict';
  var lib = execlib.lib,
      Destroyable = lib.Destroyable,
      Task = execlib.execSuite.Task;
  function DestroyableTask(prophash,destroyablenameinprophash){
    if(!destroyablenameinprophash){
      throw new lib.Error('NO_NAME_OF_DESTROYABLE_FOR_TASK_PROPERTYHASH','DestroyableTask needs a second construction parameter: destroyablenameinprophash');
    }
    if(!(destroyablenameinprophash in prophash)){
      throw new lib.Error('NO_DESTROYABLE_FOUND_IN_TASK_PROPERTYHASH',destroyablenameinprophash+' does not map to a Destroyable in propertyhash');
    }
    var d = prophash[destroyablenameinprophash];
    if(!d) {
      throw new lib.Error('NO_DESTROYABLE_FOUND_IN_TASK_PROPERTYHASH',destroyablenameinprophash+' does not map to a Destroyable in propertyhash');
    }
    if(!(d.destroyed && d.destroyed.attach)){
      var e = new lib.Error('NOT_A_DESTROYABLE',destroyablenameinprophash+' maps to something that is not a Destroyable');
      e.destroyablename = destroyablenameinprophash;
      e.notDestroyable = d;
      throw e;
    }
    Destroyable.call(this);
    Task.call(this,prophash);
    this.destroyListener = d.destroyed.attach(this.destroy.bind(this));
  }
  lib.inherit(DestroyableTask,Task);
  lib.inheritMethods(DestroyableTask,Destroyable,'destroy','extendTo');
  DestroyableTask.prototype.__cleanUp = function(){
    if(!this.destroyListener){
      return;
    }
    this.destroyListener.destroy();
    this.destroyListener = null;
    Task.prototype.destroy.call(this);
    Destroyable.prototype.__cleanUp.call(this);
  };
  return DestroyableTask;
}

module.exports = createDestroyableTask;
