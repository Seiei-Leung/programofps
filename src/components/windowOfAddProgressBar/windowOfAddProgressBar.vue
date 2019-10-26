<template>
    <div class="windowOfAddProgress-component">
        <!-- 右侧显示窗口按钮 -->
        <div class="showWindowBtn zIndexSuperTop" @click="toggleWindow" v-show="!isShowWindow">
            添<br />加<br />排<br />产<br />
        </div>
		<div v-show="isShowWindow" class="windowOfAddProgress zIndexSuperTop" v-bind:style="{top: cssOfWindow.top + 'px'}">
            <div class="header">
                <div class="txt">添 加 排 产</div>
                <div class="closeBtn" @click="toggleWindow">
                    <Icon type="ios-close-circle" />
                </div>
            </div>
			<!-- 筛选条件输入区域 -->
			<div class="filterWrapper">
				<!--  -->
<!-- 				<div class="item">
					<div class="title">筛选制单号</div>
					<Input  v-model="filterProductionLine" style="width: 50px" @on-change="filterSumTableData" />
				</div> -->
			</div>
			<!-- 表格 -->
			<Table height="450" border :columns="tableTitle" :data="waitingAddProgressList" @on-row-dblclick="dragProgress"></Table>
		</div>
    </div>
</template>

<script>
import CONST from "../../common/const";
import DateUtil from "../../common/dateUtil";
import ProgressBar from "../../vo/progressBar";

export default {
    data: function() {
        return {
			tableTitle: [
				{
                	title: '制单号',
                	key: 'orderno',
                	align: "center"
			  	},
				{
                	title: '客户',
                	key: 'clientName',
                	align: "center"
				},
				{
                	title: '计划数量',
                	key: 'qtyofbatcheddelivery',
                	align: "center"
				},
				{
                	title: '离厂日期',
                	key: 'deliveryoffactoryTime',
					align: "center",
					render: function(h, params) {
						return h(
							'div',
							{},
							DateUtil.timeStampToDate(params.row.deliveryoffactoryTime)
						);
					}
				}
			]




        }
	},
	computed: {
		// 是否显示窗口
		isShowWindow: function() {
			return this.$store.state.isShowWindowOfAddProgress;
		},
		// 窗口 css 样式
		cssOfWindow: function() {
			return {
				top: CONST.STYLEOFTOOLBAR.height + CONST.STYLEOFTOOLBAR.lineWidth
			}
		},
		// 获取待添加详情列表
		waitingAddProgressList: function() {
			return this.$store.state.waitingAddProgressList;
		}
	},
	methods: {
		// 切换窗口显示
		toggleWindow: function() {
			this.$store.commit("toggleIsShowWindowOfAddProgress");
		},
		// 
		dragProgress: function(data, index) {
			var progressBar = new ProgressBar(
				null,
				null,
				data
			);
			this.$store.commit("setActivedProgressBar", progressBar); // 确定拖动进度条
			this.$store.commit("toggleIsShowCtxOfTmp"); // 显示拖动图层
			this.$store.commit("toggleIsShowWindowOfAddProgress"); // 关闭窗口
		}







	}
}
</script>

<style scoped>
.showWindowBtn {
	position: fixed;
	right: 0;
	top: 45%;
	padding: 12px 0;
	width: 30px;
	text-align: center;
	font-size: 16px;
	line-height: 1.2;
	color: #fff;
	background-color: #3bbf67;
	border-top-left-radius: 4px;
	border-bottom-left-radius: 4px;
}
.windowOfAddProgress {
	position: fixed;
	right: 0;
	top: 0;
	bottom: 0;
	left: 70%;
	background-color: #fff;
	border:2px solid #3bbf67
}
.windowOfAddProgress .header {
	box-sizing: border-box;
	padding-left: 10px;
	width: 100%;
	height: 35px;
	background-color: #3bbf67;
	color: #fff;
	overflow: hidden;
}
.windowOfAddProgress .header .txt {
	display: inline-block;
	font-size: 16px;
	line-height: 35px;
}
.windowOfAddProgress .closeBtn {
	display: inline-block;
	float: right;
	width: 35px;
	font-size: 24px;
	text-align: center;
	line-height: 35px;
	color: rgba(0, 0, 0, 0.5);
}
</style>