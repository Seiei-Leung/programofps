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
        <v-windowOfAddProgressBar></v-windowOfAddProgressBar>
        <!-- 提示组件 -->
        <v-toast v-show="isShowToast" v-bind:txt="toastTxt"></v-toast>
        <!-- 鼠标右击进度条显示菜单 -->
        <v-windowOfMenu v-show="isShowWindowOfMenu"></v-windowOfMenu>
        <!-- 减数窗口 -->
        <v-windowOfMinus v-if="isShowWindowOfMinus"></v-windowOfMinus>
        <!-- 详情窗口 -->
        <v-windowOfDetail v-if="isShowWindowOfDetail"></v-windowOfDetail>
        <!-- 拆单窗口 -->
        <v-windowOfSeparateBill v-if="isShowWindowOfSeparateBill"></v-windowOfSeparateBill>
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
import M2V from "../../common/M2V";
import DateUtil from "../../common/dateUtil";
import FactoryCalendar from "../../vo/factoryCalendar";
import windowOfAddProgressBar from "../windowOfAddProgressBar/windowOfAddProgressBar";
import toast from "../toast/toast";
import loading from "../loading/loading";
import windowOfMenu from "../windowOfMenu/windowOfMenu";
import windowOfMinus from "../windowOfMinus/windowOfMinus";
import windowOfDetail from "../windowOfDetail/windowOfDetail";
import windowOfSeparateBill from "../windowOfSeparateBill/windowOfSeparateBill";
import backgroundForDrawWindow from "../backgroundForDrawWindow/backgroundForDrawWindow";
import ScrollUtil from "../../common/scrollUtil";
import ColorSetting from "../../vo/colorSetting";

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
        // 是否显示 toast
        isShowToast: function() {
            return this.$store.state.isShowToast;
        },
        // toast 文本
        toastTxt: function() {
            return this.$store.state.toastTxt;
        },
        // 是否显示加载中
        isLoading: function() {
            return this.$store.state.isLoading;
        },
        // 是否显示右键菜单窗口
        isShowWindowOfMenu: function() {
            return this.$store.state.isShowWindowOfMenu;
        },
        // 是否显示减数窗口
        isShowWindowOfMinus: function() {
            return this.$store.state.isShowWindowOfMinus;
        },
        // 是否显示详情窗口
        isShowWindowOfDetail: function() {
            return this.$store.state.isShowWindowOfDetail;
        },
        // 是否显示拖动图层
        isShowBackgroundForDrawWindow: function() {
            return this.$store.state.isShowBackgroundForDrawWindow;
        },
        // 是否显示拆单图层
        isShowWindowOfSeparateBill: function() {
            return this.$store.state.isShowWindowOfSeparateBill;
        },
    },
    created: function() {
        this.getColorSetting();
        this.getAllForAddProgress();
		var that = this;
		
		// 绑定滚动事件
		this.$nextTick(() => {
			var scrollUtil = new ScrollUtil();
			window.onscroll = function() {
				scrollUtil.scroll();
				if (scrollUtil.scrollDirection == 'down' || scrollUtil.scrollDirection == 'up') {
					that.$store.commit('scrollUpOrDown');
				} else if (scrollUtil.scrollDirection == 'right' || scrollUtil.scrollDirection == 'left') {
					that.$store.commit('scrollRightOrLeft');
				}
			}
		});
    },
    methods: {
        // 获取进度条颜色样式
        getColorSetting: function() {
            var that = this;
            this.$store.commit("setIsLoading", true);
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
                        data.delayDaynum
                    );
                    that.$store.commit("setColorSetting", colorSetting);
                    that.getFactoryCalendar();
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
            this.axios.get(this.seieiURL + "factoryCalendar/getFactoryCalendarByYear?yearList=" + yearListOfShow.join(",")).then((response) => {
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
                    that.getMsgOfProductLine();

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
            var yearListOfShow = DateUtil.yearListOfShow;
            this.axios.get(this.seieiURL + "productionline/getResourceDataByUserId?year=" + yearListOfShow[0]).then((response) => {
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
                    that.isDone = true;
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
        "v-toast": toast,
        "v-loading": loading,
        "v-windowOfMenu": windowOfMenu,
        "v-windowOfMinus": windowOfMinus,
        "v-windowOfDetail": windowOfDetail,
        "v-windowOfSeparateBill": windowOfSeparateBill,
        "v-backgroundForDrawWindow": backgroundForDrawWindow,
    }
}
</script>

<style scoped>

</style>