<template>
    <div class="loading-component zIndexSuperTop">
        <Spin size="large" fix></Spin>
    </div>
</template>

<script>
export default {
    data: function() {
        return {
            isLoading: true
        }
    }
}
</script>

<style scoped>
.loading-component {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
}
</style>