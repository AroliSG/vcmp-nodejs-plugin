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
import com.github.newk5.vcmp.nodejs.plugin.ServerEventHandler;
import static com.github.newk5.vcmp.nodejs.plugin.ServerEventHandler.playerJs;
import com.maxorator.vcmp.java.plugin.integration.generic.Quaternion;
import com.maxorator.vcmp.java.plugin.integration.generic.Rotation2d;
import com.maxorator.vcmp.java.plugin.integration.generic.Vector;
import com.maxorator.vcmp.java.plugin.integration.player.Player;
import com.maxorator.vcmp.java.plugin.integration.vehicle.Vehicle;
import com.maxorator.vcmp.java.plugin.integration.vehicle.VehicleColours;
import com.maxorator.vcmp.java.plugin.integration.vehicle.VehicleDamage;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import vlsi.utils.CompactHashMap;

public class VehicleProxy {

    private static CompactHashMap<String, Method> cachedMethods = new CompactHashMap<>();
    private static Method[] methods = Vehicle.class.getMethods();

    public Object run(Integer id, String method, Object... args) {
        try {
            ServerProxy.syncThread();
            Vehicle p = ServerEventHandler.server.getVehicle(id);

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
                    lst.add(Float.valueOf(((V8ValueDouble) value).toPrimitive() + ""));
                    paramTypes.add(double.class);
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
                        .filter(me -> me.getParameterCount() == lst.size()) //make sure method signature matches
                        .filter(me -> {
                            boolean b = Arrays.equals(me.getParameterTypes(), paramTypes.toArray());
                            if (method.equals("getOption") || method.equals("setOption")) {
                                return b;
                            }
                            return true;

                        })
                        .findAny().get();
                cachedMethods.put(method, m);

            }
            if (method.equalsIgnoreCase("getTurretRotation")) {
                Rotation2d ord = (Rotation2d) m.invoke(p, lst.toArray());
                ServerProxy.closeSyncBlock();
                if (ord != null) {
                    V8ValueObject obj = Context.v8.createV8ValueObject();
                    obj.setProperty("horizontal", ServerEventHandler.entityConverter.convertToV8Value(Context.v8, ord.horizontal));
                    obj.setProperty("vertical", ServerEventHandler.entityConverter.convertToV8Value(Context.v8, ord.vertical));
                    return obj;

                }
                return null;

            } else if (method.equalsIgnoreCase("getColours")) {
                VehicleColours vec = (VehicleColours) m.invoke(p, lst.toArray());
                ServerProxy.closeSyncBlock();
                if (vec != null) {
                    V8ValueObject obj = Context.v8.createV8ValueObject();
                    obj.setProperty("primary", ServerEventHandler.entityConverter.convertToV8Value(Context.v8, vec.primary));
                    obj.setProperty("secondary", ServerEventHandler.entityConverter.convertToV8Value(Context.v8, vec.secondary));
                    return obj;

                }
                return null;

            } else if (method.equals("isStreamedForPlayer")) {
                if (lst.get(0) == null) {
                    boolean b = p.isStreamedForPlayer(null);
                    ServerProxy.closeSyncBlock();
                    return b;
                }
                Player target = ServerEventHandler.server.getPlayer((int) lst.get(0));
                boolean b = p.isStreamedForPlayer(target);
                ServerProxy.closeSyncBlock();
                return b;
            } else if (method.equals("getDamage")) {

                int dmg = p.getDamageHex();
                ServerProxy.closeSyncBlock();
                return dmg;
            } else if (method.equals("getSyncController") || method.equals("getOccupant")) {
                Player target = (Player) m.invoke(p, lst.toArray());
                if (target == null) {
                    ServerProxy.closeSyncBlock();
                    return null;
                }

                String playerObj = playerJs.replaceFirst("'#id'", target.getId() + "");
                ServerProxy.closeSyncBlock();
                return playerObj;
            } else if (method.equals("getSyncReason")) {
                int ord = (int) m.invoke(p, lst.toArray());
                ServerProxy.closeSyncBlock();
                return ord;
            } else if (method.equals("getPosition") || method.equals("getRotationEuler") || method.equals("getSpeed") || method.equals("getTurnSpeed") || method.equals("getSpawnPosition") || method.equals("getSpawnRotationEuler")) {
                Vector vec = (Vector) m.invoke(p, lst.toArray());
                ServerProxy.closeSyncBlock();
                V8ValueObject obj = Context.v8.createV8ValueObject();
                if (vec == null) {
                    return null;
                }
                obj.setProperty("x", ServerEventHandler.entityConverter.convertToV8Value(Context.v8, vec.x));
                obj.setProperty("y", ServerEventHandler.entityConverter.convertToV8Value(Context.v8, vec.y));
                obj.setProperty("z", ServerEventHandler.entityConverter.convertToV8Value(Context.v8, vec.z));
                return obj;
            } else if (method.equals("getRotation") || method.equals("getSpawnRotation")) {
                Quaternion vec = (Quaternion) m.invoke(p, lst.toArray());
                ServerProxy.closeSyncBlock();
                V8ValueObject obj = Context.v8.createV8ValueObject();
                if (vec == null) {
                    return null;
                }
                obj.setProperty("x", ServerEventHandler.entityConverter.convertToV8Value(Context.v8, vec.x));
                obj.setProperty("y", ServerEventHandler.entityConverter.convertToV8Value(Context.v8, vec.y));
                obj.setProperty("z", ServerEventHandler.entityConverter.convertToV8Value(Context.v8, vec.z));
                obj.setProperty("w", ServerEventHandler.entityConverter.convertToV8Value(Context.v8, vec.w));
                return obj;
            }
            ServerProxy.closeSyncBlock();
            return m.invoke(p, lst.toArray());
        } catch (Exception e) {
            ServerProxy.closeSyncBlock();
            ServerEventHandler.exception(e);
        }
        return null;
    }

    public int getTyreStatus(int id, int tyre) {
        ServerProxy.syncThread();
        Vehicle v = ServerEventHandler.server.getVehicle(id);
        if (v != null) {
            VehicleDamage vd = v.getDamage();
            ServerProxy.closeSyncBlock();
            return vd.getTyreStatus(tyre);
        }
        ServerProxy.closeSyncBlock();
        return -1;
    }

    public int getDoorStatus(int id, int tyre) {
        ServerProxy.syncThread();
        Vehicle v = ServerEventHandler.server.getVehicle(id);
        if (v != null) {
            VehicleDamage vd = v.getDamage();
            ServerProxy.closeSyncBlock();
            return vd.getDoorStatus(tyre);
        }
        ServerProxy.closeSyncBlock();
        return -1;
    }

    public void setDoorStatus(int id, int door, int status) {
        ServerProxy.syncThread();
        Vehicle v = ServerEventHandler.server.getVehicle(id);
        if (v != null) {
            VehicleDamage vd = v.getDamage();
            vd.setDoorStatus(door, status);
            v.setDamage(vd.damage);
        }
        ServerProxy.closeSyncBlock();
    }

    public void setTyreStatus(int id, int trye, int status) {
        ServerProxy.syncThread();
        Vehicle v = ServerEventHandler.server.getVehicle(id);
        if (v != null) {
            VehicleDamage vd = v.getDamage();
            vd.setTyreStatus(trye, status);
            v.setDamage(vd.damage);
        }
        ServerProxy.closeSyncBlock();
    }

    public int getPanelStatus(int id, int panel) {
        ServerProxy.syncThread();
        Vehicle v = ServerEventHandler.server.getVehicle(id);
        if (v != null) {
            VehicleDamage vd = v.getDamage();
            ServerProxy.closeSyncBlock();
            return vd.getPanelStatus(panel);
        }
        ServerProxy.closeSyncBlock();
        return -1;
    }

    public void setPanelStatus(int id, int panel, int status) {
        ServerProxy.syncThread();
        Vehicle v = ServerEventHandler.server.getVehicle(id);
        if (v != null) {
            VehicleDamage vd = v.getDamage();
            vd.setPanelStatus(panel, status);
            v.setDamage(vd.damage);
        }
        ServerProxy.closeSyncBlock();
    }

}
