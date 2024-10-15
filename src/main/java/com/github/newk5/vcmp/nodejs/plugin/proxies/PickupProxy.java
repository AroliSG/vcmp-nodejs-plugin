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
import com.maxorator.vcmp.java.plugin.integration.generic.Vector;
import com.maxorator.vcmp.java.plugin.integration.placeable.Pickup;
import com.maxorator.vcmp.java.plugin.integration.player.Player;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import vlsi.utils.CompactHashMap;

public class PickupProxy {

    private static CompactHashMap<String, Method> cachedMethods = new CompactHashMap<>();
    private static Method[] methods = Pickup.class.getMethods();

    public Object run(Integer id, String method, Object... args) {
        try {
            ServerProxy.syncThread();
            Pickup p = ServerEventHandler.server.getPickup(id);
            Method m = cachedMethods.get(method);
            if (m == null) {
                m = Arrays
                        .stream(methods)
                        .filter(me -> me.getName()
                        .equals(method))
                        .findAny().get();
                cachedMethods.put(method, m);

            }

            V8ValueArray arr = (V8ValueArray) args[0];
            List<Object> lst = new ArrayList<>();

            for (int i = 0; i < arr.getLength(); i++) {
                V8Value value = arr.get(i);
                if (value instanceof V8ValueNull) {
                    lst.add(null);
                } else if (value instanceof V8ValueString) {
                    lst.add(((V8ValueString) value).toPrimitive());
                } else if (value instanceof V8ValueBoolean) {
                    lst.add(((V8ValueBoolean) value).toPrimitive());
                } else if (value instanceof V8ValueInteger) {
                    lst.add(((V8ValueInteger) value).toPrimitive());
                } else if (value instanceof V8ValueDouble) {
                    lst.add(Float.valueOf(((V8ValueDouble) value).toPrimitive() + ""));
                } else if (value instanceof V8ValueLong) {
                    lst.add(((V8ValueLong) value).toPrimitive());
                }
            }
            if (method.equals("isStreamedForPlayer")) {
                if (lst.get(0) == null) {
                    boolean b = p.isStreamedForPlayer(null);
                    ServerProxy.closeSyncBlock();
                    return b;
                }
                Player target = ServerEventHandler.server.getPlayer((int) lst.get(0));
                boolean b = p.isStreamedForPlayer(target);
                ServerProxy.closeSyncBlock();
                return b;
            } else if (method.equals("getPosition")) {
                Vector vec = (Vector) m.invoke(p, lst.toArray());
                ServerProxy.closeSyncBlock();
                V8ValueObject obj = Context.v8.createV8ValueObject();
                if (vec == null) {
                    return null;
                }
                obj.setProperty("x", ServerEventHandler.entityConverter.toV8Value(Context.v8, vec.x));
                obj.setProperty("y", ServerEventHandler.entityConverter.toV8Value(Context.v8, vec.y));
                obj.setProperty("z", ServerEventHandler.entityConverter.toV8Value(Context.v8, vec.z));
                return obj;
            }
            ServerProxy.closeSyncBlock();
            return m.invoke(p, lst.toArray());
        } catch (Exception ex) {
            System.out.println("exception running " + method);
            ServerProxy.closeSyncBlock();
            ex.printStackTrace();
        }
        return null;
    }

}
