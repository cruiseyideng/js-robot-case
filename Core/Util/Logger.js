const LEVEL_TYPES = { DEBUG: 1, LOG: 2, INFO: 3, WARN: 4, ERROR: 5 }

var tag = "[js]";//可以设置当前游戏的前缀
var LEVEL = LEVEL_TYPES.DEBUG; //当前Logger等级

/** 日志控制类 */
class Logger {

    static set logLeveL(lv) {
        this.LEVEL = lv;
    }

    static formatNow() {
        let date = new Date(); //后端返回的时间戳是秒
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
        date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ":" + date.getMilliseconds();
    }

    static traceback(){
        return new Error().stack;
    }

    static debug(...params) {
        if (LEVEL > LEVEL_TYPES.DEBUG) {
            return;
        }
        console.trace(tag + "[" + Logger.formatNow() + "] ", ...params);
    }

    static log(...params) {
        if (LEVEL > LEVEL_TYPES.LOG) {
            return;
        }
        console.log(tag + "[" + Logger.formatNow() + "] ", ...params);
    }

    static info(...params) {
        if (LEVEL > LEVEL_TYPES.INFO) {
            return;
        }
        console.info(tag + "[" + Logger.formatNow() + "] ", ...params);
    }

    static warn(...params) {
        if (LEVEL > LEVEL_TYPES.WARN) {
            return;
        }
        console.warn(tag + "[" + Logger.formatNow() + "] ", ...params);
    }

    static error(...params) {
        if (LEVEL > LEVEL_TYPES.ERROR) {
            return;
        }
        console.error(tag + "[" + Logger.formatNow() + "] ", ...params);
        console.error(Logger.traceback())
    }
}

module.exports = {LEVEL_TYPES, Logger}