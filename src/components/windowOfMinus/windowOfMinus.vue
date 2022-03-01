<template>
    <div class="windowOfMinus-component zIndexSuperTop window" ref="windowOfMinusComponent">
        <div class="header">
            <div class="txt" @mousedown="mouseDown">减 数</div>
            <div class="closeBtn" @click="hideWindow">
                <Icon type="ios-close-circle" />
            </div>
        </div>
        <div class="container">
            <div class="item">
                <div class="title">
                    制单号
                </div>
                <div class="txt">
                    {{activedProgressBar.getMsgOfProgressBar.orderno}}
                </div>
            </div>
            <div class="item">
                <div class="title">
                    颜色
                </div>
                <div class="txt">
                    {{activedProgressBar.getMsgOfProgressBar.color}}
                </div>
            </div>
            <div class="item">
                <div class="title">
                    尺码
                </div>
                <div class="txt">
                    {{activedProgressBar.getMsgOfProgressBar.sizes}}
                </div>
            </div>
            <div class="item">
                <div class="title">
                    分批走货数
                </div>
                <div class="txt">
                    {{activedProgressBar.getQtyofbatcheddelivery}}
                </div>
            </div>
            <div class="item">
                <div class="title">
                    已完成数
                </div>
                <div class="txt">
                    <InputNumber :max="activedProgressBar.getQtyofbatcheddelivery" :min="0" v-model="numOfDone"></InputNumber>
                </div>
            </div>
            <div class="btn" @click="minus">
                确 认 减 数
            </div>
        </div>
    </div>
</template>

<script>
import DateUtil from "../../common/dateUtil";

export default {
    data: function() {
        return {
            numOfDone: 0, // 已完成数
            factoryCalendar: null, // 工厂日历
            colorSetting: null, // 颜色设置
        }
    },
    computed: {
        // 激活的进度条
        activedProgressBar: function() {
            this.numOfDone = this.$store.state.activedProgressBar.getQtyFinish;
            return this.$store.state.activedProgressBar;
        },
        // 生产线列表
        productLineList: function() {
            return this.$store.state.productLineList;
        },
        // 源画布
        ctxOfSource: function() {
            return this.$store.state.ctxOfSource;
        }
    },
    methods: {
        // 隐藏窗口
        hideWindow: function() {
            this.clearActivedProgressBar();
            this.$store.commit("setIsShowWindowOfMinus", false);
        },
        // 点击减数按钮
        minus: function() {
            var productLineList = this.productLineList;
            var activedProgressBar = this.activedProgressBar;
            var activedProductLine = productLineList[activedProgressBar.getProductLineIndex];
            var activedProgressBarIndex = activedProductLine.getProgressIndexById(activedProgressBar.getId);
            var argumentSetting = this.$store.state.argumentSetting; // 参数设置

            /**
             * 记录历史操作（之前没有记录过历史操作，则初始化历史记录快照）
             */
            this.initHistoryObjList(productLineList, null);

            /**
             * 减数操作
             */
            var timeStampOfToday = DateUtil.getTimeStampOfToday;
            activedProgressBar.minus(activedProductLine, this.factoryCalendar, this.numOfDone, timeStampOfToday);
            // 如果设置减数后顺延
            if (argumentSetting.getAfterMinusHasamend) {
                activedProductLine.removeProgressById(activedProgressBar.getId);
                activedProductLine.addProgressWithOutAmendAtFirst(activedProgressBar, this.factoryCalendar)
            }

            // 如果参数设置了自动消除空隙
            if (argumentSetting.getIsRemoveGapModelAfterMinusOrChangeEfficiency) {
                // 消除间隙操作
                var progressList = activedProductLine.getProgressList;
                for (var i=activedProgressBarIndex+1; i<progressList.length; i++) {
                    // 如果没有重叠
                    if (progressList[i-1].getEndTime < progressList[i].getStartTime) {
                        progressList[i].reload(activedProductLine, this.factoryCalendar, progressList[i-1].getEndTime); // 消除间隙
                    }
                }
            }
            // 重新渲染
            activedProductLine.clear(this.ctxOfSource);
            activedProductLine.renderWithOutIdList(this.ctxOfSource, this.colorSetting, null, []);

            /**
             * 记录历史操作
             */
            this.pushHistoryObjList(productLineList, null, null);

            /**
             * 记录激活的生产线索引对象
             */
            this.$store.commit("addActivedObjListOfProductLine", {
                productLineIndex: activedProgressBar.getProductLineIndex,
                progressBarIndex: activedProgressBarIndex
            });
            
            // 关闭窗口
            this.hideWindow();
        },
        // 点击标题栏，拖动
        mouseDown: function() {
            this.$store.commit("setIsShowBackgroundForDrawWindow", true);
            this.$store.commit("setDomOfDragWindow", this.$refs["windowOfMinusComponent"]);
        }
    },
    created: function() {
        this.factoryCalendar = this.$store.state.factoryCalendarObj;
        this.colorSetting = this.$store.state.colorSetting;
    },
}
</script>

<style scoped>
.windowOfMinus-component {
	position: fixed;
	top: 100px;
    left: 30%;
    width: 300px;
	background-color: #fff;
	border:2px solid #1b72ce;
}
.container .item {
    margin-top: 10px;
    font-size: 18px;
}
.container .item .title {
    display: inline-block;
    width: 35%;
    padding-left: 10px;
    vertical-align: top;
}
.container .item .txt {
    display: inline-block;
    width: 60%;
    font-weight: 400;
    word-break: break-word;
    vertical-align: top;
}
.container .btn {
    margin: 30px auto;
    width: 150px;
    line-height: 1.8em;
    text-align: center;
    font-size: 18px;
    background-color: #4fa0f6;
    color: #fff;
    border-radius: 5px;
}
.container .btn:hover {
    background-color: #1b72ce;
	cursor:pointer;
}
</style>