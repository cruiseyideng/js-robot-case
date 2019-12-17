const {Job} = require("./Job")
const HttpRequest = require("../Network/HttpRequest")

class HttpRequestJob extends Job{

    constructor(){
        super();
        this.httpRequest = new HttpRequest();
        this.httpRequest.setResponseHandler(this.onResponse.bind(this));
    }

    initWithData(data){
        super.initWithData(data);
    }

    run(){
        if(!this.canRun()){
            super.complete();
            return;
        }
        this.httpRequest.send(this.data);
        super.run();
    }

    onResponse(isOk, data){
        this.result = data;
        if(isOk){
            super.complete();
        }else{
            super.failed();
        }
    }

    onDestroy(){
        this.httpRequest.onDestroy();
        this.httpRequest = undefined;
        super.onDestroy()
    }

}

module.exports = HttpRequestJob;