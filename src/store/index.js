import Vue from 'vue';
import Vuex from 'vuex';
import MapListUtil from "../common/mapListUtil";
import MapUtil from '../common/mapListUtil';
import moduleOfDisplay from "./moduleOfDisplay";

Vue.use(Vuex);

export default new Vuex.Store({
	// 引入模块
	modules: {
		moduleOfDisplay: moduleOfDisplay,
	},
	state: {
		argumentSetting: null, // 参数设置
		colorSetting: null, // 计划进度颜色设置
		ctxOfSource: null, // 源画布 上下文
		ctxOfTemp: null, // 移动画布 上下文
		factoryCalendarObj: {}, // 工厂日历
		productLineList: [], // 生产线源数据
		waitingAddProgressList: [], // 等待被添加的排产详情列表
		selectedWaitingAddProgressList: [], // 勾选了的等待被添加的排产详情列表（用于智能排产）
		activedProgressBar: null, // 拖动激活的进度条
		historyObjList: [], // 历史记录列表
		activedIndexOfHistoryObjList: null, // 历史记录列表的索引
		activedObjListOfProductLine: [], // 激活过的生产线索引与所在生产线最早更新的排产计划索引组成的键值对，形式为：{ `生产线索引`: `进度条在生产线中的索引`}
	},
	mutations: {
		// 设置参数设置
		setArgumentSetting(state, data) {
			state.argumentSetting = data;
		},
		// 计划进度颜色设置
		setColorSetting(state, data) {
			state.colorSetting = data;
		},
		// 设置画布
        setCtxOfSource(state, ctx) {
			state.ctxOfSource = ctx;
		},
		// 设置临时画布（移动画布）
        setCtxOfTemp(state, ctx) {
			state.ctxOfTemp = ctx;
		},
		// 设置工厂日历
		setFactoryCalendarObj(state, factoryCalendarObj) {
			state.factoryCalendarObj = factoryCalendarObj;
		},
		// 设置生产线源数据
		setProductLineList(state, productLineList) {
			state.productLineList = productLineList;
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
		// 设置 勾选了的等待被添加的排产详情列表（用于智能排产）
		setSelectedWaitingAddProgressLis(state, selectedWaitingAddProgressList) {
			state.selectedWaitingAddProgressList = selectedWaitingAddProgressList;

		},
		// 设置拖动激活 activedProgressBar
		setActivedProgressBar(state, activedProgressBar) {
			state.activedProgressBar = activedProgressBar;
		},
		// 设置历史记录列表
		setHistoryObjList(state, historyObjList) {
			state.historyObjList = historyObjList;
		},
		// 插入历史记录
		pushHistoryObjList(state, historyObj) {
			var historyObjList = [...state.historyObjList];
			if (state.activedIndexOfHistoryObjList == null) {
				historyObjList.push(historyObj);
				state.historyObjList = historyObjList;
				state.activedIndexOfHistoryObjList = 0;
			} else {
				var historyObjListTemp = [];
				for (var i=0; i<=state.activedIndexOfHistoryObjList; i++) {
					historyObjListTemp.push(historyObjList[i]);
				}
				historyObjListTemp.push(historyObj);
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
		}
	}
})