const crypto = require("crypto")

class Md5Util{

    static md5(data){
        return crypto.createHash('md5').update(Buffer.from(data)).digest('hex');
    }

}

module.exports = Md5Util;