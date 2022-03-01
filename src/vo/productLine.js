import ProgressBar from "./progressBar";
import CONST from "../common/const";
import DateUtil from "../common/dateUtil";

// 生产线 vo
export default class ProductLine {

    constructor(id, index, workgroup, workshop, lineCode, peopleNum, workhours, defaultStyleName, peopleNumOfLineList, workhoursOfLineList, efficiencyOfLineList) {
        this.id = id; // 生产线 ID
        this.index = index; // 在生产线列表中的索引
        this.workgroup = workgroup; // 组别
        this.workshop = workshop; // 车间
        this.lineCode = lineCode; // 生产线
        this.peopleNum = peopleNum; // 默认人数
        this.workhours = workhours; // 默认工作时间
        this.defaultStyleName = defaultStyleName; // 默认属性
        this.peopleNumOfLineList = peopleNumOfLineList; // 工作人数列表
        this.workhoursOfLineList = workhoursOfLineList; // 工作时间列表
        this.efficiencyOfLineList = efficiencyOfLineList; // 效率列表
        this.progressList = []; // 该生产线的排产进度条列表
        this.idOfLock = CONST.STATUSOFLOCK.LOCK; // 加锁时间，为 -2 时全部上锁，为 -1 时全部解锁，其它为时间戳
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

    // 获取默认属性
    get getDefaultStyleName() {
        return this.defaultStyleName;
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
        var index = this.progressList.findIndex((item) => {
            return item.id == id;
        });
        return this.progressList[index];
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
     * 获取该生产线内最晚的结束时间戳（不一定是最后一条进度条），如果没有进度条，则默认返回 今天的 0点0分0秒
     */
    getTheLastTimeStamp() {
        var progressList = this.getProgressList;
        if (progressList.length == 0) {
            return DateUtil.getTimeStampOfToday;
        } else {
            var timeStamp = 0;
            for (var progressBarIndex=0; progressBarIndex<this.progressList.length; progressBarIndex++) {
                timeStamp = timeStamp < this.progressList[progressBarIndex].getEndTime ? this.progressList[progressBarIndex].getEndTime : timeStamp;
            }
            return timeStamp;
        }
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
     * 修正插入计划时，开始时间可能引起的 bug
     * (比如有些计划的长度不足一天)
     * @param {*} timeStamp 
     */
    ractifyStartTime(timeStamp) {
        var startTime = timeStamp;
        var progressList = this.getProgressList;
        for (var progressIndex=0; progressIndex<progressList.length; progressIndex++) {
            // 发生重叠
            if (progressList[progressIndex].getStartTime <= timeStamp && progressList[progressIndex].getEndTime >= timeStamp) {
                // 发生重叠的计划的结束日期向后取整
                var endTimeAddOneDay = DateUtil.strToTimeStamp(DateUtil.timeStampToDate(progressList[progressIndex].getEndTime)) + DateUtil.timeStampOfOneDay;
                // 检测是否有时长不足一天的计划，如果有则开始时间取不足计划的结束时间
                for (var progressIndex2=progressIndex+1; progressIndex2<progressList.length; progressIndex2++) {
                    if (progressList[progressIndex2].getStartTime >= progressList[progressIndex].getEndTime && progressList[progressIndex2].getEndTime <= endTimeAddOneDay) {
                        startTime = progressList[progressIndex2].getEndTime;
                    }
                }
                break;
            }
        }
        return startTime;
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
                    // 插入数据
                    this.progressList.splice(progressBarIndex, 0, progressBarOfInsert);

                    // 如果源生产线数据中，本地计划的结束时间比后面的一些计划的结束时间要靠前
                    // 则将在下一次的循环中忽略它
                    for (var progressBarIndex2=progressBarIndex+1; progressBarIndex2<this.progressList.length; progressBarIndex2++) {
                        if (this.progressList[progressBarIndex2].getEndTime <= progressBarLocal.getEndTime) {
                            progressBarIndex += 1;
                        }
                    }
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
        // 重新排序计划列表
        this.sortProgressList();
        return this.getProgressIndexById(progressBarOfInsert.getId) + "";
    }

    /**
     * 添加进度条，但添加的进度条本身无需进行后移调整
     * @param {*} progressBarOfInsert 进度条对象
     * @param {*} factoryCalendar 工厂日历
     */
    addProgressWithOutAmendAtFirst(progressBarOfInsert, factoryCalendar) {
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
                    // 插入数据
                    this.progressList.splice(progressBarIndex, 0, progressBarOfInsert);

                    // 如果源生产线数据中，本地计划的结束时间比后面的一些计划的结束时间要靠前
                    // 则将在下一次的循环中忽略它
                    for (var progressBarIndex2=progressBarIndex+1; progressBarIndex2<this.progressList.length; progressBarIndex2++) {
                        if (this.progressList[progressBarIndex2].getEndTime <= progressBarLocal.getEndTime) {
                            progressBarIndex += 1;
                        }
                    }
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
        // 重新排序计划列表
        this.sortProgressList();
        return this.getProgressIndexById(progressBarOfInsert.getId) + "";
    }

    /**
     * 从生产线最后插入进度条
     * @param {*} progressBarOfInsert 进度条对象
     * @param {*} factoryCalendar 工厂日历
     */
    addProgressInTheEnd(progressBarOfInsert, factoryCalendar) {
        var startTimeStamp = this.getTheLastTimeStamp();
        progressBarOfInsert.reload(this, factoryCalendar, startTimeStamp);
        this.progressList.push(progressBarOfInsert);
        return this.progressList.length - 1; // 返回进度条当前的索引
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
     * @param {*} colorSetting 颜色设置 
     * @param {*} idList 无需渲染的id列表
     * @param {*} indexOfActivedList 选中激活的计划的索引列表(用于渲染激活状态)
     */
    renderWithOutIdList(ctx, colorSetting, idList, indexOfActivedList) {
        var isLock = null; // 是否上锁
        // 整条生产线都上锁
        if (this.idOfLock == CONST.STATUSOFLOCK.LOCK) {
            isLock = true;
        }
        // 整条生产线都解锁
        if (this.idOfLock == CONST.STATUSOFLOCK.UNLOCK) {
            isLock = false;
        }
        if (idList == null) {
            for (var i=0; i<this.progressList.length; i++) {
                var isActived = (indexOfActivedList.indexOf(i) != -1);
                // 如果锁的状态
                if (this.idOfLock > 0) {
                    var indexOfLock = this.getProgressIndexById(this.idOfLock); // 解锁索引
                    isLock = i > indexOfLock ? false : true;
                }
                // 是否发生重叠
                if (this.progressList[i+1] != null && this.progressList[i].getEndTime > this.progressList[i+1].getStartTime) {
                    this.progressList[i].render(ctx, colorSetting, true, isLock, isActived);
                } else {
                    this.progressList[i].render(ctx, colorSetting, false, isLock, isActived);
                }
            }
        } else {
            for (var i=0; i<this.progressList.length; i++) {
                var isActived = (indexOfActivedList.indexOf(i) != -1);
                // 是否在排除 id 的列表中
                if (idList.indexOf(this.progressList[i].id) == -1) {
                    // 如果锁的状态
                    if (this.idOfLock > 0) {
                        var indexOfLock = this.getProgressIndexById(this.idOfLock); // 解锁索引
                        isLock = i > indexOfLock ? false : true;
                    }
                    // 是否发生了重叠
                    if (this.progressList[i+1] != null && this.progressList[i].getEndTime > this.progressList[i+1].getStartTime) {
                        this.progressList[i].render(ctx, colorSetting, true, isLock, isActived);
                    } else {
                        this.progressList[i].render(ctx, colorSetting, false, isLock, isActived);
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
            that.defaultStyleName,
            that.peopleNumOfLineList,
            that.workhoursOfLineList,
            that.efficiencyOfLineList
        );
        productionLine.unLock(this.idOfLock);
        productionLine.setProgressList(progressList);
        return productionLine;
    }

    // 获取上锁状态，若上锁了某条进度条，则返回该进度条的id
    get getIdOfLock() {
        return this.idOfLock;
    }

    /**
     * 解锁当前生产线某个进度条开始以后的进度条
     * @param {*} idOfLock 进度条的id
     */
    unLock(idOfLock) {
        this.idOfLock = idOfLock;
    }

    // 当前生产线全部上锁
    lock() {
        this.idOfLock = CONST.STATUSOFLOCK.LOCK;
    }
    
    /**
     * 用于判断一条进度条基于当前上述的状态是否可以操作
     * 具体逻辑是获取该进度条与上锁了的进度条的比较
     * 若返回 false，则表示可以操作，反之则表示不可以操作
     * @param {*} timeStampOfCompare 比较进度条
     */
    checkLockStatusByTimeStamp(timeStampOfCompare) {
        var progressBarOfLock;
        /** 当前生产线没有上锁 */
        if (this.idOfLock == CONST.STATUSOFLOCK.UNLOCK)
        {
            return true;
        }
        /** 当前生产线全部上锁 */
        else if (this.idOfLock == CONST.STATUSOFLOCK.LOCK)
        {
            var lengthOfProgressList = this.progressList.length;
            // 当前生产线没有进度条
            if (lengthOfProgressList == 0) {
                return true;
            } else {
                // 默认最后一条进度条作为比较
                progressBarOfLock = this.progressList[lengthOfProgressList-1];
            }
        }
        /** 部分解锁 */
        else {
            // 获取上锁的进度条
            progressBarOfLock = this.getProgressById(this.idOfLock);
        }
        // 比较时间戳
        if (progressBarOfLock.getStartTime >= timeStampOfCompare)
        {
            return false;
        }
        return true;
    }

    // 根据开始时间排序 计划列表
    sortProgressList() {
        var progressList = this.progressList.sort((a, b) => {
            return a.getStartTime - b.getStartTime;
        });
        this.progressList = progressList;
    }
}