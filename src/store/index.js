import Vue from 'vue';
import Vuex from 'vuex';
import CONST from "../common/const";
import MapListUtil from "../common/mapListUtil";
import MapUtil from '../common/mapListUtil';
import moduleOfSwitch from "./moduleOfSwitch";

Vue.use(Vuex);

export default new Vuex.Store({
	// 引入模块
	modules: {
		moduleOfSwitch: moduleOfSwitch,
	},
	state: {
		isInited: false, // 初始化时，是否加载数据完成
		colorSetting: null, // 计划进度颜色设置
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
		historyObjList: [], // 历史记录列表
		activedIndexOfHistoryObjList: null, // 历史记录列表的索引
		activedObjListOfProductLine: [], // 激活过的生产线索引与所在生产线最早更新的排产计划索引组成的键值对
		isLoading: false, // 是否显示 loading 图层
		msgOfWindowOfMenu:{
			top: "0px",
			left: "0px"
		}, // 右键菜单的位置 CSS 样式
		isShowWindowOfMenu: false, // 是否显示右键菜单窗口
		isShowWindowOfMinus: false, // 是否显示减数窗口
		isShowWindowOfDetail: false, // 是否显示详情窗口
		isShowWindowOfSeparateBill: false, // 是否显示拆单窗口
		isShowBackgroundForDrawWindow: false, // 是否显示拖动图层
		domOfDragWindow: null, // 拖动窗口的 dom
	},
	mutations: {
		// 初始化时，是否加载数据完成
		setIsInited(state, data) {
			state.isInited = data;
		},
		// 计划进度颜色设置
		setColorSetting(state, data) {
			state.colorSetting = data;
		},
		// 显示人数
		toggleNumberofwork(state) {
			if (state.isShowNumberofwork) {
				state.isShowNumberofwork = false;
			} else {
				state.isShowNumberofwork = true;
				state.isShowWorkingHours = false;
			}
		},
		// 显示工时
		toggleWorkingHours(state) {
			if (state.isShowWorkingHours) {
				state.isShowWorkingHours = false;
			} else {
				state.isShowWorkingHours = true;
				state.isShowNumberofwork = false;
			}
		},
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
					left: - window.pageXOffset + CONST.STYLEOFPRODUCTLINESBAR.width + "px"
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
					top: window.pageYOffset + CONST.STYLEOFTOOLBAR.height - CONST.STYLEOFTOOLBAR.lineWidth + "px",
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
		showToast(state, toastTxt) {
			state.toastTxt = toastTxt;
			state.isShowToast = true;
		},
		// 隐藏 toast
		hideToast(state) {
			state.isShowToast = false;
		},
		// 切换显示添加进度条窗口
		setIsShowWindowOfAddProgress(state, data) {
			state.isShowWindowOfAddProgress = data;
		},
		// 设置 waitingAddProgressList
		setWaitingAddProgressList(state, waitingAddProgressList) {
			state.waitingAddProgressList = waitingAddProgressList;
		},
		// 根据 id 删除 waitingAddProgressList 的某项
		removeWaitingAddProgressList(state, id) {
			var waitingAddProgressList = [...state.waitingAddProgressList]; // 赋值数组
			// console.log(id);
			// console.log(waitingAddProgressList);
			var index = waitingAddProgressList.findIndex((item) => {
				return item.id == id;
			})
			waitingAddProgressList.splice(index, 1);
			state.waitingAddProgressList = waitingAddProgressList;
		},
		// 设置拖动激活 activedProgressBar
		setActivedProgressBar(state, activedProgressBar) {
			state.activedProgressBar = activedProgressBar;
		},
		// 切换移动画布
		toggleIsShowCtxOfTmp(state) {
			state.isShowCtxOfTmp = !state.isShowCtxOfTmp;
		},
		// 设置历史记录列表
		setHistoryObjList(state, historyObjList) {
			state.historyObjList = historyObjList;
		},
		// 插入历史记录
		pushHistoryObjList(state, productLineList) {
			var historyObjList = [...state.historyObjList];
			if (state.activedIndexOfHistoryObjList == null) {
				historyObjList.push(productLineList);
				state.historyObjList = historyObjList;
			} else {
				var historyObjListTemp = [];
				for (var i=0; i<=state.activedIndexOfHistoryObjList; i++) {
					historyObjListTemp.push(historyObjList[i]);
				}
				historyObjListTemp.push(productLineList);
				state.activedIndexOfHistoryObjList += 1;
				state.historyObjList = historyObjListTemp;
			}
		},
		// 设置激活过的生产线索引对象列表
		setActivedObjListOfProductLine(state, activedObjListOfProductLine) {
			state.activedObjListOfProductLine = activedObjListOfProductLine;
		},
		// 新增激活过的生产线索引对象
		addActivedObjListOfProductLine(state, data) {
			var activedObjListOfProductLine = state.activedObjListOfProductLine;
			var obj = MapUtil.getObjFromMapListByKey(activedObjListOfProductLine, data.productLineIndex);
			/**
			 * 配置对象
			 */
			// 列表中没有该信息
			if (obj == null) {
				var obj = {};
				obj[data.productLineIndex] = data.progressBarIndex;
			} else {
				if (data.progressBarIndex == null && obj[data.productLineIndex] == null) {
					obj[data.productLineIndex] = null;
				}
				else if (data.progressBarIndex == null && obj[data.productLineIndex] != null) {

				}
				else if (data.progressBarIndex != null && obj[data.productLineIndex] == null) {
					obj[data.productLineIndex] = data.progressBarIndex;
				}
				else if (data.progressBarIndex != null && obj[data.productLineIndex] != null) {
					if (data.progressBarIndex < obj[data.productLineIndex]) {
						obj[data.productLineIndex] = data.progressBarIndex;
					}
				}
			}
			var resultList = MapListUtil.addNewAndRemoveOld(activedObjListOfProductLine, obj);
			state.activedObjListOfProductLine = resultList;
		},
		// 设置历史记录列表的索引
		setActivedIndexOfHistoryObjList(state, index) {
			state.activedIndexOfHistoryObjList = index;
		},
		// 切换 isLoading
		setIsLoading(state, data) {
			state.isLoading = data;
		},
		// 设置右键菜单位置的 CSS 样式
		setMsgOfWindowOfMenu(state, data) {
			state.msgOfWindowOfMenu = data;
		},
		// 切换显示左键拆单
		setIsShowWindowOfMenu(state, data) {
			state.isShowWindowOfMenu = data;
		},
		// 切换显示减数窗口
		setIsShowWindowOfMinus(state, data) {
			state.isShowWindowOfMinus = data;
		},
		// 切换显示详情窗口
		setIsShowWindowOfDetail(state, data) {
			state.isShowWindowOfDetail = data;
		},
		// 切换显示减数窗口
		setIsShowWindowOfSeparateBill(state, data) {
			state.isShowWindowOfSeparateBill = data;
		},
		// 切换显示拖动图层
		setIsShowBackgroundForDrawWindow(state, data) {
			state.isShowBackgroundForDrawWindow = data;
		},
		// 设置 拖动窗口 dom
		setDomOfDragWindow(state, data) {
			state.domOfDragWindow = data;
		},
		// 全部窗口关闭
		closeAllWindow(state) {
			state.isShowWindowOfAddProgress = false;
			state.isShowWindowOfMenu = false;
			state.isShowWindowOfMinus = false;
			state.isShowWindowOfDetail = false;
			state.isShowWindowOfSeparateBill = false;
		}
	}
})