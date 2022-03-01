<template>
    <div class="toast-component">
        <div class="toastWrapper zIndexSuperTop">
            {{txt}}
        </div>
    </div>
</template>

<script>
export default {
    props:["txt"],
    data: function() {
        return {
            
        }
    }
}
</script>

<style scoped>
.toastWrapper {
    position: fixed;
    top: 10px;
    left: 0;
    right: 0;
    margin: auto;
    padding: 10px;
    width: 50%;
    text-align: center;
    font-size: 30px;
    color: #fff;
    background-color: rgba(0,0,0,.7);
    border-radius: 4px;    
}
</style>