// 生产线
export default class ProductLine {

    constructor(id, name, productIndex, progressBarList) {
        this.name = name;
        this.progressBarList = progressBarList;
    }

    static get name() {
        return this.name;
    }

    static get progressBarList() {
        return this.progressBarList;
    }

}