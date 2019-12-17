const Global = require("./Global");
const Client = require("./Client");
const {Logger} = require("./Core/Util/Logger")

Global.init(main)

process.on('uncaughtException', function (err) {
    Logger.error("uncaughtException:", err);
  });

function main(){
    const workerCount = 1000;
    for (let index = 0; index < workerCount; index++) {
        new Client();
        Logger.log('start client:', index);
    }
}
