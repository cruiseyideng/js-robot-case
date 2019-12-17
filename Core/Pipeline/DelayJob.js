const {Job} = require("./Job")

class DelayJob extends Job{
    
    constructor(){
        super();
        this.timeout = 0;
    }

    initWithData(data){
        super.initWithData(data)
        this.timeout = data["timeout"];
    }

    run(){
        if(!this.canRun()){
            super.complete();
            return;
        }
        setTimeout(this.onTimeout, this.timeout * 1000);
        super.run();
    }

    onTimeout(){
        super.complete();
    }

}

module.exports = DelayJob;