import DateUtil from "../common/dateUtil";
import CONST from "../common/const";
import M2V from "../common/M2V";
import StrUtil from "../common/strUtil";
import Const from "../common/const";

// 进度条类
export default class ProgressBar {

    constructor(productLineIndex, productionLineId, msgOfProgressBar) {
        this.productLineIndex = productLineIndex; // 所在生产线索引
        this.productionLineId = productionLineId; // 所在生产线生产线ID
        this.id = msgOfProgressBar.id; // 进度条 ID
        this.qtyFinish = msgOfProgressBar.qtyFinish; // 完成数量
        this.sam = msgOfProgressBar.sam; // sam
        this.qtyofbatcheddelivery = msgOfProgressBar.qtyofbatcheddelivery; // 计划数量
        this.efficiencyOfClass = msgOfProgressBar.efficiencyOfClass; // 产品效率
        this.productStyleName = msgOfProgressBar.productStyleName; // 品类
        this.startTime = msgOfProgressBar.startTime; // 开始时间
        this.endTime = msgOfProgressBar.endTime; // 结束时间
        this.efficiencyBySetting = msgOfProgressBar.efficiencyBySetting; // 自选效率
        this.msgOfProgressBar = msgOfProgressBar; // 排产进度条详情
        this.parentId = null; // 原拆单的进度条 ID
    }

    // 获取 进度条 Id
    get getId() {
        return this.id;
    }

    // 获取 原拆单的进度条 ID
    get getParentId() {
        if (this.parentId != null) {
            return this.parentId;
        }
        return false;
    }

    // 获取 完成数量
    get getQtyFinish() {
        return this.qtyFinish;
    }

    // 获取 计划数量
    get getQtyofbatcheddelivery() {
        return this.qtyofbatcheddelivery;
    }

    // 获取所在生产线的 id
    get geProductLineId() {
        return this.productionLineId;
    }

    // 获取产品类名
    get getProductStyleName() {
        return this.productStyleName;
    }

    // 返回产品效率
    get getEfficiencyOfClass() {
        return this.efficiencyOfClass;
    }

    /**
     * 获取该进度条在指定生产线时的效率
     * @param {*} productLine 生产线对象
     */
    getEfficiencyOfSource(productLine) {
        var effficiencyOfProductionLine = productLine.getEfficiency(this.productStyleName);
        if (effficiencyOfProductionLine == null) {
            return null;
        }
        return this.efficiencyOfClass*effficiencyOfProductionLine;
    }

    // 获取自选效率
    get getEfficiencyOfSetting() {
        if (this.efficiencyBySetting == null) {
            return 0;
        }
        return this.efficiencyBySetting;
    }

    /**
     * 设置自选效率
     * @param {*} efficiencyOfSetting 
     */
    setEfficiencyOfSetting(efficiencyOfSetting) {
        this.efficiencyBySetting = efficiencyOfSetting;
    }

    /**
     * 用于计算公式时，所用到的真实效率
     * @param {*} productLine 生产线对象
     */
    getEfficiency(productLine) {
        // 优先选择自选效率
        if (this.getEfficiencyOfSetting != 0) {
            return this.getEfficiencyOfSetting;
        } 
        return this.getEfficiencyOfSource(productLine);
    }

    /**
     * 获取日产
     * @param {*} productLine 所在生产线对象
     * @param {*} startTime 排产条开始时间
     */
    getDailyMaking(productLine, startTime) {
        var efficiency = this.getEfficiencyOfSource(productLine);
        if (efficiency == null) {
            return null;
        }
        var peopleNum = productLine.getPeopleNumByDate(startTime);
        var workHours = productLine.getWorkHoursByDate(startTime);
        return (peopleNum * workHours * efficiency * 60)/this.sam;
    }

    /**
     * 获取自选日产
     * @param {*} startTime 开始时间 
     */
    getDailyMakingOfSetting(productLine, startTime) {
        var efficiency = this.getEfficiencyOfSetting;
        var peopleNum = productLine.getPeopleNumByDate(startTime);
        var workHours = productLine.getWorkHoursByDate(startTime);
        return (peopleNum * workHours * efficiency * 60)/this.sam;
    }

    // 获取开启时间
    get getStartTime() {
        return this.startTime;
    }

    // 获取结束时间
    get getEndTime() {
        return this.endTime;
    }

    // 获取进度条所在生产线的索引
    get getProductLineIndex() {
        return this.productLineIndex;
    }

    // 获取详情信息
    get getMsgOfProgressBar() {
        // 修正数据
        this.msgOfProgressBar.qtyFinish = this.qtyFinish;
        this.msgOfProgressBar.qtyofbatcheddelivery = this.qtyofbatcheddelivery;
        this.msgOfProgressBar.startTime = this.startTime;
        this.msgOfProgressBar.endTime = this.endTime;
        this.msgOfProgressBar.efficiencyBySetting = this.efficiencyBySetting;
        this.msgOfProgressBar.productLineIndex = this.productLineIndex;
        this.msgOfProgressBar.productionLineId = this.productionLineId;
        return this.msgOfProgressBar;
    }

    // 获取工作量百分比
    get getPercentOfQuantityOfWork() {
        /* console.log(this.qtyFinish + "/" + this.qtyofbatcheddelivery); */
        return Math.floor((this.qtyFinish / this.qtyofbatcheddelivery)*100) / 100;
    }

    // 获取 css 样式
    get msgOfCSS() {
        return {
            width: M2V.differenceTimeStampToWidth(this.startTime, this.endTime),
            top: M2V.productLineIndexToY(this.productLineIndex),
            left: M2V.timeStampToX(this.startTime),
        }
    }

    /**
     * 获取离货期天数
     */
    get dayNumOfRemain() {
        // console.log(this.msgOfProgressBar.deliveryoffactoryTime + "-" + this.endTime + "-" + this.msgOfProgressBar.backpartDaynum + "*" + DateUtil.timeStampOfOneDay);
        var backpartDaynum = this.msgOfProgressBar.backpartDaynum ? this.msgOfProgressBar.backpartDaynum : 0; // 后整天数
        var timeStamp = this.msgOfProgressBar.deliveryoffactoryTime - this.endTime - backpartDaynum*DateUtil.timeStampOfOneDay;
        var isMinus = timeStamp < 0 ? true : false;
        if (isMinus) {
            timeStamp = Math.abs(timeStamp);
        }
        var dayCount = Math.ceil(timeStamp/DateUtil.timeStampOfOneDay);
        if (isMinus) {
            dayCount = Number(-dayCount);
        }
        return dayCount;
    }
    
    /**
     * 设置原拆单的进度条 ID
     * @param {*} parentId 
     */
    setParentId(parentId) {
        this.parentId = parentId;
    }

    /**
     * 重设计划数量
     * @param {*} productLine 
     * @param {*} factoryCalendar 
     * @param {*} qtyofbatcheddelivery 
     */
    setQtyofbatcheddelivery(productLine, factoryCalendar, qtyofbatcheddelivery) {
        this.qtyofbatcheddelivery = qtyofbatcheddelivery;
        this.setEndTime(productLine, factoryCalendar, this.startTime);
    }

    /**
     * 重置进度条的生产线、工厂日历属性、开始时间，从而更新数据
     * @param {*} productLine 生产线实例
     * @param {*} factoryCalendar 工厂日历实例
     * @param {*} startTime 开始时间
     */
    reload(productLine, factoryCalendar, startTime) {
        this.startTime = startTime;
        this.setEndTime(productLine, factoryCalendar, startTime);
        this.productionLineId = productLine.getId;
        this.productLineIndex = productLine.getIndex;
    }

    /**
     * 重置进度条的生产线、工厂日历属性，开始时间，从而更新数据，但不更新开始时间
     * @param {*} productLine  生产线实例
     * @param {*} factoryCalendar 工厂日历实例
     * @param {*} startTime 结算设置的开始时间，并非进度条的实际开始时间
     */
    reloadWithOutSettingStartTime(productLine, factoryCalendar, startTime) {
        this.setEndTime(productLine, factoryCalendar, startTime);
        this.productionLineId = productLine.getId;
        this.productLineIndex = productLine.getIndex;
    }

    /**
     * 给予进度条的生产线、工厂日历属性、开始时间，从而更新结束时间
     * @param {*} productLine 
     * @param {*} factoryCalendar 
     * @param {*} startTime 
     */
    setEndTime(productLine, factoryCalendar, startTime) {
        var efficiency = this.getEfficiency(productLine);
        if (efficiency == null) {
            return null;
        }
        var peopleNum = productLine.getPeopleNumByDate(startTime);
        var workHours = productLine.getWorkHoursByDate(startTime);
        // 需要天数
        var dayCount = ((this.qtyofbatcheddelivery - this.qtyFinish)*this.sam/60)/(efficiency*peopleNum*workHours);
        console.log("((" + this.qtyofbatcheddelivery + "-" + this.qtyFinish + ")*" + this.sam + "/60)/(" + efficiency + "*" + peopleNum + "*" + workHours + ") = " + dayCount);
        // 结合节假日，设置结束时间
        var endTime = startTime + Math.ceil(dayCount*DateUtil.timeStampOfOneDay);
        endTime = factoryCalendar.getEndTime(startTime, endTime);
        this.endTime = endTime;
    }

     /**
      * 减数功能
      * @param {*} productLine 生产线
      * @param {*} factoryCalendar 工作日历
      * @param {*} qtyFinish 完成数
      * @param {*} timeStampOfNow 设置时间的 0时0点0秒 的时间戳（当天）
      */
     minus(productLine, factoryCalendar, qtyFinish, timeStampOfNow) {
        var qtyOfUnFinish = this.qtyofbatcheddelivery - qtyFinish;
        this.qtyFinish = qtyFinish;
        // 排产已完成
        if (qtyOfUnFinish == 0) {
            // 当天时间比 排产设置开始时间 早
            if (timeStampOfNow < this.startTime) {
                this.endTime = this.startTime;
            } else {
                this.endTime = timeStampOfNow;
            }
        }
        // 排产还没有完成
        else {
            // 设置时间比排产开始时间要早
            if (timeStampOfNow <= this.startTime) {
                this.setEndTime(productLine, factoryCalendar, this.startTime);
            } else {
                this.setEndTime(productLine, factoryCalendar, timeStampOfNow);
            }
        }
    }

    /**
     * 给予 x,y 坐标，检测是否在该进度条范围内
     * @param {*} x x 坐标
     * @param {*} y y 坐标
     */
    isInArea(x, y) {
        // 检查 x 轴
        if (this.msgOfCSS.left <= x && x <= (this.msgOfCSS.width + this.msgOfCSS.left)) {
            // 检查 y 轴
            if (this.msgOfCSS.top <= y && y <= (this.msgOfCSS.top + CONST.STYLEOFPROGRESSBAR.height)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 复制 进度计划
     */
    copy() {
        var that = this;
        var msgOfProgressBar = {...this.msgOfProgressBar};
        msgOfProgressBar.qtyFinish = this.qtyFinish; // 完成数量
        msgOfProgressBar.qtyofbatcheddelivery = this.qtyofbatcheddelivery; // 计划数量
        msgOfProgressBar.startTime = this.startTime; // 开始时间
        msgOfProgressBar.endTime = this.endTime; // 结束时间
        msgOfProgressBar.efficiencyBySetting = this.efficiencyBySetting; // 自选效率
        var progressBar = new ProgressBar(
            that.productLineIndex,
            that.productionLineId,
            msgOfProgressBar
        );
        return progressBar;
    }

    /**
     * 在画布中渲染进度条
     * @param {*} ctx 画布的上下文
     * @param {*} colorSetting 颜色设置
     * @param {*} isHeigher 是否需要上移
     * @param {*} isLock 是否解锁
     * @param {*} isActived 是否被选中
     */
    render(ctx, colorSetting, isHeigher, isLock, isActived) {
        ctx.save();
        var msgOfCSS = this.msgOfCSS;
        ctx.lineWidth = CONST.STYLEOFPROGRESSBAR.lineWidth; //设置线的宽度
        if (isLock) {
            ctx.strokeStyle = '#000';
        } else {
            ctx.strokeStyle = colorSetting.getUnLockColor;
        }
        if (isActived) {
            ctx.strokeStyle = colorSetting.getSelectedColor;
        }
        var width = msgOfCSS.width;
        if (msgOfCSS.width < 1) {
            width = 1;
        }
        /**
         * 移动画布
         */
        // 如果没有重叠
        if (!isHeigher) {
            ctx.translate(msgOfCSS.left + 0.5, msgOfCSS.top + 0.5);
        } else {
            ctx.translate(msgOfCSS.left + 0.5, msgOfCSS.top + 0.5 - CONST.STYLEOFPROGRESSBAR.top);
        }
        // 渲染进度框
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(width, 0);
        ctx.lineTo(width, CONST.STYLEOFPROGRESSBAR.height);
        ctx.lineTo(0, CONST.STYLEOFPROGRESSBAR.height);
        ctx.lineTo(0, 0);
        ctx.stroke();
        ctx.closePath();
        // 渲染白色背景
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, width, CONST.STYLEOFPROGRESSBAR.height);
        // 渲染百分比进度条
        ctx.fillStyle = "#ddd";
        ctx.fillRect(0.5, CONST.STYLEOFPROGRESSBAR.height/2 - 0.5, width-1, CONST.STYLEOFPROGRESSBAR.height/2);
        ctx.fillStyle = "#3bbf67";
        ctx.fillRect(0.5, CONST.STYLEOFPROGRESSBAR.height/2 - 0.5, width*this.getPercentOfQuantityOfWork-1, CONST.STYLEOFPROGRESSBAR.height/2);
        // 渲染颜色设置
        ctx.fillStyle = colorSetting.getColor(this.dayNumOfRemain);
        ctx.fillRect(0.5, CONST.STYLEOFPROGRESSBAR.height - 2*CONST.STYLEOFPROGRESSBAR.lineWidth,  width-1, CONST.STYLEOFPROGRESSBAR.lineWidth*2);
        // 渲染百分比文本
        ctx.fillStyle = "#fff";
        ctx.font =  CONST.STYLEOFPROGRESSBAR.fontStyle;
        ctx.textBaseline = "top";
        ctx.fillText(StrUtil.decimalToPercent(this.getPercentOfQuantityOfWork), CONST.STYLEOFPROGRESSBAR.paddingLeft, CONST.STYLEOFPROGRESSBAR.height/2+Const.STYLEOFPROGRESSBAR.lineWidth, (width - 2*CONST.STYLEOFPROGRESSBAR.paddingLeft));
        // 渲染制单号文本
        ctx.fillStyle = "#444";
        ctx.fillText(this.msgOfProgressBar.orderno, CONST.STYLEOFPROGRESSBAR.paddingLeft, CONST.STYLEOFPROGRESSBAR.lineWidth, (width - 2*CONST.STYLEOFPROGRESSBAR.paddingLeft));
        // 渲染离货期天数
        ctx.fillStyle = "rgba(237, 64, 20, 0.8)";
        var text = ctx.measureText(this.dayNumOfRemain); // 获取文本渲染对象
        var textWidth = text.width; // 获取文本的渲染长度
        if (width > textWidth + CONST.STYLEOFPROGRESSBAR.paddingLeft) {
            ctx.fillText(this.dayNumOfRemain, width - textWidth - CONST.STYLEOFPROGRESSBAR.paddingLeft, CONST.STYLEOFPROGRESSBAR.height/2+Const.STYLEOFPROGRESSBAR.lineWidth);
        }
        ctx.restore();
    }

    /**
     * 在画布中清空进度条的渲染
     * @param {*} ctx 画布上下文
     */
    clear(ctx) {
        var msgOfCSS = this.msgOfCSS;
        ctx.save();
        ctx.translate(msgOfCSS.left, msgOfCSS.top);
        ctx.clearRect(0, 0, msgOfCSS.width + 2*CONST.STYLEOFPROGRESSBAR.lineWidth, CONST.STYLEOFPROGRESSBAR.height + 2*CONST.STYLEOFPROGRESSBAR.lineWidth);
        ctx.restore();
    }

    /**
     * 在画布中的移动渲染
     * @param {*} ctx 画布上下文
     * @param {*} x x 坐标
     * @param {*} y y 坐标
     */
    move(ctx, x, y) {
        var msgOfCSS = {};
        // 如果是新增的进度条，则没有开始时间和结束时间
        if (this.msgOfCSS.width == 0) {
            msgOfCSS.width = 5*CONST.STYLEOFCELL.width;
        } else {
            msgOfCSS = this.msgOfCSS;
        }
        // 清除图层
        ctx.save();
        ctx.clearRect(0, 0, ctx.canvas.offsetWidth, ctx.canvas.offsetHeight);
        ctx.lineWidth = CONST.STYLEOFPROGRESSBAR.lineWidth; //设置线的宽度
        ctx.strokeStyle = '#000';
        ctx.translate(x + 0.5, y + 0.5);
        ctx.beginPath(); // 需要重启一个路径，不然还是原来的，路径信息会先保存在内存里面
        ctx.moveTo(0, 0);
        ctx.lineTo(msgOfCSS.width, 0);
        ctx.lineTo(msgOfCSS.width, CONST.STYLEOFPROGRESSBAR.height);
        ctx.lineTo(0, CONST.STYLEOFPROGRESSBAR.height);
        ctx.lineTo(0, 0);
        ctx.stroke();
        ctx.closePath();
        // 渲染白色背景
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, msgOfCSS.width, CONST.STYLEOFPROGRESSBAR.height);
        // 渲染百分比
        ctx.fillStyle = "#ddd";
        ctx.fillRect(0, CONST.STYLEOFPROGRESSBAR.height/2 - 0.5, msgOfCSS.width, CONST.STYLEOFPROGRESSBAR.height/2);
        ctx.fillStyle = "#3bbf67";
        ctx.fillRect(0, CONST.STYLEOFPROGRESSBAR.height/2 - 0.5, msgOfCSS.width*this.getPercentOfQuantityOfWork, CONST.STYLEOFPROGRESSBAR.height/2);
        ctx.fillStyle = "#fff";
        ctx.font =  CONST.STYLEOFPROGRESSBAR.fontStyle;
        ctx.textBaseline = "top";
        ctx.fillText(StrUtil.decimalToPercent(this.getPercentOfQuantityOfWork), CONST.STYLEOFPROGRESSBAR.paddingLeft, CONST.STYLEOFPROGRESSBAR.height/2+Const.STYLEOFPROGRESSBAR.lineWidth, (msgOfCSS.width - 2*CONST.STYLEOFPROGRESSBAR.paddingLeft))
        // 渲染制单号文本
        ctx.fillStyle = "#444";
        ctx.fillText(this.msgOfProgressBar.orderno, CONST.STYLEOFPROGRESSBAR.paddingLeft, CONST.STYLEOFPROGRESSBAR.lineWidth, (msgOfCSS.width - 2*CONST.STYLEOFPROGRESSBAR.paddingLeft));
        // 渲染剩余天数
        ctx.restore();
    }

    /**
     * 静态方法，用于比较两个进度条的关系
     * @param {*} progressBarOfLocal 本地进度条
     * @param {*} progressBarOfCompare 比较进度条
     */
    static getRelationByProgressBar(progressBarOfLocal, progressBarOfCompare) {
        // 比较进度条的 **开启时间** 与本地进度条的发生重叠
        if (progressBarOfLocal.getStartTime <= progressBarOfCompare.getStartTime && progressBarOfLocal.getEndTime >= progressBarOfCompare.getStartTime) {
            return "CLASH_STARTTIME";
        }
        // 比较进度条的 ** 结束时间 ** 与本地进度条发生重叠
        else if (progressBarOfLocal.getStartTime <= progressBarOfCompare.getEndTime && progressBarOfLocal.getStartTime >= progressBarOfCompare.getStartTime) {
            return "CLASH_ENDTIME";
        }
        // 不重叠，且本地进度条靠前 
        else if (progressBarOfLocal.getEndTime <= progressBarOfCompare.getStartTime) {
            return "NO_CLASH_LOCAL_EARLY";
        }
        // 不重叠，且比较进度条靠前
        else if (progressBarOfCompare.getEndTime <= progressBarOfLocal.getStartTime) {
            return "NO_CLASH_COMPARE_EARLY";
        }
    }

}