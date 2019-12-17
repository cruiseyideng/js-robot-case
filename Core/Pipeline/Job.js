const events = require("events");

const JobStatus = {
    UNSTARTED: 0,
    STARTED: 1,
    FINISHED: 2,
    FAILED: 3
}

const JobEvent = {
    FINISHED: "finished",
    STARTED: "started",
    FAILED: "failed",
}

class Job extends events.EventEmitter{
    
    constructor(){
        super();
        this.data = undefined;
        this.result = undefined;
        this.status = JobStatus.UNSTARTED;
        this.times = 0;
        this.maxTimes = 1;
    }

    initWithData(data){
        this.data = data;
        if(data.hasOwnProperty("maxTimes")){
            this.maxTimes = data["maxTimes"];
        }
    }

    updateWithData(data){
        if(!this.data){
            this.data = data;
        }
        if(data){
            this.recurseUpdateObject(data, this.data);
        }
    }

    // 递归更新Object
    recurseUpdateObject(src, dest){
        for (const key in src) {
            if(src[key] instanceof Object){
                dest[key] = dest[key] || {}
                this.recurseUpdateObject(src[key], dest[key]);
                continue;
            }
            dest[key] = src[key];
        }
    }

    canRun(){
        if(this.maxTimes <= this.times){
            return false;
        }
        return true;
    }

    run(){
        if(this.maxTimes <= this.times){
            return;
        }
        this.status = JobStatus.STARTED;
        this.emit(JobEvent.STARTED);
        this.times += 1;
    }

    complete(){
        this.status = JobStatus.FINISHED;
        this.emit(JobEvent.FINISHED);
    }

    failed(){
        this.status = JobStatus.FAILED;
        this.emit(JobEvent.FAILED);
    }

    onDestroy(){

    }
}

module.exports = {Job, JobStatus, JobEvent};