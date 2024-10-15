const EventEmitter          = require('events');
const registeredCommands    = [];
const commandTimeout        = new Map();

function fireEventCommand(args) {
    let options     = VCMP.Server.commandOptions;
    let commandName = args[0];
    let target      = args[1];
    let message     = args[2];
    let prefix      = args[3];
    let delay       = options.commandDelayInSecs;

    const currentTime = new Date().getTime();
    const lastTime    = commandTimeout.get('commandTimeout')

        // global commands timeout callback
    if (commandTimeout.has('commandTimeout') && currentTime < lastTime) {
        if (typeof options.commandDelayCallback === 'function') options.commandDelayCallback(target,delay,prefix,commandName);
        return false;
    }
    const commandFound = registeredCommands.some(({ commandName: registeredCommand, commandAlias, execute, forcePrefixTo }) => {
            // command will only be executed if prefixes are the same.
            // only when forcePrefixTo is defined
        if (forcePrefixTo&&forcePrefixTo !== prefix) {
            if(typeof options.commandNotFoundCallback === 'function') options.commandNotFoundCallback(target,prefix,commandName);
            return true;
        }

        const isExactMatch = registeredCommand === commandName;
        const isAliasMatch = commandAlias.includes(commandName);

        if (isExactMatch || isAliasMatch) {
            if (execute) execute(target, message);

            if( options.commandDelayInSecs > 0 ) commandTimeout.set('commandTimeout', currentTime + options.commandDelayInSecs);
            return true;
        }

        return false;
    });

        // global commands not found callback
    if (!commandFound && typeof options.commandNotFoundCallback === 'function') {
        options.commandNotFoundCallback(target,prefix,commandName);
    }
}


class CustomEventEmitter extends EventEmitter {
    sEmit(event, ...args) {
        const listeners         = this.listeners(event);

        for (const listener of listeners) {
            const result = listener(...args);
            if (result !== undefined) {
                return result;
            }
        }
        return null;
    }
    registerCommand(name, options = {}) {
        const defaultOptions = {
            commandAlias: [],
            caseSensitive: false,
            forcePrefixTo: null,
            execute: null,
        };

            // default 'false' which means no case sensitive
        if (!options.caseSensitive) {
            name                    = name.toLowerCase()
            options.commandAlias    = options.commandAlias.map(alias => alias.toLowerCase());
        }

        const finalOptions = { ...defaultOptions, ...options, commandName: name };
        registeredCommands.push(finalOptions);
    }
    registerCommandPrefixes(prefixes, options = null){
        if (options) VCMP.Server.commandOptions = options;

        if (prefixes.length >= 4) {
            throw new Error("registerCommandPrefix: support up to 3 command prefixes. Excluding / which in total is 4. Please behave.");
        }
        else VCMP.Server.Prefixes = prefixes;
    }
}

const EventHandler = new CustomEventEmitter();

    // server events
function onServerLoadScripts() {return EventHandler.sEmit("LoadScripts");}
function onServerInitialise() {return EventHandler.sEmit("Initialise");}
function onServerUnloadScripts() {return EventHandler.sEmit("UnloadScripts");}
function onServerShutdown() {return EventHandler.sEmit("Shutdown");}
function onPlayerConnect(p) {return EventHandler.sEmit("Connection", p);}
function onPlayerDisconnect(p, reason) {return EventHandler.sEmit("Disconnect", p, reason);}
function onPlayerCommand(p, msg) {
    let args = msg
        .slice(0)
        .trim()
        .split(/ +/g)
    , command = args.shift().toLowerCase();
    fireEventCommand([command, p, args, '/']);

  // if (VCMP.Server.Prefixes.length >= 1 && VCMP.Server.Prefixes.length <= 3) return EventHandler.sEmit("createCommand", p, message);
  // return EventHandler.sEmit("Command", p, msg);
}
function onPlayerSpawn(p) {return EventHandler.sEmit("Spawn", p);}
function onPlayerRequestSpawn(p) {return EventHandler.sEmit("RequestSpawn", p);}
function onPlayerDeath(p, k, r, b) {
 EventHandler.sEmit("Death", p, r);
}
function onPlayerEnterVehicle(p, v, s) {return EventHandler.sEmit("EnterVehicle", p, v, s);}
function onPlayerExitVehicle(p, v) {return EventHandler.sEmit("ExitVehicle", p, v);}
function onVehicleExplode(v) {return EventHandler.sEmit("VehicleExplode", v);}
function onPlayerCrashReport(p, c) {return EventHandler.sEmit("CrashReport", p, c);}
function onCheckPointExited(c, p) {return EventHandler.sEmit("CheckPointExited", c, p);}
function onCheckPointEntered(c, p) {return EventHandler.sEmit("CheckPointEntered", c, p);}
function onPickupRespawn(pp) {return EventHandler.sEmit("PickupRespawn", pp);}
function onPickupPicked(pp, p) {return EventHandler.sEmit("PickupPicked", pp, p);}
function onPickupPickAttempt(pp, p) {return EventHandler.sEmit("PickupPickAttempt", pp, p);}
function onObjectTouched(o, p) {return EventHandler.sEmit("ObjTouched", o, p);}
function onObjectShot(o, p, w) {return EventHandler.sEmit("ObjShot", o, p, w);}
function onVehicleRespawn(v) {return EventHandler.sEmit("VehicleRespawn", v);}
function onVehicleUpdate(v, u) {return EventHandler.sEmit("VehicleUpdate", v, u);}
function onPlayerSpectate(p, s) {
    return EventHandler.sEmit("Spectate", p, s);
}

function onPlayerKeyBindUp(p, k) {return EventHandler.sEmit("KeyUp", p, k);}
function onPlayerKeyBindDown(p, k) {return EventHandler.sEmit("KeyDown", p, k);}
function onPlayerPrivateMessage(p, r, m) {return EventHandler.sEmit("PrivateMessage", p, r, m);}

function onPlayerMessage(p, m) {
    let args    = m
        .slice(0)
        .trim()
        .split(/ +/g),
    prefix      = args[0].charAt(0),
    command     = args.shift().slice(1).toLowerCase();

        // check is valid
    const isValidPrefixes = VCMP.Server.Prefixes.includes(prefix);

        // if prefix is not valid
        // make sure prefix matches a predefined prefix
    if(isValidPrefixes) fireEventCommand([command, p, args, prefix])

        // based on this we will output a text chat or not
    if(isValidPrefixes && VCMP.Server.commandOptions.disableCmdTextOutput) return false;
    return EventHandler.sEmit("Message", p, m);
}
function onPlayerAwayChange(p, afk) {return EventHandler.sEmit("AFKChanges", p, afk);}
function onPlayerEndTyping(p) {return EventHandler.sEmit("EndTyping", p);}
function onPlayerBeginTyping(p) {return EventHandler.sEmit("BeginTyping", p);}
function onPlayerGameKeysChange(p, o, n) {return EventHandler.sEmit("KeyPress", p, o, n);}
function onPlayerCrouchChange(p, c) {return EventHandler.sEmit("isCrouching", p, c);}
function onPlayerOnFireChange(p, f) {return EventHandler.sEmit("isOnFire", p, f);}
function onPlayerActionChange(p, o, n) {return EventHandler.sEmit("isOnAction", p, o, n);}
function onPlayerStateChange(p, o, n) {return EventHandler.sEmit("StateChanges", p, o, n);}
function onPlayerNameChange(p, o, n) {return EventHandler.sEmit("NameChanges", p, o, n);}
function onPlayerRequestEnterVehicle(p, v, s) {return EventHandler.sEmit("RequestEnterVehicle", p, v, s);}
function onPlayerRequestClass(p, c) {return EventHandler.sEmit("RequestClass", p, c);}
function onPlayerModuleList(p, l) {return EventHandler.sEmit("ModuleList", p, l);}
function onClientScriptData(p, s) {return EventHandler.sEmit("BeginTyping", p, s);}
function onIncomingConnection(n, p, ip) {return EventHandler.sEmit("Incoming", n, p, ip );}

