<template>
    <div class="windowOfMemo-component zIndexSuperTop" v-bind:style="{top: msgOfWindowOfMemo.top, left: msgOfWindowOfMemo.left, width: msgOfWindowOfMemo.width, height: msgOfWindowOfMemo.height}">
        {{txtOfMemo}}
    </div>
</template>

<script>
export default {
    data: function() {
        return {}
    },
    computed: {
        // 批注文本
        txtOfMemo: function() {
            return this.$store.state.moduleOfDisplay.txtOfMemo;
        },
        // 窗口 CSS 信息
        msgOfWindowOfMemo: function() {
            return this.$store.state.moduleOfDisplay.msgOfWindowOfMemo;
        },
    }
}
</script>

<style scoped>
.windowOfMemo-component {
    position: fixed;
    padding: 10px;
    background-color: rgba(0,0,0,.6);
    color: #fff;
    border-radius: 2px;
    overflow: auto;
}
</style>