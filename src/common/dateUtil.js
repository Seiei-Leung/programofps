// 时间工具
export default class DateUtil {
    constructor() {
    }

    // 显示的第一天时间戳
    static get firstTimeStampOfShow() {
        var now = new Date();
        var yearOfPrevious = now.getMonth() == 0 ? now.getFullYear() - 1 : now.getFullYear(); // 当前时间的上一个月的年份
        var monthOfPrevious = now.getMonth() == 0 ? 12 : now.getMonth(); // 当前时间的上一个月的月份
        monthOfPrevious = DateUtil.zeroFillOfMonthOrDay(monthOfPrevious);
        var dayCountOfShow = DateUtil.getDayCountOfMonth(yearOfPrevious, monthOfPrevious);
        return DateUtil.strToTimeStamp(yearOfPrevious + "-" + monthOfPrevious + "-01"); 
    }

    // 用于日期栏显示
    static get monthListOfShow() {
        var now = new Date();
        var yearOfPrevious = now.getMonth() == 0 ? now.getFullYear() - 1 : now.getFullYear(); // 当前时间的上一个月的年份
        var monthOfPrevious = now.getMonth() == 0 ? 12 : now.getMonth(); // 当前时间的上一个月的月份
        monthOfPrevious = DateUtil.zeroFillOfMonthOrDay(monthOfPrevious);
        var monthListOfShow = [yearOfPrevious + "-" + monthOfPrevious];
        // 制作日期栏标题数组以及用于显示的单元格总个数即总天数
        for (var i = 0; i < 13; i++) {
            monthOfPrevious = Number(monthOfPrevious) + 1;
            if (monthOfPrevious > 12) {
                monthOfPrevious = 1;
                yearOfPrevious += 1
            }
            monthOfPrevious = DateUtil.zeroFillOfMonthOrDay(monthOfPrevious);
            monthListOfShow.push(yearOfPrevious + '-' + monthOfPrevious);
        }
        return monthListOfShow;
    }

    // 显示的总天数
    static get dayCountOfShow() {
        var now = new Date();
        var yearOfPrevious = now.getMonth() == 0 ? now.getFullYear() - 1 : now.getFullYear(); // 当前时间的上一个月的年份
        var monthOfPrevious = now.getMonth() == 0 ? 12 : now.getMonth(); // 当前时间的上一个月的月份
        monthOfPrevious = DateUtil.zeroFillOfMonthOrDay(monthOfPrevious);
        var dayCountOfShow = DateUtil.getDayCountOfMonth(yearOfPrevious, monthOfPrevious);
        // 制作日期栏标题数组以及用于显示的单元格总个数即总天数
        for (var i = 0; i < 13; i++) {
            monthOfPrevious = Number(monthOfPrevious) + 1;
            if (monthOfPrevious > 12) {
                monthOfPrevious = 1;
                yearOfPrevious += 1
            }
            monthOfPrevious = DateUtil.zeroFillOfMonthOrDay(monthOfPrevious);
            dayCountOfShow += DateUtil.getDayCountOfMonth(yearOfPrevious, monthOfPrevious);
        }
        return dayCountOfShow;
    }

    // 一天的总时间戳
    static get timeStampOfOneDay() {
        return 24*60*60*1000;
    }

    // 月份或日期补零
    static zeroFillOfMonthOrDay(str) {
        return (str + "").length == 2 ? str : "0" + str; 
    }

    // 获取某年某月的总天数
    static getDayCountOfMonth(year, month) {
        return new Date(year, month, 0).getDate();
    }

    // 判断是否为周末
    static isWeekEnd(year, month, day) {
        month = DateUtil.zeroFillOfMonthOrDay(month);
        day = DateUtil.zeroFillOfMonthOrDay(day);
        var date = new Date(year + "/" + month + "/" + day + " 00:00:00");
        if (date.getDay() == 0 || date.getDay() == 6) {
            return true;
        } else {
            return false;
        }
    }

    // 日期转时间戳
    // 形如 "2019-11-18"
    static strToTimeStamp(dateStr) {
        var dateStrList = dateStr.split("-");
        var year = dateStrList[0];
        var month = DateUtil.zeroFillOfMonthOrDay(dateStrList[1]);
        var day = DateUtil.zeroFillOfMonthOrDay(dateStrList[2]);
        return new Date(year + "/" + month + "/" + day + " 00:00:00").getTime();
    }

    // 时间戳转日期
    // 输出结果，格式形如 "2019-11-18"
    static timeStampToDate(timeStamp) {
        var time = new Date(timeStamp);
        return (time.getFullYear() + "-" + DateUtil.zeroFillOfMonthOrDay(time.getMonth() + 1) + "-" + DateUtil.zeroFillOfMonthOrDay(time.getDay()));
    }

    // 两个时间戳转为 天数
    static timeStampsToDayCount(sTimeStamp, eTimeStamp) {
        var timeStamp = eTimeStamp - sTimeStamp;
        return Math.ceil(timeStamp / DateUtil.timeStampOfOneDay)
    }
}