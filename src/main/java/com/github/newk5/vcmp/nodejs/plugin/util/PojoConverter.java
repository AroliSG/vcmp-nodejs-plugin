package com.github.newk5.vcmp.nodejs.plugin.util;

import com.caoccao.javet.interop.V8Runtime;
import com.caoccao.javet.interop.converters.JavetObjectConverter;
import com.caoccao.javet.values.V8Value;
import com.caoccao.javet.values.reference.V8ValueObject;

import java.lang.reflect.Method;
import java.util.HashSet;
import java.util.Locale;
import java.util.Set;

@SuppressWarnings("unchecked")
public class PojoConverter extends JavetObjectConverter {

    public static final String METHOD_PREFIX_GET = "get";
    public static final String METHOD_PREFIX_IS = "is";
    protected static final Set<String> EXCLUDED_METHODS;

    static {
        EXCLUDED_METHODS = new HashSet<>();
        for (Method method : Object.class.getMethods()) {
            if (method.getParameterCount() == 0) {
                String methodName = method.getName();
                if (methodName.startsWith(METHOD_PREFIX_IS) || methodName.startsWith(METHOD_PREFIX_GET)) {
                    EXCLUDED_METHODS.add(methodName);
                }
            }
        }
    }
}
