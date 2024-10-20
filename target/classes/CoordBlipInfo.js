var a = {
    id : '#id',
    getId : function ( ){  __CheckPointProxy.run(this.id, 'delete', Array.from(arguments)); },
    getOwner : function ( ){ return  __CheckPointProxy.run(this.id, 'getOwner', Array.from(arguments)); },
    isStreamedForPlayer : function ( arg0 ){ return  __CheckPointProxy.run(this.id, 'isStreamedForPlayer', Array.from(arguments)); },
    setColour : function ( arg0, arg1, arg2, arg3 ){  __CheckPointProxy.run(this.id, 'setColour', Array.from(arguments)); },
    getColourHex : function ( ){ return  __CheckPointProxy.run(this.id, 'getColourHex', Array.from(arguments)); },
    getPosition : function ( ){ return  __CheckPointProxy.run(this.id, 'getPosition', Array.from(arguments)); },
    setWorld : function ( arg0 ){  __CheckPointProxy.run(this.id, 'setWorld', Array.from(arguments)); },
    setRadius : function ( arg0 ){  __CheckPointProxy.run(this.id, 'setRadius', Array.from(arguments)); },
    getColour : function ( ){ return  __CheckPointProxy.run(this.id, 'getColour', Array.from(arguments)); },
    getWorld : function ( ){ return  __CheckPointProxy.run(this.id, 'getWorld', Array.from(arguments)); },
    setPosition : function ( arg0, arg1, arg2 ){  __CheckPointProxy.run(this.id, 'setPosition', Array.from(arguments)); },
    getRadius : function ( ){ return  __CheckPointProxy.run(this.id, 'getRadius', Array.from(arguments)); },
    getId : function ( ){ return  __CheckPointProxy.run(this.id, 'getId', Array.from(arguments)); },
    isValid : function ( ){ return  __CheckPointProxy.run(this.id, 'isValid', Array.from(arguments)); },
    print : function() {    var result = [];     for (var id in this) {   try {  if (typeof(this[id]) == "function") {  result.push(id + ": " + this[id].toString().split(")")[0]+")" );  }  } catch (err) { result.push(id + ": inaccessible");   }    }  console.log(result);  }


 }