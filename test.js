const Global = require("./Global");
const {Logger} = require("./Core/Util/Logger")
const {Pipeline, JobType, ConditionType} = require("./Core/Pipeline/Pipeline")
const DataUtil = require("./Core/Util/DateUtil");
const Md5Util = require("./Core/Util/Md5Util")
const EnumPNames = require("./Core/Protocol/EnumProtocolNames")
const Serverjson = require("./Config/internalserver.json")
class Client{

    constructor(){
        this.pipeline = new Pipeline();

        // 数据配置
        let machine_serial = DataUtil.now().toString();
        // machine_serial = "1576554549811"
        let channel_id = "9900011911240001";
        let url = "/lobby_api/api/lobby/quick/toQuickLogin?"
        let params = "channel_id=" + channel_id + "&deviceType=0&machine_serial=" + machine_serial + "&promotion_code=10000&site_id=0"
        let signKey = "WZGARg69AME_LOGRg69AIN_Pvc1tDn9h2g69Ap"
        let quickLoginUrl = url + this.signUrl(params, signKey)
        // let server = JSON.parse(Serverjson)
        console.log(Serverjson.loginServer.domain);

        this.pipeline.insertItemWithData(0, [
            {
                type: JobType.HttpRequestJob,
                responseJson: true,
                host: Serverjson.webServer.domain,
                port: Serverjson.webServer.port,
                path: quickLoginUrl
            }
        ]);
        this.pipeline.insertItemWithData(1, [
            {
                type: JobType.ConnectServerJob,
                // host: "192.168.12.15",
                // port: "65300",
                host: Serverjson.loginServer.domain,
                port: Serverjson.loginServer.port,
                namespace: EnumPNames.Login
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
                namespace: EnumPNames.Login
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
        //登录
        this.pipeline.insertItemWithData(3, [
            {
                type: JobType.ReceiveMessageJob,
                messageType: 0x9000,
                namespace: EnumPNames.Login
            }
        ]);

        this.pipeline.insertItemWithData(4, [
            {
                type: JobType.ReceiveMessageJob,
                messageType: 0x9003,
                namespace: EnumPNames.Login
            }
        ]);
        this.pipeline.insertItemWithData(5, [
            {
                type: JobType.ConnectServerJob,
                host: Serverjson.lobbyServer.domain,
                port: Serverjson.lobbyServer.port,
                namespace: EnumPNames.Lobby
            }
        ]);

        //登录认证
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
                namespace: EnumPNames.Lobby
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

        //用户余额，保险箱，充值
        this.pipeline.insertItemWithData(7, [
            {
                type: JobType.SendMessageJob,
                messageType: 0xea,
                message: data,
                namespace: EnumPNames.Lobby
            },
            undefined,
            {
                source: [{
                    index: 3,
                    type: 1,
                    filter: this.filterSend0xe3
                }]
            }
        ]);

        //修改昵称
        data = {
            // iUserID: 5459956,
            szNickName: machine_serial.substring(5,),
            // szToken: "6B28AAC8E6245B04D4ECA56ECED7CF69"
        }

        this.pipeline.insertItemWithData(8,[
            {
                type: JobType.SendMessageJob,
                messageType: 0xe3,
                message: data,
                namespace: EnumPNames.Lobby
            },
            undefined,
            {
                source: [{
                    index: 3,
                    type: 1,
                    filter: this.filterSend0xe3
                }]
            }
        ]);
    
        this.pipeline.insertItemWithData(9, [
            {
                type: JobType.ReceiveMessageJob,
                messageType: 0xe3,
                namespace: EnumPNames.Lobby
            }
        ]);
        //存入保险箱
        data = {
            iSiteID: 0,
            iGameID: 0,
            iServerID: 0,
            llSaveCoinNum: 300,
            llGameWinCoinNum: 0,
        }
        
        this.pipeline.insertItemWithData(10,[
            {
                type: JobType.SendMessageJob,
                messageType: 0xd7,
                message: data,
                namespace: EnumPNames.Lobby
            },
            undefined,
            {
                source:[{
                    index: 3,
                    type: 1,
                    filter: this.filterSend0xa1
                }]
            }
        ]);

        //保险箱取出
        data = {
            iSiteID: 0,
            iGameID: 0,
            iServerID: 0,
            llGetNum: 300,
            szBankerPwd: "21218cca77804d2ba1922c33e0151105"
        }

        this.pipeline.insertItemWithData(11,[
            {
                type: JobType.SendMessageJob,
                messageType: 0xd5,
                message: data,
                namespace: EnumPNames.Lobby
            },
            undefined,
            {
                source:[{
                    index: 3,
                    type: 1,
                    filter: this.filterSend0xa1
                }]
            }
        ]);

        this.pipeline.insertItemWithData(12, [
            {
                type: JobType.ConnectServerJob,
                host: Serverjson.dispatchServer.domain,
                port: Serverjson.dispatchServer.port,
                namespace: EnumPNames.Dispatch
            }
        ]);

        data = {
            gameID: 186,
            level: 1
        }

        this.pipeline.insertItemWithData(13,[
            {
                type: JobType.SendMessageJob,
                messageType: 0xa4,
                message: data,
                namespace: EnumPNames.Dispatch
            },
            undefined,
            {
                source:[{
                    index: 3,
                    type: 1,
                    filter: this.filterSend0xe3
                }]
            }
        ]);
        
        this.pipeline.insertItemWithData(14,[
            {
                type: JobType.ReceiveMessageJob,
                messageType: 0xa5,
                namespace: EnumPNames.Dispatch
            }
        ]);


        //连接百家乐服务
        this.pipeline.insertItemWithData(15,[
            {
                type: JobType.ConnectServerJob,
                // host:"192.168.12.15",
                // port: "18601",
                namespace: EnumPNames.Baccarat
            },
            undefined,
            {
                source: [{
                    index: 14,
                    type: 1,
                    filter: this.gameserver
                }]
            }
        ]);


        // //退出百家乐
        // data = {cLeaveType: 5}
        // this.pipeline.insertItemWithData(15,[
        //     {
        //         type: JobType.SendMessageJob,
        //         messageType: 0xa8,
        //         namespace: EnumPNames.Baccarat
        //     },
        //     undefined,
        //     {
        //         source:[{
        //             index: 3,
        //             type: 1,
        //             filter: this.filterSend0xa4
        //         }]
        //     }
        // ]);


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
                iUserID: data["iUserId"],
                szToken: data["szPasswdToken"]
            }
        }
    }
    
    filterSend0xe3(data){
        return {
            message: {
                iUserId: data["iUserId"],
                szToken: data["szPasswdToken"]
            }
        }
    }

    filterSend0xa5(data){
        return {
            message: {
                host: data["szServerIP"],
                port: data["serverID"]
            }
        }
    }

    gameserver(resObj){
        var data = {};
        data["host"] = resObj["szServerIP"];
        data["port"] = resObj["serverID"];
    }

    signUrl(url, key){
        let signUrl = url + "&key=" + key
        let sign = Md5Util.md5(signUrl);
        return url + "&sign=" + sign;
    }
}

module.exports = Client;