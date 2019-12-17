const {Job} = require("./Job")
const Global = require("../Init");
const EventNetwork = require("../Events/EventNetwork")

class SendMessageJob extends Job{

    constructor(){
        super();
        this.message = undefined;
        this.messageType = 0
        this.namespace = ""
    }

    initWithData(data){
        super.initWithData(data);
        this.message = data["message"];
        this.messageType = data["messageType"];
        this.namespace = data["namespace"];
    }

    run(){
        if(!this.canRun()){
            super.complete();
            return;
        }
        let result = Global.networkMgr.sendMessage(this.message, this.messageType);
        super.run();
        if(result){
            super.complete();
        }else{
            super.failed();
        }
    }

    onDestroy(){
        super.onDestroy();
    }

}

module.exports = SendMessageJob;