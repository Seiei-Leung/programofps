<template>
    <div id="index-component">
        <!-- 编辑工具栏 -->
        <v-topToolBar></v-topToolBar>
        <!-- 左侧生产线栏 -->
        <v-productLinBar v-bind:productLineList="productLineList" ref="productLinesBarHook"></v-productLinBar>
        <!-- 日期栏 -->
        <v-dateBar></v-dateBar>
        <!-- 背景画布 -->
        <v-backgroundCanvas v-bind:countOfProductLines="productLineList.length"></v-backgroundCanvas>
        <!-- 装载进度条画布 -->
        <v-progressBarCanvas
            v-bind:productLineList="productLineList"
        ></v-progressBarCanvas>
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

export default {
    data: function() {
        return {
            productLineList:[],
        }
    },
    computed: {
    },
    created: function() {
        console.log(123);
        this.getFactoryCalendar();
/*         var dataOfProductLine = [
            {
                id: "123",
                name: "123",
                progressList: [
                    {
                        orderNo: "123",
                        btime: 1567353600000, // 9-6 new Date("2019-10-13 0:0:0").getTime()
                        etime: 1570636800000, // 9-15
                        quantityOfWork: 100,
                        hadDoneQuantityOfWork: 30,
                    },
                ]
            }
        ];
        // 获取 data 数据
        var dataList = [];
        for (var productLineIndex=0; productLineIndex<dataOfProductLine.length; productLineIndex++) {
            var productLineData = dataOfProductLine[productLineIndex];
            var progressObjList = []
            for (var progressIndex=0; progressIndex<productLineData.progressList.length; progressIndex++) {
                var progressData = productLineData.progressList[progressIndex];
                var progressObj = new ProgressBar(productLineIndex, progressData.orderNo, progressData.btime, progressData.etime, progressData.quantityOfWork, progressData.hadDoneQuantityOfWork);
                progressObjList.push(progressObj);
            }
            dataList.push(new ProductLine(productLineData.id, productLineData.name, productLineIndex, progressObjList));
        }
        this.productLineList = dataList; */
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
                    console.log(resourceData);
                    var productlineList = [];
                    for (var productLineIndex=0; productLineIndex<resourceData.lenght; productLineIndex++) {
                        var productLineItem = new ProductLine(
                            resourceData.id,
                            productLineIndex,
                            resourceData.workgroup,
                            resourceData.workshop,
                            resourceData.lineCode,
                            resourceData.workhours,
                            resourceData.peopleNum
                        );
                        var progressList = [];
                        for (var progressIndex=0; progressIndex<resourceData.productionPlanningDetailList.lenght; progressIndex++) {
                            var progressItemTemp = resourceData.productionPlanningDetailList[progressIndex];
                            var progressItem = new ProgressBar(
                                productLineIndex,
                                progressItemTemp.id,
                                progressItemTemp.qtyFinish,
                                progressItemTemp.style,
                                progressItemTemp.sam,
                                progressItemTemp.qtyOfBatchedDelivery,
                                progressItemTemp.startTime,
                                progressItemTemp.endTime,
                                progressItemTemp
                            ); 
                            progressList.push(progressItem);
                        }
                        productLineItem.setProgressList(progressList);
                        productlineList.push(productLineItem);
                    }
                    this.productLineList = productlineList;
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
    }
}
</script>

<style scoped>

</style>