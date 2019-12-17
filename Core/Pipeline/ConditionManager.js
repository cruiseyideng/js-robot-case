const events = require("events");
const Global = require("../Init");
const EventNetwork = require("../Events/EventNetwork")

class ConditionManager extends events.EventEmitter {
    
    constructor(pipeline){
        this.pipeline = pipeline;
    }

    init(){
        Global.eventMgr.addListener(EventNetwork.NetWorkSocketData, this.onMessage, this);
    }

    onMessage(type, message, namespace){
        
    }

}

module.exports = ConditionManager;