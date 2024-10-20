var a = {
    id : '#id',
    isStreamedForPlayer : function ( arg0 ){ return  __PlayerProxy.run(this.id, 'isStreamedForPlayer', [arg0.id]); },
    setAutomaticTimer : function ( arg0 ){  __PickupProxy.run(this.id, 'setAutomaticTimer', Array.from(arguments)); },
    getAutomaticTimer : function ( ){ return  __PickupProxy.run(this.id, 'getAutomaticTimer', Array.from(arguments)); },
    setAlpha : function ( arg0 ){  __PickupProxy.run(this.id, 'setAlpha', Array.from(arguments)); },
    getWorld : function ( ){ return  __PickupProxy.run(this.id, 'getWorld', Array.from(arguments)); },
    getPosition : function ( ){ return  __PickupProxy.run(this.id, 'getPosition', Array.from(arguments)); },
    getAlpha : function ( ){ return  __PickupProxy.run(this.id, 'getAlpha', Array.from(arguments)); },
    setAutomatic : function ( arg0 ){  __PickupProxy.run(this.id, 'setAutomatic', Array.from(arguments)); },
    getQuantity : function ( ){ return  __PickupProxy.run(this.id, 'getQuantity', Array.from(arguments)); },
    setOption : function ( arg0, arg1 ){  __PickupProxy.run(this.id, 'setOption', Array.from(arguments)); },
    setWorld : function ( arg0 ){  __PickupProxy.run(this.id, 'setWorld', Array.from(arguments)); },
    refresh : function ( ){  return __PickupProxy.run(this.id, 'refresh', Array.from(arguments)); },
    isAutomatic : function ( ){ return  __PickupProxy.run(this.id, 'isAutomatic', Array.from(arguments)); },
    setPosition : function ( arg0, arg1, arg2 ){  __PickupProxy.run(this.id, 'setPosition', Array.from(arguments)); },
    getModel : function ( ){ return  __PickupProxy.run(this.id, 'getModel', Array.from(arguments)); },
    delete : function ( ){  
        __PickupProxy.run(this.id, 'delete', Array.from(arguments));
        VCMP.PickupData[this.id]  = {};
    },
    isValid : function ( ){ return  __PickupProxy.run(this.id, 'isValid', Array.from(arguments)); },
    attachData : function(){
        let data = VCMP.PickupData[this.id];
        if (data==undefined){
            VCMP.PickupData[this.id]  = {};
            data  = VCMP.PickupData[this.id];
        }
        this["data"] = data;
        return this;
    },
    print : function() {    var result = [];     for (var id in this) {   try {  if (typeof(this[id]) == "function") {  result.push(id + ": " + this[id].toString().split(")")[0]+")" );  }  } catch (err) { result.push(id + ": inaccessible");   }    }  console.log(result);  }
 }