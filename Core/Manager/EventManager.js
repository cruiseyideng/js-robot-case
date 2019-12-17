class EventManager {

    constructor(){
        this.callbackList = {};
    }

    //注册事件
    addListener(eventName, callback, caller) {
        if (this.callbackList[eventName]) {
            var funlist = this.callbackList[eventName];
            funlist.push([callback, caller]);
            this.callbackList[eventName] = funlist;
        }
        else {
            this.callbackList[eventName] = [[callback, caller]];
        }
    }

    removeListener(eventName, callback, caller = undefined) {
        if (this.callbackList[eventName]) {
            for (let i = this.callbackList[eventName].length - 1; i >= 0; i--) {
                let callinfo = this.callbackList[eventName][i]
                if (callinfo[0] == callback && callinfo[1] == caller) {
                    this.callbackList[eventName].splice(i, 1);
                    break;
                }
            }
        }
    }

    dispatchEvent(eventName, parameter, ...restOfName) {
        var callback = this.callbackList[eventName];
        if (callback) {
            let new_callback = callback.slice(0, callback.length);
            for (var i = 0; i < new_callback.length; i++) {
                var callInfo = new_callback[i];
                callInfo[0].call(callInfo[1], parameter, ...restOfName);
            }
        }
    }
}

module.exports = EventManager;
