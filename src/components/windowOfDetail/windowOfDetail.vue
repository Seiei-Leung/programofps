<template>
    <div class="windowOfDetail-component zIndexSuperTop">
        <div class="header">
            <div class="txt">拆 单</div>
            <div class="closeBtn" @click="hideWindow">
                <Icon type="ios-close-circle" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data: function() {
        return {

        }
    },
    computed: {
        activedProgressbar: function() {
            return this.$store.state.activedProgressBar;
        }
    },
    methods: {
        hideWindow: function() {
            
        }
    }
}
</script>

<style scoped>
</style>