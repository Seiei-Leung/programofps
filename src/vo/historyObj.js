import ProductLine from "./productLine";

// 历史记录对象
export default class HistoryObj {

    /**
     * 构造函数
     * @param {*} dataOfProductLineList 记录当前时间节点所有在生产线的进度条数据快照
     * @param {*} dataOfWaitingAddProgressList 记录当前时间节点所有待添加的进度条数据快照
     * @param {*} listOfDeleteProgressId 记录当前时间节点删除的进度条的ID列表
     */
    constructor(dataOfProductLineList, dataOfWaitingAddProgressList, listOfDeleteProgressId) {
        this.dataOfProductLineList = dataOfProductLineList;
        this.dataOfWaitingAddProgressList = null;
        this.listOfDeleteProgressId = listOfDeleteProgressId;
        this.isAddProgress = false; // 当前历史操作是否为：新增进度条
        if (dataOfWaitingAddProgressList != null) {
            this.dataOfWaitingAddProgressList = dataOfWaitingAddProgressList;
            this.isAddProgress = true;
        }
    }

    // 获取当前历史操作是否为：新增进度条
    get getIsAddProgress() {
        return this.isAddProgress;
    }

    // 获取当前节点所有在生产线的进度条数据快照
    get getDataOfProductLineList() {
        var dataOfProductLineList = [];
        this.dataOfProductLineList.forEach((item) => {
            dataOfProductLineList.push(item.copy());
        });
        return dataOfProductLineList;
    }

    // 获取当前节点所有待添加的进度条数据快照
    get getDataOfWaitingAddProgressList() {
        var dataOfWaitingAddProgressList = [...this.dataOfWaitingAddProgressList];
        return dataOfWaitingAddProgressList;
    }

    // 获取当前节点所有删除的进度条的ID列表
    get getListOfDeleteProgressId() {
        if (this.listOfDeleteProgressId == null) {
            return [];
        }
        return [...this.listOfDeleteProgressId];
    }

    /**
     * 设置待排产信息
     * @param {*} dataOfWaitingAddProgressList 
     */
     setDataOfWaitingAddProgressList(dataOfWaitingAddProgressList) {
        if (dataOfWaitingAddProgressList != null) {
            this.dataOfWaitingAddProgressList = dataOfWaitingAddProgressList;
            this.isAddProgress = true;
        }
    }

    // 复制当前对象
    copy() {
        var dataOfProductLineList = [];
        this.dataOfProductLineList.forEach((item) => {
            dataOfProductLineList.push(item.copy());
        });
        var dataOfWaitingAddProgressListForCopy = [...this.dataOfWaitingAddProgressList];
        var listOfDeleteProgressIdForCopy = [...this.listOfDeleteProgressId];
        var historyObj = new HistoryObj(dataOfProductLineList, dataOfWaitingAddProgressListForCopy, listOfDeleteProgressIdForCopy);
        return historyObj;
    }
}