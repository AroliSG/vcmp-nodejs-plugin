var a = {
    id : '#id',
    addImmunity: function(intValue) { __PlayerProxy.addImmunity(this.id,intValue); },
    removeImmunity: function(intValue) { __PlayerProxy.removeImmunity(this.id,intValue); },
    hasImmunity: function(intValue) { return __PlayerProxy.hasImmunity(this.id,intValue); },
    sendStream : function (stream) { stream.build();  __PlayerProxy.sendStream(this.id,stream.bb.raw); },
    getName : function ( ){ return  __PlayerProxy.run(this.id, 'getName', Array.from(arguments)); },
    setName : function ( arg0 ){ return  __PlayerProxy.run(this.id, 'setName', Array.from(arguments)); },
    getState : function ( ){ return  __PlayerProxy.run(this.id, 'getState', Array.from(arguments)); },
    getWeaponAtSlot : function ( arg0 ){ return  __PlayerProxy.run(this.id, 'getWeaponAtSlot', Array.from(arguments)); },
    isStreamedForPlayer : function ( arg0 ){ return  __PlayerProxy.run(this.id, 'isStreamedForPlayer', [arg0.id]); },
    set3DArrowForPlayer: function ( arg0, arg1 ){ return  __PlayerProxy.run(this.id, 'set3DArrowForPlayer', Array.from(arguments)); },

    setSecondaryWorld : function ( arg0 ){  __PlayerProxy.run(this.id, 'setSecondaryWorld', Array.from(arguments)); },
    setCameraPosition : function ( arg0, arg1, arg2, arg3, arg4, arg5 ){  __PlayerProxy.run(this.id, 'setCameraPosition', Array.from(arguments)); },
    getStandingOnObject : function ( ){ const o =  __PlayerProxy.run(this.id, 'getStandingOnObject', Array.from(arguments)); if (o == null || o == undefined) return o; return server.getObject(o); },
    removeFromVehicle : function ( ){ return  __PlayerProxy.run(this.id, 'removeFromVehicle', Array.from(arguments)); },
    setSpectateTarget : function ( arg0 ){  __PlayerProxy.run(this.id, 'setSpectateTarget', Array.from(arguments)); },
    isCompatibleWithWorld : function ( arg0 ){ return  __PlayerProxy.run(this.id, 'isCompatibleWithWorld', Array.from(arguments)); },
    getSpectateTarget : function ( ){ const id= __PlayerProxy.run(this.id, 'getSpectateTarget', Array.from(arguments)); if (id== null ) return null; return server.getPlayer(id); },
    requestModuleList : function ( ){  __PlayerProxy.run(this.id, 'requestModuleList', Array.from(arguments)); },
    getInVehicleStatus : function ( ){ return  __PlayerProxy.run(this.id, 'getInVehicleStatus', Array.from(arguments)); },
    getSecondaryWorld : function ( ){ return  __PlayerProxy.run(this.id, 'getSecondaryWorld', Array.from(arguments)); },
    getStandingOnVehicle : function ( ){ const v =  __PlayerProxy.run(this.id, 'getStandingOnVehicle', Array.from(arguments)); if (v == null || v== undefined) return v; return server.getVehicle(v); },
    isAdmin : function ( ){ return  __PlayerProxy.run(this.id, 'isAdmin', Array.from(arguments)); },
    getIP : function ( ){ return  __PlayerProxy.run(this.id, 'getIP', Array.from(arguments)).toString(); },
    setAdmin : function ( arg0 ){  __PlayerProxy.run(this.id, 'setAdmin', Array.from(arguments)); },
    kick : function ( ){  __PlayerProxy.run(this.id, 'kick', Array.from(arguments)); },
    ban : function ( ){  __PlayerProxy.run(this.id, 'ban', Array.from(arguments)); },
    isSpawned : function ( ){ return  __PlayerProxy.run(this.id, 'isSpawned', Array.from(arguments)); },
    getUniqueId : function ( ){ return  __PlayerProxy.run(this.id, 'getUniqueId', Array.from(arguments)).toString(); },
    setSkin : function ( arg0 ){  __PlayerProxy.run(this.id, 'setSkin', Array.from(arguments)); },
    setWorld : function ( arg0 ){  __PlayerProxy.run(this.id, 'setWorld', Array.from(arguments)); },
    setScore : function ( arg0 ){  __PlayerProxy.run(this.id, 'setScore', Array.from(arguments)); },
    isTyping : function ( ){ return  __PlayerProxy.run(this.id, 'isTyping', Array.from(arguments)); },
    setWeaponSlot : function ( arg0 ){  __PlayerProxy.run(this.id, 'setWeaponSlot', Array.from(arguments)); },
    setMoney : function ( arg0 ){  __PlayerProxy.run(this.id, 'setMoney', Array.from(arguments)); },
    getWeaponSlot : function ( ){ return  __PlayerProxy.run(this.id, 'getWeaponSlot', Array.from(arguments)); },
    getWorld : function ( ){ return  __PlayerProxy.run(this.id, 'getWorld', Array.from(arguments)); },
    forceSpawn : function ( ){  __PlayerProxy.run(this.id, 'forceSpawn', Array.from(arguments)); },
    forceSelect : function ( ){  __PlayerProxy.run(this.id, 'forceSelect', Array.from(arguments)); },
    setHealth : function ( arg0 ){  __PlayerProxy.run(this.id, 'setHealth', Array.from(arguments)); },
    getArmour : function ( ){ return  __PlayerProxy.run(this.id, 'getArmour', Array.from(arguments)); },
    getImmunities : function ( ){ return  __PlayerProxy.run(this.id, 'getImmunities', Array.from(arguments)); },
    getHeading : function ( ){ return  __PlayerProxy.run(this.id, 'getHeading', Array.from(arguments)); },
    getAlpha : function ( ){ return  __PlayerProxy.run(this.id, 'getAlpha', Array.from(arguments)); },
    setTeam : function ( arg0 ){  __PlayerProxy.run(this.id, 'setTeam', Array.from(arguments)); },
    getInVehicleSlot : function ( ){ return  __PlayerProxy.run(this.id, 'getInVehicleSlot', Array.from(arguments)); },
    setOption : function ( arg0, arg1 ){  __PlayerProxy.run(this.id, 'setOption', Array.from(arguments)); },
    getHealth : function ( ){ return  __PlayerProxy.run(this.id, 'getHealth', Array.from(arguments)); },
    setWeapon : function ( arg0, arg1 ){  __PlayerProxy.run(this.id, 'setWeapon', Array.from(arguments)); },
    giveMoney : function ( arg0 ){  __PlayerProxy.run(this.id, 'giveMoney', Array.from(arguments)); },
    getUniqueWorld : function ( ){ return  __PlayerProxy.run(this.id, 'getUniqueWorld', Array.from(arguments)); },
    getMoney : function ( ){ return  __PlayerProxy.run(this.id, 'getMoney', Array.from(arguments)); },
    setPosition : function ( arg0, arg1, arg2 ){  __PlayerProxy.run(this.id, 'setPosition', Array.from(arguments)); },
    putInVehicle : function ( arg0, arg1, arg2, arg3 ){ return  __PlayerProxy.run(this.id, 'putInVehicle', Array.from(arguments)); },
    getSkin : function ( ){ return  __PlayerProxy.run(this.id, 'getSkin', Array.from(arguments)); },
    setArmour : function ( arg0 ){  __PlayerProxy.run(this.id, 'setArmour', Array.from(arguments)); },
    addSpeed : function ( arg0, arg1, arg2 ){  __PlayerProxy.run(this.id, 'addSpeed', Array.from(arguments)); },
    setHeading : function ( arg0 ){  __PlayerProxy.run(this.id, 'setHeading', Array.from(arguments)); },
    getAimPosition : function ( ){ return  __PlayerProxy.run(this.id, 'getAimPosition', Array.from(arguments)); },
    getFPS : function ( ){ return  __PlayerProxy.run(this.id, 'getFPS', Array.from(arguments)); },
    getImmunityFlags : function ( ){ return  __PlayerProxy.run(this.id, 'getImmunityFlags', Array.from(arguments)); },
    getScore : function ( ){ return  __PlayerProxy.run(this.id, 'getScore', Array.from(arguments)); },
    getUID : function ( ){ return  __PlayerProxy.run(this.id, 'getUID', Array.from(arguments)).toString(); },
    setImmunityFlags : function ( arg0 ){  __PlayerProxy.run(this.id, 'setImmunityFlags', Array.from(arguments)); },
    lookupPlayer: ( arg0 )=>{
        if (typeof arg0 === 'number') return server.getPlayer(arg0);
        return server.findPlayer(arg0);
    },


    getColour : function ( ){ 
        let v =  __PlayerProxy.run(this.id, 'getColour', []); 
        if (Array.from(arguments).length >0){
            const type = Array.from(arguments)[0].toLowerCase();
            if (type == "rgb"){
                v = VCMP.Colors.toRGB(v);
            }
        }
        return v;
    },
    getPosition : function ( ){ return  __PlayerProxy.run(this.id, 'getPosition', Array.from(arguments)); },
    getGameKeys : function ( ){ return  __PlayerProxy.run(this.id, 'getGameKeys', Array.from(arguments)); },
    getOption : function ( arg0 ){ return  __PlayerProxy.run(this.id, 'getOption', Array.from(arguments)); },
    giveWeapon : function ( arg0, arg1 ){  __PlayerProxy.run(this.id, 'giveWeapon', Array.from(arguments)); },
    getWeapon : function ( ){ return  __PlayerProxy.run(this.id, 'getWeapon', Array.from(arguments)); },
    setImmunities : function ( arg0 ){  __PlayerProxy.run(this.id, 'setImmunities', Array.from(arguments)); },
    setAlpha : function ( arg0, arg1 ){  __PlayerProxy.run(this.id, 'setAlpha', Array.from(arguments)); },
    setSpeed : function ( arg0, arg1, arg2 ){  __PlayerProxy.run(this.id, 'setSpeed', Array.from(arguments)); },
    getWeaponAmmo : function ( ){ return  __PlayerProxy.run(this.id, 'getWeaponAmmo', Array.from(arguments)); },
    getAction : function ( ){ return  __PlayerProxy.run(this.id, 'getAction', Array.from(arguments)); },
    getAimDirection : function ( ){ return  __PlayerProxy.run(this.id, 'getAimDirection', Array.from(arguments)); },
    setColour : function ( arg0 ){  
        const isObj = typeof arg0 === 'object' && arg0 !== null;
        __PlayerProxy.run(this.id, 'setColour', isObj ? [VCMP.Colors.toHex(arg0)] : [ VCMP.Colors.hexToInteger(arg0) ]); 
    },
    getTeam : function ( ){ return  __PlayerProxy.run(this.id, 'getTeam', Array.from(arguments)); },
    getPing : function ( ){ return  __PlayerProxy.run(this.id, 'getPing', Array.from(arguments)); },
    getUID2 : function ( ){ return  __PlayerProxy.run(this.id, 'getUID2', Array.from(arguments)).toString(); },
    getSpeed : function ( ){ return  __PlayerProxy.run(this.id, 'getSpeed', Array.from(arguments)); },
    isOnFire : function ( ){ return  __PlayerProxy.run(this.id, 'isOnFire', Array.from(arguments)); },
    isCrouching : function ( ){ return  __PlayerProxy.run(this.id, 'isCrouching', Array.from(arguments)); },
    getVehicle : function ( ){   const v = __PlayerProxy.run(this.id, 'getVehicle', Array.from(arguments));  if (v==null) return null; return server.getVehicle(v); },
    getDrunkHandling : function ( ){ return  __PlayerProxy.run(this.id, 'getDrunkHandling', Array.from(arguments)); },
    getWantedLevel : function ( ){ return  __PlayerProxy.run(this.id, 'getWantedLevel', Array.from(arguments)); },
    getPlayerClass : function ( ){ return  __PlayerProxy.run(this.id, 'getPlayerClass', Array.from(arguments)); },
    getAmmoAtSlot : function ( arg0 ){ return  __PlayerProxy.run(this.id, 'getAmmoAtSlot', Array.from(arguments)); },
    restoreCamera : function ( ){  __PlayerProxy.run(this.id, 'restoreCamera', Array.from(arguments)); },
    isAway : function ( ){ return  __PlayerProxy.run(this.id, 'isAway', Array.from(arguments)); },
    setDrunkHandling : function ( arg0 ){  __PlayerProxy.run(this.id, 'setDrunkHandling', Array.from(arguments)); },
    setAnimation : function ( arg0, arg1 ){  __PlayerProxy.run(this.id, 'setAnimation', Array.from(arguments)); },
    redirectToServer : function ( arg0, arg1, arg2, arg3, arg4 ){  __PlayerProxy.run(this.id, 'redirectToServer', Array.from(arguments)); },
    setDrunkVisuals : function ( arg0 ){  __PlayerProxy.run(this.id, 'setDrunkVisuals', Array.from(arguments)); },
    isCameraLocked : function ( ){ return  __PlayerProxy.run(this.id, 'isCameraLocked', Array.from(arguments)); },
    setWantedLevel : function ( arg0 ){  __PlayerProxy.run(this.id, 'setWantedLevel', Array.from(arguments)); },
    removeAllWeapons : function ( ){  __PlayerProxy.run(this.id, 'removeAllWeapons', Array.from(arguments)); },
    getDrunkVisuals : function ( ){ return  __PlayerProxy.run(this.id, 'getDrunkVisuals', Array.from(arguments)); },
    removeWeapon : function ( arg0 ){  __PlayerProxy.run(this.id, 'removeWeapon', Array.from(arguments)); },
    getId : function ( ){ return  __PlayerProxy.run(this.id, 'getId', Array.from(arguments)); },
    isValid : function ( ){ return  __PlayerProxy.run(this.id, 'isValid', Array.from(arguments)); },
    print : function() {    var result = [];     for (var id in this) {   try {  if (typeof(this[id]) == "function") {  result.push(id + ": " + this[id].toString().split(")")[0]+")" );  }  } catch (err) { result.push(id + ": inaccessible");   }    }  console.log(result);  },
    attachData : function(){
        let data = VCMP.PlayerData[this.id];
        if (data==undefined){
            VCMP.PlayerData[this.id]  = {};
            data  = VCMP.PlayerData[this.id];
        }
        this["data"] = data;
        return this;
    }
 }