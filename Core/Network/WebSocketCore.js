// websocket套接字应用层核心接口
var {Logger} = require("../Util/Logger")
var EnumSocketStatus = require("./EnumSocketStatus")
var WebSocket = require("ws")

class WebSocketCore{

    constructor(){
        this.host = "";
        this.port = 0;
        this.urlParams = "";
        this.socket = undefined;
        this.onConnectCb = undefined;
        this.onCloseCb = undefined;
        this.onSocketDataCb = undefined;
        this.onErrorCb = undefined;
        this.thisObject = undefined;
    }

    setCallBacks(onConnectCb, onCloseCb, onSocketDataCb, onErrorCb, thisObject) {
        this.onConnectCb = onConnectCb;
        this.onCloseCb = onCloseCb;
        this.onSocketDataCb = onSocketDataCb;
        this.onErrorCb = onErrorCb;
        this.thisObject = thisObject;
    }

    connect(host, port, urlParams = undefined) {
        this.host = host;
        this.port = port;

        if (this.socket) {
            this.closeSocket();
        }
        this.urlParams = urlParams || "";
        let socketServerUrl = "ws://" + this.host + ":" + this.port + this.urlParams;
        this.socket = new WebSocket(socketServerUrl);
        this.socket.binaryType = "arraybuffer";
        this.bindEvent();
    }

    connectByUrl(url) {
        this.close();
        this.socket = new WebSocket(url);
        this.socket.binaryType = "arraybuffer";
        this.bindEvent();
    }

    bindEvent() {
        let socket = this.socket;
        socket.onopen = this.onopen.bind(this);
        socket.onclose = this.onclose.bind(this);
        socket.onerror = this.onerror.bind(this);
        socket.onmessage = this.onmessage.bind(this);
    }

    onopen(e) {
        if (this.onConnectCb) {
            this.onConnectCb.call(this.thisObject);
        }
    }

    onclose(e) {
        if (this.onCloseCb) {
            this.onCloseCb.call(this.thisObject, e);
        }
    }

    onerror(e) {
        if (this.onErrorCb) {
            this.onErrorCb.call(this.thisObject, e);
        }
    }

    onmessage(e) {
        if (this.onSocketDataCb) {
            this.onSocketDataCb.call(this.thisObject, e.data);
        }
    }

    // return boolean 是否发送成功
    send(message) {
        if (this.socket && this.getState() == EnumSocketStatus.open) {
            this.socket.send(message);
            return true;
        } else {
            return false;
        }
    }

    getState() {
        if (this.socket) {
            return this.socket.readyState;
        }
        return EnumSocketStatus.closed;
    }

    closeSocket() {
        if (this.socket) {
            let readyState = this.socket.readyState;
            if (readyState == EnumSocketStatus.open || readyState == EnumSocketStatus.connecting) {
                this.socket.close();
            }
        }
        this.socket = undefined;
    }

    close() {
        if (this.socket) {
            this.socket.close();
            this.socket = undefined;
        }
    }

    onDestroy() {
        this.close();
    }
}

module.exports = WebSocketCore;