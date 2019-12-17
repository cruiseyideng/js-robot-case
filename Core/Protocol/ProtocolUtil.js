var $jscomp=$jscomp||{};$jscomp.scope={};$jscomp.arrayIteratorImpl=function(a){var b=0;return function(){return b<a.length?{done:!1,value:a[b++]}:{done:!0}}};$jscomp.arrayIterator=function(a){return{next:$jscomp.arrayIteratorImpl(a)}};$jscomp.makeIterator=function(a){var b="undefined"!=typeof Symbol&&Symbol.iterator&&a[Symbol.iterator];return b?b.call(a):$jscomp.arrayIterator(a)};
$jscomp.checkStringArgs=function(a,b,c){if(null==a)throw new TypeError("The 'this' value for String.prototype."+c+" must not be null or undefined");if(b instanceof RegExp)throw new TypeError("First argument to String.prototype."+c+" must not be a regular expression");return a+""};$jscomp.ASSUME_ES5=!1;$jscomp.ASSUME_NO_NATIVE_MAP=!1;$jscomp.ASSUME_NO_NATIVE_SET=!1;$jscomp.SIMPLE_FROUND_POLYFILL=!1;
$jscomp.defineProperty=$jscomp.ASSUME_ES5||"function"==typeof Object.defineProperties?Object.defineProperty:function(a,b,c){a!=Array.prototype&&a!=Object.prototype&&(a[b]=c.value)};$jscomp.getGlobal=function(a){return"undefined"!=typeof window&&window===a?a:"undefined"!=typeof global&&null!=global?global:a};$jscomp.global=$jscomp.getGlobal(this);
$jscomp.polyfill=function(a,b,c,e){if(b){c=$jscomp.global;a=a.split(".");for(e=0;e<a.length-1;e++){var d=a[e];}a=a[a.length-1];b=b(e);b!=e&&null!=b&&$jscomp.defineProperty(c,a,{configurable:!0,writable:!0,value:b})}};
$jscomp.polyfill("String.prototype.startsWith",function(a){return a?a:function(a,c){var b=$jscomp.checkStringArgs(this,a,"startsWith");a+="";var d=b.length,g=a.length;c=Math.max(0,Math.min(c|0,b.length));for(var h=0;h<g&&c<d;)if(b[c++]!=a[h++])return!1;return h>=g}},"es6","es3");
var Buffer=require("buffer").Buffer,iconv=require("iconv-lite"),PROTO_PRESET={COMMON_LIB:"common",C2S_LIB:"c2s",S2C_LIB:"s2c",LOG_WRITE:!1,LOG_READ:!1,LOG_NORMAL:!1,HEADER:[{name:"identity",type:"UCHAR",array_length:0,comment:"",struct_name:""},{name:"encode",type:"UCHAR",array_length:0,comment:"",struct_name:""},{name:"length",type:"USHORT_TRANS",array_length:0,comment:"",struct_name:""},{name:"version",type:"UCHAR",array_length:0,comment:"",struct_name:""},{name:"reserve",
type:"UCHAR",array_length:0,comment:"",struct_name:""},{name:"type",type:"USHORT_TRANS",array_length:0,comment:"",struct_name:""}],ARGS_STRINGS:{LINK:"link"},HEADER_VALUE:{identity:5,encode:0,length:0,version:3,reserve:0,type:0},HEADER_BYTE_LENGTH:8,NAMESPACE_HEADER:{},default_cstruct_value:{type:void 0,name:"",array_length:0,array_length2:0,comment:"",struct_name:""},ctypes_length:{INT:4,SHORT:2,LONGLONG:8,LONG:8,CHAR:1,CHARINT:1,UINT:4,USHORT:2,USHORT_TRANS:2,ULONGLONG:8,ULONG:8,UCHAR:1,FLOAT:4,
DOUBLE:8},STRUCT_ARRAY_LENGTH_TYPES:"INT SHORT LONGLONG CHARINT LONG CHAR UINT USHORT USHORT_TRANS ULONGLONG ULONG UCHAR".split(" "),getNameSpaceHeaderLength:function(a){return this.NAMESPACE_HEADER.hasOwnProperty(a)?this.NAMESPACE_HEADER[a].length:this.HEADER_BYTE_LENGTH},getNameSpaceHeaderDefine:function(a){return this.NAMESPACE_HEADER.hasOwnProperty(a)?this.NAMESPACE_HEADER[a].define:this.HEADER},getNameSpaceHeaderValue:function(a){return this.NAMESPACE_HEADER.hasOwnProperty(a)?this.NAMESPACE_HEADER[a].value:
this.HEADER_VALUE},pack_bits:4,correct_offset:function(a,b){if(0==this.pack_bits)return a;var c=this.ctypes_length[b];return c?a=this.correct_offset_with_type_length(a,c):(console.error("failed: correct_offset, ctypes_length is not defined of ",b),a)},correct_offset_with_type_length:function(a,b){if(0==b||0==this.pack_bits)return a;0==b%2&&(b=Math.min(b,this.pack_bits),a=Math.ceil(a/b)*b);return a},correct_cstruct_length:function(a,b){if(0==b)return a;b=Math.min(b,this.pack_bits);return Math.ceil(a/
b)*b},hasExtArg:function(a,b){a=a.ext_args;return void 0==a?!1:-1!=a.indexOf(b)}},CStructDefineLibMgr=function(){this.namespace_map={}};CStructDefineLibMgr.prototype.get_define_map_of_namespace=function(a){this.namespace_map.hasOwnProperty(a)||(this.namespace_map[a]={});return this.namespace_map[a]};CStructDefineLibMgr.prototype.get_cstruct_define_map=function(a,b){b=this.get_define_map_of_namespace(b);b.hasOwnProperty(a)||(b[a]=new CStructDefineLib(a));return b[a]};
CStructDefineLibMgr.prototype.init_cstruct_define_map_with_json=function(a,b){a.hasOwnProperty(PROTO_PRESET.COMMON_LIB)&&this.get_cstruct_define_map(PROTO_PRESET.COMMON_LIB,b).init(a[PROTO_PRESET.COMMON_LIB],this,b);for(var c in a)"string"!=typeof c?console.error("init_cstruct_define_map_with_json, key is not string",c):c!=PROTO_PRESET.COMMON_LIB&&this.get_cstruct_define_map(c,b).init(a[c],this,b)};
CStructDefineLibMgr.prototype.find_cstruct_define_key_id=function(a,b,c){return this.get_cstruct_define_map(a,c).find_cstruct_define_key_id(b)};CStructDefineLibMgr.prototype.find_cstruct_define_key_name=function(a,b,c){a=this.get_cstruct_define_map(a,c);a=a.find_cstruct_define_key_name(b);void 0==a&&(a=this.get_cstruct_define_map(PROTO_PRESET.COMMON_LIB,c),a=a.find_cstruct_define_key_name(b));return a};
var CStructDefineLib=function(a){this.all_cstruct_define_map_key_id={};this.all_cstruct_define_map_key_name={};this.inited_cstruct_define_map_key_name={};this.lib_name=a};
CStructDefineLib.prototype.init=function(a,b,c){this.all_cstruct_define_map_key_id={};this.all_cstruct_define_map_key_name={};this.inited_cstruct_define_map_key_name={};for(var e in a){var d=a[e];this.adjust_cstruct_id(d);this.all_cstruct_define_map_key_id[d.id]=d;for(var g=$jscomp.makeIterator(d.name_list),h=g.next();!h.done;h=g.next())this.all_cstruct_define_map_key_name[h.value]=d}for(var f in a)d=a[f],this.init_cstruct_define(d,b,c),PROTO_PRESET.LOG_NORMAL&&(e=PROTO_PRESET.getNameSpaceHeaderLength(c),
console.log("cstruct length",d.id,d.byte_length+e))};
CStructDefineLib.prototype.init_cstruct_define=function(a,b,c){var e=this.get_cstruct_define_dependcy(a);if(e){e=$jscomp.makeIterator(e);for(var d=e.next();!d.done;d=e.next()){d=d.value;var g=b.find_cstruct_define_key_name(this.lib_name,d,c);void 0==g?console.error("cannot find cstruct define dependcy",this.lib_name,d):this.init_cstruct_define(g,b,c)}}this.lib_name!=PROTO_PRESET.COMMON_LIB?(e=PROTO_PRESET.getNameSpaceHeaderLength(c),d=PROTO_PRESET.getNameSpaceHeaderDefine(c),a.var_list.unshift.apply(a.var_list,
d),b=this.calculate_and_fullfill_cstruct_define(a,b,0,c),a.var_list=a.var_list.slice(d.length),a.byte_length=b-e):(b=this.calculate_and_fullfill_cstruct_define(a,b,0,c),a.byte_length=b)};
CStructDefineLib.prototype.calculate_struct_max_memeber_size=function(a,b,c){if(a.hasOwnProperty("max_memeber_size"))return a.max_memeber_size;for(var e=0,d=$jscomp.makeIterator(a.var_list),g=d.next();!g.done;g=d.next())if(g=g.value,"STRUCT"==g.type){var h=b.find_cstruct_define_key_name(this.lib_name,g.struct_name,c);PROTO_PRESET.hasExtArg(g,PROTO_PRESET.ARGS_STRINGS.LINK)||(g=this.calculate_struct_max_memeber_size(h,b,c),g>e&&(e=g))}else g=PROTO_PRESET.ctypes_length[g.type],g>e&&(e=g);return a.max_memeber_size=
e};CStructDefineLib.prototype.get_cstruct_define_dependcy=function(a){var b=[];a=$jscomp.makeIterator(a.var_list);for(var c=a.next();!c.done;c=a.next())c=c.value,"STRUCT"==c.type&&(""==c.struct_name&&console.error("warn: type is STRUCT, but struct_name is blank"),this.inited_cstruct_define_map_key_name[c.struct_name]||b.push(c.struct_name));return b};
CStructDefineLib.prototype.calculate_and_fullfill_cstruct_define=function(a,b,c,e){for(var d=0,g=!1,h=$jscomp.makeIterator(a.var_list),f=h.next();!f.done;f=h.next()){f=f.value;this.fulfill_cstruct_var_define(f);if(PROTO_PRESET.ctypes_length.hasOwnProperty(f.type))c=PROTO_PRESET.correct_offset(c,f.type),c+=this.calculate_array_type_length(f,PROTO_PRESET.ctypes_length[f.type]);else if("STRUCT"==f.type){var m=b.find_cstruct_define_key_name(this.lib_name,f.struct_name,e);m||console.error("fatal: missed struct define of "+
f.struct_name);var l=this.calculate_struct_max_memeber_size(m,b,e);if(PROTO_PRESET.hasExtArg(f,PROTO_PRESET.ARGS_STRINGS.LINK)){if(d!=a.var_list.length-1)for(l=d;l<a.var_list.length-1;l++){var k=a.var_list[d];PROTO_PRESET.hasExtArg(k,PROTO_PRESET.ARGS_STRINGS.LINK)||console.error("if link occur! var_define must be append!!",k.name,a.name_list)}g||(l=this.calculate_struct_max_memeber_size(a,b,e),c=PROTO_PRESET.correct_cstruct_length(c,l),g=!0)}else c=PROTO_PRESET.correct_offset_with_type_length(c,
l);c+=this.calculate_array_type_length(f,m.byte_length);f.byte_length=m.byte_length}else console.error("fatal: missed ctypes_length define of "+f.type);d+=1}g||(l=this.calculate_struct_max_memeber_size(a,b,e),c=PROTO_PRESET.correct_cstruct_length(c,l));return c};CStructDefineLib.prototype.calculate_array_type_length=function(a,b){return 0==a.array_length?b:a.array_length2?b*a.array_length*a.array_length2:b*a.array_length};CStructDefineLib.prototype.find_cstruct_define_key_id=function(a){return this.all_cstruct_define_map_key_id[a]};
CStructDefineLib.prototype.find_cstruct_define_key_name=function(a){return this.all_cstruct_define_map_key_name[a]};CStructDefineLib.prototype.fulfill_cstruct_var_define=function(a){for(var b in PROTO_PRESET.default_cstruct_value)a.hasOwnProperty(b)||(a[b]=PROTO_PRESET.default_cstruct_value[b])};CStructDefineLib.prototype.adjust_cstruct_id=function(a){var b=a.id;"string"==typeof b&&b.toLowerCase().startsWith("0x")&&(b=parseInt(b,16));a.id=b};
var ProtocolUtil={cstruct_define_lib_mgr:new CStructDefineLibMgr,namespace:"",header:PROTO_PRESET.HEADER,init_cstruct_define_map_with_json:function(a){for(var b in a)this.cstruct_define_lib_mgr.init_cstruct_define_map_with_json(a[b],b)},reader:{BITS_32:4294967296,types:{INT:function(a,b){return a.getInt32(b,!0)},SHORT:function(a,b){return a.getInt16(b,!0)},LONGLONG:function(a,b){var c=a.getUint32(b,!0);a=a.getInt32(b+4,!0);return c+this.BITS_32*a},LONG:function(a,b){return a.getInt32(b,!0)},CHAR:function(a,
b){return a.getInt8(b)},CHARINT:function(a,b){return a.getInt8(b)},UINT:function(a,b){return a.getUint32(b,!0)},USHORT:function(a,b){return a.getUint16(b,!0)},USHORT_TRANS:function(a,b){return a.getUint16(b)},ULONGLONG:function(a,b){var c=a.getUint32(b,!0);a=a.getUint32(b+4,!0);return c+this.BITS_32*a},ULONG:function(a,b){return a.getUint32(b,!0)},UCHAR:function(a,b){return a.getUint8(b)},FLOAT:function(a,b){return a.getFloat32(b,!0)},DOUBLE:function(a,b){return a.getFloat64(b,!0)}},execute:function(a,
b,c){b=b.type;if(this.types.hasOwnProperty(b))return this.types[b].call(this,a,c);console.error("type is not defined in reader!",b)}},readType:function(a,b,c){c=void 0===c?PROTO_PRESET.S2C_LIB:c;this.header=PROTO_PRESET.getNameSpaceHeaderDefine(void 0===b?"":b);a=new DataView(a);if(c=this.read_cstruct(a,{var_list:this.header},0,c).object)return c.type},read:function(a,b,c){b=void 0===b?"":b;c=void 0===c?PROTO_PRESET.S2C_LIB:c;this.header=PROTO_PRESET.getNameSpaceHeaderDefine(b);this.namespace=b;a=
new DataView(a);b=this.read_cstruct(a,{var_list:this.header},0,c);var e=b.object,d=this.cstruct_define_lib_mgr.find_cstruct_define_key_id(c,e.type,this.namespace);if(d)return PROTO_PRESET.LOG_READ&&console.log("byte array length:",a.byteLength),b=this.read_cstruct(a,d,b.offset,c),b.object.HEADER=e,b.object;console.error("read struct is not defined!","0x"+e.type.toString(16))},read_cstruct_with_header:function(a,b,c,e,d){d=void 0===d?0:d;return b.id&&0<b.id?(c=this.read_cstruct(a,{var_list:this.header},
c,e,d),c=this.read_cstruct(a,b,c.offset,e,d)):this.read_cstruct(a,b,c,e,d)},read_cstruct:function(a,b,c,e,d){d=void 0===d?0:d;for(var g=b.var_list,h={},f=void 0,m=!1,l={$jscomp$loop$prop$index$9:0};l.$jscomp$loop$prop$index$9<g.length;l={$jscomp$loop$prop$index$9:l.$jscomp$loop$prop$index$9},l.$jscomp$loop$prop$index$9++){var k=g[l.$jscomp$loop$prop$index$9],n=function(b){var d=k.struct_name,f=this.cstruct_define_lib_mgr.find_cstruct_define_key_name(e,d,this.namespace);if(f)return this.read_cstruct_with_header(a,
f,c,e,b);console.error("read nest struct is not defined!",d)},u=function(a){for(var b=[],c=0;c<a.length;c++){var d=a[c];if(0==d)break;b.push(d)}return iconv.decode(Buffer.from(b),"utf-8")},r=function(e){return function(){if("STRUCT"==k.type){var f=c,g=PROTO_PRESET.hasExtArg(k,PROTO_PRESET.ARGS_STRINGS.LINK);if(g){if(e.$jscomp$loop$prop$index$9!=b.var_list.length-1)for(var h=e.$jscomp$loop$prop$index$9;h<b.var_list.length-1;h++){var l=b.var_list[e.$jscomp$loop$prop$index$9];PROTO_PRESET.hasExtArg(l,
PROTO_PRESET.ARGS_STRINGS.LINK)||console.error("if link occur! var_define must be append!!",l.name,b.name_list)}m||(c=PROTO_PRESET.correct_offset_with_type_length(c+d,b.max_memeber_size)-d,m=!0)}else c=PROTO_PRESET.correct_offset_with_type_length(c+d,k.byte_length)-d;PROTO_PRESET.LOG_READ&&console.log("read struct",f,c,k.byte_length,k,b.max_memeber_size);if(f=g?n.call(this,-c):n.call(this,0))return PROTO_PRESET.LOG_READ&&console.log("read_value 1",k.name,k.type,f.object,c,d),c=f.offset,f.object}else return c=
PROTO_PRESET.correct_offset(c+d,k.type)-d,f=this.reader.execute.call(this.reader,a,k,c),void 0==f&&(console.error("read failed",k.type,k),f=void 0),PROTO_PRESET.ctypes_length.hasOwnProperty(k.type)||console.error("fatal: missed ctypes_length defind of "+k.type),PROTO_PRESET.LOG_READ&&console.log("read_value 2",k.name,k.type,f,c,d),c+=PROTO_PRESET.ctypes_length[k.type],f}}(l);if(0==k.array_length)h[k.name]=r.call(this);else{var v=k.array_length,t=k.array_length2;if("STRUCT"==k.type){var p=k.args;p&&
-1!=p.indexOf("fixed")||(void 0==f?console.error("fatal: struct head is invalid array length type"):-1==PROTO_PRESET.STRUCT_ARRAY_LENGTH_TYPES.indexOf(f.type)?console.error("fatal: struct array length value type is invalid",f.type):v=Math.max(0,f.value))}f=[];for(p=0;p<v;p++)if(t){for(var q=[],w=0;w<t;w++)q.push(r.call(this));"CHAR"==k.type&&(q=u(q));f.push(q)}else f.push(r.call(this));h[k.name]="CHAR"==k.type&&0==t?u(f):f}f={name:k.name,value:h[k.name],type:k.type}}void 0==b.id||m||(b.hasOwnProperty("max_memeber_size")||
console.error("max_memeber_size is missed on cstruct_define",b.name_list,b.id),c=PROTO_PRESET.correct_offset_with_type_length(c+d,b.max_memeber_size)-d);return{object:h,offset:c}},writer:{BITS_32:4294967296,types:{INT:function(a,b,c){a.setInt32(b,c,!0)},SHORT:function(a,b,c){a.setInt16(b,c,!0)},LONGLONG:function(a,b,c){var e=Math.floor(c/this.BITS_32);a.setUint32(b,c-e*this.BITS_32,!0);a.setInt32(b+4,e,!0)},LONG:function(a,b,c){a.setInt32(b,c,!0)},CHAR:function(a,b,c){a.setInt8(b,c)},CHARINT:function(a,
b,c){a.setInt8(b,c)},UINT:function(a,b,c){a.setUint32(b,c,!0)},USHORT:function(a,b,c){a.setUint16(b,c,!0)},USHORT_TRANS:function(a,b,c){a.setUint16(b,c)},ULONGLONG:function(a,b,c){var e=Math.floor(c/this.BITS_32);a.setUint32(b,c-e*this.BITS_32,!0);a.setUint32(b+4,e,!0)},ULONG:function(a,b,c){a.setUint32(b,c,!0)},UCHAR:function(a,b,c){a.setUint8(b,c)},FLOAT:function(a,b,c){a.setFloat32(b,c,!0)},DOUBLE:function(a,b,c){a.setFloat64(b,c,!0)}},execute:function(a,b,c,e){b=b.type;if(this.types.hasOwnProperty(b))return this.types[b].call(this,
a,c,e),!0;console.error("type is not defined in writer!",b);return!1}},setNamespaceHeader:function(a){PROTO_PRESET.NAMESPACE_HEADER=a},write:function(a,b,c,e){c=void 0===c?"":c;e=void 0===e?PROTO_PRESET.C2S_LIB:e;this.header=PROTO_PRESET.getNameSpaceHeaderDefine(c);var d=PROTO_PRESET.getNameSpaceHeaderValue(c);this.namespace=c;var g=this.cstruct_define_lib_mgr.find_cstruct_define_key_id(e,b,this.namespace);if(g){var h=PROTO_PRESET.getNameSpaceHeaderLength(c),f=h+g.byte_length,m=new ArrayBuffer(f),
l=new DataView(m);d.type=b;d.length=f;d=this.onReWriteHeader(c,f,d);this.write_cstruct(l,this.header,d,0,e);this.write_cstruct(l,g.var_list,a,h,e);return m}console.error("write struct is not defined!",b)},onReWriteHeader:function(a,b,c){return c},write_cstruct:function(a,b,c,e,d){for(var g=0;g<b.length;g++){var h=b[g],f=0;c.hasOwnProperty(h.name)&&(f=c[h.name]);var m=function(b,c){if("STRUCT"==b.type){var f=h.struct_name;var g=this.cstruct_define_lib_mgr.find_cstruct_define_key_name(d,f,this.namespace);
g?f=this.write_cstruct(a,g.var_list,c,e).offset:(console.error("write neststruct is not defined!",f),f=0);if(f)PROTO_PRESET.LOG_WRITE&&console.log("write_value",b.name,b.type,c,e),e=f;else return!1}else if(e=PROTO_PRESET.correct_offset(e,b.type),this.writer.execute.call(this.writer,a,h,e,c)?f=!0:(console.error("write failed",h.type,h),f=!1),f){if(!PROTO_PRESET.ctypes_length.hasOwnProperty(b.type))return console.error("fatal: missed ctypes_length defind of "+b.type),!1;PROTO_PRESET.LOG_WRITE&&console.log("write_value",
b.name,b.type,c,e);e+=PROTO_PRESET.ctypes_length[b.type]}else return!1;return!0};if(0==h.array_length){var l=m.call(this,h,f);l||console.error("write failed1! name",h.name,"type",h.type,"value",f)}else{var k=h.array_length,n=[];n="CHAR"==h.type?iconv.encode(f,"utf-8"):f;for(f=0;f<k;f++)(l=m.call(this,h,n[f]||0))||console.error("write failed2! name",h.name,"type",h.type,"value",n)}}return{offset:e}}};module.exports=ProtocolUtil;