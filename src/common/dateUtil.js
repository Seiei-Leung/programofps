// 时间工具
export default class DateUtil {
    constructor() {
    }

    // 显示的第一天时间戳
    static get firstTimeStampOfShow() {
        var now = DateUtil.getTimeStampOfToday;
        var fifteenDayAgo = now - 15 * DateUtil.timeStampOfOneDay; // 15 天之前的时间戳
        return fifteenDayAgo;
    }

    // 用于日期栏显示
    static get monthListOfShow() {
        var firstDateOfShow = new Date(DateUtil.firstTimeStampOfShow);
        var yearOfPrevious = firstDateOfShow.getFullYear(); // 显示的第一天时间戳当前的年份
        var monthOfPrevious = firstDateOfShow.getMonth() + 1; // 显示的第一天时间戳当前的月份
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

    // 获取日期栏显示 year 的列表
    static get yearListOfShow() {
        var monthListOfShow = DateUtil.monthListOfShow;
        var firstYearStr = monthListOfShow[0];
        var lastYearStr = monthListOfShow[monthListOfShow.length-1];
        var list = [];
        firstYearStr = Number(firstYearStr.split("-")[0]);
        lastYearStr = Number(lastYearStr.split("-")[0]);
        list.push(firstYearStr);
        if (firstYearStr != lastYearStr) {
            if (lastYearStr - firstYearStr > 1) {
                list.push(Number(firstYearStr)+1);
            }
            list.push(lastYearStr);
        }
        return list;
    }

    // 显示的总天数
    static get dayCountOfShow() {
        var now = new Date();
        var yearOfPrevious = now.getMonth() == 0 ? now.getFullYear() - 1 : now.getFullYear(); // 当前时间的上一个月的年份
        var monthOfPrevious = now.getMonth() == 0 ? 12 : now.getMonth(); // 当前时间的上一个月的月份
        monthOfPrevious = DateUtil.zeroFillOfMonthOrDay(monthOfPrevious);
        var dayCountOfShow = DateUtil.getDayCountOfMonth(yearOfPrevious, monthOfPrevious) - new Date(DateUtil.firstTimeStampOfShow).getDate() + 1;
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
        return 86400000;
    }
    
    /**
     * 月份或日期补零
     * @param {*} str 月份或日期字符串
     */
    static zeroFillOfMonthOrDay(str) {
        return (str + "").length == 2 ? str : "0" + str; 
    }

    /**
     * 获取某年某月的总天数
     * @param {*} year 年
     * @param {*} month 月
     */
    static getDayCountOfMonth(year, month) {
        return new Date(year, month, 0).getDate();
    }

    /**
     * 判断是否为周末
     * @param {*} year 年
     * @param {*} month 月
     * @param {*} day 日
     */
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

    /**
     * 日期形式的字符串转化为时间戳，形如 "2019-11-18"
     * @param {*} dateStr 日期字符串
     */
    static strToTimeStamp(dateStr) {
        var dateStrList = dateStr.split("-");
        var year = dateStrList[0];
        var month = DateUtil.zeroFillOfMonthOrDay(dateStrList[1]);
        var day = DateUtil.zeroFillOfMonthOrDay(dateStrList[2]);
        return new Date(year + "/" + month + "/" + day + " 00:00:00").getTime();
    }

    /**
     * 时间戳转化为日期形式的字符串，形如 "2019-11-18"
     * @param {*} timeStamp 
     */
    static timeStampToDate(timeStamp) {
        var time = new Date(timeStamp);
        return (time.getFullYear() + "-" + DateUtil.zeroFillOfMonthOrDay(time.getMonth() + 1) + "-" + DateUtil.zeroFillOfMonthOrDay(time.getDate()));
    }

    /**
     * 通过两个时间戳的差值转化为 天数，如果 开始时间小于结束时间，则返回 0
     * @param {*} sTimeStamp 开始时间
     * @param {*} eTimeStamp 结束时间
     */
    static timeStampsToDayCount(sTimeStamp, eTimeStamp) {
        var timeStamp = eTimeStamp - sTimeStamp;
        if (timeStamp < 0) {
            return 0;
        }
        return Math.ceil(timeStamp / DateUtil.timeStampOfOneDay)
    }

    /**
     * 通过两个时间戳的差值转化为它们之间的 日期列表
     * 如 sTimeStamp=1571846400000, eTimeStamp=1572019200000
     * 返回的是二者之间的日期类别，即 ["2019-10-24", "2019-10-25", "2019-10-26"]
     * @param {*} sTimeStamp 开始时间戳
     * @param {*} eTimeStamp 结束时间戳
     */
    static timeStampsToDateStrList(sTimeStamp, eTimeStamp) {
        var resultList = [];
        var count = DateUtil.timeStampsToDayCount(sTimeStamp, eTimeStamp);
        resultList.push(DateUtil.timeStampToDate(sTimeStamp));
        for (var i=0; i<count; i++) {
            resultList.push(DateUtil.timeStampToDate(sTimeStamp + (i + 1)*DateUtil.timeStampOfOneDay))
        }
        return resultList;
    }

    /**
     * 通过画布的日期栏索引转化为 日期字符串，如 "2019-10-19"
     * @param {*} index 索引
     */
    static indexToDateStr(index) {
        var timeStamp = DateUtil.firstTimeStampOfShow + index * DateUtil.timeStampOfOneDay;
        return DateUtil.timeStampToDate(timeStamp);
    }

    /**
     * 获取今天0时0点0秒的时间戳
     */
    static get getTimeStampOfToday() {
        var now = new Date().getTime();
        return DateUtil.strToTimeStamp(DateUtil.timeStampToDate(now));
    }

    /**
     * 获取当前后十二个月的年月对象列表，如：[{year: "2022", "month": "2"}, {year: "2022", "month": "3"}, ...]
     */
    static get getYearAndMonthObjListForAYear() {
        var now = new Date();
        var resultList = [];
        // 当前年份
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        for (var i=0; i<12; i++) {
            var monthTemp = month+i;
            var yearTemp = year;
            if (monthTemp == 13) {
                monthTemp = 1;
                yearTemp += 1;
            }
            resultList.push({
                "year": yearTemp,
                "month": monthTemp
            })
        }
        return resultList;
    }

}