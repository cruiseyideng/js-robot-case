const Global = require("./Global");
const Client = require("./Client");
const {Logger} = require("./Core/Util/Logger")
const {isMainThread, Worker} = require("worker_threads")

Global.init(main)

process.on('uncaughtException', function (err) {
    Logger.error("uncaughtException:", err);
  });

function main(){
    if(isMainThread){
        const workerCount = 1000;
        for (let index = 0; index < workerCount; index++) {
            new Client();
            // let w = new Worker("./Entry.js");
            Logger.log('start client:', index);
        }
    }
}
