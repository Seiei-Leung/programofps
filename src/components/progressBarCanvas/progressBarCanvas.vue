<template>
    <div class="progressBarCanvas-component" v-bind:style="{top: msgOfCanvas.top + 'px', left: msgOfCanvas.left + 'px'}">
        <!-- 源画布 -->
        <canvas 
            class="sourceCanvas"
            ref="sourceCanvas"
            v-bind:width="msgOfCanvas.width"
            v-bind:height="msgOfCanvas.height"
            @mousedown="mousedownOfSourceCanvas"
            @dblclick="dblclickOfSourceCanvas($event)"
            @mousemove="mousemoveOfSourceCavnas($event)"
            @contextmenu.prevent="showWindowOfMenu($event)"
        ></canvas>
        <!-- 移动画布 -->
        <canvas
            v-show="isShowCtxOfTmp"
            class="tempCanvas zIndexTop"
            ref="tempCanvas"
            v-bind:width="msgOfCanvas.width"
            v-bind:height="msgOfCanvas.height"
            @mousemove="mousemoveOfTempCanvas($event)"
            @click="mouseupOfTempCanvas($event)"
        ></canvas>
    </div>
</template>

<script>
import CONST from "../../common/const";
import DateUtil from "../../common/dateUtil";
import StrUtil from "../../common/strUtil";
import M2V from "../../common/M2V";
import V2M from "../../common/V2M";
import HistoryObj from "../../vo/historyObj";

var tOfMouseHoverOfSourceCanvas; // 源画布悬浮计时器

export default {
    data: function() {
        return {
            factoryCalendar: null, // 工厂日历
            dayCountOfShow: DateUtil.dayCountOfShow, // 显示总天数
            ctxOfSource: null, // 源画布的上下文
            ctxOfTemp: null, // 移动画布的上下文
            beforeProductLineIndex: null, // 激活进度条的原来生产线的索引
            afterProductLineIndex: null, // 激活进度条移动后的生产线索引
            
        }
    },
    computed: {
        // 画布位置，大小信息
        msgOfCanvas: function() {
            return {
                width: this.dayCountOfShow * (CONST.STYLEOFCELL.width + 2*CONST.STYLEOFCELL.lineWidth),
                height: this.productLineList.length * (CONST.STYLEOFCELL.height + 2*CONST.STYLEOFCELL.lineWidth) + CONST.STYLEOFCELL.lineWidth,
                top: CONST.STYLEOFPRODUCTLINESBAR.height + CONST.STYLEOFTOOLBAR.height - CONST.STYLEOFPRODUCTLINESBAR.lineWidth - CONST.STYLEOFTOOLBAR.lineWidth,
                left: CONST.STYLEOFPRODUCTLINESBAR.width - CONST.STYLEOFPRODUCTLINESBAR.lineWidth
            }
        },
        // 是否显示移动画布
        isShowCtxOfTmp: function() {
            return this.$store.state.isShowCtxOfTmp;
        },
        productLineList: function() {
            return this.$store.state.productLineList;
        }
    },
    mounted: function() {
        // 画布渲染
        var sourceCanvas = this.$refs.sourceCanvas;
        var ctxOfSource = sourceCanvas.getContext("2d"); //设置2D渲染区
        var tempCanvas = this.$refs.tempCanvas;
        var ctxOfTemp = tempCanvas.getContext("2d");
        this.$store.commit('setCtxOfSource', ctxOfSource);
        this.ctxOfSource = ctxOfSource;
        this.$store.commit('setCtxOfTemp', ctxOfTemp);
        this.ctxOfTemp = ctxOfTemp;
        this.productLineList.forEach((item) => {
            item.renderWithOutIdList(this.ctxOfSource, null);
        });
    },
    created: function() {
        this.factoryCalendar = this.$store.state.factoryCalendarObj;
    },
    methods: {
        /*
            源数据画布事件
        */
        // 在源数据画布中点击
        dblclickOfSourceCanvas: function(e) {
            // 获取当前激活的进度条
            var progressBar =this.getProgressBarByXY(e);
            if (progressBar == null) {
                return;
            }
            
            this.beforeProductLineIndex = progressBar.getProductLineIndex;
            this.$store.commit("toggleIsShowCtxOfTmp");

            // 清除源画布
            this.productLineList[progressBar.getProductLineIndex].clear(this.ctxOfSource);
            this.productLineList[progressBar.getProductLineIndex].renderWithOutIdList(this.ctxOfSource, [progressBar.getId]);

            // 渲染移动画布
            progressBar.render(this.ctxOfTemp, false);
            this.$store.commit("setActivedProgressBar", progressBar);
        },
        // 在源数据画布移动
        mousemoveOfSourceCavnas: function(e) {
            clearTimeout(tOfMouseHoverOfSourceCanvas);
            var that = this;
            var x = e.clientX - this.msgOfCanvas.left + window.pageXOffset;
            var y = e.clientY - this.msgOfCanvas.top + window.pageYOffset;
            tOfMouseHoverOfSourceCanvas = setTimeout(() => {that.getProgressBarByXY(e)}, 500);
        },

        /*
            临时画布绑定事件
        */
        // 鼠标拖动
        mousemoveOfTempCanvas: function(e) {
            var activedProgressBar = this.$store.state.activedProgressBar;
            var totalWidth = this.msgOfCanvas.width + CONST.STYLEOFPRODUCTLINESBAR.width; // 整个排产器的总宽度
            var totalHeight = this.msgOfCanvas.height + this.msgOfCanvas.top; // 整个排产器的总高度
            var widthOfWindow = document.body.clientWidth; // 浏览器窗口的宽度
            var heightOfWindow = document.body.clientHeight; // 浏览器窗口的长度
            
            /**
             * 拖动时的自行滚动
             */
            // 左右移动
            // 拖动时，鼠标的位置在最右侧的四个单元格之类
            if (widthOfWindow - e.clientX < (4*CONST.STYLEOFCELL.width)) {
                // 滚动条离最右的差值
                var differenceX = totalWidth - (window.pageXOffset + widthOfWindow);
                // 且滚动条还能向右滚动 50 px
                if (differenceX > 50) {
                    window.scroll(window.pageXOffset + 50, window.pageYOffset);
                }
                // 已经不能在向右移动 50 px，但还有多余数值，所以默认移动到最右
                else if (0<differenceX && differenceX <= 50) {
                    window.scroll(totalWidth - widthOfWindow, window.pageYOffset);
                }
            } 
            // 拖动时，鼠标的位置在最左的两个单元格之类
            else if (e.clientX < (2*CONST.STYLEOFCELL.width + CONST.STYLEOFPRODUCTLINESBAR.width)) {
                // 滚动条还能向左滚动 50 px
                if (window.pageXOffset > 50) {
                    window.scroll(window.pageXOffset - 50, window.pageYOffset);
                }
                // 已经不能在向左移动 50 px，但还有多余数值，所以默认移动到最左
                else if (0<window.pageXOffset && window.pageXOffset <= 50) {
                    window.scroll(0, window.pageYOffset);
                }
            }
            // 上下移动
            // 拖动时，鼠标的位置在最底侧的四个单元格之类
            if (heightOfWindow - e.clientY < (4*CONST.STYLEOFCELL.height)) {
                // 滚动条离最底侧的差值
                var differenceY = totalHeight - (window.pageYOffset + heightOfWindow);
                // 且滚动条还能向下滚动 50 px
                if (differenceY > 50) {
                    window.scroll(window.pageXOffset, window.pageYOffset + 50);
                }
                // 已经不能在向下移动 50 px，但还有多余数值，所以默认移动到最低
                else if (0<differenceY && differenceY <= 50) {
                    window.scroll(window.pageXOffset, totalHeight - heightOfWindow);
                }
            }
            // 拖动时，鼠标的位置在最上的两个单元格之类
            else if (e.clientY < (2*CONST.STYLEOFCELL.height + this.msgOfCanvas.top)) {

                // 滚动条还能向上移动 50 px
                if (window.pageYOffset > 50) {
                    window.scroll(window.pageXOffset, window.pageYOffset - 50);
                }
                // 已经不能在向上移动 50 px，但还有多余数值，所以默认移动到最上
                else if (0<window.pageYOffset && window.pageYOffset <= 50) {
                    window.scroll(window.pageXOffset, 0);
                }
            }

            // 移动渲染图层
            var x = e.clientX - this.msgOfCanvas.left + window.pageXOffset;
            var y = e.clientY - this.msgOfCanvas.top + window.pageYOffset;
            activedProgressBar.move(this.ctxOfTemp, x, y);
        },
        // 松开鼠标键
        mouseupOfTempCanvas: function(e) {
            /**
             * 一系列变量的复制
             */
            var activedProgressBar = this.$store.state.activedProgressBar;
            var productLineList = this.productLineList;
            var x = e.clientX - this.msgOfCanvas.left + window.pageXOffset; // 记录鼠标坐标
            var y = e.clientY - this.msgOfCanvas.top + window.pageYOffset; // 记录鼠标坐标
            this.afterProductLineIndex = V2M.yToProductLineIndex(productLineList, y); // 移动后所在生产线的索引
            var activedProductLine = productLineList[this.afterProductLineIndex]; // 移动后所在的生产线
            var beforeProductLine = null; // 移动前所在的生产线
            // 如果不是新增的进度条，赋值 beforeProductLine
            if (activedProgressBar.getProductLineIndex != null) {
                beforeProductLine = productLineList[this.beforeProductLineIndex]; // 赋值 beforeProductLine
            }
            var startTimeStamp = V2M.xToTimeStamp(x); // 开启时间戳
            console.log("鼠标松开按键时的所在生产生产线：" + activedProductLine.fullName);

            /**
             * 清空临时画布，及隐藏它
             */
            this.ctxOfTemp.clearRect(0, 0, this.ctxOfTemp.canvas.offsetWidth, this.ctxOfTemp.canvas.offsetHeight);
            this.$store.commit("toggleIsShowCtxOfTmp");
            
            /**
             * 生产线没有对应的效率
             */
            if (activedProductLine.getEfficiency(activedProgressBar.getProductStyleName) == null) {
                this.showToast("生产线没有相对应的效率");
                // 还原数据
                if (beforeProductLine) {
                    // 该排产计划已经排产，则恢复旧生产线数据渲染
                    beforeProductLine.clear(this.ctxOfSource);
                    beforeProductLine.renderWithOutIdList(this.ctxOfSource, null);
                }
                return;
            }

            /**
             * 记录历史操作
             */
            var historyObj = null;
            var productLineListTemp = [];
            if (this.$store.state.historyObjList.length == 0) {
                for (var i=0; i<productLineList.length; i++) {
                    productLineListTemp.push(productLineList[i].copy());
                }
                if (beforeProductLine) {
                    historyObj = new HistoryObj(
                        productLineListTemp,
                        null
                    );
                } else {
                    historyObj = new HistoryObj(
                        productLineListTemp,
                        [...this.$store.state.waitingAddProgressList],
                    )
                }
                this.$store.commit("pushHistoryObjList", historyObj);
            }

            /**
             * 删除旧数据
             */
            if (beforeProductLine) {
                // 该排产计划已经排产，则从源生产线中删除该数据
                beforeProductLine.removeProgressById(activedProgressBar.getId);
            } else {
                // 该排产计划尚未排产，从 等待排产的列表中删除该元素
                this.$store.commit("removeWaitingAddProgressList", activedProgressBar.getId);
            }

            /**
             * 设置数据
             */
            // 松开鼠标后，激活进度条的初步更新数据，初步渲染
            activedProgressBar.reload(activedProductLine, this.factoryCalendar, startTimeStamp);
            // console.log(DateUtil.timeStampToDate(activedProgressBar.getStartTime));
            // console.log(DateUtil.timeStampToDate(activedProgressBar.getEndTime));
            // 移动后，激活进度条移出了原来的生产线
            if (this.beforeProductLineIndex != this.afterProductLineIndex) {
                // console.log("进度条移出了原来的生产线");
            }
            else {
            // 移动后，激活进度条没有移出原来的生产线
                // console.log("进度条没有移出原来的生产线");
            }

            /**
             * 生产线重新刷新数据，并渲染图层
             */
            activedProductLine.clear(this.ctxOfSource); // 清空图层
            var activedProgressIndex = activedProductLine.addProgress(activedProgressBar, this.factoryCalendar); // 激活生产线添加进度条
            activedProductLine.renderWithOutIdList(this.ctxOfSource, null); // 渲染生产线

            /**
             * 记录历史操作
             */
            productLineListTemp = [];
            for (var i=0; i<productLineList.length; i++) {
                productLineListTemp.push(productLineList[i].copy());
            }
            if (beforeProductLine) {
                historyObj = new HistoryObj(
                    productLineListTemp,
                    null
                );
            } else {
                historyObj = new HistoryObj(
                    productLineListTemp,
                    [...this.$store.state.waitingAddProgressList],
                )
            }
            this.$store.commit("pushHistoryObjList", historyObj);
            
            /**
             * 记录激活的生产线索引对象
             */
            this.$store.commit("addActivedObjListOfProductLine", {
                productLineIndex: activedProductLine.getIndex,
                progressBarIndex: Number(activedProgressIndex)
            });
            if (beforeProductLine) {
                this.$store.commit("addActivedObjListOfProductLine", {
                    productLineIndex: beforeProductLine.getIndex,
                    progressBarIndex: null
                });
            }
        },
        // 在数据画布悬浮，获取对应的激活的进度条
        getProgressBarByXY: function(e) {
            var x = e.clientX - this.msgOfCanvas.left + window.pageXOffset;
            var y = e.clientY - this.msgOfCanvas.top + window.pageYOffset;
            // 获取当前激活生产线
            var productLineIndex = V2M.yToProductLineIndex(this.productLineList, y);
            var progressBarList = this.productLineList[productLineIndex].getProgressList;
            // 循环当前激活的生产线的进度条，检测是否在点击范围内
            for (var progressIndex=0; progressIndex<progressBarList.length; progressIndex++) {
                if (progressBarList[progressIndex].isInArea(x, y)) {
                    return progressBarList[progressIndex];
                }
            }
            // 循环完都没有，返回 null
            return null;
        },
        // 左键显示菜单
        showWindowOfMenu: function(e) {
            // 获取当前激活的进度条
            var progressBar = this.getProgressBarByXY(e);
            // 如果没有激活进度条则不显示
            if (progressBar == null) {
                this.$store.commit("setIsShowWindowOfMenu", false);
                return;
            }
            this.$store.commit("setActivedProgressBar", progressBar);
            // 设置窗口位置
            var obj = {
                left: e.clientX + "px",
                top: e.clientY + "px"
            }
            this.$store.commit("setMsgOfWindowOfMenu", obj);
            this.$store.commit("closeAllWindow");
            this.$store.commit("setIsShowWindowOfMenu", true);
        },
        // 源画布鼠标点击事件
        mousedownOfSourceCanvas: function() {
            this.$store.commit("setIsShowWindowOfMenu", false);
        }
    }
}
</script>

<style scoped>
.progressBarCanvas-component {
    position: absolute;
}
.sourceCanvas {

}
.tempCanvas {
    position: absolute;
    top: 0;
}
</style>