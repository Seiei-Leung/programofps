<template>
    <div id="productLineBar-component">
        <!-- 生产线 -->
        <div class="productLines zIndexTop" ref="productLinesBarHook" v-bind:style="styleOfProductLinesClass">
            <div class="title" v-bind:style="styleOfTitleClass">
                生产线
            </div>
            <div class="productLinesHook" v-bind:style="styleOfProductLinesHook">
                <div class="productLine" v-for="(item, index) in productLineList" v-bind:key="index">
                    {{item.name}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import CONST from "../../common/const";

export default {
    props: ['productLineList'],
    data: function() {
        return {
            
        }
    },
    computed: {
        //  CSS 样式
        styleOfProductLinesClass: function() {
            return this.$store.state.cssAboutScroll.styleOfProductLinesClass;
        },
        // CSS 样式
        styleOfTitleClass: function() {
            return {
                position: "fixed",
                top: (CONST.STYLEOFTOOLBAR.height - CONST.STYLEOFTOOLBAR.lineWidth) + "px",
                left: "0px",
                height: CONST.STYLEOFPRODUCTLINESBAR.height + "px",
                lineHeight: CONST.STYLEOFPRODUCTLINESBAR.height + "px",
                width: CONST.STYLEOFPRODUCTLINESBAR.width + "px"
            }
        },
        styleOfProductLinesHook: function() {
            return {
                marginTop: CONST.STYLEOFPRODUCTLINESBAR.height + "px"
            }
        }
    },
    watch: {
        "scrollDirection": function() {
            console.log(345)
        }
    },
    created: function() {
        var that = this;
/*         this.$nextTick(() => {
            var productLineBarDom = that.$refs.productLinesBarHook;
            window.onscroll = function(e) {
                var scrollDirection = that.getDetailOfScroll();
                if (scrollDirection == 'DOWN' || scrollDirection == 'UP') {
                    productLineBarDom.style.position = "absolute";
                    productLineBarDom.style.top = CONST.STYLEOFTOOLBAR.height + "px";
                    productLineBarDom.style.left = window.pageXOffset + "px";
                } else if (scrollDirection == "Left" || scrollDirection == "RIGHT") {
                    productLineBarDom.style.position = "fixed";
                    productLineBarDom.style.left = "0px";
                    productLineBarDom.style.top = CONST.STYLEOFTOOLBAR.height - window.pageYOffset + "px";
                }
            }
        }) */
    },
    methods: {
    }
}
</script>

<style scoped>
.productLineBar-component {

}
.productLines {    
    position: absolute;
    left: 0px;
	display: inline-block;
	vertical-align: top;
}

.productLines .title {
	box-sizing: border-box;
	text-align: center;
	font-size: 12px;
	border: 1px solid #ddd;
	background-color: #fff;
}

.productLines .productLine {
	box-sizing: border-box;
	padding: 0 1em;
	height: 36px;
	line-height: 36px;
	font-size: 12px;
	text-align: center;
	border: 1px solid #ddd;
	border-top: none;
	background-color: #fff;
}
</style>