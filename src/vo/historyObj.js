import ProductLine from "./productLine";

export default class HistoryObj {

    /**
     * 
     * @param {*} dataOfProductLineList 
     * @param {*} dataOfWaitingAddProgressList 
     */
    constructor(dataOfProductLineList, dataOfWaitingAddProgressList) {
        this.dataOfProductLineList = dataOfProductLineList;
        this.dataOfWaitingAddProgressList = null;
        this.isAddProgress = false;
        if (dataOfWaitingAddProgressList != null) {
            this.dataOfWaitingAddProgressList = dataOfWaitingAddProgressList;
            this.isAddProgress = true;
        }
    }

    get getIsAddProgress() {
        return this.isAddProgress;
    }

    get getDataOfProductLineList() {
        var dataOfProductLineList = [];
        this.dataOfProductLineList.forEach((item) => {
            dataOfProductLineList.push(item.copy());
        });
        return dataOfProductLineList;
    }

    get getDataOfWaitingAddProgressList() {
        var dataOfWaitingAddProgressList = [...this.dataOfWaitingAddProgressList];
        return dataOfWaitingAddProgressList;
    }

    copy() {
        var dataOfProductLineList = [];
        this.dataOfProductLineList.forEach((item) => {
            dataOfProductLineList.push(item.copy());
        });
        var dataOfWaitingAddProgressList = [...dataOfProductLineList];
        var historyObj = new HistoryObj(dataOfProductLineList, dataOfWaitingAddProgressList);
        return historyObj;
    }
}