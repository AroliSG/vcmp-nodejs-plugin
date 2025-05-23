const map = new Map();
const WeaponUtils = (name,arg0,arg1,arg2) => {
    let op  = arg0;
    let op1 = arg1;
    if(typeof arg0 === 'string') op = VCMP.Weapon[op];
    if(typeof arg1 === 'string') op1 = VCMP.Weapon.Data[op1];
    let arr = [op,op1];
    if(arg2) arr.push(arg2);
    return __ServerProxy.run(name, arr);
};

    // global variables
const server ={
        // dev mode
    setDevMode : function( arg0 ) { map.set('devMode', arg0);},
    getDevMode : function( ) { return map.get('devMode'); },

        // server methods
    getObject : function( arg0 ) { return __ServerProxy.run('getObject', Array.from(arguments)); },
    createObject : function( arg0, arg1, arg2, arg3 ) { return __ServerProxy.run('createObject', Array.from(arguments)); },
    handlingRuleExists : function( arg0, arg1 ) { return __ServerProxy.run('handlingRuleExists', Array.from(arguments)); },
    removeRadioStream : function( arg0 ) { return __ServerProxy.run('removeRadioStream', Array.from(arguments)); },
    resetHandlingRule : function( arg0, arg1 ) { return __ServerProxy.run('resetHandlingRule', Array.from(arguments)); },
    getVehiclesForcedRespawnAltitude : function( ) { return __ServerProxy.run('getVehiclesForcedRespawnAltitude', Array.from(arguments)); },
    sendGameMessageToAll : function( arg0, arg1 ) { return __ServerProxy.run('sendGameMessageToAll', Array.from(arguments)); },

    setSpawnScreenCameraPos : function( arg0 ) { return __ServerProxy.run('setSpawnScreenCameraPos', Array.from(arguments)); },
    setServerPassword : function( arg0 ) { return __ServerProxy.run('setServerPassword', Array.from(arguments)); },
    sendClientMessage : function( arg0, arg1 ) { return __ServerProxy.sendClientMessage(arg0.id, arg1); },
    getKillCommandDelay : function( ) { return __ServerProxy.run('getKillCommandDelay', Array.from(arguments)); },
    setSpawnScreenCameraLookAt : function( arg0, arg1, arg2 ) { return __ServerProxy.run('setSpawnScreenCameraLookAt', Array.from(arguments)); },
    setKillCommandDelay : function( arg0 ) { return __ServerProxy.run('setKillCommandDelay', Array.from(arguments)); },
    removeAllKeyBinds : function( ) { return __ServerProxy.run('removeAllKeyBinds', Array.from(arguments)); },

    getWastedSettings : function( ) { return __ServerProxy.run('getWastedSettings', Array.from(arguments)); },
    resetAllVehicleHandlings : function( ) { return __ServerProxy.run('resetAllVehicleHandlings', Array.from(arguments)); },
    setSpawnScreenPlayerPos : function( arg0 ) { return __ServerProxy.run('setSpawnScreenPlayerPos', Array.from(arguments)); },
    setVehiclesForcedRespawnAltitude : function( arg0 ) { return __ServerProxy.run('setVehiclesForcedRespawnAltitude', Array.from(arguments)); },
    setWastedSettings : function( arg0 ) { return __ServerProxy.run('setWastedSettings', Array.from(arguments)); },
    showAllMapObjects : function( ) { return __ServerProxy.run('showAllMapObjects', Array.from(arguments)); },
    getServerPassword : function( ) { return __ServerProxy.run('getServerPassword', Array.from(arguments)); },
    sendClientMessageToAll : function( arg0 ) { return __ServerProxy.sendClientMessageToAll(arg0); },

    resetAllWeaponData : function( ) { return __ServerProxy.run('resetAllWeaponData', Array.from(arguments)); },
    getUnusedKeybindSlot : function( ) { return __ServerProxy.run('getUnusedKeybindSlot', Array.from(arguments)); },
    setWorldBounds : function( arg0 ) { return __ServerProxy.run('setWorldBounds', Array.from(arguments)); },
    isAddressBanned : function( arg0 ) { return __ServerProxy.run('isAddressBanned', Array.from(arguments)); },
    getAllVehicles : function( ) { return __ServerProxy.run('getAllVehicles', Array.from(arguments)); },
    getAllPlayers : function( ) { return __ServerProxy.run('getAllPlayers', Array.from(arguments)); },
    getCheckPoint : function( arg0 ) { return __ServerProxy.run('getCheckPoint', Array.from(arguments)); },
    getWeather : function( ) { return __ServerProxy.run('getWeather', Array.from(arguments)); },
    getGravity : function( ) { return __ServerProxy.run('getGravity', Array.from(arguments)); },
    getGameSpeed : function( ) { return __ServerProxy.run('getGameSpeed', Array.from(arguments)); },
    getWaterLevel : function( ) { return __ServerProxy.run('getWaterLevel', Array.from(arguments)); },

    registerKeyBind : function( arg0, arg1, arg2, arg3, arg4 ) { return __ServerProxy.run('registerKeyBind', Array.from(arguments)); },
    setGameSpeed : function( arg0 ) { return __ServerProxy.run('setGameSpeed', Array.from(arguments)); },
    setFallTimer : function( arg0 ) { return __ServerProxy.run('setFallTimer', Array.from(arguments)); },
    addRadioStream : function( arg0, arg1, arg2, arg3 ) { return __ServerProxy.run('addRadioStream', Array.from(arguments)); },
    setMinute : function( arg0 ) { return __ServerProxy.run('setMinute', Array.from(arguments)); },
    setWaterLevel : function( arg0 ) { return __ServerProxy.run('setWaterLevel', Array.from(arguments)); },

    createVehicle : function(...args) { return __ServerProxy.run('createVehicle', Array.from(arguments));},
    getVehicle : function( arg0 ) { return __ServerProxy.run('getVehicle', Array.from(arguments)); },
    createCoordBlip : function( arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7 ) { return __ServerProxy.run('createCoordBlip', Array.from(arguments)); },
    playSound : function( arg0, arg1, arg2, arg3, arg4 ) { return __ServerProxy.run('playSound', Array.from(arguments)); },
    getCoordBlipInfo : function( arg0 ) { return __ServerProxy.run('getCoordBlipInfo', Array.from(arguments)); },
    setHour : function( arg0 ) { return __ServerProxy.run('setHour', Array.from(arguments)); },
    getFallTimer : function( ) { return __ServerProxy.run('getFallTimer', Array.from(arguments)); },
    addPlayerClass : function( arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12 ) { return __ServerProxy.run('addPlayerClass', Array.from(arguments)); },
    banAddress : function( arg0 ) { return __ServerProxy.run('banAddress', Array.from(arguments)); },
    hideMapObject : function( arg0, arg1, arg2, arg3 ) { return __ServerProxy.run('hideMapObject', Array.from(arguments)); },
    findPlayer : function( arg0 ) { return __ServerProxy.run('findPlayer', Array.from(arguments)); },
    getPlayer : function( arg0 ) { return __ServerProxy.run('getPlayer', Array.from(arguments)); },
    lookupPlayer: ( arg0 )=>{
        if (typeof arg0 === 'number') return server.getPlayer(arg0);
        return server.findPlayer(arg0);
    },
    setHandlingRule : function( arg0, arg1, arg2 ) { __ServerProxy.run('setHandlingRule', Array.from(arguments)); },
    getMinute : function( ) { return __ServerProxy.run('getMinute', Array.from(arguments)); },
    getWorldBounds : function( ) { return __ServerProxy.run('getWorldBounds', Array.from(arguments)); },
    unbanAddress : function( arg0 ) { return __ServerProxy.run('unbanAddress', Array.from(arguments)); },
    resetHandling : function( arg0 ) { return __ServerProxy.run('resetHandling', Array.from(arguments)); },
    setWeather : function( arg0 ) { return __ServerProxy.run('setWeather', Array.from(arguments)); },
    createPickup : function( arg0, arg1, arg2, arg3, arg4, arg5 ) {return  __ServerProxy.run('createPickup', Array.from(arguments)); },
    showMapObject : function( arg0, arg1 ) { return __ServerProxy.run('showMapObject', Array.from(arguments)); },
    setAltitudeLimit : function( arg0 ) { return __ServerProxy.run('setAltitudeLimit', Array.from(arguments)); },
    getHandlingRule : function( arg0, arg1 ) { return __ServerProxy.run('getHandlingRule', Array.from(arguments)); },
    getPickup : function( arg0 ) { return __ServerProxy.run('getPickup', Array.from(arguments)); },
    setTimeRate : function( arg0 ) { return __ServerProxy.run('setTimeRate', Array.from(arguments)); },
    createCheckPoint : function( arg0, arg1, arg2, arg3, arg4, arg5 ) { return __ServerProxy.run('createCheckPoint', Array.from(arguments)); },
    getTimeRate : function( ) { return __ServerProxy.run('getTimeRate', Array.from(arguments)); },
    removeKeyBind : function( arg0 ) { return __ServerProxy.run('removeKeyBind', Array.from(arguments)); },
    setGravity : function( arg0 ) { return __ServerProxy.run('setGravity', Array.from(arguments)); },
    getKeyBind : function( arg0 ) { return __ServerProxy.run('getKeyBind', Array.from(arguments)); },
    destroyCoordBlip : function( arg0 ) { return __ServerProxy.run('destroyCoordBlip', Array.from(arguments)); },
    getAltitudeLimit : function( ) { return __ServerProxy.run('getAltitudeLimit', Array.from(arguments)); },
    getHour : function( ) { return __ServerProxy.run('getHour', Array.from(arguments)); },
    rewireEvents : function( arg0, arg1 ) { return __ServerProxy.run('rewireEvents', Array.from(arguments)); },
    getServerPort : function( ) { return __ServerProxy.run('getServerPort', Array.from(arguments)); },
    isUnloaded : function( ) { return __ServerProxy.run('isUnloaded', Array.from(arguments)); },
    setGameModeText : function( arg0 ) { return __ServerProxy.run('setGameModeText', Array.from(arguments)); },
    reloadScript : function( ) { return __ServerProxy.run('reloadScript', Array.from(arguments)); },
    sendScriptData : function( arg0, arg1 ) { return __ServerProxy.run('sendScriptData', Array.from(arguments)); },
    getServerVersion : function( ) { return __ServerProxy.run('getServerVersion', Array.from(arguments)); },
    setServerName : function( arg0 ) { return __ServerProxy.run('setServerName', Array.from(arguments)); },
    getServerName : function( ) { return __ServerProxy.run('getServerName', Array.from(arguments));  },
    setPlayerLimit : function( arg0 ) { return __ServerProxy.run('setPlayerLimit', Array.from(arguments)); },
    getPlayerLimit : function( ) { return __ServerProxy.run('getPlayerLimit', Array.from(arguments)); },
    sendGameMessage : function( arg0, arg1, arg2 ) {return __ServerProxy.run('sendGameMessage', Array.from(arguments)); },
    getGameModeText : function( ) { return __ServerProxy.run('getGameModeText', Array.from(arguments)); },
    shutdownServer : function( ) { process.exit(0); }, // return __ServerProxy.run('shutdownServer', Array.from(arguments)); },
        // methods that can take strings and numbers
    isWeaponDataValueModified : function( arg0, arg1 ) { return WeaponUtils('isWeaponDataValueModified', arg0, arg1); },
    getWeaponDataValue : function( arg0, arg1 ) { return WeaponUtils('getWeaponDataValue', arg0, arg1); },
    resetWeaponDataValue : function( arg0, arg1 ) { return WeaponUtils('resetWeaponDataValue', arg0, arg1); },
    setWeaponDataValue : function( arg0, arg1, arg2 ) { return WeaponUtils('setWeaponDataValue', arg0, arg1, arg2); },
    resetWeaponData : function( dt ) {
        if(typeof dt === 'string') dt = VCMP.Weapon[dt];
        return __ServerProxy.run('resetWeaponData', [dt]);
    },
    createExplosion : function( arg0, arg1, arg2, arg3, arg4, arg5, arg6  ) {
        let playerId    = arg5;
        let op          = arg1;
        if (typeof arg5 === 'object') playerId = arg5.id;
        if (typeof arg1 === 'string') op = VCMP.Explosion.Option[op];

        return __ServerProxy.createExplosion(arg0, op, arg2, arg3, arg4, playerId, arg6);
    },
    getOption : function( dt ) {
        if (typeof dt === 'string') dt = VCMP.Server.Option[dt];
        if (Array.isArray(dt)) return dt.forEach(op => server.getOption(VCMP.Server.Option[op]));

        return __ServerProxy.run('getOption', [dt]);
    },
    setOption : function(dt, bool) {
        if (typeof dt === 'string') dt = VCMP.Server.Option[dt];
        if (Array.isArray(dt)) return dt.forEach(op => server.setOption(VCMP.Server.Option[op], bool));

        return __ServerProxy.run('setOption', [dt, bool]);
    },

    reload: function () { __ServerProxy.reload();},
    gc: function () { return __ServerProxy.gc(); },
    events: handler,
};


 // troubleshooting crashes
Object.defineProperty(server, 'serverName', {
  get() {
    return __ServerProxy.run('getServerName', []);
  },
  set(name) {
    __ServerProxy.run('setServerName', [name]);
  },
  enumerable: true,
  configurable: true
});

process.on('uncaughtException', (err, origin) => {
    console.log(err.stack);
    require("fs").writeFileSync(
        "logs/uncaughtException.txt",
        `Caught exception: ${err.stack}\n`
    );
});

