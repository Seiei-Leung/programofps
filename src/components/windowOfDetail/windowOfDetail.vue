<template>
    <div class="windowOfDetail-component zIndexSuperTop window" ref="windowOfDetailComponent">
        <div class="header">
            <div class="txt" @mousedown="mouseDown">详 情</div>
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
                    {{msgOfProgressbar.orderno}}
                </div>
            </div>
            <div class="item">
                <div class="title">
                    颜色
                </div>
                <div class="txt">
                    {{msgOfProgressbar.color}}
                </div>
            </div>
            <div class="item">
                <div class="title">
                    尺码
                </div>
                <div class="txt">
                    {{msgOfProgressbar.sizes}}
                </div>
            </div>
            <div class="item">
                <div class="title">
                    产品分类
                </div>
                <div class="txt">
                    {{msgOfProgressbar.goodname}}
                </div>
            </div>
            <div class="item">
                <div class="title">
                    款式分类
                </div>
                <div class="txt">
                    {{msgOfProgressbar.productStyleName}}
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
                    sam
                </div>
                <div class="txt">
                    {{msgOfProgressbar.sam}}
                </div>
            </div>
            <div class="item">
                <div class="title">
                    sah
                </div>
                <div class="txt">
                    {{msgOfProgressbar.sah}}
                </div>
            </div>
            <div class="item">
                <div class="title">
                    效率
                </div>
                <div class="txt">
                    {{activedProgressBar.getEfficiencyOfSource(activedProductLine).toFixed(2)}}
                </div>
            </div>
            <div class="item">
                <div class="title">
                    自选效率
                </div>
                <div class="txt">
                    {{activedProgressBar.getEfficiencyOfSetting.toFixed(2)}}
                </div>
            </div>
            <div class="item">
                <div class="title">
                    日产
                </div>
                <div class="txt">
                    {{Math.floor(activedProgressBar.getDailyMaking(activedProductLine, activedProgressBar.getStartTime))}}
                </div>
            </div>
            <div class="item">
                <div class="title">
                    自选日产
                </div>
                <div class="txt">
                    {{Math.floor(activedProgressBar.getDailyMakingOfSetting(activedProductLine, activedProgressBar.getStartTime))}}
                </div>
            </div>
            <div class="item">
                <div class="title">
                    开始时间
                </div>
                <div class="txt">
                    {{timeStampToDate(activedProgressBar.getStartTime)}}
                </div>
            </div>
            <div class="item">
                <div class="title">
                    结束时间
                </div>
                <div class="txt">
                    {{timeStampToDate(activedProgressBar.getEndTime)}}
                </div>
            </div>
            <div class="item">
                <div class="title">
                    离厂期
                </div>
                <div class="txt">
                    {{timeStampToDate(msgOfProgressbar.deliveryoffactoryTime)}}
                </div>
            </div>
            <div class="item">
                <div class="title">
                    后整天数
                </div>
                <div class="txt">
                    {{msgOfProgressbar.backpartDaynum}}
                </div>
            </div>
            <div class="item">
                <div class="title">
                    剩余天数
                </div>
                <div class="txt">
                    {{activedProgressBar.dayNumOfRemain}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import DateUtil from "../../common/dateUtil";

export default {
    data: function() {
        return {
            activedProgressBar: null, // 激活进度条对象
            msgOfProgressbar: null, // 激活进度条的详情信息
            efficiency: null, // 效率
            activedProductLine: null, // 所在生产线
        }
    },
    created: function() {
        this.activedProgressBar = this.$store.state.activedProgressBar;
        this.msgOfProgressbar = this.activedProgressBar.getMsgOfProgressBar;
        this.activedProductLine = this.$store.state.productLineList[this.activedProgressBar.getProductLineIndex];
    },
    methods: {
        // 隐藏窗口
        hideWindow: function() {
            this.clearActivedProgressBar();
            this.$store.commit("setIsShowWindowOfDetail", false);
        },
        // 时间戳转字符串
        timeStampToDate: function(timeStamp) {
            return DateUtil.timeStampToDate(timeStamp);
        },
        // 点击标题栏，拖动
        mouseDown: function() {
            this.$store.commit("setIsShowBackgroundForDrawWindow", true);
            this.$store.commit("setDomOfDragWindow", this.$refs["windowOfDetailComponent"]);
        }
    }
}
</script>

<style scoped>
.windowOfDetail-component {
    position: fixed;
    top: 100px;
    left: 30%;
    width:  500px;
	background-color: #fff;
	border:2px solid #1b72ce;
}
.container .item {
    font-size: 0;
}
.container .item:nth-child(even) {
    background-color: #efefef;
}
.container .item .title {
    display: inline-block;
    box-sizing: border-box;
    padding-left: 1em;
    width: 30%;
    font-size: 20px;
    vertical-align: top;
}
.container .item .txt {
    display: inline-block;
    box-sizing: border-box;
    padding-left: 1em;
    width: 70%;
    height: 30px;
    font-size: 20px;
    vertical-align: top;
    border-left: 1px solid #93c8ff;
    word-break: break-all;
}
</style>