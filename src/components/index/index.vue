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

export default {
    data: function() {
        return {
            productLineList:[],
        }
    },
    computed: {
    },
    created: function() {
        var that = this;
        var data = [
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
/*                     {
                        btime: 1570636800000, // 9-6
                        etime: 1570896000000 // 9-15
                    },
                    {
                        btime: 1570896000000, // 9-6
                        etime: 1571068800000 // 9-15
                    } */
                ]
            },
            {
                id: "234",
                name: "234",
                progressList: [
                ]
            },
            {
                id: "345",
                name: "345",
                progressList: [
                ]
            },
            {
                id: "456",
                name: "456",
                progressList: [
                ]
            },
            {
                id: "456",
                name: "456",
                progressList: [
                ]
            },
            {
                id: "456",
                name: "456",
                progressList: [
                ]
            },
            {
                id: "456",
                name: "456",
                progressList: [
                ]
            },
            {
                id: "456",
                name: "456",
                progressList: [
                ]
            },
            {
                id: "456",
                name: "456",
                progressList: [
                ]
            },
            {
                id: "456",
                name: "456",
                progressList: [
                ]
            },
            {
                id: "456",
                name: "456",
                progressList: [
                ]
            },
            {
                id: "456",
                name: "456",
                progressList: [
                ]
            },
            {
                id: "456",
                name: "456",
                progressList: [
                ]
            },
            {
                id: "456",
                name: "456",
                progressList: [
                ]
            },
            {
                id: "456",
                name: "456",
                progressList: [
                ]
            },
            {
                id: "456",
                name: "456",
                progressList: [
                ]
            },
            {
                id: "456",
                name: "456",
                progressList: [
                ]
            },
        ]
        // 获取 data 数据
        var dataList = [];
        for (var productLineIndex=0; productLineIndex<data.length; productLineIndex++) {
            var productLineData = data[productLineIndex];
            var progressObjList = []
            for (var progressIndex=0; progressIndex<productLineData.progressList.length; progressIndex++) {
                var progressData = productLineData.progressList[progressIndex];
                var progressObj = new ProgressBar(productLineIndex, progressData.orderNo, progressData.btime, progressData.etime, progressData.quantityOfWork, progressData.hadDoneQuantityOfWork);
                progressObjList.push(progressObj);
            }
            dataList.push(new ProductLine(productLineData.id, productLineData.name, productLineIndex, progressObjList));
        }
        this.productLineList = dataList;
        



    },
    methods: {
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