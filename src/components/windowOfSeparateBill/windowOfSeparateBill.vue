<template>
    <div class="windowOfSeparateBill-component zIndexSuperTop window" ref="windowOfSeparateBillComponent">
        <div class="header">
            <div class="txt" @mousedown="mouseDown">拆 单</div>
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
                    {{activedProgressBar.getQtyFinish}}
                </div>
            </div>
            <div class="item">
                <div class="title">
                    拆单数量
                </div>
                <div class="txt">
                    <InputNumber v-bind:max="activedProgressBar.getQtyofbatcheddelivery - activedProgressBar.getQtyFinish" :min="0" v-model="numOfSeparateBill"></InputNumber>
                </div>
            </div>
            <div class="item">
                <div class="title">
                    选择生产线
                </div>
                <div class="txt">
                    <Select v-model="indexOfSelectedProductLine" @on-change="changeSelect" style="width:150px">
                        <Option v-for="item in productLineList" :value="item.getIndex" :key="item.getIndex">{{item.fullName}}</Option>
                    </Select>
                </div>
            </div>
            <div class="btn" @click="separateBill">
                确 认 拆 单
            </div>
        </div>
    </div>
</template>

<script>
import HistoryObj from "../../vo/historyObj";
import ProgressBar from "../../vo/progressBar";

export default {
    data: function() {
        return {
            factoryCalendar: null, // 工厂日历
            numOfSeparateBill: 0, // 拆单数量
            indexOfSelectedProductLine: null, // 拆分到的生产线索引
            colorSetting: null, // 颜色设置
        }
    },
    computed: {
        // 激活的进度条
        activedProgressBar: function() {
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
            this.$store.commit("setIsShowWindowOfSeparateBill", false);
        },
        // 点击标题栏，拖动
        mouseDown: function() {
            this.$store.commit("setIsShowBackgroundForDrawWindow", true);
            this.$store.commit("setDomOfDragWindow", this.$refs["windowOfSeparateBillComponent"]);
        },
        // 修改拆分选择的生产线
        changeSelect: function() {
        },
        // 确定拆单
        separateBill: function() {
            // 检查拆分数量
            if (this.numOfSeparateBill == 0) {
                this.$Message.error("拆分数量不能为零");
                return;
            }
            var indexOfSelectedProductLine = this.indexOfSelectedProductLine; // 选择拆分到的生产线索引
            var activedProgressBar = this.activedProgressBar;
            var productLineList = this.productLineList;
            /**
             * 检查数据是否正确
             */
            // 检查是否已选择拆分生产线
            if (indexOfSelectedProductLine == null) {
                this.$Message.error("尚未选择拆分生产线");
                return;
            }
            // 检查拆分的生产线是否为原来的生产线
            if (indexOfSelectedProductLine == activedProgressBar.getProductLineIndex) {
                this.$Message.error("拆分的生产线不能与原生产线一致");
                return;
            }
            // 检查拆分生产线是否有对应的效率值
            var selectedProductLine = productLineList[indexOfSelectedProductLine]; // 选择拆分到生产线
            if (selectedProductLine.getEfficiency(activedProgressBar.getProductStyleName) == null) {
                this.$Message.error("拆分的生产线没有相对应的效率");
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
                historyObj = new HistoryObj(
                    productLineListTemp,
                    null
                );
                this.$store.commit("pushHistoryObjList", historyObj);
            }

            /**
             * 拆单操作
             */
            // 原排产减数
            activedProgressBar.setQtyofbatcheddelivery(productLineList[activedProgressBar.getProductLineIndex], this.factoryCalendar, (activedProgressBar.getQtyofbatcheddelivery - this.numOfSeparateBill), activedProgressBar.getStartTime);
            // 创建新增生产线对象
            var newMsgOfProgressBar = {...activedProgressBar.getMsgOfProgressBar};
            newMsgOfProgressBar.id = "new" + (new Date()).getTime();
            newMsgOfProgressBar.qtyFinish = 0;
            newMsgOfProgressBar.qtyofbatcheddelivery = this.numOfSeparateBill;
            var newProgressBar = new ProgressBar(indexOfSelectedProductLine, selectedProductLine.getId, newMsgOfProgressBar);
            newProgressBar.setParentId(activedProgressBar.getId);
            // 新增排产信息到拆分生产线的最后
            selectedProductLine.addProgressInTheEnd(newProgressBar, this.factoryCalendar);
            // 重新渲染
            // 被拆分的生产线渲染
            productLineList[activedProgressBar.getProductLineIndex].clear(this.ctxOfSource);
            productLineList[activedProgressBar.getProductLineIndex].renderWithOutIdList(this.ctxOfSource, this.colorSetting, null);
            // 拆分到的生产线渲染
            selectedProductLine.clear(this.ctxOfSource);
            selectedProductLine.renderWithOutIdList(this.ctxOfSource, this.colorSetting, null);

            /**
             * 历史操作
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
                productLineIndex: activedProgressBar.getProductLineIndex,
                progressBarIndex: productLineList[activedProgressBar.getProductLineIndex].getProgressIndexById(activedProgressBar.getId)
            });
            this.$store.commit("addActivedObjListOfProductLine", {
                productLineIndex: indexOfSelectedProductLine,
                progressBarIndex: productLineList[indexOfSelectedProductLine].getProgressIndexById(newProgressBar.getId)
            });

            // 关闭窗口
            this.hideWindow();
        }
    },
    created: function() {
        this.factoryCalendar = this.$store.state.factoryCalendarObj;
        this.colorSetting = this.$store.state.colorSetting;
    },
}
</script>

<style scoped>
.windowOfSeparateBill-component {
	position: fixed;
	top: 100px;
    left: 30%;
    width: 450px;
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