<template>
    <div class="windowOfAnalysis-component">
        <!-- 接单分析 -->
        <div class="windowOfAnalysis zIndexSuperTop window" ref="windowOfAnalysisComponent" v-bind:style="{width: cssOfWindow.widthOfWindow}">
            <div class="header">
                <div class="txt" @mousedown="mouseDown">接 单 分 析</div>
                <div class="closeBtn" @click="hideWindow">
                    <Icon type="ios-close-circle" />
                </div>
            </div>
            <div class="contentWrapper">
                <div class="inputWrapper">
                    <CheckboxGroup v-model="searchDateList">
                        <Checkbox v-for="(item, index) in selectDateList" :label="item.year + '-' + item.month" :key="index"></Checkbox>
                    </CheckboxGroup>
                </div>
                <div class="btnWrapper">
                    <Button type="primary" @click="search" :loading="isDisabled">确定</Button>
                </div>
			    <!-- 表格 -->
                <div class="tableWrapper">
			        <v-filterTable
			        	@on-search="filterData"
                        :loading="isDisabled"
			        	:data="msgOfTableForShow"
                        :columns="tableColumns"
                        :heightOfRealTable="cssOfWindow.heightOfTable"
			        	:widthOfRealTable="cssOfWindow.widthOfTable">
			        </v-filterTable>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import CONST from "../../common/const";
import DateUtil from "../../common/dateUtil";
import filterTable from "../filterTable/filterTable";

export default {
    data: function() {
        return {
            searchDateList: [], // 用于查看的时间列表参数
            selectDateList: [], // 用于选择的时间列表参数
            msgOfTable: [], // 表格源数据
            msgOfTableForShow: [], // 表格数据用于展示
            isDisabled: false,
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
                	title: '空闲产能',
                	key: 'spareCapacity',
                	align: "center"
			  	},
				{
                	title: '单位',
                	key: 'unit',
                	align: "center"
			  	}
            ]
        }
    },
    created: function() {
        // 构建 selectDateList
        this.selectDateList = DateUtil.getYearAndMonthObjListForAYear;
    },
    methods: {
        // 关闭窗口
        hideWindow: function() {
            this.$store.commit("setIsShowWindowOfAnalysis", false);
        },
        // 查询数据
        search: function() {
            var that = this;
            if (this.searchDateList.length == 0) {
                return;
            }
            this.isDisabled = true;
            this.axios.post(this.seieiURL + "dataBoard/getAllByTime", this.searchDateList).then((response) => {
                if (response.data.status) {
                    that.$Message.error({
                        content: response.data.msg,
                        duration: 0,
                        closable: true
                    });
                } else {
                    response.data.data.forEach((item) => {
                        item.unit = "小时";
                    });
                    that.msgOfTable = response.data.data;
                    that.msgOfTableForShow = response.data.data;
                }
                that.isDisabled = false;
            }).catch((error) => {
                that.$Message.error({
                    content: "服务器异常,请刷新！！",
                    duration: 0,
                    closable: true
                });
                console.log(error);
                that.isDisabled = false;
            });
        },
        // 筛选数据
        filterData: function(searchObj) {
			// 获取筛选数据的属性名
			var titleList = Object.keys(searchObj)
			var msgOfTableForShow = [...this.msgOfTable];
			titleList.forEach((item) => {
				var regExp = new RegExp(searchObj[item]);
				var msgOfTableForShowTemp = [];
				// 正则表达式，筛选数据
				msgOfTableForShow.forEach((item2) => {
					if (regExp.test(item2[item])) {
						msgOfTableForShowTemp.push(item2);
					}
				});
				msgOfTableForShow = msgOfTableForShowTemp;
			});
			this.msgOfTableForShow = msgOfTableForShow;
        },
        // 点击标题栏，拖动
        mouseDown: function() {
            this.$store.commit("setIsShowBackgroundForDrawWindow", true);
            this.$store.commit("setDomOfDragWindow", this.$refs["windowOfAnalysisComponent"]);
        }
    },
    computed: {
        // 窗口 css 样式
		cssOfWindow: function() {
			return {
				heightOfTable: window.innerHeight - 2 * CONST.STYLEOFFILTERTABLE.heightOfFilterTable - 2 * CONST.STYLEOFWINDOW.titleHeight - 52, // 52 为选择区域的高度
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
.windowOfAnalysis-component .windowOfAnalysis {
	position: fixed;
	top: 100px;
    right: 0;
	background-color: #fff;
	border:2px solid #1b72ce;
}
.windowOfAnalysis-component .contentWrapper {
    padding-top: 10px;
}
.windowOfAnalysis-component .contentWrapper .inputWrapper {
    display: inline-block;
    width: 90%;
    margin-left: 10px;
}
.windowOfAnalysis-component .contentWrapper .btnWrapper {
    display: inline-block;
}
.windowOfAnalysis-component .contentWrapper .tableWrapper {
    margin-top: 10px;
}
</style>