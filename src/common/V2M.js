import DateUtil from "./dateUtil";
import CONST from "./const";

// 数据模型转化为视图数据
export default class V2M {

    /*
        参数：生产线列表
    */
    constructor(productLineList) {
        this.productLineList = productLineList;
    }

    // 纵坐标返回生产线列表索引
    yToProductLineIndex(y) {
        var index = Math.ceil(y / (CONST.STYLEOFCELL.height + 2*CONST.STYLEOFCELL.lineWidth));
        var length = this.productLineList.length;
        if (length >= index) {
            return index;
        } else {
            return length - 1;
        }
    }

    // 纵坐标返回生产线
    yToProductLine(y) {
        return this.productLineList[this.yToProductLineIndex(y)];
    }

    // 横坐标返回日期
    xToTimeStamp(x) {
        var firstTimeStamp = DateUtil.firstTimeStampOfShow;
        var index = Math.floor(x / (CONST.STYLEOFCELL.width + 2*CONST.STYLEOFCELL.lineWidth));
        console.log(firstTimeStamp);
        return firstTimeStamp + index * DateUtil.timeStampOfOneDay;
    }

}