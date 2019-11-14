<template>
    <div class="windowOfAddProgress-component">
        <!-- 右侧显示窗口按钮 -->
        <div class="showWindowBtn zIndexSuperTop" @click="showWindow" v-show="!isShowWindow">
            添<br />加<br />排<br />产<br />
        </div>
		<div v-show="isShowWindow" class="windowOfAddProgress zIndexSuperTop window" v-bind:style="{top: cssOfWindow.top + 'px'}">
            <div class="header">
                <div class="txt">添 加 排 产</div>
                <div class="closeBtn" @click="hideWindow">
                    <Icon type="ios-close-circle" />
                </div>
            </div>
			<!-- 筛选条件输入区域 -->
			<div class="filterWrapper">
				<div class="item">
					<div class="title">筛选制单号</div>
					<Input v-model="filterOrderno" style="margin-left: 5px;width: 150px;" @on-change="filterData" />
				</div>
			</div>
			<!-- 表格 -->
			<Table height="450" border :columns="tableTitle" :data="waitingAddProgressListForShow" @on-row-dblclick="dragProgress"></Table>
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
                	title: '产品分类',
                	key: 'style',
                	align: "center"
				},
				{
                	title: '款式分类',
                	key: 'productStyleName',
                	align: "center"
				},
				{
                	title: '计划数量',
                	key: 'qtyofbatcheddelivery',
                	align: "center",
                    sortable: true
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
			],
			waitingAddProgressList: [], // 待添加信息的列表源数据
			waitingAddProgressListForShow: [], // 用于显示待添加信息列表
			filterOrderno: "",
        }
	},
	computed: {
		// 是否显示窗口
		isShowWindow: function() {
			return this.$store.state.moduleOfDisplay.isShowWindowOfAddProgress;
		},
		// 窗口 css 样式
		cssOfWindow: function() {
			return {
				top: CONST.STYLEOFTOOLBAR.height + CONST.STYLEOFTOOLBAR.lineWidth
			}
		}
	},
	methods: {
		// 窗口显示
		showWindow: function() {
			this.waitingAddProgressList = this.$store.state.waitingAddProgressList;
			this.waitingAddProgressListForShow = [...this.waitingAddProgressList];
			this.$store.commit("closeAllWindow");
			this.$store.commit("setIsShowWindowOfAddProgress", true);
		},
		hideWindow: function() {
			this.$store.commit("setIsShowWindowOfAddProgress", false);
		},
		// 双击添加 进度条 
		dragProgress: function(data, index) {
			var progressBar = new ProgressBar(
				null,
				null,
				data
			);
			this.$store.commit("setActivedProgressBar", progressBar); // 确定拖动进度条
			this.$store.commit("toggleIsShowCtxOfTmp"); // 显示拖动图层
			this.$store.commit("closeAllWindow"); // 关闭窗口
		},
		// 筛选数据
		filterData: function() {
			var that = this;
			var waitingAddProgressListForShow = [];
			if (this.filterOrderno == "") {
				this.waitingAddProgressListForShow = this.waitingAddProgressList;
				return;
			}
			this.waitingAddProgressList.forEach((item) => {
				if (this.filterOrderno == item.orderno) {
					waitingAddProgressListForShow.push(item);
				}
			});
			this.waitingAddProgressListForShow = waitingAddProgressListForShow;
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
	background-color: #4fa0f6;
	border-top-left-radius: 4px;
	border-bottom-left-radius: 4px;
}
.showWindowBtn:hover {
	background-color: #2d547e;
	cursor:pointer;
}
.windowOfAddProgress {
	position: fixed;
	right: 0;
	top: 0;
	bottom: 0;
	left: 55%;
	background-color: #fff;
	border:2px solid #1b72ce;
}
.filterWrapper {
	padding: 10px;
}
.filterWrapper .item .title{
    display: inline-block;
}
</style>