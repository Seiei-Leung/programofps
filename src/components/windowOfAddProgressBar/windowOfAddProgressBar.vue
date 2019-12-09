<template>
    <div class="windowOfAddProgress-component">
        <!-- 右侧显示窗口按钮 -->
		<div class="windowOfAddProgress zIndexSuperTop window">
            <div class="header">
                <div class="txt">添 加 排 产</div>
                <div class="closeBtn" @click="hideWindow">
                    <Icon type="ios-close-circle" />
                </div>
            </div>
			<!-- 表格 -->
			<v-filterTable
				@on-row-dblclick="dragProgress"
				@on-search="filterData"
				:data="waitingAddProgressListForShow"
                :columns="tableColumns"
				:height="0">
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
                	title: '制单号',
                	key: 'orderno',
                	align: "center",
            		filter: {
              			type: 'Input'
            		}
			  	},
				{
                	title: '客户',
                	key: 'clientName',
                	align: "center",
            		filter: {
              			type: 'Input'
            		}
				},
				{
                	title: '产品分类',
                	key: 'style',
                	align: "center",
            		filter: {
              			type: 'Input'
            		}
				},
				{
                	title: '款式分类',
                	key: 'productStyleName',
                	align: "center",
            		filter: {
              			type: 'Input'
            		}
				},
				{
                	title: 'SAH',
                	key: 'sah',
                	align: "center",
            		filter: {
              			type: 'Input'
            		}
				},
				{
                	title: '计划数量',
                	key: 'qtyofbatcheddelivery',
                	align: "center",
                    sortable: true,
            		filter: {
              			type: 'Input'
            		}
				},
				{
                	title: '离厂日期',
                	key: 'deliveryoffactoryTime',
					align: "center",
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
				}
			],
			waitingAddProgressList: [], // 待添加信息的列表源数据
			waitingAddProgressListForShow: [], // 用于显示待添加信息列表
        }
	},
	computed: {
		// 窗口 css 样式
		cssOfWindow: function() {
			return {
				top: CONST.STYLEOFTOOLBAR.height + CONST.STYLEOFTOOLBAR.lineWidth
			}
		}
	},
	methods: {
		// 窗口显示
		hideWindow: function() {
			this.$store.commit("setIsShowWindowOfAddProgress", false);
		},
		// 表格双击添加进度条，由子组件传递激活
		dragProgress: function(obj) {
			var data = obj.data;
			var index = obj.index
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
		}
	},
	created: function() {
		this.waitingAddProgressList = this.$store.state.waitingAddProgressList;
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
	top: 0;
	bottom: 0;
	left: 30%;
	background-color: #fff;
	border:2px solid #1b72ce;
}
</style>