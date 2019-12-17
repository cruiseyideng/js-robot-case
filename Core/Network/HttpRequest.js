const http = require("http");
const {Logger} = require("../Util/Logger")

class HttpRequest{

    constructor(){
        this.responseHandler = undefined;
        this.request = undefined;
        this.rawData = '';
        this.isResponseJson = false;
    }

    setResponseJson(isJson){
        this.isResponseJson = isJson;
    }

    setResponseHandler(handler){
        this.responseHandler = handler;
    }

    // responseJson 返回json格式
    // host: 
    // port: 
    // path: 
    // method: 
    send(options){
        if(options.hasOwnProperty("responseJson")){
            this.setResponseJson(options["responseJson"]);
            delete options["responseJson"];
        }
        if(this.request){
            this.request.abort();
        }
        this.rawData = "";
        Logger.log(">>>>>> http request", options)
        this.request = http.get(options, (res) => {
            if(!res){
                this.onResponseData(false, undefined);
                return;
            }
            res.setEncoding('utf8');
            res.on('data', (chunk) => { this.rawData += chunk; });
            res.once("error", () => {
                this.onResponseData(false, undefined);
            });
            res.once('end', () => {
                if(this.isResponseJson){
                    try {
                        const parsedData = JSON.parse(this.rawData);
                        this.onResponseData(true, parsedData);
                    } catch (e) {
                        Logger.error(e.message, this.rawData);
                        this.onResponseData(true, undefined);
                    }
                }else{
                    this.onResponseData(true, this.rawData);
                }
            });
        });
        this.request.end();
    }

    get(host, port, path, responseJson = true){
        if(this.request){
            this.request.abort();
        }
        this.setResponseJson(responseJson);
        var options = {
            host: host,
            port: port,
            path: path,
        }
        this.request(options);
    }
    
    onResponseData(isOk, data){
        Logger.log("<<<<<< http response", isOk, data)
        if(this.responseHandler){
            this.responseHandler(isOk, data);
        }
    }

    onDestroy(){
        if(this.request){
            this.request.abort();
            this.request = undefined;
        }
    }
}

module.exports = HttpRequest;