<template>
    <div class="topToolBar-component zIndexSuper">
        <!-- 编辑工具栏 -->
        <div class="item" @click="historyBack">撤回<i class="iconfont icon-jijiangdaozhang"></i></div>
        <div class="item" @click="historyRemake">重做<i class="iconfont icon-zuji"></i></div>
        <div class="item" @click="submitBtn">保存<i class="iconfont icon-selectfill"></i></div>
        <div class="item" @click="refreshPage">刷新<i class="iconfont icon-refresh"></i></div>
        <div class="item" @click="showNumberOfWork"><span v-show="!isShowNumberofwork">显示工作人数</span><span v-show="isShowNumberofwork">隐藏工作人数</span><i class="iconfont icon-favfill"></i></div>
        <div class="item" @click="showWorkingHours"><span v-show="!isShowWorkingHours">显示工作时间</span><span v-show="isShowWorkingHours">隐藏工作时间</span><i class="iconfont icon-favfill"></i></div>
    </div>
</template>

<script>
export default {
    data: function() {
        return {
        }
    },
    computed: {
        isShowNumberofwork() {
            return this.$store.state.isShowNumberofwork;
        },
        isShowWorkingHours() {
            return this.$store.state.isShowWorkingHours;
        }
    },
    methods: {
        historyBack: function() {

        },
        historyRemake: function() {

        },
        submitBtn: function() {

        },
        refreshPage: function() {

        },
        showNumberOfWork: function() {

        },
        showWorkingHours: function() {

        }
    }
}
</script>

<style scoped>
/* 工具栏 */
.topToolBar-component {
	position: fixed;
	top: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    border-bottom: 1px solid #ddd;
}
.topToolBar-component .item {
	display: inline-block;
    box-sizing: border-box;
    padding: 0px 5px;
    margin: 5px 0px 5px 5px;
    line-height: 25px;
    font-size: 14px;
    border-radius: 4px;
    background-color: #3BBF67;
    color: #fff;
}
.topToolBar-component .item:hover {
	background-color: #23733e;;
	cursor:pointer
}
.topToolBar-component .iconfont {
	margin-left: 4px;
	font-size: 14px!important;
}
</style>