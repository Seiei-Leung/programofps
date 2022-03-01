// 参数设置
export default class ArgumentSetting {
    constructor(afterMinusHasamend, afterMinusorchangeefficiencyHasremovegapmodel, peopleNum, workhours) {
        this.afterMinusHasamend = afterMinusHasamend; // 减数后是否顺延
        this.afterMinusorchangeefficiencyHasremovegapmodel = afterMinusorchangeefficiencyHasremovegapmodel; // 减数，修改效率后是否自动消除时间空隙
        this.workhours = workhours; // 计算排产推算开始期的每天工作时长
        this.peopleNum = peopleNum; // 计算排产推算开始期的生产线人数
    }

    // 获取 减数，修改效率后是否自动消除时间空隙
    get getIsRemoveGapModelAfterMinusOrChangeEfficiency() {
        return this.afterMinusorchangeefficiencyHasremovegapmodel;
    }

    // 获取 减数后是否顺延
    get getAfterMinusHasamend() {
        return this.afterMinusHasamend;
    }

    // 计算排产推算开始期的生产线人数
    get getPeopleNum() {
        return this.peopleNum;
    }

    // 计算排产推算开始期的每天工作时长
    get getWorkhours() {
        return this.workhours;
    }
}