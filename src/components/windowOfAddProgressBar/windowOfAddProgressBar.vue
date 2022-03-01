<template>
    <div class="windowOfAddProgress-component">
        <!-- 右侧显示窗口按钮 -->
		<div class="windowOfAddProgress zIndexSuperTop window" ref="windowOfAddProgressComponent" v-bind:style="{width: cssOfWindow.widthOfWindow}">
            <div class="header">
                <div class="txt" @mousedown="mouseDown">添 加 排 产</div>
                <div class="closeBtn" @click="hideWindow">
                    <Icon type="ios-close-circle" />
                </div>
            </div>
			<!-- 表格 -->
			<v-filterTable
				@on-row-dblclick="dragProgress"
				@on-selection-change="handleSelectRow"
				@on-search="filterData"
				:data="waitingAddProgressListForShow"
                :columns="tableColumns"
				:heightOfRealTable="cssOfWindow.heightOfTable"
				:widthOfRealTable="cssOfWindow.widthOfTable">
			</v-filterTable>
		</div>
    </div>
</template>

<script>
import CONST from "../../common/const";
import DateUtil from "../../common/dateUtil";
import ProgressBar from "../../vo/progressBar";
import filterTable from "../filterTable/filterTable";

export default {
    data: function() {
        return {
			tableColumns: [
				{
					title: '#',
                	type:'selection',
                    width: 60,
                    align: 'center'
         		},
				{
                	title: '制单号',
                	key: 'orderno',
                	align: "center",
            		filter: {
              			type: 'Input'
            		}
			  	},
				{
                	title: '客户',
                	key: 'clientname',
                	align: "center",
            		filter: {
              			type: 'Input'
            		}
				},
				{
                	title: '产品分类',
                	key: 'style',
                	align: "center",
                    width: 120,
            		filter: {
              			type: 'Input'
            		}
				},
				{
                	title: '款式分类',
                	key: 'productStyleName',
                	align: "center",
                    width: 100,
            		filter: {
              			type: 'Input'
            		}
				},
				{
                	title: 'SAH',
                	key: 'sah',
                	align: "center",
                    width: 100,
            		filter: {
              			type: 'Input'
            		}
				},
				{
                	title: '计划数量',
                	key: 'qtyofbatcheddelivery',
                	align: "center",
                    sortable: true,
                    width: 100,
            		filter: {
              			type: 'Input'
            		}
				},
				{
                	title: '离厂日期',
                	key: 'deliveryoffactoryTime',
					align: "center",
                    width: 100,
            		filter: {
              			type: 'Input'
            		},
					render: function(h, params) {
						return h(
							'div',
							{},
							DateUtil.timeStampToDate(params.row.deliveryoffactoryTime)
						);
					}
				},
				{
                	title: '推算开始日期',
                	key: 'calculateStartTimeByEndTimeAndDefaultSetting',
                	align: "center",
                    width: 100,
                    sortable: true
				},
			],
			waitingAddProgressList: [], // 待添加信息的列表源数据
			waitingAddProgressListForShow: [], // 用于显示待添加信息列表
        }
	},
	computed: {
		// 窗口 css 样式
		cssOfWindow: function() {
			return {
				heightOfTable: 0.5*(window.innerHeight - (CONST.STYLEOFTOOLBAR.height + CONST.STYLEOFTOOLBAR.lineWidth)),
				widthOfTable: CONST.STYLEOFWINDOWOFADDPROGRESSBAR.width - 2*CONST.STYLEOFWINDOW.lineWidth,
				widthOfWindow: CONST.STYLEOFWINDOWOFADDPROGRESSBAR.width + "px"
			}
		},

	},
	methods: {
		// 窗口显示
		hideWindow: function() {
			this.$store.commit("setIsShowWindowOfAddProgress", false);
		},
		// 表格双击添加进度条，由子组件传递激活
		dragProgress: function(obj) {
			var data = obj.data;
			var progressBar = new ProgressBar(
				null,
				null,
				data
			);
			this.$store.commit("setActivedProgressBar", progressBar); // 确定拖动进度条
			this.$store.commit("toggleIsShowCtxOfTmp"); // 显示拖动图层
			this.$store.commit("closeAllWindow"); // 关闭窗口
		},
		// 子组件用于筛选数据
		filterData(searchObj) {
			// 获取筛选数据的属性名
			var titleList = Object.keys(searchObj)
			var waitingAddProgressListForShow = [...this.waitingAddProgressList];
			titleList.forEach((item) => {
				var regExp = new RegExp(searchObj[item]);
				var waitingAddProgressListForShowTemp = [];
				// 正则表达式，筛选数据
				waitingAddProgressListForShow.forEach((item2) => {
					if (regExp.test(item2[item])) {
						waitingAddProgressListForShowTemp.push(item2);
					}
				});
				waitingAddProgressListForShow = waitingAddProgressListForShowTemp;
			});
			this.waitingAddProgressListForShow = waitingAddProgressListForShow;
		},
		// 勾选表格事件
		handleSelectRow(selectionList) {
			// 用于智能排产
			// 保存数据到 vue-x
			if (selectionList.length > 0) {
				this.$store.commit("setSelectedWaitingAddProgressLis", selectionList);
			}
		},
        // 点击标题栏，拖动
        mouseDown: function() {
            this.$store.commit("setIsShowBackgroundForDrawWindow", true);
            this.$store.commit("setDomOfDragWindow", this.$refs["windowOfAddProgressComponent"]);
        }
	},
	created: function() {
        var argumentSetting = this.$store.state.argumentSetting;
        var factoryCalendar = this.$store.state.factoryCalendarObj;
		var waitingAddProgressList = [...this.$store.state.waitingAddProgressList];
		waitingAddProgressList.forEach((item) => {
			item.calculateStartTimeByEndTimeAndDefaultSetting = ProgressBar.calculateStartTimeByEndTimeAndDefaultSetting(argumentSetting, factoryCalendar, item);
		});
		this.waitingAddProgressList = waitingAddProgressList;
		this.waitingAddProgressListForShow = [...this.waitingAddProgressList];
	},
	components: {
		"v-filterTable": filterTable
	}
}
</script>

<style scoped>
.windowOfAddProgress {
	position: fixed;
	right: 0;
	top: 100px;
	background-color: #fff;
	border:2px solid #1b72ce;
}
</style>