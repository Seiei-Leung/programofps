import Vue from 'vue';
import Vuex from 'vuex';
import CONST from "../common/const";

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		isShowNumberofwork: false,
		isShowWorkingHours: false,
		ctxOfSource: null,
		ctxOfTemp: null,
		cssAboutScroll: {
			// 左侧生产线 bar
			styleOfProductLinesClass: {
				position: "absolute",
				top: (CONST.STYLEOFTOOLBAR.height - CONST.STYLEOFTOOLBAR.lineWidth) + "px",
				left: "0px",
				width: CONST.STYLEOFPRODUCTLINESBAR.width + "px"
			},
			// 日期 bar
			styleOfMonthsClass: {
				position: "absolute",
				top: CONST.STYLEOFTOOLBAR.height - CONST.STYLEOFTOOLBAR.lineWidth + "px",
				left: CONST.STYLEOFPRODUCTLINESBAR.width - CONST.STYLEOFPRODUCTLINESBAR.lineWidth + "px"
			}
		}
	},
	mutations: {
		// 设置画布
        setCtxOfSource(state, ctx) {
			state.ctxOfSource = ctx;
		},
		// 设置临时画布（移动画布）
        setCtxOfTemp(state, ctx) {
			state.ctxOfTemp = ctx;
		},
		// 滚动条纵向滚
		scrollUpOrDown(state) {
			state.cssAboutScroll = {
				// 左侧生产线 bar
				styleOfProductLinesClass: {
					position: "absolute",
					top: (CONST.STYLEOFTOOLBAR.height - CONST.STYLEOFTOOLBAR.lineWidth) + "px",
					left: window.pageXOffset + "px",
					width: CONST.STYLEOFPRODUCTLINESBAR.width + "px"
				},
				// 日期 bar
				styleOfMonthsClass: {
					position: "fixed",
					top: CONST.STYLEOFTOOLBAR.height - CONST.STYLEOFTOOLBAR.lineWidth + "px",
					left: - window.pageXOffset + "px"
				}
			}
		},
		// 滚动条横向滚
		scrollRightOrLeft(state) {
			state.cssAboutScroll = {
				// 左侧生产线 bar
				styleOfProductLinesClass: {
					position: "fixed",
					top: (CONST.STYLEOFTOOLBAR.height - CONST.STYLEOFTOOLBAR.lineWidth) - window.pageYOffset + "px",
					left: "0px",
					width: CONST.STYLEOFPRODUCTLINESBAR.width + "px"
				},
				// 日期 bar
				styleOfMonthsClass: {
					position: "absolute",
					top: CONST.STYLEOFTOOLBAR.height - CONST.STYLEOFTOOLBAR.lineWidth + "px",
					left: CONST.STYLEOFPRODUCTLINESBAR.width - CONST.STYLEOFPRODUCTLINESBAR.lineWidth + "px"
				}
			}

		}



	}
})