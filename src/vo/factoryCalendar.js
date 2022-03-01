import DateUtil from "../common/dateUtil";

export default class FactoryCalendar {
    
    constructor() {
        this.yearList = [];
        this.dayList = [];
        this.festivalDayList = [];
    }

    /**
     * 新增日常工作日的假期信息
     * @param {*} year 年份
     * @param {*} Mon 星期一是否要上班
     * @param {*} Tues 星期二是否要上班
     * @param {*} Wed 星期三是否要上班
     * @param {*} Thurs 星期四是否要上班
     * @param {*} Fri 星期五是否要上班
     * @param {*} Sat 星期六是否要上班
     * @param {*} Sun 星期天是否要上班
     * @param {*} festivalDay 节日信息
     */
    addDetailByYear(year, Mon, Tues, Wed, Thurs, Fri, Sat, Sun, festivalDay) {
        this.yearList.push(year);
        this.dayList.push([Sun, Mon, Tues, Wed, Thurs, Fri, Sat]);
        this.festivalDayList.push(festivalDay);
    }

    /**
     * 某天是否为非工作日
     * @param {*} srt 时间，如 2019-10-17 
     */
    isHoliday(timeStamp) {
        var time = new Date(timeStamp);
        var year = time.getFullYear();
        var weekDay = time.getDay();
        var index = this.yearList.indexOf(year);
        if (index == -1) {
            return null;
        }
        var dayList = this.dayList[index];
        var dateTemp = this.festivalDayList[index].find((item) => {
            return item == DateUtil.timeStampToDate(timeStamp);
        })
        if (dateTemp != null) {
            return true;
        }
        if (!dayList[weekDay]) {
            return true;
        }
        return false;
    }
    
    /**
     * 给予开启时间，没有节假日时预计完成时间 来获取有节假日时的完成时间
     * @param {*} startTime 开启日期
     * @param {*} endTime 预计完成时间
     */
    getEndTime(startTime, endTime) {
        var dayCount = DateUtil.timeStampsToDayCount(startTime, endTime); // 需要多少工作日
        var timeStampTemp = startTime;
        var holidayCount = 0;
        for (var i=0; i<dayCount; i++) {
            if (this.isHoliday(timeStampTemp)) {
               dayCount += 1;
               holidayCount += 1;
            }
            timeStampTemp += DateUtil.timeStampOfOneDay;
        }
        return endTime + holidayCount*DateUtil.timeStampOfOneDay;
    }

    /**
     * 给予结束时间，需要工作天数反推获取开始时间
     * @param {*} endTime 结束时间
     * @param {*} dayCount 总需要工作天数
     */
    getStartTime(endTime, dayCount) {
        var timeStampTemp = endTime;
        var holidayCount = 0;
        var dayCountTemp = dayCount;
        for (var i=0; i<dayCountTemp; i++) {
            if (this.isHoliday(timeStampTemp)) {
                dayCountTemp += 1;
               holidayCount += 1;
            }
            timeStampTemp -= DateUtil.timeStampOfOneDay;
        }
        return endTime - (dayCount + holidayCount)*DateUtil.timeStampOfOneDay;
    }
}