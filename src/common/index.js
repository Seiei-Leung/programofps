import DateUtil from "./dateUtil";
import HistoryObj from "../vo/historyObj";

// 注册自定义插件
export default{
	install: function(Vue, opt) {
		Vue.mixin({
			data: function() {
				return {
					seieiURL: "http://193.112.62.129:8080/SaasapsBackEnd/api/",
					//seieiURL: "http://localhost:8080/SaasapsBackEnd/api/",
					//seieiURL: "http://www.etscn.com.cn:58080/SaasapsBackEnd/api/"
				}
			},
			methods: {
				// 显示提示
				showToast: function(toastTxt, time) {
					var that = this;
					if (time == null) {
						time = 2000;
					}
					this.$store.commit("showToast", toastTxt);
					setTimeout(() => {
						that.$store.commit("hideToast");
					}, time);
				},
				// 用户 session 失效
				isInvaildSession: function(status) {
					if (status == 10) {
						var href = window.location.href;
						href = href.split("/ps")[0] + "/#/signIn";
						window.location.assign(href);
					}
				},
				// 清空被选中的计划进度的框边颜色(包括相同制单号引起的激活状态)
				clearActivedProgressBar: function() {
					var colorSetting = this.$store.state.colorSetting;
					var ctxOfSource = this.$store.state.ctxOfSource;
					var activedProgressBar = this.$store.state.activedProgressBar;
					if (activedProgressBar != null) {
						var activedProductLine = this.$store.state.productLineList[activedProgressBar.getProductLineIndex];
						// 当前激活的进度条有可能是新增进度条，因此没有生产线
						if (activedProductLine != null) {
							activedProductLine.clear(ctxOfSource);
							activedProductLine.renderWithOutIdList(ctxOfSource, colorSetting, null, []);
						}
					}

					// 清空相同制单号引起的激活状态
					var progressBarListOfTheSameOrderNo = this.$store.state.progressBarListOfTheSameOrderNo;
					for (var indexOfProgressBarListOfTheSameOrderNo=0; indexOfProgressBarListOfTheSameOrderNo < progressBarListOfTheSameOrderNo.length; indexOfProgressBarListOfTheSameOrderNo++) {
						// 获取信息
						var itemOfProgressBarListOfTheSameOrderNo = progressBarListOfTheSameOrderNo[indexOfProgressBarListOfTheSameOrderNo];
						// 获取列表中所有进度条信息，并重新渲染
						for (var indexOfProgressBar=0; indexOfProgressBar<itemOfProgressBarListOfTheSameOrderNo.progressBarList.length; indexOfProgressBar++) {
							var productLineItem = this.productLineList[itemOfProgressBarListOfTheSameOrderNo.productLineIndex];
							productLineItem.clear(ctxOfSource);
							productLineItem.renderWithOutIdList(ctxOfSource, colorSetting, null, []);
						}
					}
		
					// 还原存储列表
					progressBarListOfTheSameOrderNo = [];
					this.$store.commit("setProgressBarListOfTheSameOrderNo", []);
				},
        		// 获取待排产的详情列表
        		getAllForAddProgress: function() {
         		    var that = this;
					this.$store.commit("setIsReadyShowWindowOfAddProgress", false);
        		    return this.axios.get(this.seieiURL + "productionplanningdetail/getAllForAddProgress").then((response) => {
        		        if (response.data.status) {
        		            that.$Message.error(response.data.msg);
        		            that.isInvaildSession(response.data.status);
        		        } else {
							that.$store.commit("setIsReadyShowWindowOfAddProgress", true);
        		            that.$store.commit("setWaitingAddProgressList", response.data.data);
        		        }
        		    }).catch((error) => {
        		        that.$Message.error({
        		          content: "服务器异常,请刷新！！",
        		          duration: 0,
        		          closable: true
        		        });
        		        console.log(error);
        		    });
				},
				// 重载生产线信息
				reloadMsgOfProductLine: function() {
					var that = this;
					this.$store.commit("setIsLoading", true);
					return this.axios.get(this.seieiURL + "productionline/getResourceDataByUserId?time=" + DateUtil.firstTimeStampOfShow).then((response) => {
						if (response.data.status) {
							that.$store.commit("setIsLoading", false);
							that.$Message.error(response.data.msg);
							that.isInvaildSession(response.data.status);
						} else {
							var resourceData = response.data.data;
							var productlineList = [];
							for (var productLineIndex=0; productLineIndex<resourceData.length; productLineIndex++) {
								var productLineItem = new ProductLine(
									resourceData[productLineIndex].id,
									productLineIndex,
									resourceData[productLineIndex].workgroup,
									resourceData[productLineIndex].workshop,
									resourceData[productLineIndex].lineCode,
									resourceData[productLineIndex].peopleNum,
									resourceData[productLineIndex].workhours,
									resourceData[productLineIndex].defaultStyleName,
									resourceData[productLineIndex].peopleNumOfLineList,
									resourceData[productLineIndex].workhoursOfLineList,
									resourceData[productLineIndex].efficiencyOfLineList
								);
								var progressList = [];
								for (var progressIndex=0; progressIndex<resourceData[productLineIndex].productionPlanningDetailList.length; progressIndex++) {
									var progressItemTemp = resourceData[productLineIndex].productionPlanningDetailList[progressIndex];
									var progressItem = new ProgressBar(
										productLineIndex,
										resourceData[productLineIndex].id,
										progressItemTemp
									); 
									progressList.push(progressItem);
								}
								productLineItem.setProgressList(progressList);
								productlineList.push(productLineItem);
							}
							// 保存到 vuex 中
							that.$store.commit("setIsLoading", false);
							that.$store.commit('setProductLineList', productlineList);
							// 重新渲染
							productlineList.forEach((item) => {
								item.clear(that.$store.state.ctxOfSource);
								item.renderWithOutIdList(that.$store.state.ctxOfSource, that.$store.state.colorSetting, null, []);
							});
						}
					}).catch((error) => {
						that.$store.commit("setIsLoading", false);
						that.$Message.error({
						  content: "服务器异常,请刷新！！",
						  duration: 0,
						  closable: true
						});
						console.log(error);
					});
				},
				/**
				 * 之前没有记录过历史版本，则初始化历史版本快照
				 * @param {*} productLineList 生产线信息
				 * @param {*} dataOfWaitingAddProgressList 待排产表信息 
				 * @returns 
				 */
				initHistoryObjList: function(productLineList, dataOfWaitingAddProgressList) {
					var productLineListTemp = [];
					var historyObjListFromStore = this.$store.state.historyObjList;
					if (historyObjListFromStore.length == 0) {
						for (var i=0; i<productLineList.length; i++) {
							productLineListTemp.push(productLineList[i].copy());
						}
						var historyObj = new HistoryObj(
							productLineListTemp,
							dataOfWaitingAddProgressList,
							[]
						);
						this.$store.commit("pushHistoryObjList", historyObj);
						return true;
					}
					return false;
				},
				/**
				 * 之前有记录历史版本，记录历史版本
				 * @param {*} productLineList 生产线信息
				 * @param {*} dataOfWaitingAddProgressList 待排产表信息 
				 * @param {*} progressIdForDelete 删除进度条的 ID 
				 * @returns 
				 */
				pushHistoryObjList: function(productLineList, dataOfWaitingAddProgressList, progressIdForDelete) {
					var productLineListTemp = [];
					for (var i=0; i<productLineList.length; i++) {
						productLineListTemp.push(productLineList[i].copy());
					}
					var historyObjListFromStore = this.$store.state.historyObjList;
					var listOfDeleteIdForSave = []; // 用于保存 删除进度条的id列表 的信息
					// 获取上一个历史版本实例
					var activedIndexOfHistoryObjList = this.$store.state.activedIndexOfHistoryObjList; // 当前历史版本对应的索引
					if (activedIndexOfHistoryObjList != 0) {
						// 获取上一个历史版本实例
						var historyObjOfLast = historyObjListFromStore[activedIndexOfHistoryObjList];
						// 获取上一个历史版本实例的 删除进度条的id列表 的信息
						listOfDeleteIdForSave = historyObjOfLast.getListOfDeleteProgressId;
					}
					// 添加了删除进度条的ID
					if (progressIdForDelete != null) {
						listOfDeleteIdForSave.push(progressIdForDelete);
					}
					var historyObj = new HistoryObj(
						productLineListTemp,
						dataOfWaitingAddProgressList,
						listOfDeleteIdForSave
					);
					this.$store.commit("pushHistoryObjList", historyObj);
				}
			},
			created: function () {
			}
		})
	}
}