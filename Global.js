var Global = require("./Core/Init");
const events = require("events");

events.EventEmitter.defaultMaxListeners = 1000000;

module.exports = Global;