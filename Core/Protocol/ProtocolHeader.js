// 协议头定义
const EnumProtocolNames = {
    CustomServer: "CustomServer",
    Erba: "Erba",
    GameFactory: "GameFactory",
    Baccarat: "Baccarat",
    SXNiuNiu: "SXNiuNiu",
    Dispatch: "Dispatch",
    SXLunPan: "SXLunPan",
    HongBao: "HongBao",
    ffc: "ffc",
    WebGame: "WebGame",
    Ddz: "Ddz",
    BankerBull: "BankerBull",
    three: "three",
    SXLongHu: "SXLongHu",
    FFCBaiJiaLe: "FFCBaiJiaLe",
    Godofwealth: "Godofwealth",
    DaXiaoDanShuang: "DaXiaoDanShuang",
    FongShen: "FongShen",
    RedBlack: "RedBlack",
    SXBaiJiaLe: "SXBaiJiaLe",
    FFCLongHu: "FFCLongHu",
    Lobby: "Lobby",
    FishFactory: "FishFactory",
    FishDispatch: "FishDispatch",
    LongHu: "LongHu",
    Flower: "Flower",
    Fish: "Fish",
    ThreeKingDoms: "ThreeKingDoms",
    BonusBears: "BonusBears",
    Login: "Login",
    GodofwealthNew: "GodofwealthNew",
}

const HEADER_VALUE = {
    identity: 5,
    encode: 0,
    length: 0, // 根据协议补充
    version: 3,
    reserve: 0,
    type: 0,    // 跟进协议补充
}

// 协议头定义
const DEFAULT = [
    { name: "identity", type: "UCHAR", array_length: 0, array_length2:0, comment: "", struct_name: "" },
    { name: "encode", type: "UCHAR", array_length: 0, array_length2:0, comment: "", struct_name: "" },
    { name: "length", type: "USHORT_TRANS", array_length: 0, array_length2:0, comment: "", struct_name: "" },
    { name: "version", type: "UCHAR", array_length: 0, array_length2:0, comment: "", struct_name: "" },
    { name: "reserve", type: "UCHAR", array_length: 0, array_length2:0, comment: "", struct_name: "" },
    { name: "type", type: "USHORT_TRANS", array_length: 0, array_length2:0, comment: "", struct_name: "" },
];

// 捕鱼协议头定义
const FISH = [
    { name: "fish_head", type: "CHARINT", array_length: 4, array_length2:0, comment: "", struct_name: "" },
    { name: "type", type: "UINT", array_length: 0, array_length2:0, comment: "", struct_name: "" },
    { name: "iSocketIndex", type: "UINT", array_length: 0, array_length2:0, comment: "", struct_name: "" },
    { name: "iVersion", type: "INT", array_length: 0, array_length2:0, comment: "", struct_name: "" },
    { name: "iFlagID", type: "INT", array_length: 0, array_length2:0, comment: "", struct_name: "" },
    { name: "cMsgFromType", type: "CHAR", array_length: 0, array_length2:0, comment: "", struct_name: "" },
    { name: "cFlag", type: "CHAR", array_length: 0, array_length2:0, comment: "", struct_name: "" },
    { name: "sUnused", type: "CHARINT", array_length: 2, array_length2:0, comment: "", struct_name: "" },
    { name: "iFlag", type: "UINT", array_length: 0, array_length2:0, comment: "", struct_name: "" },
];

// 捕鱼协议头默认值
FISH_VALUE = {
    fish_head: [3, 0, 0, 0],
    type: 0,    // 跟进协议补充
    iSocketIndex: 0,
    iVersion: 11259375,
    cMsgFromType: 0, 
    cFlag: 0,
    sUnused: [0, 0],
    iFlag: 0
}

// 捕鱼协议定义
FISH_HEADER_PROTOCOL = {
    define: FISH,
    value: FISH_VALUE,
    length: 28
}

// 协议空间下的定义
CONFIG = {
    [EnumProtocolNames.Fish]: FISH_HEADER_PROTOCOL, 
    [EnumProtocolNames.FishDispatch]: FISH_HEADER_PROTOCOL,
    [EnumProtocolNames.FishFactory]: FISH_HEADER_PROTOCOL
}

module.exports = {EnumProtocolNames, CONFIG};
