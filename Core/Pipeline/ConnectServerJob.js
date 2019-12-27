const {Job} = require("./Job")
const Global = require("../Init");
const EventNetwork = require("../Events/EventNetwork")

class ConnectServerJob extends Job{

    constructor(){
        super();
        this.host = ""
        this.port = ""
        this.namespace = ""
    }

    initWithData(data){
        super.initWithData(data);
        this.host = data["host"];
        this.port = data["port"];
        this.namespace = data["namespace"];
    }

    
    updateWithData(data){
        super.updateWithData(data);
        this.host = this.data["host"];
        this.port = this.data["port"];
        this.namespace = this.data["namespace"];
    }

    addListeners(){
        Global.eventMgr.addListener(EventNetwork.NetWorkConnectSuccess, this.onConnect, this);
        // Global.eventMgr.addListener(EventNetwork.NetWorkConnectClose, this.onClose, this);
        Global.eventMgr.addListener(EventNetwork.NetWorkConnectError, this.onError, this);
    }

    removeListeners(){
        Global.eventMgr.removeListener(EventNetwork.NetWorkConnectSuccess, this.onConnect, this);
        // Global.eventMgr.removeListener(EventNetwork.NetWorkConnectClose, this.onClose, this);
        Global.eventMgr.removeListener(EventNetwork.NetWorkConnectError, this.onError, this);
    }

    run(){
        this.addListeners();
        Global.networkMgr.connect(this.host, this.port, this.namespace);
        super.run();
    }

    onConnect(){
        this.removeListeners();
        super.complete();
    }

    onError(){
        this.removeListeners();
        super.failed();
    }

    onClose(){
        this.removeListeners();
        super.failed();
    }

    onDestroy(){
        this.removeListeners();
        super.onDestroy();
    }

}

module.exports = ConnectServerJob;