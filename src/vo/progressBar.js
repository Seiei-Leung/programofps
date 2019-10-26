import DateUtil from "../common/dateUtil";
import CONST from "../common/const";
import M2V from "../common/M2V";
import StrUtil from "../common/strUtil";
import Const from "../common/const";

// 进度条类
export default class ProgressBar {

    constructor(productLineIndex, productionlineId, msgOfProgressBar) {
        this.productLineIndex = productLineIndex; // 所在生产线索引
        this.productionlineId = productionlineId; // 所在生产线生产线ID
        this.id = msgOfProgressBar.id; // 进度条 ID
        this.qtyFinish = msgOfProgressBar.qtyFinish; // 完成数量
        this.sam = msgOfProgressBar.sam; // sam
        this.qtyofbatcheddelivery = msgOfProgressBar.qtyofbatcheddelivery; // 计划数量
        this.efficiencyOfClass = msgOfProgressBar.efficiencyOfClass; // 产品效率
        this.productStyleName = msgOfProgressBar.productStyleName; // 品类
        this.startTime = msgOfProgressBar.startTime; // 开始时间
        this.endTime = msgOfProgressBar.endTime; // 结束时间
        this.msgOfProgressBar = msgOfProgressBar; // 排产进度条详情

        this.needWorkDayCount = null; // 在当前生产线内需要多少个工作日完成
    }

    // 获取 进度条 Id
    get getId() {
        return this.id;
    }

    // 获取产品类名
    get getProductStyleName() {
        return this.productStyleName;
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
        return this.msgOfProgressBar;
    }

    // 获取工作量百分比
    get getPercentOfQuantityOfWork() {
        /* console.log(this.qtyFinish + "/" + this.qtyofbatcheddelivery); */
        return Number((this.qtyFinish / this.qtyofbatcheddelivery).toFixed(2));
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
     * 重置进度条的生产线、工厂日历属性、开始时间，从而更新数据
     * @param {*} productLine 生产线实例
     * @param {*} factoryCalendar 工厂日历实例
     * @param {*} startTime 开始时间
     */
    reload(productLine, factoryCalendar, startTime) {
        this.startTime = startTime;
        this.setEndTime(productLine, factoryCalendar, startTime);
        this.productionlineId = productLine.getId;
        this.productLineIndex = productLine.getIndex;
    }

    /**
     * 给予进度条的生产线、工厂日历属性、开始时间，从而更新结束时间
     * @param {*} productLine 
     * @param {*} factoryCalendar 
     * @param {*} startTime 
     */
    setEndTime(productLine, factoryCalendar, startTime) {
        var effficiencyOfProductionLine = productLine.getEfficiency(this.productStyleName);
        if (effficiencyOfProductionLine == null) {
            return null;
        }
        var peopleNum = productLine.getPeopleNumByDate(startTime);
        var workHours = productLine.getWorkHoursByDate(startTime);
        // 需要天数
        var dayCount = (this.efficiencyOfClass*((this.qtyofbatcheddelivery - this.qtyFinish)*this.sam/60)*effficiencyOfProductionLine)/(peopleNum*workHours);
        console.log("(" + this.efficiencyOfClass + "*((" + this.qtyofbatcheddelivery + "-" + this.qtyFinish + ")*" + this.sam + "/60)*" + effficiencyOfProductionLine + ")/(" + peopleNum + "*" + workHours + ") = " + dayCount);
        // 结合节假日，设置结束时间
        var endTime = startTime + Math.ceil(dayCount*DateUtil.timeStampOfOneDay);
        endTime = factoryCalendar.getEndTime(startTime, endTime);
        this.endTime = endTime;
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
     * 在画布中渲染进度条
     * @param {*} ctx 画布的上下文
     */
    render(ctx) {
        ctx.save();
        var msgOfCSS = this.msgOfCSS;
        ctx.lineWidth = CONST.STYLEOFPROGRESSBAR.lineWidth; //设置线的宽度
        ctx.strokeStyle = '#000';
        var width = msgOfCSS.width;
        if (msgOfCSS.width < 1) {
            width = 1;
        }
        // 移动画布
        ctx.translate(msgOfCSS.left + 0.5, msgOfCSS.top + 0.5);
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
        // 渲染百分比
        ctx.fillStyle = "#ddd";
        ctx.fillRect(0, CONST.STYLEOFPROGRESSBAR.height/2 - 0.5, width, CONST.STYLEOFPROGRESSBAR.height/2);
        ctx.fillStyle = "#3bbf67";
        ctx.fillRect(0, CONST.STYLEOFPROGRESSBAR.height/2 - 0.5, width*this.getPercentOfQuantityOfWork, CONST.STYLEOFPROGRESSBAR.height/2);
        ctx.fillStyle = "#fff";
        ctx.font =  CONST.STYLEOFPROGRESSBAR.fontStyle;
        ctx.textBaseline = "top";
        ctx.fillText(StrUtil.decimalToPercent(this.getPercentOfQuantityOfWork), CONST.STYLEOFPROGRESSBAR.paddingLeft, CONST.STYLEOFPROGRESSBAR.height/2+Const.STYLEOFPROGRESSBAR.lineWidth, (width - 2*CONST.STYLEOFPROGRESSBAR.paddingLeft));
        // 渲染制单号文本
        ctx.fillStyle = "#444";
        ctx.fillText(this.msgOfProgressBar.orderno, CONST.STYLEOFPROGRESSBAR.paddingLeft, CONST.STYLEOFPROGRESSBAR.lineWidth, (width - 2*CONST.STYLEOFPROGRESSBAR.paddingLeft));
        ctx.restore();
        /* ctx.strokeRect(msgOfCSS.left + 0.5, msgOfCSS.top + 0.5, width, CONST.STYLEOFPROGRESSBAR.height); */
        /* console.log(msgOfCSS.top + "," + msgOfCSS.left + "," + width + "," + CONST.STYLEOFPROGRESSBAR.height); */
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