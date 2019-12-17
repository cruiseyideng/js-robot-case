const Global = require("./Global");
const {Logger} = require("./Core/Util/Logger")
const {Pipeline, JobType, ConditionType} = require("./Core/Pipeline/Pipeline")
const DataUtil = require("./Core/Util/DateUtil");
const Md5Util = require("./Core/Util/Md5Util")

class Client{

    constructor(){
        this.pipeline = new Pipeline();

        // 数据配置
        let machine_serial = DataUtil.now().toString();
        // machine_serial = "1576554549811"
        let channel_id = "9900101910050001";
        let url = "/lobby_api/api/lobby/quick/toQuickLogin?"
        let params = "channel_id=" + channel_id + "&deviceType=0&machine_serial=" + machine_serial + "&promotion_code=10000&site_id=0"
        let signKey = "WZGARg69AME_LOGRg69AIN_Pvc1tDn9h2g69Ap"
        let quickLoginUrl = url + this.signUrl(params, signKey)

        this.pipeline.insertItemWithData(0, [
            {
                type: JobType.HttpRequestJob,
                responseJson: true,
                host: "47.56.167.186",
                port: "8889",
                path: quickLoginUrl
            }
        ]);
        this.pipeline.insertItemWithData(1, [
            {
                type: JobType.ConnectServerJob,
                host: "47.56.167.186",
                port: "65300",
                namespace: "Login"
            }
        ]);

        let data = {};
        data["iSiteId"] = 0;
        data["iLoginType"] = 3;
        data["iAppserviceId"] = 100;
        data["szMachineserial"] = machine_serial;
        data["szChannelID"] = channel_id;
        
        this.pipeline.insertItemWithData(2, [
            {
                type: JobType.SendMessageJob,
                messageType: 0x9000,
                message: data,
                namespace: "Login"
            },
            undefined,
            {
                source: [{
                    index: 0,
                    type: 1,
                    filter: this.loginData2LoginRequest
                }]
            }
        ]);
        
        this.pipeline.insertItemWithData(3, [
            {
                type: JobType.ReceiveMessageJob,
                messageType: 0x9000,
                namespace: "Login"
            }
        ]);

        this.pipeline.insertItemWithData(4, [
            {
                type: JobType.ReceiveMessageJob,
                messageType: 0x9003,
                namespace: "Login"
            }
        ]);
        this.pipeline.insertItemWithData(5, [
            {
                type: JobType.ConnectServerJob,
                host: "47.56.167.186",
                port: "65400",
                namespace: "Lobby"
            }
        ]);

        data = {
            // iUserID: 5459956,
            iLobbySiteID: 0,
            szChannelID: channel_id,
            // szToken: "6B28AAC8E6245B04D4ECA56ECED7CF69"
        }
        
        this.pipeline.insertItemWithData(6, [
            {
                type: JobType.SendMessageJob,
                messageType: 0xa1,
                message: data,
                namespace: "Lobby"
            },
            undefined,
            {
                source: [{
                    index: 3,
                    type: 1,
                    filter: this.filterSend0xa1
                }]
            }
        ]);
        
        this.pipeline.insertItemWithData(7, [
            {
                type: JobType.SendMessageJob,
                messageType: 0xea,
                message: data,
                namespace: "Lobby"
            }
        ]);

        this.pipeline.run();
    }

    loginData2LoginRequest(resObj){
        var data = {};
        if (resObj['mobile_bind'] == 1) {//已绑定手机
            data["szAccounts"] = resObj['account_mobile'];
            data["iAccountsourceId"] = 3;
            data["szPassword"] = resObj['account_passwd'];
        }
        else {
            data["szAccounts"] = resObj['account_name'];
            data["iAccountsourceId"] = 1;
            data["szPassword"] = resObj['login_token'];
        }
        return {
            message: data
        };
    }

    filterSend0xa1(data){
        return {
            message: {
                iUserId: data["iUserId"],
                szToken: data["szPasswdToken"]
            }
        }
    }

    signUrl(url, key){
        let signUrl = url + "&key=" + key
        let sign = Md5Util.md5(signUrl);
        return url + "&sign=" + sign;
    }
}

module.exports = Client;