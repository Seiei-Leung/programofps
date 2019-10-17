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
     */
    addDetailAboutWorkDay(year, Mon, Tues, Wed, Thurs, Fri, Sat, Sun) {
        this.yearList.push(year);
        this.DayList.push([Mon, Tues, Wed, Thurs, Fri, Sat, Sun]);
    }

    /**
     * 新增节假日信息
     * @param {*} festivalDay 节假日日期，如 2019-10-17
     */
    addDetailAboutFestival(festivalDay) {
        this.festivalDayList.push(festivalDay);
    }
    
}