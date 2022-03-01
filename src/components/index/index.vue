<template>
    <div id="index-component">
        <!-- 编辑工具栏 -->
        <v-topToolBar></v-topToolBar>
        <!-- 左侧生产线栏 -->
        <v-productLinBar v-if="isDone"></v-productLinBar>
        <!-- 日期栏 -->
        <v-dateBar v-if="isDone"></v-dateBar>
        <!-- 背景画布 -->
        <v-backgroundCanvas v-if="isDone"></v-backgroundCanvas>
        <!-- 装载进度条画布 -->
        <v-progressBarCanvas v-if="isDone"></v-progressBarCanvas>
        <!-- 右侧添加进度条窗口 -->
        <v-windowOfAddProgressBar v-if="isShowWindowOfAddProgress"></v-windowOfAddProgressBar>
        <!-- 右侧添加批量减数窗口 -->
        <v-windowOfBatchMinus v-if="isShowWindowOfBatchMinus"></v-windowOfBatchMinus>
        <!-- 右侧添加批量自选效率窗口 -->
        <v-windowOfBatchSettingEfficiency v-if="isShowWindowOfBatchSettingEfficiency"></v-windowOfBatchSettingEfficiency>
        <!-- 定位窗口 -->
        <v-windowOfLocate v-if="isShowWindowOfLocate"></v-windowOfLocate>
        <!-- 接单分析 -->
        <v-windowOfAnalysis v-if="isShowWindowOfAnalysis"></v-windowOfAnalysis>
        <!-- 提示组件 -->
        <v-toast v-show="isShowToast" v-bind:txt="toastTxt"></v-toast>
        <!-- 鼠标右击进度条显示菜单 -->
        <v-windowOfMenu v-if="isDone" v-show="isShowWindowOfMenu"></v-windowOfMenu>
        <!-- 减数窗口 -->
        <v-windowOfMinus v-if="isShowWindowOfMinus"></v-windowOfMinus>
        <!-- 详情窗口 -->
        <v-windowOfDetail v-if="isShowWindowOfDetail"></v-windowOfDetail>
        <!-- 拆单窗口 -->
        <v-windowOfSeparateBill v-if="isShowWindowOfSeparateBill"></v-windowOfSeparateBill>
        <!-- 自选效率窗口 -->
        <v-windowOfSettingEfficiency v-if="isShowWindowOfSettingEfficiency"></v-windowOfSettingEfficiency>
        <!-- 批注窗口 -->
        <v-windowOfMemo v-if="isShowWindowOfMemo"></v-windowOfMemo>
        <!-- 拖动窗口图层 -->
        <v-backgroundForDrawWindow v-if="isShowBackgroundForDrawWindow"></v-backgroundForDrawWindow>
        <!-- loading 组件 -->
        <v-loading v-show="isLoading"></v-loading>
    </div>
</template>

<script>
import topToolBar from "../topToolBar/topToolBar";
import productLinBar from "../productLineBar/productLineBar";
import dateBar from "../dateBar/dateBar";
import backgroundCanvas from "../backgroundCanvas/backgroundCanvas";
import progressBarCanvas from "../progressBarCanvas/progressBarCanvas";
import ProgressBar from "../../vo/progressBar";
import ProductLine from "../../vo/productLine";
import DateUtil from "../../common/dateUtil";
import FactoryCalendar from "../../vo/factoryCalendar";
import windowOfAddProgressBar from "../windowOfAddProgressBar/windowOfAddProgressBar";
import windowOfBatchMinus from "../windowOfBatchMinus/windowOfBatchMinus";
import windowOfLocate from "../windowOfLocate/windowOfLocate";
import windowOfAnalysis from "../windowOfAnalysis/windowOfAnalysis";
import windowOfMemo from "../windowOfMemo/windowOfMemo";
import windowOfBatchSettingEfficiency from "../windowOfBatchSettingEfficiency/windowOfBatchSettingEfficiency";
import toast from "../toast/toast";
import loading from "../loading/loading";
import windowOfMenu from "../windowOfMenu/windowOfMenu";
import windowOfMinus from "../windowOfMinus/windowOfMinus";
import windowOfDetail from "../windowOfDetail/windowOfDetail";
import windowOfSeparateBill from "../windowOfSeparateBill/windowOfSeparateBill";
import windowOfSettingEfficiency from "../windowOfSettingEfficiency/windowOfSettingEfficiency";
import backgroundForDrawWindow from "../backgroundForDrawWindow/backgroundForDrawWindow";
import ScrollUtil from "../../common/scrollUtil";
import ColorSetting from "../../vo/colorSetting";
import ArgumentSetting from "../../vo/argumentSetting";

export default {
    data: function() {
        return {
            isDone: false, // 是否已经获取数据
        }
    },
    computed: {
        // 生产线源数据
        productLineList: function() {
            return this.$store.state.productLineList;
        },
		// 是否显示新增排产窗口
		isShowWindowOfAddProgress: function() {
			return this.$store.state.moduleOfDisplay.isShowWindowOfAddProgress;
        },
        // 是否显示批量减数窗口
        isShowWindowOfBatchMinus: function() {
            return this.$store.state.moduleOfDisplay.isShowWindowOfBatchMinus;
        },
        // 是否显示批量自选效率窗口
        isShowWindowOfBatchSettingEfficiency: function() {
            return this.$store.state.moduleOfDisplay.isShowWindowOfBatchSettingEfficiency;
        },
        // 是否显示定位窗口
        isShowWindowOfLocate: function() {
            return this.$store.state.moduleOfDisplay.isShowWindowOfLocate;
        },
        // 是否显示接单分析窗口
        isShowWindowOfAnalysis: function() {
            return this.$store.state.moduleOfDisplay.isShowWindowOfAnalysis;
        },
        // 是否显示批注窗口
        isShowWindowOfMemo: function() {
            return this.$store.state.moduleOfDisplay.isShowWindowOfMemo;
        },
        // 是否显示 toast
        isShowToast: function() {
            return this.$store.state.moduleOfDisplay.isShowToast;
        },
        // toast 文本
        toastTxt: function() {
            return this.$store.state.moduleOfDisplay.toastTxt;
        },
        // 是否显示加载中
        isLoading: function() {
            return this.$store.state.moduleOfDisplay.isLoading;
        },
        // 是否显示右键菜单窗口
        isShowWindowOfMenu: function() {
            return this.$store.state.moduleOfDisplay.isShowWindowOfMenu;
        },
        // 是否显示减数窗口
        isShowWindowOfMinus: function() {
            return this.$store.state.moduleOfDisplay.isShowWindowOfMinus;
        },
        // 是否显示详情窗口
        isShowWindowOfDetail: function() {
            return this.$store.state.moduleOfDisplay.isShowWindowOfDetail;
        },
        // 是否显示自选效率窗口
        isShowWindowOfSettingEfficiency: function() {
            return this.$store.state.moduleOfDisplay.isShowWindowOfSettingEfficiency;
        },
        // 是否显示拖动图层
        isShowBackgroundForDrawWindow: function() {
            return this.$store.state.moduleOfDisplay.isShowBackgroundForDrawWindow;
        },
        // 是否显示拆单图层
        isShowWindowOfSeparateBill: function() {
            return this.$store.state.moduleOfDisplay.isShowWindowOfSeparateBill;
        },
    },
    created: function() {
        var that = this;
        this.$store.commit("setIsLoading", true);
        this.getAllForAddProgress();
        // async 同步，aysnc 函数之后的语句并不是同步的，即如消除下面控制台的注释，"async 外输出的语句" 会比 "async 内输出的语句" 输出的要前
        (async function() {
            await that.getArgumentSetting(); // 获取参数设置
            await that.getColorSetting(); // 获取颜色设置
            await that.getFactoryCalendar(); // 获取工厂日历
            await that.getMsgOfProductLine(); // 获取生产线数据
            that.$store.commit("setIsLoading", false); // 消除 loading
            that.isDone = true; // 渲染子组件
            // console.log("async 内输出的语句");
        })();
        // console.log("async 外输出的语句");
        
		// 绑定滚动事件
		this.$nextTick(() => {
			var scrollUtil = new ScrollUtil();
			window.onscroll = function() {
				scrollUtil.scroll();
				if (scrollUtil.scrollDirection == 'down' || scrollUtil.scrollDirection == 'up') {
                    that.$store.commit('scrollUpOrDown');
                } 
                else if (scrollUtil.scrollDirection == 'right' || scrollUtil.scrollDirection == 'left') {
                    that.$store.commit('scrollRightOrLeft');
				}
			}
		});
    },
    methods: {
        // 获取参数设置
        getArgumentSetting: function() {
            var that = this;
            this.axios.get(this.seieiURL + "argumentSetting/getAll").then((response) => {
                if (response.data.status) {
                    that.$store.commit("setIsLoading", false);
                    that.$Message.error(response.data.msg);
                    that.isInvaildSession(response.data.status);
                } else {
                    var argumentSetting = new ArgumentSetting(
                        response.data.data.afterMinusHasamend,
                        response.data.data.afterMinusorchangeefficiencyHasremovegapmodel,
                        response.data.data.peopleNum,
                        response.data.data.workhours
                    );
                    that.$store.commit("setArgumentSetting", argumentSetting);
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
        // 获取进度条颜色样式
        getColorSetting: function() {
            var that = this;
            this.axios.get(this.seieiURL + "colorSetting/getByUserId").then((response) => {
                if (response.data.status) {
                    that.$store.commit("setIsLoading", false);
                    that.$Message.error(response.data.msg);
                    that.isInvaildSession(response.data.status);
                } else {
                    var data = response.data.data;
                    // 保存到 vuex
                    var colorSetting = new ColorSetting(
                        data.defaultColor,
                        data.defaultAdvanceColor,
                        data.defaultDelayColor,
                        data.advanceColor,
                        data.advanceDaynum,
                        data.delayColor,
                        data.delayDaynum,
                        data.unlockColor,
                        data.selectedColor
                    );
                    that.$store.commit("setColorSetting", colorSetting);
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
        // 获取工厂日历
        getFactoryCalendar: function() {
            var that = this;
            var yearListOfShow = DateUtil.yearListOfShow;
            return this.axios.get(this.seieiURL + "factoryCalendar/getFactoryCalendarByYear?yearList=" + yearListOfShow.join(",")).then((response) => {
                if (response.data.status) {
                    that.$store.commit("setIsLoading", false);
                    that.$Message.error(response.data.msg);
                    that.isInvaildSession(response.data.status);
                } else {
                    var factoryCalendar = new FactoryCalendar();
                    response.data.data.forEach((item) => {
                        var festivalList = [];
                        item.festivalList.forEach((item2) => {
                           festivalList = festivalList.concat(DateUtil.timeStampsToDateStrList(item2.beginDate, item2.endDate));
                        });
                        factoryCalendar.addDetailByYear(item.year, item.monday, item.tuesday, item.wednesday, item.thursday, item.friday, item.saturday, item.sunday, festivalList);
                    });
                    // 保存到 vuex 中
                    that.$store.commit('setFactoryCalendarObj', factoryCalendar);
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
        // 获取生产线信息
        getMsgOfProductLine: function() {
            var that = this;
            return this.axios.get(this.seieiURL + "productionline/getResourceDataByUserId?time=" + DateUtil.firstTimeStampOfShow).then((response) => {
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
                    that.$store.commit('setProductLineList', productlineList);
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
    },
    components: {
        'v-topToolBar': topToolBar,
        'v-productLinBar': productLinBar,
        'v-dateBar': dateBar,
        'v-backgroundCanvas': backgroundCanvas,
        'v-progressBarCanvas': progressBarCanvas,
        'v-windowOfAddProgressBar': windowOfAddProgressBar,
        "v-windowOfBatchMinus": windowOfBatchMinus,
        "v-windowOfBatchSettingEfficiency": windowOfBatchSettingEfficiency,
        "v-windowOfLocate": windowOfLocate,
        "v-windowOfAnalysis": windowOfAnalysis,
        "v-windowOfMemo": windowOfMemo,
        "v-toast": toast,
        "v-loading": loading,
        "v-windowOfMenu": windowOfMenu,
        "v-windowOfMinus": windowOfMinus,
        "v-windowOfDetail": windowOfDetail,
        "v-windowOfSeparateBill": windowOfSeparateBill,
        "v-windowOfSettingEfficiency": windowOfSettingEfficiency,
        "v-backgroundForDrawWindow": backgroundForDrawWindow,
    }
}
</script>

<style scoped>

</style>