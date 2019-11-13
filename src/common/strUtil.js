// 字符串工具
export default class StrUtil {
    
    constructor() {

    }

    /**
     * 数字添加 “px”
     * @param {*} str 数字
     */
    static takeOffPX(str) {
        return str.split("px")[0];
    }

    /**
     * 小数转化为百分比
     * @param {*} decimal 小数
     */
    static decimalToPercent(decimal) {
        return Math.floor(decimal*100) + "%";
    }

}