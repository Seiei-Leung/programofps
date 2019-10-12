import DateUtil from "./dateUtil";
import CONST from "./const";

export default class M2V {

    /*
        参数：生产线列表
    */
    constructor() {
    }

    // 开始时间戳转为 x 坐标
    static btimeToX(timeStamp) {
        var firstTimeStamp = DateUtil.firstTimeStampOfShow;
        var timeStampTmpl = timeStamp - firstTimeStamp;
        var dayCount =  Math.floor(timeStampTmpl / DateUtil.timeStampOfOneDay);
        return (dayCount*(CONST.STYLEOFCELL.width + 2*CONST.STYLEOFCELL.lineWidth) + ((CONST.STYLEOFCELL.width + 2*CONST.STYLEOFCELL.lineWidth) / 2)) + CONST.STYLEOFPROGRESSBAR.lineWidth;
    }

    // 需要天数转为 宽度
    static dayCountToWidth(dayCount) {
        return (dayCount*CONST.STYLEOFCELL.width + (dayCount - 1)*2*CONST.STYLEOFCELL.lineWidth + CONST.STYLEOFPROGRESSBAR.lineWidth);
    }

    // 生产线索引转为 y 坐标
    static productLineIndexToY(productLineIndex) {
        var top = productLineIndex * (CONST.STYLEOFCELL.height + 2*CONST.STYLEOFCELL.lineWidth);
        return (top + CONST.STYLEOFPROGRESSBAR.top);
    }


}