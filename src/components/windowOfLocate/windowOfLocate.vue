<template>
    <div class="windowOfLocate-component">
        <!-- 定位窗口 -->
        <div class="windowOfLocate zIndexSuperTop window" ref="windowOfLocateComponent" v-bind:style="{width: cssOfWindow.widthOfWindow}">
            <div class="header">
                <div class="txt" @mousedown="mouseDown">定 位</div>
                <div class="closeBtn" @click="hideWindow">
                    <Icon type="ios-close-circle" />
                </div>
            </div>
			<!-- 表格 -->
			<v-filterTable
				@on-row-dblclick="locateBar"
				@on-search="filterData"
				:data="msgOfActivedProgressBarListForShow"
                :columns="tableColumns"
                :heightOfRealTable="cssOfWindow.heightOfTable"
				:widthOfRealTable="cssOfWindow.widthOfTable">
			</v-filterTable>
        </div>
    </div>
</template>

<script>
import filterTable from "../filterTable/filterTable";
import DateUtil from "../../common/dateUtil";
import CONST from "../../common/const";
import ProgressBar from "../../vo/progressBar";

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
            ]
        }
    },
	computed: {
		ctxOfSource: function() {
			return this.$store.state.ctxOfSource;
		},
		colorSetting: function() {
			return this.$store.state.colorSetting;
		},
		productLineList: function() {
			return this.$store.state.productLineList;
		}
	},
    methods: {
        // 关闭窗口
        hideWindow: function() {
            this.$store.commit("setIsShowWindowOfLocate", false);
        },
        // 双击表格
        locateBar: function(obj) {
			
            var ctxOfSource = this.$store.state.ctxOfSource;
            var colorSetting = this.$store.state.colorSetting;
			var orderno = obj.data.orderno;
			var activeedProgressBar = new ProgressBar(
				obj.productLineId,
				obj.productLineIndex,
				obj.data
			);

			// 清空之前选择激活进度条的状态(包括相同制单号引起的激活状态)
            this.clearActivedProgressBar();

			var progressBarListOfTheSameOrderNo = [];
            // 查找所有生产线中相同制单的进度条，并高亮
            for (var indexOfProductLineList=0; indexOfProductLineList<this.productLineList.length; indexOfProductLineList++) {
                var productLine = this.productLineList[indexOfProductLineList];
                // 循环该生产线的进度条
                for (var indexOfProgressBar=0; indexOfProgressBar<productLine.getProgressList.length; indexOfProgressBar++) {
                    var progressBar = productLine.getProgressList[indexOfProgressBar];
                    if (progressBar.msgOfProgressBar.orderno == orderno) {
                        var isExistIngProgressBarListOfTheSameOrderNo = false;
                        // 循环列表，检查是否已存在当前进度条的生产线
                        for (var indexOfProgressBarListOfTheSameOrderNo=0; indexOfProgressBarListOfTheSameOrderNo<progressBarListOfTheSameOrderNo.length; indexOfProgressBarListOfTheSameOrderNo++) {
                            var itemOfProgressBarListOfTheSameOrderNo = progressBarListOfTheSameOrderNo[indexOfProgressBarListOfTheSameOrderNo];
                            if (itemOfProgressBarListOfTheSameOrderNo.productLineIndex == productLine.getIndex) {
                                isExistIngProgressBarListOfTheSameOrderNo = true;
                                itemOfProgressBarListOfTheSameOrderNo.progressBarList.push(progressBar);
                            }
                        }
                        // 如果当前进度条的生产线不存在于存储列表中，新增并添加
                        if (!isExistIngProgressBarListOfTheSameOrderNo) {
                            var msgObjOfProgressBarListOfTheSameOrderNo = {};
                            msgObjOfProgressBarListOfTheSameOrderNo.productLineIndex = productLine.getIndex;
                            msgObjOfProgressBarListOfTheSameOrderNo.progressBarList = [progressBar];
                            progressBarListOfTheSameOrderNo.push(msgObjOfProgressBarListOfTheSameOrderNo);
                        }
                    }
                }
            }
            this.$store.commit("setProgressBarListOfTheSameOrderNo", progressBarListOfTheSameOrderNo);

			// 渲染相同制单号的进度条
            for (var indexOfProgressBarListOfTheSameOrderNo=0; indexOfProgressBarListOfTheSameOrderNo < progressBarListOfTheSameOrderNo.length; indexOfProgressBarListOfTheSameOrderNo++) {
                var itemOfProgressBarListOfTheSameOrderNo = progressBarListOfTheSameOrderNo[indexOfProgressBarListOfTheSameOrderNo];
                // 获取生产线
                var productLineItem = this.productLineList[itemOfProgressBarListOfTheSameOrderNo.productLineIndex];
                var progressIndexList = []; // 需要激活的进度条的索引列表
                // 组装进度条的索引列表
                for (indexOfProgressBar=0; indexOfProgressBar<itemOfProgressBarListOfTheSameOrderNo.progressBarList.length; indexOfProgressBar++) {
                    var progressBarItem = itemOfProgressBarListOfTheSameOrderNo.progressBarList[indexOfProgressBar];
                    progressIndexList.push(productLineItem.getProgressIndexById(progressBarItem.getId));
                }
                // 重新渲染
                productLineItem.clear(ctxOfSource);
                productLineItem.renderWithOutIdList(ctxOfSource, colorSetting, null, progressIndexList);
            }
        
			// 页面滚动聚焦到激活进度条
			var left = activeedProgressBar.msgOfCSS.left < 0 ? 0 : activeedProgressBar.msgOfCSS.left;
			window.scroll(left, window.pageYOffset);
			this.$store.commit("scrollRightOrLeft");
		
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
        // 点击标题栏，拖动
        mouseDown: function() {
            this.$store.commit("setIsShowBackgroundForDrawWindow", true);
            this.$store.commit("setDomOfDragWindow", this.$refs["windowOfLocateComponent"]);
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
.windowOfLocate {
	position: fixed;
	right: 0;
	top: 100px;
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