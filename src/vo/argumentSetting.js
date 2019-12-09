// 参数设置
export default class ArgumentSetting {
    constructor(afterMinusHasamend, afterMinusorchangeefficiencyHasremovegapmodel) {
        this.afterMinusHasamend = afterMinusHasamend; // 减数后是否顺延
        this.afterMinusorchangeefficiencyHasremovegapmodel = afterMinusorchangeefficiencyHasremovegapmodel; // 减数，修改效率后是否自动消除时间空隙
    }

    // 获取 减数，修改效率后是否自动消除时间空隙
    get getIsRemoveGapModelAfterMinusOrChangeEfficiency() {
        return this.afterMinusorchangeefficiencyHasremovegapmodel;
    }

    // 获取 减数后是否顺延
    get getAfterMinusHasamend() {
        return this.afterMinusHasamend;
    }
}