const EventEmitter          = require('events');
const registeredCommands    = [];
const commandTimeout        = new Map();

function fireEventCommand(args) {
    let options     = VCMP.Server.commandOptions;
    let commandName = args[0];
    let target      = args[1];
    let message     = args[2];
    let prefix      = args[3];
    let triggerWith = args[4];
    let delay       = options.commandDelayInSecs;

    const currentTime = new Date().getTime();
    const lastTime    = commandTimeout.get('commandTimeout')

        // global commands timeout callback
    if (commandTimeout.has('commandTimeout') && currentTime < lastTime) {
        if (typeof options.commandDelayCallback === 'function') options.commandDelayCallback(target,delay,prefix,commandName);
        return false;
    }
    const commandFound = registeredCommands.some(({
        commandName: registeredCommand,
        commandAlias,
        execute,
        forcePrefixTo,
        executeWith
    }) => {

            // command will only be executed if prefixes are the same.
            // only when forcePrefixTo is defined
        if (executeWith && triggerWith && triggerWith !== executeWith) return false;
        if (forcePrefixTo&&forcePrefixTo !== prefix) return false;

        const isExactMatch = registeredCommand === commandName;
        const isAliasMatch = commandAlias.includes(commandName);

        if (isExactMatch || isAliasMatch) {
            if (execute) execute(target, message);

            if( options.commandDelayInSecs > 0 ) commandTimeout.set('commandTimeout', currentTime + options.commandDelayInSecs);
            return true;
        }

        return false;
    });

        // global commands not found callback-
    if (!commandFound && typeof options.commandNotFoundCallback === 'function') {
        options.commandNotFoundCallback(target,prefix,commandName);
    }
}

class CustomEventEmitter extends EventEmitter {
    registerEvent(event, ...args) {
            // returning boolean results from callbacks
        const l     = this.listeners(event)[0];
        const evt   = typeof l == 'function' && l(...args);

        if (l && evt !== undefined) return evt;
        return null;
    }
    registerCommand(name, options = {}) {
        const defaultOptions = {
            commandAlias: [],
            caseSensitive: false,
            forcePrefixTo: undefined,
            execute: undefined,
            executeWith: null
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
    triggerCommand(arrayArgs){
        fireEventCommand(arrayArgs);
    }
}

const handler = new CustomEventEmitter();

function onPlayerDeath(p, k, r, b) {
    if (k) return handler.registerEvent("Kill", p, k, r, b);
    return handler.registerEvent("Death", p, r);
}

function onPlayerCommand(p, msg) {
    let args = msg
        .slice(0)
        .trim()
        .split(/ +/g)
    , command = args.shift();
    fireEventCommand([command, p, args, '/', "vcmp"]);
}

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
    if(isValidPrefixes) fireEventCommand([command, p, args, prefix, "vcmp"])

        // based on this we will output a text chat or not
    if(isValidPrefixes && VCMP.Server.commandOptions.disableCmdTextOutput) return false;
    return handler.registerEvent("Message", p, m);
}

function onPlayerPrivateMessage(p, r, m) {return handler.registerEvent("PrivateMessage", p, r, m);}

    // server events
function onServerLoadScripts() {
    return handler.registerEvent("LoadScripts");
};

function onServerInitialise() {
        // development mode
    let devToggle = server.getDevMode();
    if (devToggle === "auto") devToggle = process.platform === "win32";
    if (devToggle) DevelopmentMode();

    return handler.registerEvent("Init");
};

function onServerUnloadScripts() {return handler.registerEvent("UnloadScripts");}
function onServerShutdown() {return handler.registerEvent("Shutdown");}

function onPlayerConnect(p) {return handler.registerEvent("Connected", p);}
function onPlayerDisconnect(p, reason) {return handler.registerEvent("Disconnected", p, reason);}

function onPlayerSpawn(p) {return handler.registerEvent("Spawn", p);}
function onPlayerRequestSpawn(p) {return handler.registerEvent("RequestSpawn", p);}

function onPlayerEnterVehicle(p, v, s) {return handler.registerEvent("EnterVehicle", p, v, s);}
function onPlayerRequestEnterVehicle(p, v, s) {return handler.registerEvent("RequestEnterVehicle", p, v, s);}
function onPlayerExitVehicle(p, v) {return handler.registerEvent("ExitVehicle", p, v);}

function onPlayerKeyBindUp(p, k) {return handler.registerEvent("KeyUp", p, k);}
function onPlayerKeyBindDown(p, k) {return handler.registerEvent("KeyDown", p, k);}

function onPlayerCrashReport(p, c) {return handler.registerEvent("CrashReport", p, c);}

function onPlayerEndTyping(p) {return handler.registerEvent("EndTyping", p);}
function onPlayerBeginTyping(p) {return handler.registerEvent("BeginTyping", p);}

function onPlayerSpectate(p, s) {return handler.registerEvent("Spectate", p, s);}


function onPlayerAwayChange(p, afk) {return handler.registerEvent("AFKChanges", p, afk);}

function onPlayerGameKeysChange(p, o, n) {return handler.registerEvent("KeyChanges", p, o, n);}
function onPlayerCrouchChange(p, c) {return handler.registerEvent("isCrouching", p, c);}
function onPlayerOnFireChange(p, f) {return handler.registerEvent("isOnFire", p, f);}
function onPlayerActionChange(p, o, n) {return handler.registerEvent("isOnAction", p, o, n);}
function onPlayerStateChange(p, o, n) {return handler.registerEvent("StateChanges", p, o, n);}
function onPlayerNameChange(p, o, n) {return handler.registerEvent("NameChanges", p, o, n);}

function onPlayerRequestClass(p, c) {return handler.registerEvent("RequestClass", p, c);}
function onPlayerModuleList(p, l) {return handler.registerEvent("ModuleList", p, l);}

function onCheckPointExited(c, p) {return handler.registerEvent("CheckPointExited", c, p);}
function onCheckPointEntered(c, p) {return handler.registerEvent("CheckPointEntered", c, p);}

function onPickupRespawn(pp) {return handler.registerEvent("PickupRespawn", pp);}
function onPickupPicked(pp, p) {return handler.registerEvent("PickupCollected", pp, p);}
function onPickupPickAttempt(pp, p) {return handler.registerEvent("PickupAttempted", pp, p);}

function onObjectTouched(o, p) {return handler.registerEvent("ObjTouched", o, p);}
function onObjectShot(o, p, w) {return handler.registerEvent("ObjShot", o, p, w);}

function onVehicleExplode(v) {return handler.registerEvent("VehicleExplode", v);}
function onVehicleRespawn(v) {return handler.registerEvent("VehicleRespawn", v);}

function onClientScriptData(p, s) {return handler.registerEvent("ScriptData", p, s);}
function onIncomingConnection(n, p, ip) {return handler.registerEvent("Incoming", n, p, ip );}

