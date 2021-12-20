<template>
    <div class="windowOfSettingEfficiency-component zIndexSuperTop window" ref="windowOfSettingEfficiencyComponent">
        <div class="header">
            <div class="txt" @mousedown="mouseDown">自选效率</div>
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
                    效率
                </div>
                <div class="txt">
                    {{activedProgressBar.getEfficiencyOfSource(productLineList[activedProgressBar.getProductLineIndex])}}
                </div>
            </div>
            <div class="item">
                <div class="title">
                    自选效率
                </div>
                <div class="txt">
                    <InputNumber :min="0" v-model="efficiencyOfSetting" :step="0.01"></InputNumber>
                </div>
            </div>
            <div class="btn" @click="setEfficiency">
                确 认
            </div>
        </div>
    </div>
</template>

<script>
import HistoryObj from "../../vo/historyObj";
import DateUtil from "../../common/dateUtil";

export default {
    data: function() {
        return {
            factoryCalendar: null, // 工厂日历
            colorSetting: null, // 颜色设置
            efficiencyOfSetting: 0, // 自选效率
        }
    },
    computed: {
        // 激活的进度条
        activedProgressBar: function() {
            this.efficiencyOfSetting = this.$store.state.activedProgressBar.getEfficiencyOfSetting;
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
    created: function() {
        this.factoryCalendar = this.$store.state.factoryCalendarObj;
        this.colorSetting = this.$store.state.colorSetting;
    },
    methods: {
        // 隐藏窗口
        hideWindow: function() {
            this.clearActivedProgressBar();
            this.$store.commit("setIsShowWindowOfSettingEfficiency", false);
        },
        // 点击标题栏，拖动
        mouseDown: function() {
            this.$store.commit("setIsShowBackgroundForDrawWindow", true);
            this.$store.commit("setDomOfDragWindow", this.$refs["windowOfSettingEfficiencyComponent"]);
        },
        // 确认自选效率
        setEfficiency: function() {
            var activedProgressBar = this.activedProgressBar;
            var productLineList = this.productLineList;
            var activedProductLine = productLineList[activedProgressBar.getProductLineIndex];
            var argumentSetting = this.$store.state.argumentSetting; // 参数设置
            var timeStampOfToday = DateUtil.getTimeStampOfToday;
            var startTimeStamp = activedProgressBar.getStartTime > timeStampOfToday ? activedProgressBar.getStartTime : timeStampOfToday; // 用于计算结束时间的开始时间节点

            /**
             * 记录历史操作
             */
            var historyObj = null;
            var productLineListTemp = [];
            if (this.$store.state.historyObjList.length == 0) {
                for (var i=0; i<productLineList.length; i++) {
                    productLineListTemp.push(productLineList[i].copy());
                }
                historyObj = new HistoryObj(
                    productLineListTemp,
                    null
                )
                this.$store.commit("pushHistoryObjList", historyObj);
            }

            /**
             * 自选效率确认后，数据更新（删除进度数据后，重新插入）
             */ 
            activedProductLine.removeProgressById(activedProgressBar.getId);
            activedProgressBar.setEfficiencyOfSetting(this.efficiencyOfSetting);
            activedProgressBar.reloadWithOutSettingStartTime(activedProductLine, this.factoryCalendar, startTimeStamp);
            var activedProgressBarIndex = Number(activedProductLine.addProgressWithOutAmendAtFirst(activedProgressBar, this.factoryCalendar)); // 激活生产线添加进度条
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

            /**
             * 重新渲染
             */
            activedProductLine.clear(this.ctxOfSource); // 清空图层
            activedProductLine.renderWithOutIdList(this.ctxOfSource, this.colorSetting, null, null); // 渲染生产线

            /**
             * 记录历史操作
             */
            productLineListTemp = [];
            for (var i=0; i<productLineList.length; i++) {
                productLineListTemp.push(productLineList[i].copy());
            }
            historyObj = new HistoryObj(
                productLineListTemp,
                null
            );
            this.$store.commit("pushHistoryObjList", historyObj);

            /**
             * 记录激活的生产线索引对象
             */
            this.$store.commit("addActivedObjListOfProductLine", {
                productLineIndex: activedProductLine.getIndex,
                progressBarIndex: Number(activedProgressBarIndex)
            });

            // 关闭窗口
            this.hideWindow();
        }
    }
}
</script>

<style scoped>
.windowOfSettingEfficiency-component {
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