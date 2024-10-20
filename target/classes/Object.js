var a = {
    id : '#id',
    delete : function ( ){  
        __GameObjectProxy.run(this.id, 'delete', Array.from(arguments));
        VCMP.ObjectData[this.id]  = {};
    },
    setShotReportEnabled : function ( arg0 ){  __GameObjectProxy.run(this.id, 'setShotReportEnabled', Array.from(arguments)); },
    isShotReportEnabled : function ( ){ return  __GameObjectProxy.run(this.id, 'isShotReportEnabled', Array.from(arguments)); },
    isTouchedReportEnabled : function ( ){ return  __GameObjectProxy.run(this.id, 'isTouchedReportEnabled', Array.from(arguments)); },
    isStreamedForPlayer : function ( arg0 ){ return  __PlayerProxy.run(this.id, 'isStreamedForPlayer', [arg0.id]); },
    setTouchedReportEnabled : function ( arg0 ){  __GameObjectProxy.run(this.id, 'setTouchedReportEnabled', Array.from(arguments)); },
    moveBy : function ( arg0, arg1, arg2, arg3 ){  __GameObjectProxy.run(this.id, 'moveBy', Array.from(arguments)); },
    setAlpha : function ( arg0, arg1 ){  __GameObjectProxy.run(this.id, 'setAlpha', Array.from(arguments)); },
    getAlpha : function ( ){ return  __GameObjectProxy.run(this.id, 'getAlpha', Array.from(arguments)); },
    getPosition : function ( ){ return  __GameObjectProxy.run(this.id, 'getPosition', Array.from(arguments)); },
    rotateByEuler : function ( arg0, arg1, arg2, arg3 ){  __GameObjectProxy.run(this.id, 'rotateByEuler', Array.from(arguments)); },
    getRotation : function ( ){ return  __GameObjectProxy.run(this.id, 'getRotation', Array.from(arguments)); },
    moveTo : function ( arg0, arg1, arg2, arg3 ){  __GameObjectProxy.run(this.id, 'moveTo', Array.from(arguments)); },
    setWorld : function ( arg0 ){  __GameObjectProxy.run(this.id, 'setWorld', Array.from(arguments)); },
    setPosition : function ( arg0, arg1, arg2 ){  __GameObjectProxy.run(this.id, 'setPosition', Array.from(arguments)); },
    getModel : function ( ){ return  __GameObjectProxy.run(this.id, 'getModel', Array.from(arguments)); },
    getWorld : function ( ){ return  __GameObjectProxy.run(this.id, 'getWorld', Array.from(arguments)); },
    rotateToEuler : function ( arg0, arg1, arg2, arg3 ){  __GameObjectProxy.run(this.id, 'rotateToEuler', Array.from(arguments)); },
    rotateBy : function ( arg0, arg1, arg2, arg3, arg4 ){  __GameObjectProxy.run(this.id, 'rotateBy', Array.from(arguments)); },
    rotateTo : function ( arg0, arg1, arg2, arg3, arg4 ){  __GameObjectProxy.run(this.id, 'rotateTo', Array.from(arguments)); },
    getRotationEuler : function ( ){ return  __GameObjectProxy.run(this.id, 'getRotationEuler', Array.from(arguments)); },
    getId : function ( ){ return  __GameObjectProxy.run(this.id, 'getId', Array.from(arguments)); },
    attachData : function(){
        let data = VCMP.ObjectData[this.id];
        if (data==undefined){
            VCMP.ObjectData[this.id]  = {};
            data  = VCMP.ObjectData[this.id];
        }
        this["data"] = data;
        return this;
    },
    print : function() {    var result = [];     for (var id in this) {   try {  if (typeof(this[id]) == "function") {  result.push(id + ": " + this[id].toString().split(")")[0]+")" );  }  } catch (err) { result.push(id + ": inaccessible");   }    }  console.log(result);  }
 }