const {Job} = require("./Job")
const Global = require("../Init");
const EventNetwork = require("../Events/EventNetwork")
const {Logger} = require("../Util/Logger")

class SendMessageJob extends Job{

    constructor(){
        super();
        this.type = 0
        this.namespace = ""
    }

    initWithData(data){
        super.initWithData(data);
        this.type = data["messageType"];
        this.namespace = data["namespace"];
    }

    triggerOnMessage(type, message, namespace){
        if(type == this.type && this.namespace == namespace){
            Logger.log("triggerOnMessage", type, this.type, this.namespace)
            this.result = message;
            this.complete();
        }
    }

    run(){
        Global.eventMgr.addListener(EventNetwork.NetWorkSocketData, this.triggerOnMessage, this);
        super.run();
    }

    onDestroy(){
        Global.eventMgr.removeListener(EventNetwork.NetWorkSocketData, this.triggerOnMessage, this);
        super.onDestroy();
    }

}

module.exports = SendMessageJob;