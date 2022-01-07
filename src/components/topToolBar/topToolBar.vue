<template>
    <div class="topToolBar-component zIndexSuperTop">
        <!-- 编辑工具栏 -->
        <div class="item item1" @click="historyBack">撤回 <Icon type="ios-rewind" /></div>
        <div class="item item2" @click="historyRemake">重做 <Icon type="ios-fastforward" /></div>
        <div class="item" @click="submitBtn">保存 <Icon type="md-cloud-upload" /></div>
        <div class="item" @click="refreshPage">刷新 <Icon type="md-refresh" /></div>
        <div class="item item3" @click="showWindowOfAddProgress" v-if="isReadyShowWindowOfAddProgress">添加排产 <Icon type="ios-add-circle-outline" /></div>
        <div class="item5" v-if="!isReadyShowWindowOfAddProgress">正在加载待排产信息列表 <Icon type="ios-add-circle-outline" /></div>
        <div class="itemOfSelect">
            <Select v-model="smartMode" filterable placeholder="请选择排产方案">
                <Option v-for="item in smartModeList" :value="item.value" :key="item.value">{{item.label}}</Option>
            </Select>
        </div>
        <!-- 智能排产时，指定生产线 -->
        <div class="itemOfSelect" v-show="smartMode == 'assignProductLine'">
            <Select v-model="activedProductLineIndex" filterable placeholder="请选择指定生产线">
                <Option v-for="item in productLineList" :value="item.getIndex" :key="item.getId">{{item.fullName}}</Option>
            </Select>
        </div>
        <div class="item" :class="smartMode == '' || !isShowWindowOfAddProgress ? 'itemOfInvalid' : 'item3'" @click="smartSchedule">智能排产 <Icon type="ios-cafe" /></div>
        <div class="item item3" @click="showWindowOfBatchMinus">批量减数 <Icon type="ios-list-box" /></div>
        <div class="item item3" @click="showWindowOfBatchSettingEfficiency">批量自选效率 <Icon type="ios-list-box" /></div>
        <div class="item item4" @click="showNumberOfWork"><span v-show="!isShowNumberofwork">显示工作人数</span><span v-show="isShowNumberofwork">隐藏工作人数</span> <Icon type="ios-body" /></div>
        <div class="item item4"  @click="showWorkingHours"><span v-show="!isShowWorkingHours">显示工作时间</span><span v-show="isShowWorkingHours">隐藏工作时间</span> <Icon type="md-alarm" /></div>
    </div>
</template>

<script>
import MapListUtil from "../../common/mapListUtil";
import DateUtil from "../../common/dateUtil";
import ProgressBar from "../../vo/progressBar";
import ProductLine from "../../vo/productLine";
import CONST from "../../common/const";

export default {
    data: function() {
        return {
            smartMode: "", // 已选择的排产方案
            smartModeList: [
                {
                    label: "效率优先",
                    value: "efficiencyFirst"
                },
                {
                    label: "用时最短",
                    value: "consumeTimeShortest"
                },
                {
                    label: "最早完成",
                    value: "soonest"
                },
                {
                    label: "指定生产线",
                    value: "assignProductLine"
                },
            ], // 排产方案选择列表
            activedProductLineIndex: null, // 智能排产指定的生产线索引
        }
    },
    computed: {
        // 是否已经获取好待添加排产的数据
        isReadyShowWindowOfAddProgress() {
            return this.$store.state.moduleOfDisplay.isReadyShowWindowOfAddProgress;
        },
        // 是否显示工作人数
        isShowNumberofwork() {
            return this.$store.state.moduleOfDisplay.isShowNumberofwork;
        },
        // 是否显示工作时间
        isShowWorkingHours() {
            return this.$store.state.moduleOfDisplay.isShowWorkingHours;
        },
        // 返回原生画布
        ctxOfSource() {
            return this.$store.state.ctxOfSource;
        },
        // 颜色设置
        colorSetting() {
            return this.$store.state.colorSetting;
        },
        // 生产线信息
        productLineList: function() {
            return this.$store.state.productLineList;
        },
        // 工厂日历设置
        factoryCalendar() {
            return this.$store.state.factoryCalendarObj;
        },
        // 是否显示待排产窗口
        isShowWindowOfAddProgress() {
            return this.$store.state.moduleOfDisplay.isShowWindowOfAddProgress;
        }
    },
    methods: {
        // 历史撤回
        historyBack: function() {
            var historyObjList = this.$store.state.historyObjList;
            var activedIndexListOfProductLine = MapListUtil.getKeysFromMapList(this.$store.state.activedObjListOfProductLine);
            if (historyObjList.length == 0) {
                return;
            }
            if (this.$store.state.activedIndexOfHistoryObjList == 0) {
                return;
            }
            this.$store.commit("setActivedIndexOfHistoryObjList", (this.$store.state.activedIndexOfHistoryObjList-1));
            var historyObj = historyObjList[this.$store.state.activedIndexOfHistoryObjList];
            this.$store.commit("setProductLineList", historyObj.getDataOfProductLineList);
            activedIndexListOfProductLine.forEach((item) => {
                historyObj.getDataOfProductLineList[item].clear(this.ctxOfSource);
                historyObj.getDataOfProductLineList[item].renderWithOutIdList(this.ctxOfSource, this.colorSetting, null, null);
            })
            if (historyObj.getIsAddProgress) {
                this.$store.commit("setWaitingAddProgressList", historyObj.getDataOfWaitingAddProgressList);
            }
        },
        // 历史重做
        historyRemake: function() {
            var historyObjList = this.$store.state.historyObjList;
            var activedIndexListOfProductLine = MapListUtil.getKeysFromMapList(this.$store.state.activedObjListOfProductLine);
            if (historyObjList.length == 0) {
                return;
            }
            if (this.$store.state.activedIndexOfHistoryObjList == (historyObjList.length-1)) {
                return;
            }
            this.$store.commit("setActivedIndexOfHistoryObjList", (this.$store.state.activedIndexOfHistoryObjList+1));
            var historyObj = historyObjList[this.$store.state.activedIndexOfHistoryObjList];
            this.$store.commit("setProductLineList", historyObj.getDataOfProductLineList);
            activedIndexListOfProductLine.forEach((item) => {
                historyObj.getDataOfProductLineList[item].clear(this.ctxOfSource);
                historyObj.getDataOfProductLineList[item].renderWithOutIdList(this.ctxOfSource, this.colorSetting, null, null);
            })
            if (historyObj.getIsAddProgress) {
                this.$store.commit("setWaitingAddProgressList", historyObj.getDataOfWaitingAddProgressList);
            }
        },
        // 保存数据
        submitBtn: function() {
            var that = this;
            var dataList = []; // 用于上传数据列表
            var productLineList = this.$store.state.productLineList; // 生产线列表数据
            var activedObjListOfProductLine = this.$store.state.activedObjListOfProductLine; // 激活的生产线索引对象列表
            if (activedObjListOfProductLine.length == 0) {
                return;
            }
            this.$store.commit("setIsLoading", true);
            /**
             * 组装数据
             */
            // 组装更新的进度条数据
            var activedIndexListOfProductLine = MapListUtil.getKeysFromMapList(activedObjListOfProductLine); // 激活的生产线索引列表
            // 循环激活生产线索引列表，获取详情
            activedIndexListOfProductLine.forEach((item) => {
                // 激活生产线中的需要更新的排产计划索引
                var progressBarIndex = MapListUtil.getObjFromMapListByKey(activedObjListOfProductLine, item)[item];
                if (progressBarIndex != null) {
                    // 激活生产线的数据
                    var progressListTemp = productLineList[item].getProgressList;
                    // 组装提交 Obj
                    for (var i=progressBarIndex; i<progressListTemp.length; i++) {
                        var progressBar = progressListTemp[i]; // 排产计划对象
                        var obj = {};
                        obj.productionLineId = progressBar.geProductLineId; // 更新生产线id
                        obj.id = progressBar.getId; // 确定排产计划 id
                        obj.qtyFinish = progressBar.getQtyFinish; // 更新工作完成数量
                        obj.qtyofbatcheddelivery = progressBar.getQtyofbatcheddelivery; // 更新计划数量
                        obj.startTime = progressBar.getStartTime; // 更新开始时间
                        obj.endTime = progressBar.getEndTime; // 更新结束时间
                        obj.efficiencyOfSetting = progressBar.getEfficiencyOfSetting; // 更新自选效率
                        obj.orderno = progressBar.getMsgOfProgressBar.orderno; // 制单号（合并进度条时，会修改制单号信息）
                        // 对因拆单而新增的排产进度条，从而赋值原拆单的进度条 ID
                        if (progressBar.getParentId) {
                            obj.parentId = progressBar.getParentId;
                        }
                        dataList.push(obj);
                    }
                }
            });
            // 组装删除进度条的数据
            var activedIndexOfHistoryObjList = this.$store.state.activedIndexOfHistoryObjList; // 当前历史版本对应的索引
            var historyObj = this.$store.state.historyObjList[activedIndexOfHistoryObjList]; // 当前历史版本对象
            var listOfDeleteId = historyObj.getListOfDeleteProgressId; // 获取当前历史版本的所有删除的进度条的ID列表
            var existLogicallyDelete = false;
            listOfDeleteId.forEach((deleteId) => {
                var obj = {};
                obj.id = deleteId;
                dataList.push(obj);
                if (deleteId.indexOf(CONST.PREFIXOFPROGRESSBARID.LOGICALLYDELETE) != -1) {
                    existLogicallyDelete = true;
                }
            });

            // 向后台提交数据
            this.axios.post(this.seieiURL + "productionplanningdetail/updateProgress", dataList).then((response) => {
               if (response.data.status) {
                    that.$Message.error(response.data.msg);
                    that.$store.commit("setIsLoading", false);
                    that.isInvaildSession(response.data.status);
               } else {
                    // 如果含有逻辑删除，则刷新待排产信息
                    if (existLogicallyDelete) {
                        that.getAllForAddProgress();
                    }

                    // 刷新数据
                    that.axios.get(that.seieiURL + "productionline/getResourceDataByUserId?time=" + DateUtil.firstTimeStampOfShow).then((response) => {
                        if (response.data.status) {
                            that.$store.commit("setIsLoading", false);
                            that.$Message.error(response.data.msg);
                            that.isInvaildSession(response.data.status);
                        } else {
                            var resourceData = response.data.data;
                            var productlineList = [];
                            for (var productLineIndex=0; productLineIndex<resourceData.length; productLineIndex++) {
                                var productLineItem = new ProductLine(
                                    resourceData[productLineIndex].id,
                                    productLineIndex,
                                    resourceData[productLineIndex].workgroup,
                                    resourceData[productLineIndex].workshop,
                                    resourceData[productLineIndex].lineCode,
                                    resourceData[productLineIndex].peopleNum,
                                    resourceData[productLineIndex].workhours,
                                    resourceData[productLineIndex].defaultStyleName,
                                    resourceData[productLineIndex].peopleNumOfLineList,
                                    resourceData[productLineIndex].workhoursOfLineList,
                                    resourceData[productLineIndex].efficiencyOfLineList
                                );
                                var progressList = [];
                                for (var progressIndex=0; progressIndex<resourceData[productLineIndex].productionPlanningDetailList.length; progressIndex++) {
                                    var progressItemTemp = resourceData[productLineIndex].productionPlanningDetailList[progressIndex];
                                    var progressItem = new ProgressBar(
                                        productLineIndex,
                                        resourceData[productLineIndex].id,
                                        progressItemTemp
                                    ); 
                                    progressList.push(progressItem);
                                }
                                productLineItem.setProgressList(progressList);
                                productlineList.push(productLineItem);
                            }
                            // 保存到 vuex 中
                            that.$store.commit("setIsLoading", false);
                            that.$store.commit('setProductLineList', productlineList);
                            // 重新渲染
                            productlineList.forEach((item) => {
                                item.clear(that.ctxOfSource);
                                item.renderWithOutIdList(that.ctxOfSource, that.colorSetting, null, null);
                            });
                            // 清空历史记录
                            that.$store.commit("setHistoryObjList", []);
                            that.$store.commit("setActivedObjListOfProductLine", []);
                            that.$store.commit("setActivedIndexOfHistoryObjList", null);
                            that.$Message.success("更新成功");
                        }
                    }).catch((error) => {
                        that.$store.commit("setIsLoading", false);
                        that.$Message.error({
                          content: "服务器异常,请刷新！！",
                          duration: 0,
                          closable: true
                        });
                        console.log(error);
                    });
               }
            }).catch((error) => {
                that.$store.commit("setIsLoading", false);
                that.$Message.error({
                  content: "服务器异常,请刷新！！",
                  duration: 0,
                  closable: true
                });
                console.log(error);
            });
        },
        // 刷新数据
        refreshPage: function() {
            window.location.reload();
        },
        // 显示添加排产窗口
        showWindowOfAddProgress: function() {
			this.$store.commit("closeAllWindow");
			this.clearActivedProgressBar(); // 清空被选中的计划进度的框边颜色
			this.$store.commit("setIsShowWindowOfAddProgress", true);
        },
        // 智能排产
        smartSchedule: function() {
            var isShowWindowOfAddProgress = this.isShowWindowOfAddProgress;
            var selectedWaitingAddProgressList = this.$store.state.selectedWaitingAddProgressList;
            var productLineList = this.productLineList;
            if (this.smartMode == "" || !isShowWindowOfAddProgress || selectedWaitingAddProgressList.length == 0) {
                return;
            }
            if (this.smartMode == "assignProductLine" && this.activedProductLineIndex == null) {
                this.$Message.error({
                    content: "请指定生产线",
                    duration: 0,
                    closable: true
                });
                return;
            }

            /**
             * 记录历史操作（之前没有记录过历史操作，则初始化历史记录快照）
             */
            // 新增排产，则还要修改上一个历史版本对象，把排产表数据设置过去
            var dataOfWaitingAddProgressList = [...this.$store.state.waitingAddProgressList];
            if (!this.initHistoryObjList(productLineList, dataOfWaitingAddProgressList)) {
                this.$store.state.historyObjList[this.$store.state.activedIndexOfHistoryObjList].setDataOfWaitingAddProgressList(dataOfWaitingAddProgressList);
            }

            /*
            * 智能排产
            */
            selectedWaitingAddProgressList.forEach((selectedWaitingAddProgressMsg) => {
                // 初始化进度条对象
                var activedProgressBar = new ProgressBar(
				    null,
				    null,
				    selectedWaitingAddProgressMsg
			    );
                var activedProductLine = null; // 进度条新增到的生产线
                
                // 排产方案是效率优先
                if (this.smartMode == "efficiencyFirst") {
                    activedProductLine = this.scheduleByEfficiencyFirst(selectedWaitingAddProgressMsg);
                }
                // 排产方案是用时最短
                else if (this.smartMode == "consumeTimeShortest") {
                    activedProductLine = this.scheduleByConsumeTimeShortest(selectedWaitingAddProgressMsg);
                }
                // 排产方案是最早完成
                else if (this.smartMode == "soonest") {
                    activedProductLine = this.scheduleBySoonest(selectedWaitingAddProgressMsg);
                }
                // 指定生产线
                else if (this.smartMode == "assignProductLine") {
                    activedProductLine = productLineList[this.activedProductLineIndex];
                }
                
                /**
                 * 删除旧数据
                 */
                // 从等待排产的列表中删除该元素
                this.$store.commit("removeWaitingAddProgressList", activedProgressBar.getId);
                
                /**
                 * 设置数据
                 */
                // 生产线重新刷新数据，并渲染图层
                activedProductLine.clear(this.ctxOfSource); // 清空图层
                var activedProgressBarIndex = activedProductLine.addProgressInTheEnd(activedProgressBar, this.factoryCalendar); // 激活生产线添加进度条
                activedProductLine.renderWithOutIdList(this.ctxOfSource, this.colorSetting, null, null); // 渲染生产线

                /**
                 * 记录激活的生产线索引对象
                 */
                this.$store.commit("addActivedObjListOfProductLine", {
                    productLineIndex: activedProgressBar.getProductLineIndex,
                    progressBarIndex: activedProgressBarIndex
                });
            });

            /**
             * 记录历史操作
             */
            this.pushHistoryObjList(productLineList, null, null);
            
            // 关闭窗口
			this.$store.commit("closeAllWindow");
        },
        // 显示批量减数
        showWindowOfBatchMinus: function() {
            this.$store.commit("closeAllWindow");
			this.clearActivedProgressBar(); // 清空被选中的计划进度的框边颜色
			this.$store.commit("setIsShowWindowOfBatchMinus", true);
        },
        // 显示自选效率窗口
        showWindowOfBatchSettingEfficiency: function() {
            this.$store.commit("closeAllWindow");
			this.clearActivedProgressBar(); // 清空被选中的计划进度的框边颜色
			this.$store.commit("setIsShowWindowOfBatchSettingEfficiency", true);
        },
        // 显示人数
        showNumberOfWork: function() {
            this.$store.commit("toggleNumberofwork");
        },
        // 显示工作时间
        showWorkingHours: function() {
            this.$store.commit("toggleWorkingHours");
        },
        // 智能排产，排产方案为：效率最高
        scheduleByEfficiencyFirst: function(selectedWaitingAddProgressMsg) {
            var productLineList = this.productLineList; // 生产线信息
            var styleName = selectedWaitingAddProgressMsg.productStyleName; // 品名
            /**
             * 循环生产线获取最快效率
             */
            var fastestEfficiency = 0; // 初始化最快效率
            var activedProductLine = null;
            productLineList.forEach((productLine) => {
                var efficiencyNow = productLine.getEfficiency(styleName);
                if (efficiencyNow != null && efficiencyNow > fastestEfficiency) {
                    activedProductLine = productLine;
                    fastestEfficiency = efficiencyNow;
                }
            });
            return activedProductLine;
        },
        // 智能排产，排产方案为：耗时最短
        scheduleByConsumeTimeShortest: function(selectedWaitingAddProgressMsg) {
            var productLineList = this.productLineList; // 生产线信息
            var styleName = selectedWaitingAddProgressMsg.productStyleName; // 品名
            /**
             * 循环生产线获取日产最多的那条生产线
             */
            var dailyMakingForComputed = 0; // 每日日产
            var progress = new ProgressBar(
				null,
			    null,
				selectedWaitingAddProgressMsg
			);
            var activedProductLine = null; // 返回的生产线
            productLineList.forEach((productLine) => {
                var efficiency = productLine.getEfficiency(styleName);
                if (efficiency == null) {
                    return;
                }
                // 组装进度条到相应的生产线
                var startTime = productLine.getTheLastTimeStamp();
                progress.reload(productLine, this.factoryCalendar, startTime);
                var dailyMakingForComputedTemp = progress.getDailyMakingForComputed(productLine, startTime);
                // 获取对应的每日日产，并进行比较
                if (dailyMakingForComputed == 0 || dailyMakingForComputedTemp > dailyMakingForComputed) {
                    dailyMakingForComputed = dailyMakingForComputedTemp;
                    activedProductLine = productLine;
                }
            });
            return activedProductLine;
        },
        // 只能排产，排产方案为：时间最早
        scheduleBySoonest: function(selectedWaitingAddProgressMsg) {
            var productLineList = this.productLineList; // 生产线信息
            var styleName = selectedWaitingAddProgressMsg.productStyleName; // 品名
            /**
             * 循环生产线获取结束时间最早的那条生产线
             */
            var endTimeStamp = 0; // 结束时间
            var activedProductLine = null; // 返回的生产线
            var progress = new ProgressBar(
				null,
			    null,
				selectedWaitingAddProgressMsg
			);
            productLineList.forEach((productLine) => {
                var efficiency = productLine.getEfficiency(styleName);
                if (efficiency == null) {
                    return;
                }
                // 组装进度条到相应的生产线
                var startTime = productLine.getTheLastTimeStamp();
                progress.reload(productLine, this.factoryCalendar, startTime);
                // 获取对应的结束时间戳，并进行比较
                if (endTimeStamp == 0 || endTimeStamp > progress.getEndTime) {
                    activedProductLine = productLine;
                    endTimeStamp = progress.getEndTime;
                }
            });
            return activedProductLine;
        }
    }
}
</script>

<style>
/* 工具栏 */
.topToolBar-component {
	position: fixed;
	top: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    border-bottom: 1px solid #ddd;
}
.topToolBar-component .item {
	display: inline-block;
    box-sizing: border-box;
    padding: 0px 5px;
    margin: 5px 0px 5px 5px;
    line-height: 25px;
    font-size: 14px;
    border-radius: 4px;
    background-color: #3bbf67;
    color: #fff;
}
.topToolBar-component .itemOfSelect {
	display: inline-block;
    box-sizing: border-box;
    margin: 5px 0px 5px 5px;
    line-height: 25px;
    font-size: 14px;
}
.topToolBar-component .itemOfSelect .ivu-select-single .ivu-select-selection {
    height: 25px;
}
.topToolBar-component .itemOfSelect .ivu-select-input {
    height: 25px;
    line-height: 25px;
}
.topToolBar-component .item1{
    background-color:#ed4014;
}
.topToolBar-component .item2{
    background-color:#ffad33;
}
.topToolBar-component .item3 {
    background-color: #2db7f5;
}
.topToolBar-component .item4 {
    background-color: #4fa0f6;
}
.topToolBar-component .itemOfInvalid {
    background-color: #ddd;
}
.topToolBar-component .item5 {
	display: inline-block;
    box-sizing: border-box;
    padding: 0px 5px;
    margin: 5px 0px 5px 5px;
    line-height: 25px;
    font-size: 14px;
    border-radius: 4px;
    background-color: #ddd;
    color: #fff;
}
.topToolBar-component .item:hover {
	background-color: rgba(0,0,0,0.5);
	cursor:pointer;
}
.topToolBar-component .itemOfInvalid:hover {
    background-color: #ddd;
	cursor: default;
}
.topToolBar-component .iconfont {
	margin-left: 4px;
	font-size: 14px!important;
}
</style>