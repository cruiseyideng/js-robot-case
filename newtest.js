const Global = require("./Global");
const {Logger} = require("./Core/Util/Logger")
const {Pipeline, JobType, ConditionType} = require("./Core/Pipeline/Pipeline")
const DataUtil = require("./Core/Util/DateUtil");
const Md5Util = require("./Core/Util/Md5Util")
const EnumPNames = require("./Core/Protocol/EnumProtocolNames")
const Serverjson = require("./Config/server.json")

const PipelineName = {
    QuickLogin:"QuickLogin",
    ReceiveLoginData:"ReceiveLoginData",
    GameServerList:"GameServerList",
    BaccaratServer: "BaccaratServer",
    LongHuServer: "LongHuServer"
}

class Client{

    constructor(){
        this.pipeline = new Pipeline();

        // 数据配置
        let machine_serial = DataUtil.now().toString();
        this.machine_serial = machine_serial;
        // machine_serial = "1576554549811"
        let channel_id = "9900101910050001";
        this.channel_id = channel_id;
        let url = "/lobby_api/api/lobby/quick/toQuickLogin?"
        let params = "channel_id=" + channel_id + "&deviceType=0&machine_serial=" + machine_serial + "&promotion_code=10000&site_id=0"
        let signKey = Serverjson.files.webServer.url_quickRegister.md5Key
        let quickLoginUrl = url + this.signUrl(params, signKey)
        // let server = JSON.parse(Serverjson)
        console.log(Serverjson.loginServer.domain);

        this.pipeline.append(PipelineName.QuickLogin, [
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
                    // index: 0,
                    name: PipelineName.QuickLogin,
                    type: 1,
                    filter: this.loginData2LoginRequest
                }]
            }
        ]);
        //登录
        this.pipeline.append(PipelineName.ReceiveLoginData, [
            {
                type: JobType.ReceiveMessageJob,
                messageType: 0x9000,
                namespace: EnumPNames.Login
            }
        ]);

        this.pipeline.append(PipelineName.GameServerList,[
            {
                type: JobType.ReceiveMessageJob,
                messageType: 0x9001,
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
                    // name: PipelineName.ReceiveLoginData,
                    name: PipelineName.ReceiveLoginData,
                    type: 1,
                    filter: this.filterSend0xa1
                }]
            }
        ]);

        this.pipeline.insertItemWithData(7, [
            {
                type: JobType.ConnectServerJob,
                host: Serverjson.dispatchServer.domain,
                port: Serverjson.dispatchServer.port,
                namespace: EnumPNames.Dispatch
            }
        ]);

        this.pipeline.insertItemWithData(8,[
            {
                type: JobType.SendMessageJob,
                messageType: 0xa4,
                message: data,
                namespace: EnumPNames.Dispatch
            },
            undefined,
            {
                source:[{
                    name: PipelineName.GameServerList,
                    type: 1,
                    filter: this.filterGameServerList
                }]
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

    filterUserid(data){
        let user_id = data["iUserId"]
        let gmpurl = "/lobby_api/api/promotion/toGetMyPrInfo?"
        let gmpparams = "channel_id=" + this.channel_id + "&machine_serial=" + this.machine_serial + "&user_id=" + user_id
        let signUrl = Serverjson.files.webServer.url_myGeneralize.md5Key
        let toGetMyPrInfourl = gmpurl + this.signUrl(gmpparams,signUrl)
        return {
            path: toGetMyPrInfourl
        }
    }

    filterEnterGame(data){
        return {
            message: {
                iUserID: data["iUserId"],
                szPasswd: data["szPasswdToken"]
            }
        }
    }

    filtergameserver(resObj){
        console.log("szServerIP___________________"+resObj["szServerIP"])
        var data = {};
        data["host"] = resObj["szServerIP"];
        data["port"] = resObj["serverID"];
        return data;
    }

    filterGameServerList(resObj){
        console.log("~~~~~~~~~~~~~~~~"+resObj)
        var data = {};
        // let listindex = Math.floor(Math.random() * resObj["usListCount"]);
        // data["host"] = resObj["serverInfo"][listindex]["szTelecomIP"];
        // data["port"] = resObj["serverInfo"][listindex]["usServerPort"];
        // data["gameID"] = resObj["serverInfo"][listindex]["usGameID"];
        // data["level"] = 1;
        return data;
    }





    signUrl(url, key){
        let signUrl = url + "&key=" + key
        let sign = Md5Util.md5(signUrl);
        return url + "&sign=" + sign;
    }
}

module.exports = Client;