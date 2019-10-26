import Vue from 'vue';
import Vuex from 'vuex';
import CONST from "../common/const";

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		isShowNumberofwork: false, // 是否显示人数
		isShowWorkingHours: false, // 是否显示工作时间
		ctxOfSource: null, // 源画布 上下文
		ctxOfTemp: null, // 移动画布 上下文
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
		}, // 用于滚动信息
		factoryCalendarObj: {}, // 工厂日历
		productLineList: [], // 生产线源数据
		isShowToast: false, // 是否显示 toast 提示
		toastTxt: "", // toast 提示文本
		isShowWindowOfAddProgress: false, // 是否显示添加进度条窗口
		waitingAddProgressList: [], // 等待被添加的排产详情列表
		activedProgressBar: null, // 拖动激活的进度条
		isShowCtxOfTmp: false, // 是否显示移动画布
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
		},
		// 设置工厂日历
		setFactoryCalendarObj(state, factoryCalendarObj) {
			state.factoryCalendarObj = factoryCalendarObj;
		},
		// 设置生产线源数据
		setProductLineList(state, productLineList) {
			state.productLineList = productLineList;
		},
		// 显示 toast 
		showToast(state, toastTxt, time) {
			state.toastTxt = toastTxt;
			state.isShowToast = true;
		},
		// 隐藏 toast
		hideToast(state) {
			state.isShowToast = false;
		},
		// 切换显示添加进度条窗口
		toggleIsShowWindowOfAddProgress(state) {
			state.isShowWindowOfAddProgress = !state.isShowWindowOfAddProgress;
		},
		// 设置 waitingAddProgressList
		setWaitingAddProgressList(state, waitingAddProgressList) {
			state.waitingAddProgressList = waitingAddProgressList;
		},
		// 设置拖动激活 activedProgressBar
		setActivedProgressBar(state, activedProgressBar) {
			state.activedProgressBar = activedProgressBar;
		},
		// 切换移动画布
		toggleIsShowCtxOfTmp(state) {
			state.isShowCtxOfTmp = !state.isShowCtxOfTmp;
		}
	}
})