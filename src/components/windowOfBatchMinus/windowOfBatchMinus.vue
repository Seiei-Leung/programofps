<template>
    <div class="windowOfBatchMinus-component">
        <!-- 右侧批量减数窗口 -->
        <div class="windowOfBatchMinus zIndexSuperTop window" v-bind:style="{width: cssOfWindow.widthOfWindow}">
            <div class="header">
                <div class="txt">批 量 减 数</div>
                <div class="closeBtn" @click="hideWindow">
                    <Icon type="ios-close-circle" />
                </div>
            </div>
			<!-- 表格 -->
			<v-filterTable
				@on-row-dblclick="dblclick"
				@on-search="filterData"
				:data="msgOfActivedProgressBarListForShow"
                :columns="tableColumns"
                :heightOfRealTable="cssOfWindow.heightOfTable"
				:widthOfRealTable="cssOfWindow.widthOfTable">
			</v-filterTable>
            <div class="btn" @click="submitChange">
                确 认 修 改
            </div>
        </div>
    </div>
</template>

<script>
import filterTable from "../filterTable/filterTable";
import DateUtil from "../../common/dateUtil";
import CONST from "../../common/const";

export default {
    data: function() {
        var self = this; // // 存储当前vue实例 this，因为下面自定义 table 的 render 函数直接使用 this 的话，无法正确指向 vue 实例
        return {
            factoryCalendar: null, // 工厂日历
            colorSetting: null, // 颜色设置
            hadChangedMsgOfActivedProgressBarList: [], // 修改过的排产计划详细详细列表
            productLineList: [], // 生产线数据
            tableHeight: 0, // 表格高度
            msgOfActivedProgressBarList: [], // 已经排产的所有计划列表
            msgOfActivedProgressBarListForShow: [], // 用于显示的已经排产的所有计划列表
            tableColumns: [
				{
                	title: '生产线',
                	key: 'productLineName',
                	align: "center",
            		filter: {
              			type: 'Input'
            		}
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
                	title: '已完成数',
                	key: 'qtyFinish',
                    align: "center",
                    render: function(h, params) {
                        return h(
                            'InputNumber',
                            {
                                props: {
                                    max: params.row.qtyofbatcheddelivery, // 最大值
                                    min: 0, // 最小值
                                    value: params.row.qtyFinish, // 默认值
                                },
                                on: {
                                    "on-change": val => {
                                        // 减数
                                        params.row.qtyFinish = val;
                                        self.hadChangedMsgOfActivedProgressBarList.push(params.row); // 使用 self 代替 this
                                    }
                                }
                            },
                        )
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
            ]
        }
    },
    methods: {
        // 关闭窗口
        hideWindow: function() {
            this.$store.commit("setIsShowWindowOfBatchMinus", false);
        },
        // 双击表格
        dblclick: function() {
            return;
        },
        // 筛选数据
        filterData: function(searchObj) {
			// 获取筛选数据的属性名
			var titleList = Object.keys(searchObj)
			var msgOfActivedProgressBarListForShow = [...this.msgOfActivedProgressBarList];
			titleList.forEach((item) => {
				var regExp = new RegExp(searchObj[item]);
				var msgOfActivedProgressBarListForShowTemp = [];
				// 正则表达式，筛选数据
				msgOfActivedProgressBarListForShow.forEach((item2) => {
					if (regExp.test(item2[item])) {
						msgOfActivedProgressBarListForShowTemp.push(item2);
					}
				});
				msgOfActivedProgressBarListForShow = msgOfActivedProgressBarListForShowTemp;
			});
			this.msgOfActivedProgressBarListForShow = msgOfActivedProgressBarListForShow;
        },
        // 确认减数
        submitChange: function() {
            // 修改过后的进度条详情数据列表
            var hadChangedMsgOfActivedProgressBarList = this.hadChangedMsgOfActivedProgressBarList.sort((a, b) => {
                return a.startTime - b.startTime;
            });
            var productLineList = this.productLineList;
            var argumentSetting = this.$store.state.argumentSetting; // 参数设置

            /**
             * 记录历史操作（之前没有记录过历史操作，则初始化历史记录快照）
             */
            this.initHistoryObjList(productLineList, null);

            /**
             * 批量减数操作
             */
            hadChangedMsgOfActivedProgressBarList.forEach((msgOfActivedProgressBar) => {
                var activedProductLine = productLineList[msgOfActivedProgressBar.productLineIndex]; // 激活生产线
                var activedProgressBar = activedProductLine.getProgressById(msgOfActivedProgressBar.id); // 激活进度条
                var activedProgressBarIndex = activedProductLine.getProgressIndexById(activedProgressBar.getId); // 计划进度索引
                var timeStampOfToday = DateUtil.getTimeStampOfToday;
                activedProgressBar.minus(activedProductLine, this.factoryCalendar, msgOfActivedProgressBar.qtyFinish, timeStampOfToday);

                // 如果设置减数后顺延
                if (argumentSetting.getAfterMinusHasamend) {
                    activedProductLine.removeProgressById(activedProgressBar.getId);
                    activedProductLine.addProgressWithOutAmendAtFirst(activedProgressBar, this.factoryCalendar)
                }
                
                
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
                 * 记录激活的生产线索引对象
                 */
                this.$store.commit("addActivedObjListOfProductLine", {
                    productLineIndex: activedProgressBar.getProductLineIndex,
                    progressBarIndex: activedProgressBarIndex
                });
            });

            /**
             * 记录历史操作
             */
            this.pushHistoryObjList(productLineList, null, null);
            
            // 关闭窗口
            this.hideWindow();
        }
    },
    created: function() {
        var msgOfActivedProgressBarList = [];
        var productLineList = this.$store.state.productLineList; // 生产线列表
        this.productLineList = productLineList;
        this.factoryCalendar = this.$store.state.factoryCalendarObj; // 工厂日历
        this.colorSetting = this.$store.state.colorSetting; // 颜色设置

        /**
         * 获取所有已经排产的计划进度
         */

        // 循环生产线列表
        productLineList.forEach((productLine) => {
            var progresssList = productLine.getProgressList;
            progresssList.forEach((progress) => {
                var msgOfActivedProgressBar = {...progress.getMsgOfProgressBar};
                msgOfActivedProgressBar.productLineName = productLineList[msgOfActivedProgressBar.productLineIndex].fullName;
                msgOfActivedProgressBarList.push(msgOfActivedProgressBar);
            });
        });
        this.msgOfActivedProgressBarList = msgOfActivedProgressBarList;
        this.msgOfActivedProgressBarListForShow = [...this.msgOfActivedProgressBarList];
    },
    computed: {
        // 源画布
        ctxOfSource: function() {
            return this.$store.state.ctxOfSource;
        },
        // 窗口 css 样式
		cssOfWindow: function() {
			return {
				heightOfTable: window.innerHeight - 2 * CONST.STYLEOFFILTERTABLE.heightOfFilterTable - 2 * CONST.STYLEOFWINDOW.titleHeight,
				widthOfTable: CONST.STYLEOFWINDOWOFADDPROGRESSBAR.width - 2*CONST.STYLEOFWINDOW.lineWidth,
				widthOfWindow: CONST.STYLEOFWINDOWOFADDPROGRESSBAR.width + "px"
			}
		}
    },
	components: {
		"v-filterTable": filterTable
	}
}
</script>

<style scoped>
.windowOfBatchMinus {
	position: fixed;
	right: 0;
	top: 0;
	bottom: 0;
	background-color: #fff;
	border:2px solid #1b72ce; 
}
.btn {
    margin: auto;
    margin-top: 20px;
    width: 300px;
    line-height: 1.8em;
    text-align: center;
    font-size: 18px;
    background-color: #4fa0f6;
    color: #fff;
    border-radius: 5px;
}
.btn:hover {
    background-color: #1b72ce;
	cursor:pointer;
}
</style>