<template>
    <div id="index-component">
        <!-- 编辑工具栏 -->
        <v-topToolBar></v-topToolBar>
        <!-- 左侧生产线栏 -->
        <v-productLinBar
            v-if="isDone"
            v-bind:productLineList="productLineList"
            ref="productLinesBarHook">
        </v-productLinBar>
        <!-- 日期栏 -->
        <v-dateBar 
            v-if="isDone"
        ></v-dateBar>
        <!-- 背景画布 -->
        <v-backgroundCanvas
            v-if="isDone"
            v-bind:countOfProductLines="productLineList.length">
        </v-backgroundCanvas>
        <!-- 装载进度条画布 -->
        <v-progressBarCanvas
            v-if="isDone"
            v-bind:productLineList="productLineList"
        ></v-progressBarCanvas>
        <!-- 右侧添加进度条窗口 -->
        <v-windowOfAddProgressBar></v-windowOfAddProgressBar>
        <!-- 提示组件 -->
        <v-toast v-show="isShowToast" v-bind:txt="toastTxt"></v-toast>
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
        }
    },
    created: function() {
        this.getFactoryCalendar();
        this.getAllForAddProgress();
    },
    methods: {
        // 获取工厂日历
        getFactoryCalendar: function() {
            var that = this;
            var yearListOfShow = DateUtil.yearListOfShow;
            this.axios.get(this.seieiURL + "factoryCalendar/getFactoryCalendarByYear?yearList=" + yearListOfShow.join(",")).then((response) => {
                if (response.data.status) {
                    that.$Message.error(response.data.msg);
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
                    that.getProductLine();

                }
            }).catch((error) => {
                that.$Message.error({
                  content: "服务器异常,请刷新！！",
                  duration: 0,
                  closable: true
                });
                console.log(error);
            });
        },
        // 获取生产线信息
        getProductLine: function() {
            var that = this;
            var yearListOfShow = DateUtil.yearListOfShow;
            this.axios.get(this.seieiURL + "productionline/getResourceDataByUserId?year=" + yearListOfShow[0]).then((response) => {
                if (response.data.status) {
                    that.$Message.error(response.data.msg);
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
                            resourceData[productLineIndex].workhours,
                            resourceData[productLineIndex].peopleNum,
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
                    that.isDone = true;
                }
            }).catch((error) => {
                that.$Message.error({
                  content: "服务器异常,请刷新！！",
                  duration: 0,
                  closable: true
                });
                console.log(error);
            });
        },
        // 获取待排产的详情列表
        getAllForAddProgress: function() {
            var that = this;
            this.axios.get(this.seieiURL + "productionplanningdetail/getAllForAddProgress").then((response) => {
                if (response.data.status) {
                    that.$Message.error(response.data.msg);
                } else {
                    that.$store.commit("setWaitingAddProgressList", response.data.data);
                }
            }).catch((error) => {
                that.$Message.error({
                  content: "服务器异常,请刷新！！",
                  duration: 0,
                  closable: true
                });
                console.log(error);
            });
        }
    },
    components: {
        'v-topToolBar': topToolBar,
        'v-productLinBar': productLinBar,
        'v-dateBar': dateBar,
        'v-backgroundCanvas': backgroundCanvas,
        'v-progressBarCanvas': progressBarCanvas,
        'v-windowOfAddProgressBar': windowOfAddProgressBar,
        "v-toast": toast,
    }
}
</script>

<style scoped>

</style>