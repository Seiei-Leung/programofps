<template>
    <div class="windowOfMenu-component zIndexSuperTop" v-bind:style="{top: msgOfWindowOfMenu.top, left: msgOfWindowOfMenu.left}">
        <div class="menuWrapper">
            <div class="item">
                详情信息
            </div>
            <div class="item" @click="showWindowOfMinus">
                减数
            </div>
            <div class="item">
                拆单
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data: function() {
        
    },
    computed: {
        // 右键窗口 CSS 信息
        msgOfWindowOfMenu: function() {
            return this.$store.state.msgOfWindowOfMenu;
        },
    },
    methods: {
        // 显示减数窗口
        showWindowOfMinus: function() {
            this.$store.commit("closeAllWindow");
            this.$store.commit("setIsShowWindowOfMinus", true);
        }

    }
}
</script>

<style scoped>
.windowOfMenu-component {
    position: fixed;
}
.menuWrapper {
	font-size: 12px;
	width: 150px;
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