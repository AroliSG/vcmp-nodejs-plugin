package com.github.newk5.vcmp.nodejs.plugin;

import com.github.newk5.vcmp.nodejs.plugin.util.FileResourceUtils;
import com.github.newk5.vcmp.nodejs.plugin.util.EntityConverter;
import com.github.newk5.vcmp.nodejs.plugin.proxies.PlayerProxy;
import com.caoccao.javet.exceptions.JavetExecutionException;
import com.caoccao.javet.interop.V8Host;
import com.caoccao.javet.interop.executors.IV8Executor;
import com.caoccao.javet.node.modules.NodeModuleModule;
import com.caoccao.javet.values.V8Value;
import com.caoccao.javet.values.primitive.V8ValueBoolean;
import com.caoccao.javet.values.primitive.V8ValueString;
import com.caoccao.javet.values.reference.V8ValueObject;
import static com.github.newk5.vcmp.nodejs.plugin.Context.v8;
import com.github.newk5.vcmp.nodejs.plugin.proxies.CheckpointProxy;
import com.github.newk5.vcmp.nodejs.plugin.proxies.GameObjectProxy;
import com.github.newk5.vcmp.nodejs.plugin.proxies.PickupProxy;
import com.github.newk5.vcmp.nodejs.plugin.proxies.ServerProxy;
import com.github.newk5.vcmp.nodejs.plugin.proxies.VehicleProxy;

import com.maxorator.vcmp.java.plugin.integration.RootEventHandler;
import com.maxorator.vcmp.java.plugin.integration.placeable.CheckPoint;
import com.maxorator.vcmp.java.plugin.integration.placeable.GameObject;
import com.maxorator.vcmp.java.plugin.integration.placeable.Pickup;
import com.maxorator.vcmp.java.plugin.integration.player.Player;
import com.maxorator.vcmp.java.plugin.integration.server.Server;
import com.maxorator.vcmp.java.plugin.integration.vehicle.Vehicle;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.Arrays;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.logging.Level;
import java.util.logging.Logger;

public class ServerEventHandler extends RootEventHandler {
    public static EntityConverter entityConverter;
    public static Server server;
    public static String playerJs = "";
    public static String vehicleJs = "";
    public static String checkpointJs = "";
    public static String objectJs = "";
    public static String pickupJs = "";

    private String tempPlayerVar    = "__tempPlayer";
    private String version          = "v1.1.1";

    private AtomicBoolean eventLoopStarted = new AtomicBoolean(false);
    private PlayerUpdateEvents playerUpdateEvents;
    private FileResourceUtils resources = new FileResourceUtils();
 

    public ServerEventHandler(Server server) throws IOException, InterruptedException {
        super(server);
        this.server     = server;
        entityConverter = new EntityConverter();

        try {
            V8Host host = V8Host.getNodeInstance();
            v8 = host.createV8Runtime();
            v8.allowEval(true);

            Thread eventLoop = new Thread(() -> {
                try {

                    eventLoopStarted.set(true);
                    while (true) {
                        v8.await();
                        Thread.sleep(1);

                    }
                } catch (InterruptedException ex) {
                    Logger.getLogger(ServerEventHandler.class.getName()).log(Level.SEVERE, null, ex);
                }

            });

            eventLoop.setName("eventLoopThread");
            eventLoop.start();

            Context.load(server);

        }catch(Exception ex) {
            Logger.getLogger(ServerEventHandler.class.getName()).log(Level.SEVERE, null, ex);
        }

        try {
            v8.getExecutor(resources.readResource("byte-buffer.min.js")).executeVoid();
            v8.getExecutor(resources.readResource("VCMPStream.js")).executeVoid();

            V8ValueString dirname   = v8.createV8ValueString(new File("").getAbsolutePath() + File.separator + "src");
            V8ValueString filename  = v8.createV8ValueString(new File("").getAbsolutePath() + File.separator + "src" + File.separator + "main.js");

            v8.getGlobalObject().setProperty("__version", version);
            v8.getGlobalObject().setProperty("__dirname", dirname);
            v8.getGlobalObject().setProperty("__filename", filename);


            this.playerJs       = resources.readResource("Player.js");
            this.checkpointJs   = resources.readResource("Checkpoint.js");
            this.objectJs       = resources.readResource("Object.js");
            this.pickupJs       = resources.readResource("Pickup.js");
            this.vehicleJs      = resources.readResource("Vehicle.js");

            v8.getExecutor(resources.readResource("VCMPGlobals.js")).executeVoid();
            v8.getExecutor(resources.readResource("EventHandler.js")).executeVoid();
            v8.getExecutor(resources.readResource("CheckForUpdates.js")).executeVoid();
            v8.getExecutor(resources.readResource("Server.js")).executeVoid();
            init();

            if (Context.playerUpdateFunctionsExist()) playerUpdateEvents = new PlayerUpdateEvents(this);
            org.pmw.tinylog.Logger.info("Node.js context initialized");

            dirname.close();
            filename.close();

        } catch (Exception e) {
            exception(e);
        }
    }

    @Override
    public boolean onServerInitialise() {

        try {

            if (Context.functionExists("onServerInitialise")) {

                v8.getGlobalObject().invokeVoid("onServerInitialise");

                System.out.println("");
                v8.getExecutor(" console.log('\\x1b[32m lib version " + version + " updated by AroliSG');").executeVoid();
                v8.getExecutor(" console.log('\\x1b[32m by NewK and AroliSG');").executeVoid();
                v8.getExecutor(" console.log('\\x1b[32m Node.js version: \\x1b[0m' + process.version);").executeVoid();
                System.out.println("");

            }
        } catch (Exception e) {
            exception(e);
            e.printStackTrace();
        }
        return true;
    }

    public void init() {
        try {
            File f = new File("src" + File.separator + "main.js");
            String content = new String(Files.readAllBytes(f.toPath()), StandardCharsets.UTF_8);

            IV8Executor executor = v8.getExecutor(content);

            v8.getNodeModule(NodeModuleModule.class)
                .setRequireRootDirectory(new File("src" + File.separator + "script" + System.currentTimeMillis()).getAbsolutePath());

            V8Value playerProxy     = entityConverter.convertToV8Value(v8, new PlayerProxy());
            V8Value vehicleProxy    = entityConverter.convertToV8Value(v8, new VehicleProxy());
            V8Value pickupProxy     = entityConverter.convertToV8Value(v8, new PickupProxy());
            V8Value objectProxy     = entityConverter.convertToV8Value(v8, new GameObjectProxy());
            V8Value checkpointProxy = entityConverter.convertToV8Value(v8, new CheckpointProxy());


            ServerProxy sp      = new ServerProxy();
            V8Value serverProxy = entityConverter.convertToV8Value(v8, sp);
            V8Value serverJs    = entityConverter.convertToV8Value(v8, server);

            v8.getGlobalObject().set("__PlayerProxy", playerProxy);
            v8.getGlobalObject().set("__VehicleProxy", vehicleProxy);
            v8.getGlobalObject().set("__PickupProxy", pickupProxy);
            v8.getGlobalObject().set("__GameObjectProxy", objectProxy);
            v8.getGlobalObject().set("__CheckPointProxy", checkpointProxy);
            v8.getGlobalObject().set("__ServerProxy", serverProxy);

            sp.overrideObjectGetters();
            executor.executeBoolean();

            playerProxy.close();
            vehicleProxy.close();
            pickupProxy.close();
            objectProxy.close();
            checkpointProxy.close();
            serverJs.close();

        } catch (Exception e) {
            exception(e);
        }
    }

    @Override
    public void onServerFrame() {}

    public static void exception(Exception e) {
        try {
            e.printStackTrace();
            org.pmw.tinylog.Logger.error(e);
            if (e instanceof JavetExecutionException) {
                JavetExecutionException jex = (JavetExecutionException) e;

                String msg = "\033[0;31m ERROR: main.js:" + jex.getScriptingError().getLineNumber() + " " + jex.getScriptingError().getSourceLine() + " " + jex.getScriptingError().getMessage() + "\033[0m";
                System.out.println(msg);
                org.pmw.tinylog.Logger.error(msg);
            }
        } catch (Exception ex) {
        }

    }

    @Override
    public void onPlayerConnect(Player player) {
        if (Context.playerUpdateFunctionsExist()) playerUpdateEvents.connect(player);
        if (Context.functionExists("onPlayerConnect")) {
            try {
                String playerObj = "(" + playerJs.replaceFirst("'#id'", player.getId() + "") + ").attachData()";
                v8.getExecutor("onPlayerConnect(" + playerObj + "); ").executeVoid();
            } catch (Exception e) {
                exception(e);
            }
        }
    }

    @Override
    public void onServerLoadScripts() {
        try {
            if (Context.functionExists("onServerLoadScripts")) {
                v8.getGlobalObject().invokeVoid("onServerLoadScripts");
            }
        } catch (Exception ex) {
            exception(ex);
            Logger.getLogger(ServerEventHandler.class.getName()).log(Level.SEVERE, null, ex);
        }

    }

    public void onPlayerWeaponChange(Player p, int oldWep, int newWep) {
        try {
            if (Context.functionExists("onPlayerWeaponChange")) {
                String playerObj = playerJs.replaceFirst("'#id'", p.getId() + "");

                v8.getExecutor("onPlayerWeaponChange(" + playerObj + ", " + oldWep + ", " + newWep + "); ").executeVoid();
                v8.lowMemoryNotification();
            }
        } catch (Exception e) {
            exception(e);
        }
    }

    public void onPlayerMove(Player player, float lastX, float lastY, float lastZ, float newX, float newY, float newZ) {
        if (Context.functionExists("onPlayerMove")) {

            try {
                String playerObj = "(" + playerJs.replaceFirst("'#id'", player.getId() + "") + ").attachData()";

                v8.getExecutor("onPlayerMove(" + playerObj + ", " + lastX + ", " + lastY + ", " + lastZ + ", " + newX + ", " + newY + ", " + newZ + " ); ").executeVoid();
                v8.lowMemoryNotification();
            } catch (Exception e) {
                exception(e);
            }
        }
    }

    public void onPlayerHealthChange(Player player, float lastHP, float newHP) {
        if (Context.functionExists("onPlayerHealthChange")) {
            try {
                String playerObj = "(" + playerJs.replaceFirst("'#id'", player.getId() + "") + ").attachData()";

                v8.getExecutor("onPlayerHealthChange(" + playerObj + ", " + lastHP + ", " + newHP + "); ").executeVoid();
                v8.lowMemoryNotification();
            } catch (Exception e) {
                exception(e);
            }
        }
    }

    public void onPlayerArmourChange(Player player, float lastArmour, float newArmour) {
        if (Context.functionExists("onPlayerArmourChange")) {
            try {
                String playerObj = "(" + playerJs.replaceFirst("'#id'", player.getId() + "") + ").attachData()";

                v8.getExecutor("onPlayerArmourChange(" + playerObj + ", " + lastArmour + ", " + newArmour + "); ").executeVoid();
                v8.lowMemoryNotification();
            } catch (Exception e) {
                exception(e);
            }
        }
    }

    @Override
    public void onPlayerModuleList(Player player, String list) {
        if (Context.functionExists("onPlayerModuleList")) {
            try {
                try (V8ValueObject p = playerToV8Object(player);
                        V8ValueString o2 = v8.createV8ValueString(list);) {

                    v8.getGlobalObject().invokeVoid("onPlayerModuleList", p, o2);

                }
                v8.getExecutor("delete global." + tempPlayerVar).executeVoid();
            } catch (Exception e) {
                exception(e);
            }
        }
    }

    @Override
    public void onServerUnloadScripts() {
        if (Context.functionExists("onServerUnloadScripts")) {
            try {
                v8.getGlobalObject().invokeVoid("onServerUnloadScripts");
            } catch (Exception e) {
                exception(e);
            }
        }

    }

    @Override
    public String onIncomingConnection(String name, String password, String ip) {
        if (Context.functionExists("onIncomingConnection")) {
            try {
                try (V8ValueString o1 = v8.createV8ValueString(name);
                        V8ValueString o2 = v8.createV8ValueString(password);
                        V8ValueString o3 = v8.createV8ValueString(ip);) {
                    Object o = v8.getGlobalObject().invoke("onIncomingConnection", o1, o2, o3);

                    if (o != null) {
                        if (o instanceof V8ValueString) {
                            V8ValueString v = (V8ValueString) o;
                            return v.toPrimitive();
                        }
                    }
                }

            } catch (Exception e) {
                exception(e);
            }
        }
        return name;
    }

    @Override
    public void onPlayerSpawn(Player player) {
        if (Context.functionExists("onPlayerSpawn")) {
            try {
                String playerObj = "(" + playerJs.replaceFirst("'#id'", player.getId() + "") + ").attachData()";
                v8.getExecutor("onPlayerSpawn(" + playerObj + "); ").executeVoid();
            } catch (Exception e) {
               exception(e);
            }
        }
    }

    @Override
    public void onPlayerDisconnect(Player player, int reason) {
        if (Context.functionExists("onPlayerDisconnect")) {
            try {
                String playerObj = "(" + playerJs.replaceFirst("'#id'", player.getId() + "") + ").attachData()";

                v8.getExecutor("onPlayerDisconnect(" + playerObj + ", " + reason + "); ").executeVoid();
                v8.getExecutor("VCMP.PlayerData[" + player.getId() + "]= {};").executeVoid();
            } catch (Exception e) {
                exception(e);
            }
        }
    }

    @Override
    public void onPlayerEnterVehicle(Player player, Vehicle vehicle, int slot) {
        if (Context.functionExists("onPlayerEnterVehicle")) {
            try {
                String playerObj = "(" + playerJs.replaceFirst("'#id'", player.getId() + "") + ").attachData()";
                String vehicleObj = "(" + vehicleJs.replaceFirst("'#id'", vehicle.getId() + "") + ").attachData()";
                v8.getExecutor("onPlayerEnterVehicle(" + playerObj + ", " + vehicleObj + "," + slot + "); ").executeVoid();
            } catch (Exception e) {
                exception(e);
            }
        }
    }

    @Override
    public void onPlayerExitVehicle(Player player, Vehicle vehicle) {
        if (Context.functionExists("onPlayerExitVehicle")) {
            try {
                String playerObj    = "(" + playerJs.replaceFirst("'#id'", player.getId() + "") + ").attachData()";
                String vehicleObj   = "(" + vehicleJs.replaceFirst("'#id'", vehicle.getId() + "") + ").attachData()";

                v8.getExecutor("onPlayerExitVehicle(" + playerObj + ", " + vehicleObj + "); ").executeVoid();
            } catch (Exception e) {
               exception(e);
            }
        }
    }

    @Override
    public void onVehicleExplode(Vehicle vehicle) {
        if (Context.functionExists("onVehicleExplode")) {
            try {
                String vehicleObj = "(" + vehicleJs.replaceFirst("'#id'", vehicle.getId() + "") + ").attachData()";
                v8.getExecutor("onVehicleExplode(" + vehicleObj + "); ").executeVoid();
            } catch (Exception e) {
                exception(e);
            }
        }
    }

    @Override
    public boolean onPlayerCommand(Player player, String message) {
        if (Context.functionExists("onPlayerCommand")) {
            try (V8ValueObject p = playerToV8Object(player); V8ValueString o2 = v8.createV8ValueString(message);) {
                Object o = v8.getGlobalObject().invoke("onPlayerCommand", p, o2);
                v8.getExecutor("delete global." + tempPlayerVar).executeVoid();

                if (o != null && o instanceof V8ValueBoolean) {
                    V8ValueBoolean v = (V8ValueBoolean) o;
                    return v.toPrimitive();
                }
            } catch (Exception e) {
                exception(e);
            }
        }
        return true;
    }

    @Override
    public void onPlayerCrashReport(Player player, String crashLog) {
        if (Context.functionExists("onPlayerCrashReport")) {
            try {
                try (V8ValueObject p = playerToV8Object(player);  V8ValueString o2 = v8.createV8ValueString(crashLog);) {
                    v8.getGlobalObject().invokeVoid("onPlayerCrashReport", p, o2);
                    v8.getExecutor("VCMP.PlayerData[" + player.getId() + "]= {};").executeVoid();
                }
                v8.getExecutor("delete global." + tempPlayerVar).executeVoid();
            } catch (Exception e) {
                exception(e);
            }
        }
    }

    @Override
    public void onCheckPointExited(CheckPoint checkPoint, Player player) {
        if (Context.functionExists("onCheckPointExited")) {
            try {
                String playerObj = "(" + playerJs.replaceFirst("'#id'", player.getId() + "") + ").attachData()";
                String chObj = "(" + checkpointJs.replaceFirst("'#id'", checkPoint.getId() + "") + ").attachData()";
                v8.getExecutor("onCheckPointExited(" + playerObj + ", " + chObj + "); ").executeVoid();
            } catch (Exception e) {
                exception(e);
            }
        }
    }

    @Override
    public void onCheckPointEntered(CheckPoint checkPoint, Player player) {

        if (Context.functionExists("onCheckPointEntered")) {

            try {
                String playerObj = "(" + playerJs.replaceFirst("'#id'", player.getId() + "") + ").attachData()";
                String chObj = "(" + checkpointJs.replaceFirst("'#id'", checkPoint.getId() + "") + ").attachData()";
                v8.getExecutor("onCheckPointEntered(" + playerObj + ",  " + chObj + "); ").executeVoid();

            } catch (Exception e) {
                exception(e);
            }
        }
    }

    @Override
    public void onPickupRespawn(Pickup pickup) {
        if (Context.functionExists("onPickupRespawn")) {
            try {
                String pobj = "(" + pickupJs.replaceFirst("'#id'", pickup.getId() + "") + ").attachData()";
                v8.getExecutor("onPickupRespawn(" + pobj + "); ").executeVoid();
            } catch (Exception e) {
                exception(e);
            }
        }
    }

    @Override
    public void onPickupPicked(Pickup pickup, Player player) {
        if (Context.functionExists("onPickupPicked")) {
            try {
                String playerObj = "(" + playerJs.replaceFirst("'#id'", player.getId() + "") + ").attachData()";
                String pobj = "(" + pickupJs.replaceFirst("'#id'", pickup.getId() + "") + ").attachData()";
                v8.getExecutor("onPickupPicked(" + pobj + ", " + playerObj + "); ").executeVoid();
            } catch (Exception e) {
                exception(e);
            }
        }
    }

    @Override
    public boolean onPickupPickAttempt(Pickup pickup, Player player) {
        if (Context.functionExists("onPickupPickAttempt")) {
            try {
                String playerObj = "(" + playerJs.replaceFirst("'#id'", player.getId() + "") + ").attachData()";
                String pobj = "(" + "(" + pickupJs.replaceFirst("'#id'", pickup.getId() + "") + ").attachData()" + ").attachData()";
                Boolean o = v8.getExecutor("onPickupPickAttempt(" + pobj + ", " + playerObj + "); ").executeBoolean();

                if (o != null) {
                    return o;
                }
            } catch (Exception e) {
                exception(e);
            }
        }
        return false;
    }

    @Override
    public void onObjectTouched(GameObject object, Player player) {
        if (Context.functionExists("onObjectTouched")) {
            try {
                String playerObj = "(" + playerJs.replaceFirst("'#id'", player.getId() + "") + ").attachData()";
                String pobj = "(" + objectJs.replaceFirst("'#id'", object.getId() + "") + ").attachData()";

                v8.getExecutor("onObjectTouched(" + pobj + ", " + playerObj + "); ").executeVoid();
            } catch (Exception e) {
                exception(e);
            }
        }
    }

    @Override
    public void onObjectShot(GameObject object, Player player, int weaponId) {
        if (Context.functionExists("onObjectShot")) {
            try {
                String playerObj = "(" + playerJs.replaceFirst("'#id'", player.getId() + "") + ").attachData()";
                String pobj = "(" + objectJs.replaceFirst("'#id'", object.getId() + "") + ").attachData()";

                v8.getExecutor("onObjectShot(" + pobj + ", " + playerObj + ", " + weaponId + "); ").executeVoid();
            } catch (Exception e) {
                exception(e);
            }
        }
    }

    @Override
    public void onVehicleRespawn(Vehicle vehicle) {
        if (Context.functionExists("onVehicleRespawn")) {
            try {
                String vehicleObj = "(" + vehicleJs.replaceFirst("'#id'", vehicle.getId() + "") + ").attachData()";
                v8.getExecutor("onVehicleRespawn(" + vehicleObj + "); ").executeVoid();

            } catch (Exception e) {
                exception(e);
            }
        }
    }

    @Override
    public void onVehicleUpdate(Vehicle vehicle, int updateType) {
        if (Context.functionExists("onVehicleUpdate")) {
            try {
                String vehicleObj = "(" + vehicleJs.replaceFirst("'#id'", vehicle.getId() + "") + ").attachData()";
                v8.getExecutor("onVehicleUpdate(" + vehicleObj + ", " + updateType + "); ").executeVoid();
                v8.lowMemoryNotification();
            } catch (Exception e) {
                exception(e);
            }
        }
    }

    @Override
    public void onPlayerSpectate(Player player, Player spectated) {
        if (Context.functionExists("onPlayerSpectate")) {
            try {
                String playerObj = "(" + playerJs.replaceFirst("'#id'", player.getId() + "") + ").attachData()";
                String playerObj2 = playerJs.replaceFirst("'#id'", spectated.getId() + "");

                v8.getExecutor("onPlayerSpectate(" + playerObj + ", " + playerObj2 + "); ").executeVoid();
            } catch (Exception e) {
                exception(e);
            }
        }
    }

    @Override
    public void onPlayerKeyBindUp(Player player, int keyBindIndex) {
        if (Context.functionExists("onPlayerKeyBindUp")) {
            try {
                String playerObj = "(" + playerJs.replaceFirst("'#id'", player.getId() + "") + ").attachData()";
                v8.getExecutor("onPlayerKeyBindUp(" + playerObj + ", " + keyBindIndex + "); ").executeVoid();
            } catch (Exception e) {
                exception(e);
            }
        }
    }

    @Override
    public void onPlayerKeyBindDown(Player player, int keyBindIndex) {
        if (Context.functionExists("onPlayerKeyBindDown")) {
            try {
                String playerObj = "(" + playerJs.replaceFirst("'#id'", player.getId() + "") + ").attachData()";
                v8.getExecutor("onPlayerKeyBindDown(" + playerObj + ", " + keyBindIndex + "); ").executeVoid();
            } catch (Exception e) {
                exception(e);
            }
        }
    }

    @Override
    public boolean onPlayerPrivateMessage(Player player, Player recipient, String message) {
        if (Context.functionExists("onPlayerPrivateMessage")) {
            try {
                try (V8ValueObject p = playerToV8Object(player); V8ValueObject p2 = playerToV8Object(recipient); V8ValueString s = v8.createV8ValueString(message);) {
                    Object o = v8.getGlobalObject().invoke("onPlayerPrivateMessage", p, p2, s);

                    v8.getExecutor("delete global." + tempPlayerVar).executeVoid();
                    if (o != null && o instanceof V8ValueBoolean) {
                        V8ValueBoolean b = (V8ValueBoolean) o;
                        return b.toPrimitive();
                    }
                }

            } catch (Exception e) {
                exception(e);
            }
        }
        return true;
    }

    @Override
    public boolean onPlayerMessage(Player player, String message) {
        if (Context.functionExists("onPlayerMessage")) {
            try {
                try (V8ValueObject p = playerToV8Object(player); V8ValueString s = v8.createV8ValueString(message);) {
                    Object o = v8.getGlobalObject().invoke("onPlayerMessage", p, s);

                    v8.getExecutor("delete global." + tempPlayerVar).executeVoid();
                    if (o != null && o instanceof V8ValueBoolean) {
                        V8ValueBoolean b = (V8ValueBoolean) o;
                        return b.toPrimitive();
                    }
                }
            } catch (Exception e) {
                exception(e);
            }
        }
        return true;
    }

    @Override
    public void onPlayerAwayChange(Player player, boolean isAway) {
        if (Context.functionExists("onPlayerAwayChange")) {
            try {
                String playerObj = "(" + playerJs.replaceFirst("'#id'", player.getId() + "") + ").attachData()";
                v8.getExecutor("onPlayerAwayChange(" + playerObj + ", " + isAway + "); ").executeVoid();
            } catch (Exception e) {
                exception(e);
            }
        }
    }

    @Override
    public void onPlayerEndTyping(Player player) {
        if (Context.functionExists("onPlayerEndTyping")) {
            try {
                String playerObj = "(" + playerJs.replaceFirst("'#id'", player.getId() + "") + ").attachData()";
                v8.getExecutor("onPlayerBeginTyping(" + playerObj + "); ").executeVoid();
            } catch (Exception e) {
                exception(e);
            }
        }
    }

    @Override
    public void onPlayerBeginTyping(Player player) {
        if (Context.functionExists("onPlayerBeginTyping")) {
            try {
                String playerObj = "(" + playerJs.replaceFirst("'#id'", player.getId() + "") + ").attachData()";
                v8.getExecutor("onPlayerBeginTyping(" + playerObj + "); ").executeVoid();
            } catch (Exception e) {
                exception(e);
            }
        }
    }

    @Override
    public void onPlayerGameKeysChange(Player player, int oldKeys, int newKeys) {
        if (Context.functionExists("onPlayerGameKeysChange")) {
            try {
                String playerObj = "(" + playerJs.replaceFirst("'#id'", player.getId() + "") + ").attachData()";
                v8.getExecutor("onPlayerGameKeysChange(" + playerObj + ", " + oldKeys + ", " + newKeys + "); ").executeVoid();
            } catch (Exception e) {
                exception(e);
            }
        }
    }

    @Override
    public void onPlayerCrouchChange(Player player, boolean isCrouching) {
        if (Context.functionExists("onPlayerCrouchChange")) {
            try {
                String playerObj = "(" + playerJs.replaceFirst("'#id'", player.getId() + "") + ").attachData()";
                v8.getExecutor("onPlayerCrouchChange(" + playerObj + ", " + isCrouching + "); ").executeVoid();
            } catch (Exception e) {
                exception(e);
            }
        }
    }

    @Override
    public void onPlayerOnFireChange(Player player, boolean isOnFire) {
        if (Context.functionExists("onPlayerOnFireChange")) {
            try {
                String playerObj = "(" + playerJs.replaceFirst("'#id'", player.getId() + "") + ").attachData()";
                v8.getExecutor("onPlayerOnFireChange(" + playerObj + ", " + isOnFire + "); ").executeVoid();
            } catch (Exception e) {
                exception(e);
            }
        }
    }

    @Override
    public void onPlayerActionChange(Player player, int oldAction, int newAction) {
        if (Context.functionExists("onPlayerActionChange")) {
            try {
                String playerObj = "(" + playerJs.replaceFirst("'#id'", player.getId() + "") + ").attachData()";
                v8.getExecutor("onPlayerActionChange(" + playerObj + ", " + oldAction + ", " + newAction + "); ").executeVoid();
            } catch (Exception e) {
                exception(e);
            }
        }
    }

    @Override
    public void onPlayerStateChange(Player player, int oldState, int newState) {
        if (oldState == newState) return;
        if (Context.functionExists("onPlayerStateChange")) {
            try {
                String playerObj = "(" + playerJs.replaceFirst("'#id'", player.getId() + "") + ").attachData()";
                v8.getExecutor("onPlayerStateChange(" + playerObj + ", " + oldState + ", " + newState + "); ").executeVoid();
            } catch (Exception e) {
                exception(e);
            }
        }

    }

    @Override
    public void onPlayerNameChange(Player player, String oldName, String newName) {
        if (Context.functionExists("onPlayerNameChange")) {
            try {
                try (V8ValueObject p = playerToV8Object(player); V8ValueString o2 = v8.createV8ValueString(oldName); V8ValueString o3 = v8.createV8ValueString(newName);) {
                    v8.getGlobalObject().invoke("onPlayerNameChange", p, o2, o3);
                }
                v8.getExecutor("delete global." + tempPlayerVar).executeVoid();
            } catch (Exception e) {
                exception(e);
            }
        }
    }

    private V8ValueObject playerToV8Object(Player player) {
        try {
            String playerObj = "(" + playerJs.replaceFirst("'#id'", player.getId() + "") + ").attachData()";
            return v8.getExecutor("global." + this.tempPlayerVar + "=" + playerObj + "; global." + this.tempPlayerVar + ";").execute();
        } catch (Exception e) {
            exception(e);
            Logger.getLogger(ServerEventHandler.class.getName()).log(Level.SEVERE, null, e);
        }
        return null;
    }

    @Override
    public boolean onPlayerRequestEnterVehicle(Player player, Vehicle vehicle, int slot) {
        if (Context.functionExists("onPlayerRequestEnterVehicle")) {
            try {
                String playerObj = "(" + playerJs.replaceFirst("'#id'", player.getId() + "") + ").attachData()";
                String vehicleObj = "(" + vehicleJs.replaceFirst("'#id'", vehicle.getId() + "") + ").attachData()";

                Boolean o = v8.getExecutor("onPlayerRequestEnterVehicle(" + playerObj + ", " + vehicleObj + ", " + slot + "); ").executeBoolean();
                if (o != null) return o;
            } catch (Exception e) {
                exception(e);
            }
        }
        return true;
    }

    @Override
    public void onPlayerUpdate(Player player, int updateType) {
        if (Context.playerUpdateFunctionsExist()) playerUpdateEvents.update(player);
        if (Context.functionExists("onPlayerUpdate")) {
            try {
                String playerObj = "(" + playerJs.replaceFirst("'#id'", player.getId() + "") + ").attachData()";

                v8.getExecutor("onPlayerUpdate(" + playerObj + ", " + updateType + "); ").executeVoid();
                v8.lowMemoryNotification();
            } catch (Exception e) {
                exception(e);
            }
        }
    }

    @Override
    public void onPlayerDeath(Player player, Player killer, int reason, int bodyPart) {
        if (Context.functionExists("onPlayerDeath")) {
            try {
                String playerObj = "(" + playerJs.replaceFirst("'#id'", player.getId() + "") + ").attachData()";
                String playerObj2 = playerJs.replaceFirst("'#id'", killer == null ? "-1" : killer.getId() + "");

                v8.getExecutor("onPlayerDeath(" + playerObj + ", " + (killer == null ? "null" : playerObj2) + "," + reason + ", " + bodyPart + " ); ").executeVoid();
            } catch (Exception e) {
                exception(e);
            }
        }
    }

    @Override
    public boolean onPlayerRequestSpawn(Player player) {
        if (Context.functionExists("onPlayerRequestSpawn")) {
            try {
                String playerObj = "(" + playerJs.replaceFirst("'#id'", player.getId() + "") + ").attachData()";
                Boolean o = v8.getExecutor("onPlayerRequestSpawn(" + playerObj + "); ").executeBoolean();

                if (o != null) return o;
            } catch (Exception e) {
                exception(e);
            }
        }
        return true;
    }

    @Override
    public boolean onPlayerRequestClass(Player player, int classIndex) {
        if (Context.functionExists("onPlayerRequestClass")) {
            try {
                String playerObj = "(" + playerJs.replaceFirst("'#id'", player.getId() + "") + ").attachData()";
                Boolean o = v8.getExecutor("onPlayerRequestClass(" + playerObj + "," + classIndex + " ); ").executeBoolean();

                if (o != null) return o;
            } catch (Exception e) {
                exception(e);
            }
        }
        return true;
    }

    @Override
    public void onClientScriptData(Player player, byte[] data) {
        if (Context.functionExists("onClientScriptData")) {
            try {
                String playerObj = "(" + playerJs.replaceFirst("'#id'", player.getId() + "") + ").attachData()";
                v8.getExecutor("onClientScriptData(" + playerObj + ", new VCMPStream(" + Arrays.toString(data) + ")); ").executeVoid();
            } catch (Exception e) {
                exception(e);
            }

        }
    }

    //not being used
    @Override
    public void onPluginCommand(int identifier, String message) {
        if (Context.functionExists("onPluginCommand")) {
            try {
                //v8.getExecutor("onPluginCommand(" + identifier + ", '" + message + "'); ").executeVoid();
            } catch (Exception e) {
                exception(e);
            }
        }
    }

    @Override
    public void onServerShutdown() {
        if (Context.functionExists("onServerShutdown")) {
            try {
                v8.getGlobalObject().invokeVoid("onServerShutdown");
            } catch (Exception e) {
                exception(e);
            }
        }
    }

}