<template>
    <div class="backgroundCanvas-component" v-bind:style="{top: msgOfCanvas.top, left: msgOfCanvas.left}">
        <!-- 画布必须设置 长与宽，注意不是 css 中的长与宽-->
        <canvas class="background" ref="background" v-bind:width="msgOfCanvas.width" v-bind:height="msgOfCanvas.height"></canvas>
        <canvas v-show="isShowNumberofwork" class="backgroundOfPeople" ref="backgroundOfPeople" v-bind:width="msgOfCanvas.width" v-bind:height="msgOfCanvas.height"></canvas>
        <canvas v-show="isShowWorkingHours" class="backgroundOfHours" ref="backgroundOfHours" v-bind:width="msgOfCanvas.width" v-bind:height="msgOfCanvas.height"></canvas>
    </div>
</template>

<script>
import DateUtil from "../../common/dateUtil";
import CONST from "../../common/const";

export default {
    data: function() {
        return {
            dayCountOfShow: DateUtil.dayCountOfShow
        }
    },
    computed: {
        // 画布 CSS 信息
        msgOfCanvas: function() {
            return {
                width: this.dayCountOfShow * (CONST.STYLEOFCELL.width + 2*CONST.STYLEOFCELL.lineWidth),
                height: this.countOfProductLines * (CONST.STYLEOFCELL.height + 2*CONST.STYLEOFCELL.lineWidth) + CONST.STYLEOFCELL.lineWidth,
                top: CONST.STYLEOFPRODUCTLINESBAR.height + CONST.STYLEOFTOOLBAR.height - CONST.STYLEOFPRODUCTLINESBAR.lineWidth - CONST.STYLEOFTOOLBAR.lineWidth + "px",
                left: CONST.STYLEOFPRODUCTLINESBAR.width - CONST.STYLEOFPRODUCTLINESBAR.lineWidth + "px"
            }
        },
        // 生产线的个数
        countOfProductLines: function() {
            return this.$store.state.productLineList.length;
        },
        // 生产线数据列表
        productLineList: function() {
            return this.$store.state.productLineList;
        },
        // 是否显示人数画布
        isShowNumberofwork: function() {
            return this.$store.state.isShowNumberofwork;
        },
        // 是否显示工时画布
        isShowWorkingHours: function() {
            return this.$store.state.isShowWorkingHours;
        }
    },
    // 挂载
    mounted: function() {
        // 画布渲染
        var backgroundDom = this.$refs.background;
        var ctxOfBackground = backgroundDom.getContext("2d"); //设置2D渲染区，背景图层上下文
        var backgroundOfPeopleDom = this.$refs.backgroundOfPeople; 
        var ctxOfBackgroundOfPeople = backgroundOfPeopleDom.getContext("2d"); // 工作人数背景图层上下文
        var backgroundOfHoursDom = this.$refs.backgroundOfHours;
        var ctxOfBackgroundOfHours = backgroundOfHoursDom.getContext("2d"); // 工时背景图层上下文
        
        ctxOfBackgroundOfPeople.fillStyle = CONST.STYLEOFCELL.fillColor;
        ctxOfBackgroundOfPeople.font =  CONST.STYLEOFCELL.fontStyle;
        ctxOfBackgroundOfPeople.textBaseline = "top";
        ctxOfBackgroundOfHours.fillStyle = CONST.STYLEOFCELL.fillColor;
        ctxOfBackgroundOfHours.font =  CONST.STYLEOFCELL.fontStyle;
        ctxOfBackgroundOfHours.textBaseline = "top";

        ctxOfBackground.lineWidth = CONST.STYLEOFCELL.lineWidth; //设置线的宽度
        ctxOfBackground.strokeStyle = CONST.STYLEOFCELL.borderColor;
        ctxOfBackground.fillStyle = CONST.STYLEOFCELL.activedBackgroundColor;
        var dayCountOfShow = this.dayCountOfShow;
        var countOfProductLines = this.countOfProductLines;
        for (var n=0; n<countOfProductLines; n++) {
            for (var m=0; m<dayCountOfShow; m++) {
                if (this.$store.state.factoryCalendarObj.isHoliday(DateUtil.indexToDateStr(m))) {
                    ctxOfBackground.fillRect(m*(CONST.STYLEOFCELL.width + 2*CONST.STYLEOFCELL.lineWidth)+0.5, n*(CONST.STYLEOFCELL.height + 2*CONST.STYLEOFCELL.lineWidth)+0.5, (CONST.STYLEOFCELL.width + 2*CONST.STYLEOFCELL.lineWidth), (CONST.STYLEOFCELL.height + 2*CONST.STYLEOFCELL.lineWidth));
                }
                // 渲染单元格
                ctxOfBackground.strokeRect(m*(CONST.STYLEOFCELL.width + 2*CONST.STYLEOFCELL.lineWidth)+0.5, n*(CONST.STYLEOFCELL.height + 2*CONST.STYLEOFCELL.lineWidth)+0.5, (CONST.STYLEOFCELL.width + 2*CONST.STYLEOFCELL.lineWidth), (CONST.STYLEOFCELL.height + 2*CONST.STYLEOFCELL.lineWidth));
                // 渲染工作人数
                var peopleNum = this.productLineList[n].getPeopleNumByDate(DateUtil.strToTimeStamp(DateUtil.indexToDateStr(m)));
                ctxOfBackgroundOfPeople.fillText(peopleNum, m*(CONST.STYLEOFCELL.width + 2*CONST.STYLEOFCELL.lineWidth)+0.5+CONST.STYLEOFCELL.paddingLeft, n*(CONST.STYLEOFCELL.height + 2*CONST.STYLEOFCELL.lineWidth)+0.5+CONST.STYLEOFCELL.paddingTop);
                
                // 渲染工时
                var workHours = this.productLineList[n].getWorkHoursByDate(DateUtil.strToTimeStamp(DateUtil.indexToDateStr(m)));
                ctxOfBackgroundOfHours.fillText(workHours, m*(CONST.STYLEOFCELL.width + 2*CONST.STYLEOFCELL.lineWidth)+0.5+CONST.STYLEOFCELL.paddingLeft, n*(CONST.STYLEOFCELL.height + 2*CONST.STYLEOFCELL.lineWidth)+0.5+CONST.STYLEOFCELL.paddingTop);
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
.backgroundOfPeople {
    position: absolute;
    top: 0;
}
.backgroundOfHours {
    position: absolute;
    top: 0;
}
</style>