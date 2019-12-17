var EventManager = require("./Manager/EventManager");
const ProtocolInit = require("./Protocol/ProtocolInit");
const fs = require("fs")
const {Logger} = require("./Util/Logger");
const NetworkManager = require("./Network/NetworkManager");

var Global = {};

Global.eventMgr = new EventManager();
Global.networkMgr = new NetworkManager();

var _initCompelete = undefined;
Global.init = function(callback = undefined){
    _initCompelete = callback;
    fs.readFile("./Config/protocol.json", (err, data) => {
        const json = JSON.parse(data);
        ProtocolInit.exec(json);
        Logger.log("init protocol")
        _initCompelete()
    })
}

module.exports = Global;