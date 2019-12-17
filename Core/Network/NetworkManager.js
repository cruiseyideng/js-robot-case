var WebSocketCore = require("./WebSocketCore");
var ProtocolUtil = require("../Protocol/ProtocolUtil")
var {Logger} = require("../Util/Logger");
var EventNetwork = require("../Events/EventNetwork");
const fs = require("fs")

class NetworkManager{
    
    constructor(name = "Default"){
        this._name = name;
        this.namespace = undefined;
        this.webSocket = new WebSocketCore();
        this.webSocket.setCallBacks(this.onConnect.bind(this), this.onClose.bind(this), this.onSocketData.bind(this), this.onError.bind(this));
    }

    connect(host, port, namespace = undefined, urlParams = undefined) {
        this.namespace = namespace;
        this.webSocket.connect(host, port, urlParams);
        Logger.log("connect", host, port, this.namespace)
    }
    
    onConnect(){
        const Global = require("../Init");
        Logger.log("onconnect", this.namespace)
        Global.eventMgr.dispatchEvent(EventNetwork.NetWorkConnectSuccess);
    }

    onClose(){
        const Global = require("../Init");
        Logger.log("onclose", this.namespace)
        Global.eventMgr.dispatchEvent(EventNetwork.NetWorkConnectClose);
    }

    onSocketData(data){
        const Global = require("../Init");
        let messageType = ProtocolUtil.readType(data, this.namespace);
        try {
            let message = ProtocolUtil.read(data, this.namespace);
            if (message) {
                if (message.hasOwnProperty("HEADER")) {
                    let type = message["HEADER"].type;
                    delete message["HEADER"]
                    Logger.log("<<<<<< receive message 0x" + type.toString(16), this._name, this.namespace, message)
                    Global.eventMgr.dispatchEvent(EventNetwork.NetWorkSocketData, type, message, this.namespace, this._name);
                } else {
                    Logger.error("error: receive message without HEADER", this._name, this.namespace, message)
                }
            } else {
                Logger.warn("error: receive unreadable message", this._name, this.namespace)
            }
        } catch (error) {
            Logger.error("caught error:", error, messageType, this.namespace);
        }
    }

    sendMessage(object, messageType) {
        let buffer = ProtocolUtil.write(object, messageType, this.namespace);
        let result = false;
        if (buffer) {
            Logger.log(">>>>>> send message 0x" + messageType.toString(16), this._name, this.namespace, object);
            result = this.webSocket.send(buffer);
            this.writeBin(buffer, messageType, "send");
        } else {
            Logger.error(">>>>>> failed: send message 0x" + messageType.toString(16), this._name, this.namespace, object);
        }
        return result;
    }

    onError(){
        Logger.log("onerror", this.namespace)
        const Global = require("../Init");
        Global.eventMgr.dispatchEvent(EventNetwork.NetWorkConnectError);
    }

    writeBin(buffer, type, tag = "receive") {
        // let uint8Array = new Uint8Array(buffer);
        // Logger.log("len:", uint8Array.length);
        // fs.writeFile("protocol_" + type + "_" + tag + ".bin", uint8Array, ()=>{
        //     Logger.log("============= write " + type + " successfully ==========")    
        // });
    }
}

module.exports = NetworkManager;
