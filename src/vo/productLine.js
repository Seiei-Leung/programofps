// 生产线 vo
export default class ProductLine {

    constructor(id, index, workgroup, workshop, lineCode, peopleNum, workhours, peopleNumOfLineList, workhoursOfLineList, efficiencyOfLineList) {
        this.id = id;
        this.index = index;
        this.workgroup = workgroup;
        this.workshop = workshop;
        this.lineCode = lineCode;
        this.peopleNum = peopleNum;
        this.workhours = workhours;
        this.peopleNumOfLineList = peopleNumOfLineList;
        this.workhoursOfLineList = workhoursOfLineList;
        this.efficiencyOfLineList = efficiencyOfLineList;
        this.progressList = [];
    }

    // 获取生产线全名
    get fullName() {
        return this.workgroup + "-" + this.workshop + "-" + this.lineCode;
    }

    // 根据时间获取生产线工作人数
    getPeopleNumByDate(timeStamp) {
        this.peopleNumOfLineList.forEach((item) => {
            if (item.startTime <= timeStamp && timeStamp <= item.endTime) {
                return item.peopleNum;
            }
        });
        return this.peopleNum;
    }

    // 根据时间获取生产线工作人数
    getWorkHoursByDate(timeStamp) {
        this.workhoursOfLineList.forEach((item) => {
            if (item.startTime <= timeStamp && timeStamp <= item.endTime) {
                return item.workhours;
            }
        });
        return this.workhours;
    }

    // 获取生产线效率
    getEfficiency(styleName) {
        this.efficiencyOfLineList.forEach((item) => {
            if (item.styleName == styleName) {
                return item.efficiency;
            }
        });
        return null;
    }

    // 设置生产线排产详情信息
    setProgressList(progressList) {
        this.progressList = progressList;
    }

    // 获取生产线排产详情信息
    get getProgressList() {
        return this.progressList;
    }

    // todo 整条生产线重新渲染
    render() {

    }
}