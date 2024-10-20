var a = {
    id : '#id',
    getTyreStatus : function(tyre) {  return __VehicleProxy.getTyreStatus(this.id, tyre);  },
    getDoorStatus : function(door) {  return __VehicleProxy.getDoorStatus(this.id, door);  },
    getPanelStatus : function(panel) {  return __VehicleProxy.getPanelStatus(this.id, panel);  },
    setDoorStatus : function(door,status) {  __VehicleProxy.setDoorStatus(this.id, door, status);  },
    setTyreStatus : function(tyre,status) {  return __VehicleProxy.setTyreStatus(this.id, tyre,status);  },
    setPanelStatus : function(panel,status) {  return __VehicleProxy.setPanelStatus(this.id, panel,status);  },
    delete : function ( ){
        __VehicleProxy.run(this.id, 'delete', Array.from(arguments));
        VCMP.VehicleData[this.id]  = {};
    },
    setSpawnRotationEuler : function ( arg0, arg1, arg2 ){  __VehicleProxy.run(this.id, 'setSpawnRotationEuler', Array.from(arguments)); },
    isStreamedForPlayer : function ( arg0 ){ return  __PlayerProxy.run(this.id, 'isStreamedForPlayer', [arg0.id]); },
    getSpawnRotationEuler : function ( ){ return  __VehicleProxy.run(this.id, 'getSpawnRotationEuler', Array.from(arguments)); },
    getTurrentRotation : function ( ){ return  __VehicleProxy.run(this.id, 'getTurrentRotation', Array.from(arguments)); },
    handlingRuleExists : function ( arg0 ){ return  __VehicleProxy.run(this.id, 'handlingRuleExists', Array.from(arguments)); },
    resetHandlingRule : function ( arg0 ){  __VehicleProxy.run(this.id, 'resetHandlingRule', Array.from(arguments)); },
    setIdleRespawnTimeout : function ( arg0 ){  __VehicleProxy.run(this.id, 'setIdleRespawnTimeout', Array.from(arguments)); },
    getIdleRespawnTimeout : function ( ){ return  __VehicleProxy.run(this.id, 'getIdleRespawnTimeout', Array.from(arguments)); },
    getSyncController : function ( ){ const p = __VehicleProxy.run(this.id, 'getSyncController', Array.from(arguments)); if (p==null || p == undefined) return p; return JSON.parse(p); },
    getSyncReason : function ( ){ return  __VehicleProxy.run(this.id, 'getSyncReason', Array.from(arguments)); },
    setWorld : function ( arg0 ){  __VehicleProxy.run(this.id, 'setWorld', Array.from(arguments)); },
    getWorld : function ( ){ return  __VehicleProxy.run(this.id, 'getWorld', Array.from(arguments)); },
    getModel : function ( ){ return  __VehicleProxy.run(this.id, 'getModel', Array.from(arguments)); },
    getOccupant : function ( arg0 ){   const p = __VehicleProxy.run(this.id, 'getOccupant', Array.from(arguments)); if (p==null || p == undefined) return p; return server.getPlayer(p); },
    respawn : function ( ){  __VehicleProxy.run(this.id, 'respawn', Array.from(arguments)); },
    setImmunities : function ( arg0 ){  __VehicleProxy.run(this.id, 'setImmunities', Array.from(arguments)); },
    setHealth : function ( arg0 ){  __VehicleProxy.run(this.id, 'setHealth', Array.from(arguments)); },
    getTurnSpeed : function ( arg0 ){ return  __VehicleProxy.run(this.id, 'getTurnSpeed', Array.from(arguments)); },
    setImmunityFlags : function ( arg0 ){  __VehicleProxy.run(this.id, 'setImmunityFlags', Array.from(arguments)); },
    getRotation : function ( ){ return  __VehicleProxy.run(this.id, 'getRotation', Array.from(arguments)); },
    getOption : function ( arg0 ){ return  __VehicleProxy.run(this.id, 'getOption', Array.from(arguments)); },
    setRotationEuler : function ( arg0, arg1, arg2 ){  __VehicleProxy.run(this.id, 'setRotationEuler', Array.from(arguments)); },
    setLightsData : function ( arg0 ){  __VehicleProxy.run(this.id, 'setLightsData', Array.from(arguments)); },
    setTaxiLight : function ( arg0 ){  __VehicleProxy.run(this.id, 'setTaxiLight', Array.from(arguments)); },
    setPosition : function ( arg0, arg1, arg2 ){  __VehicleProxy.run(this.id, 'setPosition', Array.from(arguments)); },
    getRotationEuler : function ( ){ return  __VehicleProxy.run(this.id, 'getRotationEuler', Array.from(arguments)); },
    getSpawnPosition : function ( ){ return  __VehicleProxy.run(this.id, 'getSpawnPosition', Array.from(arguments)); },
    getHealth : function ( ){ return  __VehicleProxy.run(this.id, 'getHealth', Array.from(arguments)); },
    getTaxiLight : function ( ){ return  __VehicleProxy.run(this.id, 'getTaxiLight', Array.from(arguments)); },
    setRadio : function ( arg0 ){  __VehicleProxy.run(this.id, 'setRadio', Array.from(arguments)); },
    setHandlingRule : function ( arg0, arg1 ){  __VehicleProxy.run(this.id, 'setHandlingRule', Array.from(arguments)); },
    resetHandling : function ( ){  __VehicleProxy.run(this.id, 'resetHandling', Array.from(arguments)); },
    getPosition : function ( ){ return  __VehicleProxy.run(this.id, 'getPosition', Array.from(arguments)); },
    getRadio : function ( ){ return  __VehicleProxy.run(this.id, 'getRadio', Array.from(arguments)); },
    getImmunityFlags : function ( ){ return  __VehicleProxy.run(this.id, 'getImmunityFlags', Array.from(arguments)); },
    setSpeed : function ( arg0, arg1, arg2, arg3, arg4 ){  __VehicleProxy.run(this.id, 'setSpeed', Array.from(arguments)); },
    getImmunities : function ( ){ return  __VehicleProxy.run(this.id, 'getImmunities', Array.from(arguments)); },
    isWrecked : function ( ){ return  __VehicleProxy.run(this.id, 'isWrecked', Array.from(arguments)); },
    detonate : function ( ){  __VehicleProxy.run(this.id, 'detonate', Array.from(arguments)); },
    setTurnSpeed : function ( arg0, arg1, arg2, arg3, arg4 ){  __VehicleProxy.run(this.id, 'setTurnSpeed', Array.from(arguments)); },
    setSpawnRotation : function ( arg0, arg1, arg2, arg3 ){  __VehicleProxy.run(this.id, 'setSpawnRotation', Array.from(arguments)); },
    getSpawnRotation : function ( ){ return  __VehicleProxy.run(this.id, 'getSpawnRotation', Array.from(arguments)); },
    setColours : function ( arg0 ){ 
        let primary = arg0.primary;
        if (typeof primary === 'object' && primary !== null){
            primary = VCMP.Colors.toHex(primary);
        }
        let secondary = arg0.secondary;
        if (typeof secondary === 'object' && secondary !== null){
            secondary = VCMP.Colors.toHex(secondary);
        }
        __VehicleProxy.run(this.id, 'setColours', [primary,secondary]);
    },
    getLightsData : function ( ){ return  __VehicleProxy.run(this.id, 'getLightsData', Array.from(arguments)); },
    getHandlingRule : function ( arg0 ){ return  __VehicleProxy.run(this.id, 'getHandlingRule', Array.from(arguments)); },
    setRotation : function ( arg0, arg1, arg2, arg3 ){  __VehicleProxy.run(this.id, 'setRotation', Array.from(arguments)); },
    getSpeed : function ( arg0 ){ return  __VehicleProxy.run(this.id, 'getSpeed', Array.from(arguments)); },
    setOption : function ( arg0, arg1 ){  __VehicleProxy.run(this.id, 'setOption', Array.from(arguments)); },
    setSpawnPosition : function ( arg0, arg1, arg2 ){  __VehicleProxy.run(this.id, 'setSpawnPosition', Array.from(arguments)); },
    getColours : function ( ){ return  __VehicleProxy.run(this.id, 'getColours', Array.from(arguments)); },
    getId : function ( ){ return  __VehicleProxy.run(this.id, 'getId', Array.from(arguments)); },
    isValid : function ( ){ return  __VehicleProxy.run(this.id, 'isValid', Array.from(arguments)); },
    attachData : function(){
        let data = VCMP.VehicleData[this.id];
        if (data==undefined){
            VCMP.VehicleData[this.id]  = {};
            data  = VCMP.VehicleData[this.id];
        }
        this["data"] = data;
        return this;
    },
    print : function() {    var result = [];     for (var id in this) {   try {  if (typeof(this[id]) == "function") {  result.push(id + ": " + this[id].toString().split(")")[0]+")" );  }  } catch (err) { result.push(id + ": inaccessible");   }    }  console.log(result);  }
 }