// 计划颜色设定对象
export default class ColorSetting {
    constructor(defaultColor, defaultAdvanceColor, defaultDelayColor, advanceColor, advanceDaynum, delayColor, delayDaynum, unlockColor) {
        this.defaultColor = defaultColor; // 默认颜色
        this.defaultAdvanceColor = defaultAdvanceColor; // 默认提前颜色
        this.defaultDelayColor = defaultDelayColor; // 默认推迟颜色
        this.advanceColor = advanceColor; // 提前 advanceDaynum 天数时的颜色
        this.advanceDaynum = advanceDaynum; // 提前天数
        this.delayColor = delayColor; // 推迟 delayDaynum 天数时的颜色
        this.delayDaynum = delayDaynum; // 推迟天数
        this.unlockColor = unlockColor; // 解锁计划的边框颜色
    }

    /**
     * 根据 离货期天数 获取用户设定的颜色
     * @param {*} dayNumOfRemain 离货期天数
     */
    getColor(dayNumOfRemain) {
        // 时间刚刚好，不提前也不推迟
        if (dayNumOfRemain == 0) {
            return this.defaultColor;
        }
        /**
         * 时间推迟
         */
        if (dayNumOfRemain < 0) {
            // 默认推迟颜色
            var color = this.defaultDelayColor;
            // 超过推迟天数时，设置的推迟颜色
            if (Math.abs(dayNumOfRemain) >= this.delayDaynum) {
                color = this.delayColor;
            }
            return color;
        }
        /**
         * 时间提前
         */
        if (dayNumOfRemain > 0) {
            // 默认提前颜色
            var color = this.advanceColor;
            // 超过提前天数时，设置的提前颜色
            if (dayNumOfRemain >= this.advanceDaynum) {
                color = this.advanceColor;
            }
            return color;
        }
    }

    // 获取解锁时边框
    get getUnLockColor() {
        return this.unlockColor;
    }

}