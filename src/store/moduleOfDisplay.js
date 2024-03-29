// 用于信息、图层的显示与否
// this.$store.state.moduleOfDisplay.test
// this.$store.commit("test");
import CONST from "../common/const";

export default {
    state: {
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
		msgOfWindowOfMenu:{
			top: "0px",
			left: "0px"
		}, // 右键菜单的位置 CSS 样式
		isReadyShowWindowOfAddProgress: false, // 是否已经获取好待添加排产的数据
		isShowNumberofwork: false, // 是否显示人数
		isShowWorkingHours: false, // 是否显示工作时间
		isShowToast: false, // 是否显示 toast 提示
		toastTxt: "", // toast 提示文本
		isShowCtxOfTmp: false, // 是否显示移动画布
		isLoading: false, // 是否显示 loading 图层
		isShowWindowOfAddProgress: false, // 是否显示添加进度条窗口
		isShowWindowOfBatchMinus: false, // 是否显示批量减数窗口
		isShowWindowOfBatchSettingEfficiency: false, // 是否显示批量自选效率窗口
		isShowWindowOfLocate: false, // 是否显示定位窗口
		isShowWindowOfAnalysis: false, // 是否显示接单分析窗口
		isShowWindowOfMenu: false, // 是否显示右键菜单窗口
		isShowWindowOfMinus: false, // 是否显示减数窗口
		isShowWindowOfDetail: false, // 是否显示详情窗口
		isShowWindowOfSeparateBill: false, // 是否显示拆单窗口
		isShowWindowOfSettingEfficiency: false, // 是否显示自定效率
		isShowWindowOfMemo: false, // 是否显示批注
		txtOfMemo: "", // 批注文本
		msgOfWindowOfMemo: {
			top: "0px",
			left: "0px"
		}, // 批注的位置 CSS 样式
		isShowBackgroundForDrawWindow: false, // 是否显示拖动图层
		domOfDragWindow: null, // 拖动窗口的 dom
		
    },
    mutations: {
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
		// 设置右键菜单位置的 CSS 样式
		setMsgOfWindowOfMenu(state, data) {
			state.msgOfWindowOfMenu = data;
		},
		// 设置是否已经获取好待添加排产的数据
		setIsReadyShowWindowOfAddProgress(state, data) {
			state.isReadyShowWindowOfAddProgress = data;
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
		// 显示 toast 
		showToast(state, toastTxt) {
			state.toastTxt = toastTxt;
			state.isShowToast = true;
		},
		// 隐藏 toast
		hideToast(state) {
			state.isShowToast = false;
		},
		// 切换移动画布
		toggleIsShowCtxOfTmp(state) {
			state.isShowCtxOfTmp = !state.isShowCtxOfTmp;
		},
		// 设置是否显示 Loading 状态
		setIsLoading(state, data) {
			state.isLoading = data;
		},
		// 设置是否显示显示添加进度条窗口
		setIsShowWindowOfAddProgress(state, data) {
			state.isShowWindowOfAddProgress = data;
		},
		// 设置是否显示显示批量减数窗口
		setIsShowWindowOfBatchMinus(state, data) {
			state.isShowWindowOfBatchMinus = data;
		},
		// 设置是否显示显示批量自选效率窗口
		setIsShowWindowOfBatchSettingEfficiency(state, data) {
			state.isShowWindowOfBatchSettingEfficiency = data;
		},
		// 设置是否显示显示左键拆单
		setIsShowWindowOfMenu(state, data) {
			state.isShowWindowOfMenu = data;
		},
		// 设置是否显示显示减数窗口
		setIsShowWindowOfMinus(state, data) {
			state.isShowWindowOfMinus = data;
		},
		// 设置是否显示显示详情窗口
		setIsShowWindowOfDetail(state, data) {
			state.isShowWindowOfDetail = data;
		},
		// 设置是否显示显示减数窗口
		setIsShowWindowOfSeparateBill(state, data) {
			state.isShowWindowOfSeparateBill = data;
		},
		// 设置是否显示显示拖动窗口
		setIsShowBackgroundForDrawWindow(state, data) {
			state.isShowBackgroundForDrawWindow = data;
		},
		// 设置是否显示显示自定义效率窗口
		setIsShowWindowOfSettingEfficiency(state, data) {
			state.isShowWindowOfSettingEfficiency = data;
		},
		// 设置是否显示定位窗口
		setIsShowWindowOfLocate(state, data) {
			state.isShowWindowOfLocate = data;
		},
		// 设置是否显示定位窗口
		setIsShowWindowOfAnalysis(state, data) {
			state.isShowWindowOfAnalysis = data;
		},
		// 设置是否显示批注
		setIsShowWindowOfMemo(state, data) {
			// 在显示批注之前要检测其它窗口有没有打开
			if (data) {
				if (state.isShowWindowOfAddProgress ||
					state.isShowWindowOfBatchMinus ||
					state.isShowWindowOfMenu ||
					state.isShowWindowOfMinus ||
					state.isShowWindowOfDetail ||
					state.isShowWindowOfSeparateBill ||
					state.isShowWindowOfSettingEfficiency ||
					state.isShowWindowOfBatchSettingEfficiency ||
					state.isShowWindowOfLocate ||
					state.isShowWindowOfAnalysis) {
					return;
				}
			}
			state.isShowWindowOfMemo = data;
		},
		// 设置批注窗口的批注文本
		setTxtOfMemo(state, data) {
			state.txtOfMemo = data;
		},
		// 设置批注窗口位置
		setMsgOfWindowOfMemo(state, data) {
			state.msgOfWindowOfMemo = data;
		},
		// 设置 拖动窗口 dom
		setDomOfDragWindow(state, data) {
			state.domOfDragWindow = data;
		},
		// 全部窗口关闭
		closeAllWindow(state) {
			state.isShowWindowOfAddProgress = false;
			state.isShowWindowOfBatchMinus = false;
			state.isShowWindowOfMenu = false;
			state.isShowWindowOfMinus = false;
			state.isShowWindowOfDetail = false;
			state.isShowWindowOfSeparateBill = false;
			state.isShowWindowOfSettingEfficiency = false;
			state.isShowWindowOfBatchSettingEfficiency = false;
			state.isShowWindowOfLocate = false;
			state.isShowWindowOfAnalysis = false;
			state.isShowWindowOfMemo = false;
		}
    },
  }