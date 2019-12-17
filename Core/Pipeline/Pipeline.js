const events = require("events");
const Global = require("../Init");
const EventNetwork = require("../Events/EventNetwork")
const {Condition} = require("./Condition");
const {JobEvent, Job} = require("./Job");
const {Logger} = require("../Util/Logger")

const ConnectServerJob = require("./ConnectServerJob")
const DelayJob = require("./DelayJob")
const HttpRequestJob = require("./HttpRequestJob")
const ReceiveMessageJob = require("./ReceiveMessageJob")
const SendMessageJob = require("./SendMessageJob")

const ConditionType = {
    PREVIOUS: 0,    // 上一个完成
    RECEIVE_MESSAGE: 1, // 收到服务器协议 data: messageType
}

const JobType = {
    ConnectServerJob: 0,
    DelayJob: 1,
    HttpRequestJob: 2,
    ReceiveMessageJob: 3,
    SendMessageJob: 4,
}

const JobInnerDataType = {
    DATA: 0,    // data
    RESULT: 1   // result
}

// 数据过滤
class DataFilter{
    constructor(data){
        data = data || {};
        // pipelineindex列表
        // index: 管道索引
        // type：任务属性类型
        // map: 变量转换关系
        // filter: 变量转换函数(参入一个数据)
        this.source = data["source"];
        // allFilter: 变量转换函数(参入全部数据的列表)
        this.allFilter = data["allFilter"]
    }

    filterPipeline(pipeline){
        if(!this.source){
            return undefined;
        }
        let sourceDatas = []
        for (const value of this.source) {
            var index = value["index"];
            var dataType = value["type"];
            var filterMap = value["map"];
            var filterFunc = value["filter"];
            var item = pipeline.items[index];
            if(!item){
                sourceDatas.push(undefined);
                continue;
            }
            var tempData;
            if(dataType == JobInnerDataType.DATA){
                tempData = item.job.data;
            }else{
                tempData = item.job.result;
            }
            if(filterMap){
                tempData = tempData || {}
                var newTempData = {}
                for (const key in filterMap) {
                    newTempData[filterMap[key]] = tempData[key];
                }
                tempData = newTempData;
            }
            if(filterFunc){
                tempData = filterFunc(tempData);
            }
            sourceDatas.push(tempData);
        }
        if(this.allFilter){
            sourceDatas = this.allFilter(sourceDatas);
        }

        var resultData = {}
        for (const iterator of sourceDatas) {
            for (const key in iterator) {
                resultData[key] = iterator[key];
            }
        }
        return resultData;
    }
}

// 管道物件
class PipelineItem{
    constructor(data, condition = undefined, dataFilter = undefined){
        this.condition = new Condition(condition);
        this.job = undefined;
        if(data['type'] == JobType.ConnectServerJob){
            this.job = new ConnectServerJob();
        }else if(data['type'] == JobType.DelayJob){
            this.job = new DelayJob();
        }else if(data['type'] == JobType.HttpRequestJob){
            this.job = new HttpRequestJob();
        }else if(data['type'] == JobType.ReceiveMessageJob){
            this.job = new ReceiveMessageJob();
        }else if(data['type'] == JobType.SendMessageJob){
            this.job = new SendMessageJob();
        }else{
            this.job = new Job();
        }
        this.job.initWithData(data);
        this.filter = new DataFilter(dataFilter);
    }

    runWithPipeline(pipeline){
        let data = this.filter.filterPipeline(pipeline);
        this.job.updateWithData(data);
        this.job.run();
    }
}

class Pipeline {
    constructor(){
        this.items = [];
        this.index = -1;
    }

    init(){
        Global.eventMgr.addListener(EventNetwork.NetWorkSocketData, this.triggerOnMessage, this);
    }

    insertItemWithData(index, data){
        let item = new PipelineItem(data[0], data[1], data[2]);
        this.items[index] = item;
        item.job.on(JobEvent.FINISHED, ()=>{
            this.nextItem();
        })
    }

    initItemsWithData(listData){
        let items = []
        for (const data of listData) {
            let item = new PipelineItem(data[0], data[1], data[2]);
            items.push(item);
        }
        this.setItems(items);
    }

    setItems(items){
        this.items = items;
        for (const item of this.items) {
            item.job.on(JobEvent.FINISHED, ()=>{
                this.nextItem();
            })
        }
    }

    run(){
        this.nextItem();
    }

    nextItem(){
        this.index += 1;
        Logger.log("next item index:", this.index, " total:", this.items.length)
        if(this.index < this.items.length){
            let item = this.items[this.index];
            item.runWithPipeline(this);
        }else if(this.index == this.items.length){
            Logger.warn("Pipeline finished!");
        }
    }

    triggerOnMessage(type, message, namespace){
        let items = this.getItemsOfConditionType(type);
        for (const item of items) {
            if(item.condition.messageType == type){
                item.runWithPipeline(this);
            }
        }
    }

    getItemsOfConditionType(type){
        let items = []
        for (const item of this.items) {
            if(item && item.condition){
                if(item.condition.type == type){
                    items.push(item);
                }
            }
        }
        return items;
    }

}

module.exports = {Pipeline, JobType, ConditionType};