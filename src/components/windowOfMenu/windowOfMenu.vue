<template>
    <div class="windowOfMenu-component zIndexSuperTop" v-bind:style="{top: msgOfWindowOfMenu.top, left: msgOfWindowOfMenu.left, width: msgOfWindowOfMenu.width}">
        <div class="menuWrapper">
            <div class="item" @click="showWindowOfDetail">
                详情
            </div>
            <div class="item" @click="showWindowOfMinus">
                减数
            </div>
            <div class="item" @click="showWindowOfSeparateBill">
                拆单
            </div>
            <div class="item" @click="showDeleteModel">
                删除
            </div>
            <div class="item" @click="showWindowOfSettingEfficiency">
                自选效率
            </div>
            <div class="item" @click="showRemoveGapModel">
                消除时间间隙
            </div>
            <div class="item" @click="lockProductLine">
                锁定该生产线
            </div>
            <div class="item" @click="unlockProductLine">
                解锁之后计划
            </div>
        </div>
        <Modal
            v-model="isShowDeleteModel"
            title="删除排产进度"
            @on-ok="deleteProgress"
            @on-cancel="hideDeleteModel">
            <p>是否删除该排产进度，确定删除后将无法撤回删除！！</p>
        </Modal>
        <Modal
            v-model="isShowRemoveGapModel"
            title="消除时间间隙"
            @on-ok="removeGap"
            @on-cancel="hideRemoveGapModel">
            <p>是否消除该排产进度往后排产进度之间的时间间隙？</p>
        </Modal>
    </div>
</template>

<script>
import CONST from "../../common/const";
import HistoryObj from "../../vo/historyObj";

export default {
    data: function() {
        return {
            isShowDeleteModel: false, // 是否显示删除窗口
            isShowRemoveGapModel: false, // 是否显示
            factoryCalendar: null, // 工厂日历
            colorSetting: null, // 颜色设置
        }
    },
    computed: {
        // 右键窗口 CSS 信息
        msgOfWindowOfMenu: function() {
            return this.$store.state.moduleOfDisplay.msgOfWindowOfMenu;
        },
        // 激活排产进度
        activedProgressBar: function() {
            return this.$store.state.activedProgressBar;
        },
        // 生产线信息列表
        productLineList: function() {
            return this.$store.state.productLineList;
        },
        // 源画布
        ctxOfSource: function() {
            return this.$store.state.ctxOfSource;
        }
    },
    methods: {
        // 显示减数窗口
        showWindowOfMinus: function() {
            this.$store.commit("closeAllWindow");
            this.$store.commit("setIsShowWindowOfMinus", true);
        },
        // 显示详情窗口
        showWindowOfDetail: function() {
            this.$store.commit("closeAllWindow");
            this.$store.commit("setIsShowWindowOfDetail", true);
        },
        // 显示减数窗口
        showWindowOfSeparateBill: function() {
            this.$store.commit("closeAllWindow");
            this.$store.commit("setIsShowWindowOfSeparateBill", true);
        },
        // 显示删除对话框
        showDeleteModel: function() {
            this.$store.commit("closeAllWindow");
            this.isShowDeleteModel = true;
        },
        // 隐藏删除对话框
        hideDeleteModel: function() {
            this.isShowDeleteModel = false;
        },
        // 显示消除时间空隙对话框
        showRemoveGapModel: function() {
            this.$store.commit("closeAllWindow");
            this.isShowRemoveGapModel = true;
        },
        // 隐藏消除时间空隙对话框
        hideRemoveGapModel: function() {
            this.isShowRemoveGapModel = false;
        },
        // 显示自选效率窗口
        showWindowOfSettingEfficiency: function() {
            this.$store.commit("closeAllWindow");
            this.$store.commit("setIsShowWindowOfSettingEfficiency", true);
        },
        // 确认输出排产进度条
        deleteProgress: function() {
            this.isShowDeleteModel = false;
            this.$store.commit("setIsLoading", true);
            var activedProgressBar = this.activedProgressBar;
            var that = this;
            this.axios.get(this.seieiURL + "productionplanningdetail/resetProgress?id=" + this.activedProgressBar.getId).then((response) => {
                if (response.data.status) {
                    that.$store.commit("setIsLoading", false);
                    that.$Message.error(response.data.msg);
                    that.isInvaildSession(response.data.status);
                } else {
                    var productLineList = that.productLineList;
                    productLineList[activedProgressBar.getProductLineIndex].removeProgressById(activedProgressBar.getId);
                    productLineList[activedProgressBar.getProductLineIndex].clear(that.ctxOfSource);
                    productLineList[activedProgressBar.getProductLineIndex].renderWithOutIdList(that.ctxOfSource, that.colorSetting, null, null);
                    that.$store.commit("setProductLineList", productLineList);
                    // 异步变同步
                    (async function() {
                        await that.getAllForAddProgress(); // await 后要接 promise 对象，所以函数要 return
                        that.$store.commit("setIsLoading", false);
                    })();
                    // 清空历史
                    that.$store.commit("setHistoryObjList", []);
                    that.$store.commit("setActivedIndexOfHistoryObjList", null);
                }
            }).catch((error) => {
                that.$store.commit("setIsLoading", false);
                that.$Message.error({
                  content: "服务器异常,请刷新！！",
                  duration: 0,
                  closable: true
                });
                console.log(error);
            });
        },
        // 消除时间空隙
        removeGap: function() {
            var productLineList = this.productLineList;
            var activedProgressBar = this.activedProgressBar;
            var activedProductLine = productLineList[activedProgressBar.getProductLineIndex];
            var activedProgressBarIndex = activedProductLine.getProgressIndexById(activedProgressBar.getId); // 激活排产进度在生产线的索引
            var progressList = activedProductLine.getProgressList;
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
            // 消除间隙操作
            for (var i=activedProgressBarIndex+1; i<progressList.length; i++) {
                // 如果没有重叠
                if (progressList[i-1].getEndTime < progressList[i].getStartTime) {
                    
                    progressList[i].reload(activedProductLine, this.factoryCalendar, progressList[i-1].getEndTime); // 消除间隙
                }
            }
            // 重新渲染
            activedProductLine.clear(this.ctxOfSource);
            activedProductLine.renderWithOutIdList(this.ctxOfSource, this.colorSetting, null, null);

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
                productLineIndex: this.activedProgressBar.getProductLineIndex,
                progressBarIndex: activedProgressBarIndex
            });

            // 隐藏对话框
            this.isShowRemoveGapModel = false;
        },
        // 锁定所有生产线
        lockProductLine: function() {
            var productLineList = this.productLineList;
            var activedProgressBar = this.activedProgressBar;
            var activedProductLine = productLineList[activedProgressBar.getProductLineIndex];
            activedProductLine.lock(); // 上锁
            activedProductLine.clear(this.ctxOfSource);
            activedProductLine.renderWithOutIdList(this.ctxOfSource, this.colorSetting, null, null);
            this.clearActivedProgressBar();
            this.$store.commit("setIsShowWindowOfMenu", false);
        },
        // 解锁生产线
        unlockProductLine: function() {
            var productLineList = this.productLineList;
            var activedProgressBar = this.activedProgressBar;
            var activedProductLine = productLineList[activedProgressBar.getProductLineIndex];
            var activedProgressBarIndex = activedProductLine.getProgressIndexById(activedProgressBar.getId);
            // 如果解锁的排产计划是该生产线中的第一条，则表示解锁整条生产线
            if (activedProgressBarIndex == 0) {
                activedProductLine.unLock(CONST.STATUSOFLOCK.UNLOCK);
            } else {
                activedProductLine.unLock(activedProductLine.getProgressList[activedProgressBarIndex - 1].getId);
            }
            activedProductLine.clear(this.ctxOfSource);
            activedProductLine.renderWithOutIdList(this.ctxOfSource, this.colorSetting, null, null);
            this.clearActivedProgressBar();
            this.$store.commit("setIsShowWindowOfMenu", false);
        }

    },
    created: function() {
        this.factoryCalendar = this.$store.state.factoryCalendarObj;
        this.colorSetting = this.$store.state.colorSetting;
    }
}
</script>

<style scoped>
.windowOfMenu-component {
    position: fixed;
}
.menuWrapper {
	font-size: 12px;
	background-color: #fff;
	border: 1px solid #ccc;
}
.menuWrapper .item {
	box-sizing: border-box;
	width: 100%;
	padding-left: 10px;
	line-height: 1.8em;
}
.menuWrapper .item:hover {
	background-color: #eee;
	cursor:pointer;
}
</style>