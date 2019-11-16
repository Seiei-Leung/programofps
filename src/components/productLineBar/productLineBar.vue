<template>
    <div id="productLineBar-component">
        <!-- 生产线 -->
        <div class="productLines zIndexSuper" ref="productLinesBarHook" v-bind:style="styleOfProductLinesClass">
            <div class="title" v-bind:style="styleOfTitleClass">
                生产线
            </div>
            <div class="productLinesHook" v-bind:style="styleOfProductLinesHook">
                <div class="productLine" v-for="(item, index) in productLineList" v-bind:key="index">
                    {{item.fullName}}({{item.getDefaultStyleName}})
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import CONST from "../../common/const";

export default {
    data: function() {
        return {
            
        }
    },
    computed: {
        //  CSS 样式
        styleOfProductLinesClass: function() {
            return this.$store.state.moduleOfDisplay.cssAboutScroll.styleOfProductLinesClass;
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
                marginTop: CONST.STYLEOFPRODUCTLINESBAR.height + "px",
                borderTop: "1px solid #ddd"
            }
        },
        productLineList: function() {
            return this.$store.state.productLineList;
        }
    },
    created: function() {
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
	height: 36px;
	line-height: 36px;
	font-size: 12px;
	text-align: center;
	border: 1px solid #ddd;
	border-top: none;
	background-color: #fff;
}
</style>