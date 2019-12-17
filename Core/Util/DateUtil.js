
class DateUtil {

    static formatNumStr(num) {
        let str = "" + num;
        if (num < 10) {
            str = "0" + num;
        }
        return str;
    }

    static formateYearMonthDayStr(timestamp, seperator = "-") {
        let date = new Date(timestamp);
        return date.getFullYear() + seperator + (date.getMonth() + 1) + seperator + date.getDate();
    }

    static formateMonthDayStr(timestamp) {
        let date = new Date(timestamp);
        return (date.getMonth() + 1) + "月" + date.getDate() + "日";
    }

    //  timestamp:1453094034000  2018-1-31 19:53:44
    //根据时间戳返回 2018-1-31 19:53:44 
    static formatDateStr(timestamp) {
        let date = new Date(timestamp);
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + this.formatNumStr(date.getHours()) + ":" + this.formatNumStr(date.getMinutes()) + ":" + this.formatNumStr(date.getSeconds());
    }

    //  timestamp:1453094034000  2018-1-31-19-53-44 
    //根据时间戳返回 2018-1-31-19-53-44 
    static formatDateStr2(timestamp) {
        let date = new Date(timestamp);
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "-" + this.formatNumStr(date.getHours()) + "-" + this.formatNumStr(date.getMinutes()) + "-" + this.formatNumStr(date.getSeconds());
    }

    //  timestamp:1453094034000  
    //根据时间戳返回 19:53
    static formatHourMinStr(timestamp) {
        let date = new Date(timestamp);
        return this.formatNumStr(date.getHours()) + ":" + this.formatNumStr(date.getMinutes());
    }

    static now() {
        let date = new Date();
        return date.getTime();
    }

    static betweenTime(startTime, endTime) {
        let date = new Date();
        if (date.getTime() >= startTime && date.getTime() <= endTime) {
            return true;
        }
        return false;
    }

    static isToday(dateTime) {
        let nowDate = new Date();
        let checkDate = new Date(dateTime);
        // Logger.log("isToday===", nowDate.getDate(), checkDate.getDate());
        if (checkDate.getFullYear() == nowDate.getFullYear() && checkDate.getMonth() == nowDate.getMonth() && checkDate.getDate() == nowDate.getDate()) {
            // Logger.log("isToday=相同==", nowDate, checkDate);
            return true;
        }
        // Logger.log("isToday==不同=", nowDate, checkDate);
        return false;
    }

}

module.exports = DateUtil;