const ProtocolUtil = require("./ProtocolUtil")
const ProtocolHeader = require("./ProtocolHeader")

class ProtocolInit{

    static exec(json){
        ProtocolUtil.setNamespaceHeader(ProtocolHeader.CONFIG);
        ProtocolUtil.onReWriteHeader = this.onReWriteHeader;
        ProtocolUtil.init_cstruct_define_map_with_json(json);
    }

    static onReWriteHeader(namespace, buffer_length, headerValue){
        if(headerValue["fish_head"]){
            headerValue["fish_head"] = [3, 0, (buffer_length >> 8), buffer_length];
        }
        return headerValue;
    }

}


module.exports = ProtocolInit;