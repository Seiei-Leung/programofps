import ProgressBar from "./progressBar";
import CONST from "../common/const";

// 生产线 vo
export default class ProductLine {

    constructor(id, index, workgroup, workshop, lineCode, peopleNum, workhours, peopleNumOfLineList, workhoursOfLineList, efficiencyOfLineList) {
        this.id = id; // 生产线 ID
        this.index = index; // 在生产线列表中的索引
        this.workgroup = workgroup; // 组别
        this.workshop = workshop; // 车间
        this.lineCode = lineCode; // 生产线
        this.peopleNum = peopleNum; // 默认人数
        this.workhours = workhours; // 默认工作时间
        this.peopleNumOfLineList = peopleNumOfLineList; // 工作人数列表
        this.workhoursOfLineList = workhoursOfLineList; // 工作时间列表
        this.efficiencyOfLineList = efficiencyOfLineList; // 效率列表
        this.progressList = []; // 该生产线的排产进度条列表
    }

    // 获取主键
    get getId() {
        return this.id;
    }

    // 获取生产线索引
    get getIndex() {
        return this.index;
    }

    // 获取组别
    get getWorkgroup() {
        return this.workgroup;
    }

    // 获取车间
    get getWorkshop() {
        return this.workshop;
    }

    // 获取生产线
    get getLineCode() {
        return this.lineCode;
    }

    // 获取工作人数列表
    get getPeopleNumOfLineList() {
        return this.peopleNumOfLineList;
    }

    // 获取工作时间列表
    get getWorkhoursOfLineList() {
        return this.workhoursOfLineList;
    }

    // 获取效率列表
    get getEfficiencyOfLineList() {
        return this.efficiencyOfLineList;
    }

    // 获取生产线全名
    get fullName() {
        return this.workgroup + "-" + this.workshop + "-" + this.lineCode;
    }

    // 获取生产线排产详情信息
    get getProgressList() {
        return this.progressList;
    }

    /**
     * 设置生产线的排产列表
     * @param {*} progressList 排产列表
     */
    setProgressList(progressList) {
        this.progressList = progressList;
    }

    /**
     * 根据时间点获取生产线工作人数
     * @param {*} timeStamp 时间点
     */
    getPeopleNumByDate(timeStamp) {
        var peopleNum = this.peopleNum;
        this.peopleNumOfLineList.forEach((item) => {
            if (item.startTime <= timeStamp && timeStamp <= item.endTime) {
                peopleNum = item.peopleNum;
            }
        });
        return peopleNum;
    }

    /**
     * 根据时间点获取生产线工作时间
     * @param {*} timeStamp 时间点
     */
    getWorkHoursByDate(timeStamp) {
        var workhours = this.workhours;
        this.workhoursOfLineList.forEach((item) => {
            if (item.startTime <= timeStamp && timeStamp <= item.endTime) {
                workhours = item.workhours;
            }
        });
        return workhours;
    }

    // 获取生产线效率
    /**
     * 根据产品类获取效率
     * @param {*} styleName 产品类名
     */
    getEfficiency(styleName) {
        var efficiency = null;
        this.efficiencyOfLineList.forEach((item) => {
            if (item.styleName == styleName) {
                efficiency = item.efficiency;
            }
        });
        return efficiency;
    }

    /**
     * 根据排产进度条的 id 获取进度条实例
     * @param {*} id 
     */
    getProgressById(id) {
        this.progressList.find((item) => {
            return item.id == id;
        })
    }

    /**
     * 根据排产进度条的 id 获取进度条实例在列表中的索引
     * @param {*} id 进度条的 id
     */
    getProgressIndexById(id) {
        var index = this.progressList.findIndex((item) => {
            return item.id == id;
        });
        return index;
    }

    /**
     * 根据进度条 id 删除对应的进度条
     * @param {*} id 进度条的 id
     */
    removeProgressById(id) {
        var index = this.getProgressIndexById(id);
        if (index == null) {
            console.log("该生产线没有对应 id 的进度条");
            return;
        }
        this.progressList.splice(index, 1);
    }

    /**
     * 添加新排产进度条到列表，返回新增排产计划所在的索引
     * @param {*} progressBarOfInsert 排产进度条实例
     * @param {*} factoryCalendar 工厂日历
     */
    addProgress(progressBarOfInsert, factoryCalendar) {
        var progressBarIndexOfReset = 0; // 用于重置的
        var isInserted = false; // 是否已经插入了进度条
        var progressBarLocal; // 取于本地生产线用于比较的进度条
        var progressBarOfCompare = progressBarOfInsert; // 设置用于比较的进度条
        var relationOfInsert; // 插入进度的状态
        for (var progressBarIndex=0; progressBarIndex<this.progressList.length; progressBarIndex++) {
            // 还没有插入新的进度条
            if (!isInserted) {
                progressBarLocal = this.progressList[progressBarIndex];
                relationOfInsert = ProgressBar.getRelationByProgressBar(progressBarLocal, progressBarOfCompare);
                // 新增的进度条与本地进度条不重叠，且本地进度条靠前
                if (relationOfInsert == "NO_CLASH_LOCAL_EARLY") {
                    progressBarIndexOfReset  += 1;
                    continue;
                }
                // 新增的进度条的 **开启时间 ** 与本地进度条的发生重叠
                else if (relationOfInsert == "CLASH_STARTTIME") {
                    console.log("新增的进度条的 **开启时间** 与本地进度条的发生重叠");
                    
                    // 循环索引 +1
                    progressBarIndex += 1; 
                    // 重置插入进度条的开启时间等信息
                    progressBarOfInsert.reload(this, factoryCalendar, progressBarLocal.getEndTime);
                    this.progressList.splice(progressBarIndex, 0, progressBarOfInsert);
                    isInserted = true; //更新为已插入
                    progressBarLocal = progressBarOfInsert; // 重置本地生产线用于比较的进度条
                }
                // 新增的进度条的 **结束时间 ** 与本地进度条的发生重叠
                else if (relationOfInsert == "CLASH_ENDTIME") {
                    console.log("新增的进度条的 **结束时间** 与本地进度条的发生重叠");

                    // 插入数据，因为新增进度条靠前，所以取代了发生重叠进度条的位置
                    this.progressList.splice(progressBarIndex, 0, progressBarOfInsert);            
                    // 往后进度条的索引都加 1，后续结束会加 1
                    progressBarIndex += 1;
                    // 重置发生重叠的进度条的信息
                    progressBarLocal.reload(this, factoryCalendar, progressBarOfInsert.getEndTime);
                    isInserted = true; //更新为已插入
                }
                // 不发生重叠，且新增的进度条靠前
                else {
                    continue;
                }
            }
            // 新增进度条已经插入
            else {
                // 重置用于比较的进度条，
                progressBarOfCompare = this.progressList[progressBarIndex];
                var relation = ProgressBar.getRelationByProgressBar(progressBarLocal, progressBarOfCompare);
                // 如果不发生重叠，且本地进度条靠前
                if (relation == "NO_CLASH_LOCAL_EARLY") {
                    progressBarLocal = progressBarOfCompare; // 重置本地生产线用于比较的进度条
                    continue;
                }
                // 发生重叠
                else {
                    // console.log(relation);
                    // 更新发生重叠的数据
                    progressBarOfCompare.reload(this, factoryCalendar, progressBarLocal.getEndTime);
                    progressBarLocal = progressBarOfCompare; // 重置本地生产线用于比较的进度条
                    continue;
                }
            }
        }
        // 循环所有的进度条后，isInserted 仍然为 false, 即对所有的进度条都没有发生重叠，可以直接插入
        if (!isInserted) {
            console.log("没有发生重叠");
            // 插入数据
            this.progressList.splice(progressBarIndexOfReset, 0, progressBarOfInsert);
        }
        return this.getProgressIndexById(progressBarOfInsert.getId) + "";
    }

    /**
     * 清空整体生产线渲染
     * @param {*} ctx 画布上下文
     */
    clear(ctx) {
        ctx.clearRect(0, (CONST.STYLEOFCELL.height + 2*CONST.STYLEOFCELL.lineWidth)*this.index, ctx.canvas.offsetWidth, CONST.STYLEOFCELL.height);
    }

    /**
     * 生产线进度条渲染
     * @param {*} ctx 画布上下文 
     * @param {*} idList 无需渲染的id列表
     */
    renderWithOutIdList(ctx, idList) {
        if (idList == null) {
            for (var i=0; i<this.progressList.length; i++) {
                // 是否发生重叠
                if (this.progressList[i+1] != null && this.progressList[i].getEndTime > this.progressList[i+1].getStartTime) {
                    this.progressList[i].render(ctx, true);
                } else {
                    this.progressList[i].render(ctx, false);
                }
            }
        } else {
            for (var i=0; i<this.progressList.length; i++) {
                // 是否在排除 id 的列表中
                if (idList.indexOf(this.progressList[i].id) == -1) {
                    // 是否发生了重叠
                    if (this.progressList[i+1] != null && this.progressList[i].getEndTime > this.progressList[i+1].getStartTime) {
                        this.progressList[i].render(ctx, true);
                    } else {
                        this.progressList[i].render(ctx, false);
                    }
                }
            }
        }
    }

    /**
     * 复制对象
     */
    copy() {
        var that = this;
        var progressList = [];
        this.getProgressList.forEach((item) => {
            progressList.push(item.copy());
        });
        var productionLine = new ProductLine(
            that.id,
            that.index,
            that.workgroup,
            that.workshop,
            that.lineCode,
            that.peopleNum,
            that.workhours,
            that.peopleNumOfLineList,
            that.workhoursOfLineList,
            that.efficiencyOfLineList
        );
        productionLine.setProgressList(progressList);
        return productionLine;
    }



}