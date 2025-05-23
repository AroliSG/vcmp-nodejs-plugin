package com.github.newk5.vcmp.nodejs.plugin.proxies;
import com.caoccao.javet.values.V8Value;
import com.caoccao.javet.values.primitive.V8ValueBoolean;
import com.caoccao.javet.values.primitive.V8ValueDouble;
import com.caoccao.javet.values.primitive.V8ValueInteger;
import com.caoccao.javet.values.primitive.V8ValueLong;
import com.caoccao.javet.values.primitive.V8ValueNull;
import com.caoccao.javet.values.primitive.V8ValueString;
import com.caoccao.javet.values.reference.V8ValueArray;
import com.caoccao.javet.values.reference.V8ValueObject;
import com.github.newk5.vcmp.nodejs.plugin.Context;
import static com.github.newk5.vcmp.nodejs.plugin.Context.v8;
import com.github.newk5.vcmp.nodejs.plugin.ServerEventHandler;
import com.maxorator.vcmp.java.plugin.integration.generic.Vector;
import com.maxorator.vcmp.java.plugin.integration.placeable.GameObject;
import com.maxorator.vcmp.java.plugin.integration.player.Player;
import com.maxorator.vcmp.java.plugin.integration.player.PlayerImmunity;
import com.maxorator.vcmp.java.plugin.integration.player.PlayerImpl;
import com.maxorator.vcmp.java.plugin.integration.vehicle.Vehicle;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import vlsi.utils.CompactHashMap;

public class PlayerProxy {

    private static CompactHashMap<String, Method> cachedMethods = new CompactHashMap<>();
    private static Method[] methods = PlayerImpl.class.getMethods();

    public void sendStream(Integer id, byte[] b) {
        try {
            ServerProxy.syncThread();
            Player p = ServerEventHandler.server.getPlayer(id);

            ServerEventHandler.server.sendScriptData(p, b);
            ServerProxy.closeSyncBlock();
        } catch (Exception e) {
            ServerProxy.closeSyncBlock();
            ServerEventHandler.exception(e);
        }
    }

    public void removeImmunity(int id, int v) {
        try {
            ServerProxy.syncThread();
            Player p = ServerEventHandler.server.getPlayer(id);

            PlayerImmunity target = p.getImmunities();
            target.remove(v);
            p.setImmunityFlags(target.hex);
            ServerProxy.closeSyncBlock();
        } catch (Exception e) {
            ServerProxy.closeSyncBlock();
            ServerEventHandler.exception(e);
        }
    }

    public boolean hasImmunity(int id, int v) {
        try {
            ServerProxy.syncThread();
            Player p = ServerEventHandler.server.getPlayer(id);

            ServerProxy.closeSyncBlock();
            return p.getImmunities().has(v);
        } catch (Exception e) {
            ServerProxy.closeSyncBlock();
            ServerEventHandler.exception(e);

            return false;
        }
    }

    public void addImmunity(int id, int v) {
        try {
            ServerProxy.syncThread();
            Player p = ServerEventHandler.server.getPlayer(id);

            PlayerImmunity target = p.getImmunities();
            target.add(v);
            p.setImmunityFlags(target.hex);
            ServerProxy.closeSyncBlock();
        } catch (Exception e) {
            ServerProxy.closeSyncBlock();
            ServerEventHandler.exception(e);
        }
    }

    public Object run(Integer id, String method, Object... args) {
        try {
            ServerProxy.syncThread();

            Player p = ServerEventHandler.server.getPlayer(id);

            V8ValueArray arr = (V8ValueArray) args[0];
            List<Object> lst = new ArrayList<>();
            List<Class> paramTypes = new ArrayList<>();

            for (int i = 0; i < arr.getLength(); i++) {
                V8Value value = arr.get(i);
                if (value instanceof V8ValueNull) {
                    lst.add(null);

                } else if (value instanceof V8ValueString) {
                    lst.add(((V8ValueString) value).toPrimitive());
                    paramTypes.add(String.class);
                } else if (value instanceof V8ValueBoolean) {
                    lst.add(((V8ValueBoolean) value).toPrimitive());
                    paramTypes.add(boolean.class);
                } else if (value instanceof V8ValueInteger) {
                    lst.add(((V8ValueInteger) value).toPrimitive());
                    paramTypes.add(int.class);
                } else if (value instanceof V8ValueDouble) {
                    if (method.equals("setColour")) {
                        V8ValueDouble d = (V8ValueDouble) value;
                        Double nd = d.toPrimitive();
                        lst.add(nd.intValue());
                        paramTypes.add(int.class);
                    } else {
                        lst.add(Float.valueOf(((V8ValueDouble) value).toPrimitive() + ""));
                        paramTypes.add(double.class);
                    }

                } else if (value instanceof V8ValueLong) {
                    lst.add(((V8ValueLong) value).toPrimitive());
                    paramTypes.add(long.class);
                }
            }
            Method m = cachedMethods.get(method);
            if (m == null) {
                m = Arrays
                        .stream(methods)
                        .filter(me -> me.getName().equals(method))
                        .filter(me -> {
                            if (method.equals("getColour")) {
                                return true;
                            }
                            return me.getParameterCount() == lst.size();
                        }) //make sure method signature matches
                        .filter(me -> {
                            boolean b = Arrays.equals(me.getParameterTypes(), paramTypes.toArray());
                            if (method.equals("getOption") || method.equals("setOption") || method.equals("setColour")) {
                                return b;
                            }
                            return true;

                        })
                        .findAny().get();
                cachedMethods.put(method, m);

            }
            if (method.equals("getUID") || method.equals("getUID2") || method.equals("IP") || method.equals("getUniqueId")) {
                if (method.equals("getUID")) {
                    V8Value uid = ServerEventHandler.entityConverter.convertToV8Value(v8, p.getUID());
                    ServerProxy.closeSyncBlock();
                    return uid;
                }
                if (method.equals("getUID2")) {
                    V8Value uid = ServerEventHandler.entityConverter.convertToV8Value(v8, p.getUID2());
                    ServerProxy.closeSyncBlock();
                    return uid;
                }
                if (method.equals("getUniqueId")) {
                    V8Value uid = ServerEventHandler.entityConverter.convertToV8Value(v8, p.getUniqueId());
                    ServerProxy.closeSyncBlock();
                    return uid;
                }
                if (method.equals("getIP")) {
                    V8Value ip = ServerEventHandler.entityConverter.convertToV8Value(v8, p.getIP());
                    ServerProxy.closeSyncBlock();
                    return ip;
                }
            }
            else if (method.equalsIgnoreCase("setSpectateTarget")) {
                if (lst.get(0) == null) {
                    p.setSpectateTarget(null);
                    ServerProxy.closeSyncBlock();
                    return null;
                }
                Player target = ServerEventHandler.server.getPlayer((int) lst.get(0));
                if (target != null) {
                    p.setSpectateTarget(target);
                    ServerProxy.closeSyncBlock();
                }
                return null;

            } else if (method.equals("getSpectateTarget")) {
                Player target = p.getSpectateTarget();
                if (target == null) {
                    ServerProxy.closeSyncBlock();
                    return null;
                }

                int pid = target.getId();
                ServerProxy.closeSyncBlock();
                return pid;

            }
            else if (method.equals("set3DArrowForPlayer")) {
                Player target = ServerEventHandler.server.getPlayer((int) lst.get(0));
                p.set3DArrowForPlayer(target, (boolean) lst.get(1));
                ServerProxy.closeSyncBlock();

                return null;
            }
            else if (method.equals("isStreamedForPlayer")) {
                boolean v = false;
                if (lst.get(0) == null) {

                     v = p.isStreamedForPlayer(null);
                    ServerProxy.closeSyncBlock();

                    return v;
                }
                Player target = ServerEventHandler.server.getPlayer((int) lst.get(0));
                v = p.isStreamedForPlayer(target);

                ServerProxy.closeSyncBlock();
                return v;
            } else if (method.equals("putInVehicle")) {
                int vid = (int) lst.get(0);
                int slot = (int) lst.get(1);
                boolean b1 = (boolean) lst.get(2);
                boolean b2 = (boolean) lst.get(3);

                p.putInVehicle(ServerEventHandler.server.getVehicle(vid), slot, b1, b2);
                ServerProxy.closeSyncBlock();
                return null;
            } else if (method.equals("getColour")) {
                V8ValueInteger obj = Context.v8.createV8ValueInteger(p.getColourHex());
                ServerProxy.closeSyncBlock();
                return obj;

            } else if (method.equals("getVehicle") || method.equals("getStandingOnVehicle")) {
                Vehicle v = (Vehicle) m.invoke(p, lst.toArray());
                if (v == null) {
                    ServerProxy.closeSyncBlock();
                    return null;
                }

                int vid = v.getId();
                ServerProxy.closeSyncBlock();
                return vid;

            } else if (method.equals("getStandingOnObject")) {
                GameObject v = (GameObject) m.invoke(p, lst.toArray());
                if (v == null) {
                    ServerProxy.closeSyncBlock();
                    return null;
                }

                int vid = v.getId();
                ServerProxy.closeSyncBlock();
                return vid;

            } else if (method.equals("getPosition") || method.equals("getSpeed") || method.equals("getAimPosition") || method.equals("getAimDirection")) {
                V8ValueObject obj = Context.v8.createV8ValueObject();
                Vector vec = null;
                if (method.equals("getPosition")) {
                    vec = p.getPosition();
                } else if (method.equals("getSpeed")) {
                    vec = p.getSpeed();
                } else if (method.equals("getAimPosition")) {
                    vec = p.getAimPosition();
                } else if (method.equals("getAimDirection")) {
                    vec = p.getAimDirection();
                }
                obj.setProperty("x", ServerEventHandler.entityConverter.convertToV8Value(v8, vec.x));
                obj.setProperty("y", ServerEventHandler.entityConverter.convertToV8Value(v8, vec.y));
                obj.setProperty("z", ServerEventHandler.entityConverter.convertToV8Value(v8, vec.z));
                ServerProxy.closeSyncBlock();
                return obj;

            }
            Object o = m.invoke(p, lst.toArray());

            ServerProxy.closeSyncBlock();
            return o;

        } catch (Exception e) {
            ServerProxy.closeSyncBlock();
            ServerEventHandler.exception(e);
        }
        return null;
    }

}
