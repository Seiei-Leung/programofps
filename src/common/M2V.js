import DateUtil from "./dateUtil";
import CONST from "./const";

// 数据模型映射视图
export default class M2V {

    constructor() {
    }

    /**
     * 时间戳转化为 x 坐标
     * @param {*} timeStamp 时间戳 
     */
    static timeStampToX(timeStamp) {
        var firstTimeStamp = DateUtil.firstTimeStampOfShow;
        var timeStampTmpl = timeStamp - firstTimeStamp;
        var dayCount =  Math.floor(timeStampTmpl / DateUtil.timeStampOfOneDay);
        var residueTimeStamp = timeStampTmpl - dayCount*DateUtil.timeStampOfOneDay; // 剩余的时间戳
        var percent = Number((residueTimeStamp / DateUtil.timeStampOfOneDay).toFixed(1)); // 剩余的时间戳占一天的百分比
        return Math.floor(dayCount*(CONST.STYLEOFCELL.width + 2*CONST.STYLEOFCELL.lineWidth) + percent*CONST.STYLEOFCELL.width);
    }

    /**
     * 两个时间戳之间的差值转为 宽度
     * @param {*} startTime 开始时间戳
     * @param {*} endTime 结束时间戳
     */
    static differenceTimeStampToWidth(startTime, endTime) {
        return M2V.timeStampToX(endTime) - M2V.timeStampToX(startTime);
    }
    
    /**
     * 排产进度条通过生产线索引转为 y 坐标
     * @param {*} productLineIndex 生产线索引
     */
    static productLineIndexToY(productLineIndex) {
        var top = productLineIndex * (CONST.STYLEOFCELL.height + 2*CONST.STYLEOFCELL.lineWidth);
        return (top + CONST.STYLEOFPROGRESSBAR.top);
    }


}