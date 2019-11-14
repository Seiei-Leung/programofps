<template>
    <div class="backgroundForDrawWindow-component zIndexSuperTop" @mouseleave="mouseleave" @mouseup="mouseUp" @mousemove="mouseMove($event)" v-bind:style="{top: msgOfCSS.top}">
    </div>
</template>

<script>
import CONST from "../../common/const";

export default {
    data: function() {
        return {
            domOfDragWindow: null, // 拖动窗口
        }
    },
    computed: {
        // css 样式
        msgOfCSS: function() {
            return {
                top: CONST.STYLEOFPRODUCTLINESBAR.height + CONST.STYLEOFTOOLBAR.height - CONST.STYLEOFPRODUCTLINESBAR.lineWidth + "px",
            }
        }
    },
    created: function() {
        this.domOfDragWindow = this.$store.state.moduleOfDisplay.domOfDragWindow;
    },
    methods: {
        // 拖动窗口
        mouseMove: function(e) {
            e.preventDefault();
            var domOfDragWindow = this.domOfDragWindow;
            var left = e.clientX - Math.ceil(domOfDragWindow.offsetWidth/2);
            var top = e.clientY - Math.ceil(CONST.STYLEOFWINDOW.titleHeight/2);
            if (0 <= left && left <= (window.innerWidth - domOfDragWindow.offsetWidth)) {
                domOfDragWindow.style.left = left + "px";
            }
            if (0 <= top && top <= (window.innerHeight - domOfDragWindow.offsetHeight)) {
                domOfDragWindow.style.top = top + "px";
            }
        },
        // 松开鼠标
        mouseUp: function() {
            this.$store.commit("setIsShowBackgroundForDrawWindow", false);
        },
        // 鼠标离开区域
        mouseleave: function() {
            this.$store.commit("setIsShowBackgroundForDrawWindow", false);
        }
    }
}
</script>

<style scoped>
.backgroundForDrawWindow-component {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
}
</style>