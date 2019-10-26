import DateUtil from "./dateUtil";
import CONST from "./const";

// 视图映射到数据模型
export default class V2M {
    
    constructor() {
    }

    /**
     * 纵坐标返回生产线列表索引
     * @param {*} productLineList 生产线列表 
     * @param {*} y y 坐标
     */
    static yToProductLineIndex(productLineList, y) {
        var index = Math.ceil(y / (CONST.STYLEOFCELL.height + 2*CONST.STYLEOFCELL.lineWidth));
        var length = productLineList.length;
        if (length >= index) {
            return index - 1;
        } else {
            return length - 1;
        }
    }

    /**
     * 纵坐标返回生产线
     * @param {*} productLineList 生产线列表 
     * @param {*} y y 坐标
     */
    static yToProductLine(productLineList, y) {
        return productLineList[V2M.yToProductLineIndex(productLineList, y)];
    }

    /**
     * 横坐标返回对应的日期
     * @param {*} x x 坐标
     */
    static xToTimeStamp(x) {
        var firstTimeStamp = DateUtil.firstTimeStampOfShow;
        var index = Math.floor(x / (CONST.STYLEOFCELL.width + 2*CONST.STYLEOFCELL.lineWidth));
        return firstTimeStamp + index * DateUtil.timeStampOfOneDay;
    }

}