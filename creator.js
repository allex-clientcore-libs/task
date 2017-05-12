function createTask(execlib){
  'use strict';
  var lib = execlib.lib,
      execSuite = execlib.execSuite,
      taskRegistry = execSuite.taskRegistry,
      ResolvableTaskError = execSuite.ResolvableTaskError;
  function TaskConstructionError(missingpropname){
    var ret = new lib.Error('TASK_CONSTRUCTION_ERROR','Constructor property hash misses the '+missingpropname+' property');
    ret.missingpropname = missingpropname;
    return ret;
  };
  lib.inherit(TaskConstructionError,lib.Error);
  function propExistenceChecker(prophash,compulsorypropname){
    if(!(compulsorypropname in prophash)){
      //console.log('TASK CONSTRUCTION PROPHASH FAILED',prophash, compulsorypropname);
      throw new TaskConstructionError(compulsorypropname);
    }
  }
  function Task(prophash){
    //console.log('!!! Task compulsoryConstructionProperties',this.compulsoryConstructionProperties);
    this.compulsoryConstructionProperties.forEach(propExistenceChecker.bind(null,prophash));
    if(!prophash.debug){
      this.log = lib.dummyFunc;
    }
  };
  Task.prototype.destroy = function(){
    if(this.hasOwnProperty('log')){
      this.log = null;
    }
  };
  Task.prototype.raiseException = function(e){
    if(!e.code){
      throw new lib.NotAnAllexErrorError(e);
    }
    /* TODO: Recognize a ResolvableTaskError
    if(!(e instanceof ResolvableTaskError)){
      console.log(e,'not instanceof',ResolvableTaskError);
      throw "Sta sad?";
    }
    */
    taskRegistry.registerException(this,e);
  };
  Task.prototype.log = function(){
    var args = Array.prototype.slice.call(arguments);
    if(this.debugPid){
      args.unshift(process.pid);
    }
    console.log.apply(console,args);
  };
  Task.prototype.debugMode = function () {
    return this.log !== lib.dummyFunc;
  };
  Task.prototype.compulsoryConstructionProperties = [];
  return Task;
}

module.exports = createTask;
