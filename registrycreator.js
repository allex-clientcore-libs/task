var _taskRegistryInstance;
function createTaskRegistry(execlib,taskSuite){
  'use strict';
  var UnknownTaskClassError = taskSuite.UnknownTaskClassError,
      NotATaskDescriptorError = taskSuite.NotATaskDescriptorError,
      lib = execlib.lib,
      execSuite = execlib.execSuite;

  if(execSuite.taskRegistry){
    return;
  }

  function MapOfArrays(){
    lib.Map.call(this);
  }
  lib.inherit(MapOfArrays,lib.Map);
  MapOfArrays.prototype.add = function(name,val){
    var it = this.get(name);
    if(!it){
      it = [];
      lib.Map.prototype.add.call(this,name,it);
    }
    it.push(val);
  };
  MapOfArrays.prototype.remove = function(){
    throw new lib.Error('NO_REMOVAL_FROM_MAP_OF_ARRAYS','Only generic Map remove may be used');
  };
  MapOfArrays.prototype.resolve = function(name,prophash){
    //TODO: now what?
  };

  function TaskRegistry(){
    this.modulesDone = new lib.DIContainer();
    this.ctors = new lib.Map;
    this.rtExceptions = new MapOfArrays;
  }
  TaskRegistry.prototype.destroy = function(){
    this.ctors.destroy();
    this.ctors = null;
    this.modulesDone.destroy();
  };
  TaskRegistry.prototype.moduleDone = function (modulename) {
    var ret = this.modulesDone.busy(modulename);
    if (!ret) {
      this.modulesDone.waitFor(modulename);
    }
    return ret;
  };
  TaskRegistry.prototype.register = function (modulename, tasks) {
    tasks.forEach(this.registerClass.bind(this));
    this.modulesDone.register(modulename, true);
  };
  TaskRegistry.prototype.registerClass = function(classdescriptor){
    if('object' !== typeof classdescriptor){
      throw new NotATaskDescriptorError(classdescriptor);
    }
    if(!('name' in classdescriptor)){
      throw new NotATaskDescriptorError(classdescriptor);
    }
    if('function' !== typeof classdescriptor.klass){
      throw new NotATaskDescriptorError(classdescriptor);
    }
    this.ctors.add(classdescriptor.name,classdescriptor.klass);
  };
  TaskRegistry.prototype.spawn = function(taskclassname,prophash){
    var tctor = this.ctors.get(taskclassname);
    if(!tctor){
      throw new UnknownTaskClassError(taskclassname);
    }
    return new tctor(prophash);
  };
  TaskRegistry.prototype.run = function(taskclassname,propertyhash){
    var ret = this.spawn(taskclassname,propertyhash);
    ret.go();
    return ret;
  };
  TaskRegistry.prototype.registerException = function(task,e){
    console.log('should registerException',e,'for',task);
    this.rtExceptions.add(e.code,task);
  };
  TaskRegistry.prototype.hasAll = function (taskpack) {
    return lib.traverseConditionally(taskpack, this.misses)!==true;
  };
  TaskRegistry.prototype.misses = function (taskname) {
    if (!this.ctors.get(taskname)) {
      return true;
    }
  };
  execSuite.taskRegistry = new TaskRegistry;
}

module.exports = createTaskRegistry;
