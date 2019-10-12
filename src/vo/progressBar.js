import DateUtil from "../common/dateUtil";
import CONST from "../common/const";
import M2V from "../common/M2V";
import StrUtil from "../common/strUtil";
import Const from "../common/const";

// 进度条类
export default class ProgressBar {

    constructor(productLineIndex, orderNo, btime, etime, quantityOfWork, hadDoneQuantityOfWork) {
        this.productLineIndex = productLineIndex; // 所在生产线索引
        this.orderNo = orderNo; // 制单号
        this.btime = btime; // 开启日期
        this.etime = etime; // 完工日期
        this.quantityOfWork = quantityOfWork; // 工作总量
        this.hadDoneQuantityOfWork = hadDoneQuantityOfWork; // 已经完成数量
        
    }

    // 重新设定




    // 获取工作量百分比
    get getPercentOfQuantityOfWork() {
        return (this.hadDoneQuantityOfWork / this.quantityOfWork).toFixed(2);
    }

    // 根据不同的输出线指定最后完工日期
    getEtimeByProductLine() {

    }

    // 根据不同的生产线制定所需天数
    getRequiredDayCount() {

    }

    // 获取总天数
    get getDayCount() {
        return DateUtil.timeStampsToDayCount(this.btime, this.etime);
    }

    // 是否点击
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

    // css 样式
    get msgOfCSS() {
        return {
            width: M2V.dayCountToWidth(this.getDayCount),
            top: M2V.productLineIndexToY(this.productLineIndex),
            left: M2V.btimeToX(this.btime),
        }
    }

    // 渲染图形
    render(ctx) {
        ctx.save();
        var msgOfCSS = this.msgOfCSS;
        ctx.lineWidth = CONST.STYLEOFPROGRESSBAR.lineWidth; //设置线的宽度
        ctx.strokeStyle = '#000';
        // 移动画布
        ctx.translate(msgOfCSS.left + 0.5, msgOfCSS.top + 0.5);
        // 渲染进度框
        ctx.beginPath();
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
        ctx.fillText(StrUtil.decimalToPercent(this.getPercentOfQuantityOfWork), msgOfCSS.width*this.getPercentOfQuantityOfWork/2, CONST.STYLEOFPROGRESSBAR.height/2+Const.STYLEOFPROGRESSBAR.lineWidth)
        // 渲染制单号文本
        ctx.fillStyle = "#444";
        ctx.fillText(this.orderNo, msgOfCSS.width/2, CONST.STYLEOFPROGRESSBAR.lineWidth);
        ctx.restore();
        /* ctx.strokeRect(msgOfCSS.left + 0.5, msgOfCSS.top + 0.5, msgOfCSS.width, CONST.STYLEOFPROGRESSBAR.height); */
        /* console.log(msgOfCSS.top + "," + msgOfCSS.left + "," + msgOfCSS.width + "," + CONST.STYLEOFPROGRESSBAR.height); */
    }

    // 清空渲染
    clear(ctx) {
        var msgOfCSS = this.msgOfCSS;
        ctx.save();
        ctx.translate(msgOfCSS.left, msgOfCSS.top);
        ctx.clearRect(0, 0, msgOfCSS.width + CONST.STYLEOFPROGRESSBAR.lineWidth, CONST.STYLEOFPROGRESSBAR.height + CONST.STYLEOFPROGRESSBAR.lineWidth);
        ctx.restore();
    }

    // 在图层中移动渲染
    move(ctx, x, y) {
        // 清除图层
        ctx.save();
        ctx.clearRect(0, 0, ctx.canvas.offsetWidth, ctx.canvas.offsetHeight);
        var msgOfCSS = this.msgOfCSS;
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
        ctx.fillText(StrUtil.decimalToPercent(this.getPercentOfQuantityOfWork), msgOfCSS.width*this.getPercentOfQuantityOfWork/2, CONST.STYLEOFPROGRESSBAR.height/2+Const.STYLEOFPROGRESSBAR.lineWidth)
        // 渲染制单号文本
        ctx.fillStyle = "#444";
        ctx.fillText(this.orderNo, msgOfCSS.width/2, CONST.STYLEOFPROGRESSBAR.lineWidth);
        ctx.restore();
        ctx.restore();
    }

}