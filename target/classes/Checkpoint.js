var a = {
    id : '#id',
    delete : function ( ){  
        __CheckPointProxy.run(this.id, 'delete', Array.from(arguments));
        VCMP.CheckpointData[this.id]  = {};
    },
    getOwner : function ( ){ const p=  __CheckPointProxy.run(this.id, 'getOwner', Array.from(arguments));  if (p==null || p == undefined) return p; return JSON.parse(p); },
    isStreamedForPlayer : function ( arg0 ){ return  __PlayerProxy.run(this.id, 'isStreamedForPlayer', [arg0.id]); },
    setColour : function ( arg0 ){
        const isObj = typeof arg0 === 'object' && arg0 !== null;
        if (isObj){
           __CheckPointProxy.run(this.id, 'setColour', [arg0.r, arg0.g, arg0.b, arg0.a ]  );
        } else{
            arg0 = VCMP.Colors.toRGB(arg0);
            __CheckPointProxy.run(this.id, 'setColour', [arg0.r, arg0.g, arg0.b, arg0.a ]  );
        }
    },
    getPosition : function ( ){ return  __CheckPointProxy.run(this.id, 'getPosition', Array.from(arguments));  },
    setWorld : function ( arg0 ){  __CheckPointProxy.run(this.id, 'setWorld', Array.from(arguments)); },
    setRadius : function ( arg0 ){  __CheckPointProxy.run(this.id, 'setRadius', Array.from(arguments)); },
    getColour : function ( ){ 
        let v =  __CheckPointProxy.run(this.id, 'getColour', Array.from(arguments)); 
        if (Array.from(arguments).length >0){
            const type = Array.from(arguments)[0].toLowerCase();
            if (type == "rgb"){
                v = VCMP.Colors.toRGB(v);
            }
        }
        return v; 
    },
    getWorld : function ( ){ return  __CheckPointProxy.run(this.id, 'getWorld', Array.from(arguments)); },
    setPosition : function ( arg0, arg1, arg2 ){  __CheckPointProxy.run(this.id, 'setPosition', Array.from(arguments)); },
    getRadius : function ( ){ return  __CheckPointProxy.run(this.id, 'getRadius', Array.from(arguments)); },
    getId : function ( ){ return  __CheckPointProxy.run(this.id, 'getId', Array.from(arguments)); },
    isValid : function ( ){ return  __CheckPointProxy.run(this.id, 'isValid', Array.from(arguments)); },
    attachData : function(){
        let data = VCMP.CheckpointData[this.id];
        if (data==undefined){
            VCMP.CheckpointData[this.id]  = {};
            data  = VCMP.CheckpointData[this.id];
        }
        this["data"] = data;
        return this;
    },
    print : function() {    var result = [];     for (var id in this) {   try {  if (typeof(this[id]) == "function") {  result.push(id + ": " + this[id].toString().split(")")[0]+")" );  }  } catch (err) { result.push(id + ": inaccessible");   }    }  console.log(result);  }

 }