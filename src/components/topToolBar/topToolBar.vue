<template>
    <div class="topToolBar-component zIndexSuperTop">
        <!-- 编辑工具栏 -->
        <div class="item item1" @click="historyBack">撤回 <Icon type="ios-rewind" /></div>
        <div class="item item2" @click="historyRemake">重做 <Icon type="ios-fastforward" /></div>
        <div class="item" @click="submitBtn">保存 <Icon type="md-cloud-upload" /></div>
        <div class="item" @click="refreshPage">刷新 <Icon type="md-refresh" /></div>
        <div class="item item3" @click="showNumberOfWork"><span v-show="!isShowNumberofwork">显示工作人数</span><span v-show="isShowNumberofwork">隐藏工作人数</span> <Icon type="ios-body" /></div>
        <div class="item item3"  @click="showWorkingHours"><span v-show="!isShowWorkingHours">显示工作时间</span><span v-show="isShowWorkingHours">隐藏工作时间</span> <Icon type="md-alarm" /></div>
    </div>
</template>

<script>
import MapListUtil from "../../common/mapListUtil";
import DateUtil from "../../common/dateUtil";
import ProgressBar from "../../vo/progressBar";
import ProductLine from "../../vo/productLine";

export default {
    data: function() {
        return {
        }
    },
    computed: {
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
            if (this.$store.state.activedIndexOfHistoryObjList == null) {
                this.$store.commit("setActivedIndexOfHistoryObjList", historyObjList.length-1);
            }
            if (this.$store.state.activedIndexOfHistoryObjList == 0) {
                return;
            }
            this.$store.commit("setActivedIndexOfHistoryObjList", (this.$store.state.activedIndexOfHistoryObjList-1));
            var historyObj = historyObjList[this.$store.state.activedIndexOfHistoryObjList];
            this.$store.commit("setProductLineList", historyObj.getDataOfProductLineList);
            activedIndexListOfProductLine.forEach((item) => {
                historyObj.getDataOfProductLineList[item].clear(this.ctxOfSource);
                historyObj.getDataOfProductLineList[item].renderWithOutIdList(this.ctxOfSource, this.colorSetting, null);
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
            if (this.$store.state.activedIndexOfHistoryObjList == null) {
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
                historyObj.getDataOfProductLineList[item].renderWithOutIdList(this.ctxOfSource, this.colorSetting, null);
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
                        // 对因拆单而新增的排产进度条，从而赋值原拆单的进度条 ID
                        if (progressBar.getParentId) {
                            obj.parentId = progressBar.getParentId;
                        }
                        dataList.push(obj);
                    }
                }
            });
            this.axios.post(this.seieiURL + "productionplanningdetail/updateProgress", dataList).then((response) => {
               if (response.data.status) {
                    that.$Message.error(response.data.msg);
                    that.$store.commit("setIsLoading", false);
                    that.isInvaildSession(response.data.status);
               } else {
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
                                item.renderWithOutIdList(that.ctxOfSource, that.colorSetting, null);
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
        // 显示人数
        showNumberOfWork: function() {
            this.$store.commit("toggleNumberofwork");
        },
        // 显示工作时间
        showWorkingHours: function() {
            this.$store.commit("toggleWorkingHours");
        }
    },
    created: function() {
    }
}
</script>

<style scoped>
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
.topToolBar-component .item1{
    background-color:#ed4014;
}
.topToolBar-component .item2{
    background-color:#ffad33;
}
.topToolBar-component .item3 {
    background-color: #4fa0f6;
}
.topToolBar-component .item:hover {
	background-color: rgba(0,0,0,0.5);
	cursor:pointer;
}
.topToolBar-component .iconfont {
	margin-left: 4px;
	font-size: 14px!important;
}
</style>