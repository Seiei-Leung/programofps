<template>
    <div class="backgroundCanvas-component" v-bind:style="{top: msgOfCanvas.top, left: msgOfCanvas.left}">
        <!-- 画布必须设置 长与宽，注意不是 css 中的长与宽-->
        <canvas class="background" ref="background" v-bind:width="msgOfCanvas.width" v-bind:height="msgOfCanvas.height"></canvas>
    </div>
</template>

<script>
import DateUtil from "../../common/dateUtil";
import CONST from "../../common/const";

export default {
    props: ['countOfProductLines'],
    data: function() {
        return {
            dayCountOfShow: DateUtil.dayCountOfShow
        }
    },
    computed: {
        msgOfCanvas: function() {
            return {
                width: this.dayCountOfShow * (CONST.STYLEOFCELL.width + 2*CONST.STYLEOFCELL.lineWidth),
                height: this.countOfProductLines * (CONST.STYLEOFCELL.height + 2*CONST.STYLEOFCELL.lineWidth) + CONST.STYLEOFCELL.lineWidth,
                top: CONST.STYLEOFPRODUCTLINESBAR.height + CONST.STYLEOFTOOLBAR.height - CONST.STYLEOFPRODUCTLINESBAR.lineWidth - CONST.STYLEOFTOOLBAR.lineWidth + "px",
                left: CONST.STYLEOFPRODUCTLINESBAR.width - CONST.STYLEOFPRODUCTLINESBAR.lineWidth + "px"
            }
        }
    },
    // 挂载
    mounted: function() {
        // 画布渲染
        var backgroundDom = this.$refs.background;
        var ctx = backgroundDom.getContext("2d");//设置2D渲染区
        ctx.lineWidth = CONST.STYLEOFCELL.lineWidth; //设置线的宽度
        ctx.strokeStyle = '#ddd';
        var dayCountOfShow = this.dayCountOfShow;
        var countOfProductLines = this.countOfProductLines;
        for (var n=0; n<countOfProductLines; n++) {
            for (var m=0; m<dayCountOfShow; m++) {
                ctx.strokeRect(m*(CONST.STYLEOFCELL.width + 2*CONST.STYLEOFCELL.lineWidth)+0.5, n*(CONST.STYLEOFCELL.height + 2*CONST.STYLEOFCELL.lineWidth)+0.5, (CONST.STYLEOFCELL.width + 2*CONST.STYLEOFCELL.lineWidth), (CONST.STYLEOFCELL.height + 2*CONST.STYLEOFCELL.lineWidth))
            }
        }
    },
    methods: {

    }
}
</script>

<style scoped>
.backgroundCanvas-component {
    position: absolute;
}
</style>