// 参数设置
export default class ArgumentSetting {
    constructor(afterMinusorchangeefficiencyHasremovegapmodel) {
        this.afterMinusorchangeefficiencyHasremovegapmodel = afterMinusorchangeefficiencyHasremovegapmodel; // 减数，修改效率后是否自动消除时间空隙
    }

    // 获取 减数，修改效率后是否自动消除时间空隙
    get getIsRemoveGapModelAfterMinusOrChangeEfficiency() {
        return this.afterMinusorchangeefficiencyHasremovegapmodel;
    }
}