function createMultiDestroyableTask(execlib){
  'use strict';
  var lib = execlib.lib,
      Destroyable = lib.Destroyable,
      Task = execlib.execSuite.Task;

  function attachDestroyedListener(mdt,prophash,destroyablename){
    var d = prophash[destroyablename];
    if(!(d.destroyed && d.destroyed.attach)){
      var e = new lib.Error('NOT_A_DESTROYABLE',destroyablenameinprophash+' maps to something that is not a Destroyable');
      e.destroyablename = destroyablenameinprophash;
      e.notDestroyable = d;
      throw e;
    }
    return d.destroyed.attach(mdt.destroy.bind(mdt));
  }
  function MultiDestroyableTask(prophash,destroyablenamesinprophash){
    if(!lib.isArray(destroyablenamesinprophash)){
      throw new lib.Error('DESTROYABLE_NAMES_MUST_BE_AN_ARRAY','MultiDestroyableTask needs a second construction parameter - destroyablenamesinprophash - to be an array');
    }
    this.destroyListeners = destroyablenamesinprophash.map(attachDestroyedListener.bind(null,this,prophash));
  }
  lib.inherit(MultiDestroyableTask,Task);
  MultiDestroyableTask.prototype.__cleanUp = function(){
    lib.arryDestroyAll(this.destroyListeners);
    this.destroyListeners = null;
  };
  return MultiDestroyableTask;
}

module.exports = createMultiDestroyableTask;
