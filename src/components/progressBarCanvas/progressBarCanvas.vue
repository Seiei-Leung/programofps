<template>
    <div class="progressBarCanvas-component" v-bind:style="{top: msgOfCanvas.top + 'px', left: msgOfCanvas.left + 'px'}">
        <canvas 
            class="sourceCanvas"
            ref="sourceCanvas"
            v-bind:width="msgOfCanvas.width"
            v-bind:height="msgOfCanvas.height"
            @mousedown="mousedownOfSourceCanvas($event)"
            @mousemove="mousemoveOfSourceCavnas($event)"
        ></canvas>
        <canvas
            v-show="isShowCtxOfTmp"
            class="tempCanvas zIndexTop"
            ref="tempCanvas"
            v-bind:width="msgOfCanvas.width"
            v-bind:height="msgOfCanvas.height"
            @mousemove="mousemoveOfTempCanvas($event)"
            @mouseup="mouseupOfTempCanvas($event)"
        ></canvas>
    </div>
</template>

<script>
import CONST from "../../common/const";
import DateUtil from "../../common/dateUtil";
import StrUtil from "../../common/strUtil";
import M2V from "../../common/M2V";
import V2M from "../../common/V2M";

var tOfMouseHoverOfSourceCanvas; // 源画布悬浮计时器

export default {
    props: [
        'productLineList', // 生产线个数
        ''
    ],
    data: function() {
        return {
            dayCountOfShow: DateUtil.dayCountOfShow, // 显示总天数
            ctxOfSource: null,
            ctxOfTemp: null,
            V2M: null, // v2m 对象
            isShowCtxOfTmp: false,
            activedProgressBar: null, 
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
            item.progressBarList.forEach((progressBar) => {
                progressBar.render(this.ctxOfSource);
            });
        });
    },
    created: function() {
        this.V2M = new V2M(this.productLineList);
    },
    methods: {
        /*
            源数据画布事件
        */
        // 在源数据画布中点击
        mousedownOfSourceCanvas: function(e) {
            var that = this;
            var progressBar =this.getProgressBarByXY(e);
            if (progressBar == null) {
                return;
            }
            this.isShowCtxOfTmp = true;
            // 清除源画布
            progressBar.clear(this.ctxOfSource);
            // 渲染移动画布
            progressBar.render(this.ctxOfTemp);
            this.activedProgressBar = progressBar;
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
        // 移动
        mousemoveOfTempCanvas: function(e) {
            var activedProgressBar = this.activedProgressBar;
            var x = e.clientX - this.msgOfCanvas.left + window.pageXOffset;
            var y = e.clientY - this.msgOfCanvas.top + window.pageYOffset;
            activedProgressBar.move(this.ctxOfTemp, x, y);
        },
        // 松开鼠标键
        mouseupOfTempCanvas: function(e) {
            var activedProgressBar = this.activedProgressBar;
            // 记录鼠标坐标
            var x = e.clientX - this.msgOfCanvas.left + window.pageXOffset;
            var y = e.clientY - this.msgOfCanvas.top + window.pageYOffset;
            // 清空临时画布，及隐藏它
            this.ctxOfTemp.clearRect(0, 0, this.ctxOfTemp.canvas.offsetWidth, this.ctxOfTemp.canvas.offsetHeight);
            this.isShowCtxOfTmp = false;
            // todo 
            // 1、确定生产线 2、确定宽度 
            // 数据影响图层
            











        },
        // 在数据画布悬浮，获取对应的激活的进度条
        getProgressBarByXY: function(e) {
            var x = e.clientX - this.msgOfCanvas.left + window.pageXOffset;
            var y = e.clientY - this.msgOfCanvas.top + window.pageYOffset;
            var productLineIndex = this.V2M.yToProductLineIndex(y) - 1;
            var progressBarList = this.productLineList[productLineIndex].progressBarList;
            for (var progressIndex=0; progressIndex<progressBarList.length; progressIndex++) {
                if (progressBarList[progressIndex].isInArea(x, y)) {
                    return progressBarList[progressIndex];
                }
            }
            return null;
        }
    },
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