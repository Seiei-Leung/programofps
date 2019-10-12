// 字符串工具
export default class StrUtil {
    
    constructor() {

    }

    // 数字添加 px
    static takeOffPX(str) {
        return str.split("px")[0];
    }

    // 小数转化为百分比，如 90%
    static decimalToPercent(decimal) {
        return (decimal*100) + "%";
    }

}