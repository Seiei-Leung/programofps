import DateUtil from "../common/dateUtil";

// 注册自定义插件
export default{
	install: function(Vue, opt) {
		Vue.mixin({
			data: function() {
				return {
					seieiURL: "",
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
        		// 获取待排产的详情列表
        		getAllForAddProgress: function() {
        		    var that = this;
        		    return this.axios.get(this.seieiURL + "productionplanningdetail/getAllForAddProgress").then((response) => {
        		        if (response.data.status) {
        		            that.$Message.error(response.data.msg);
        		            that.isInvaildSession(response.data.status);
        		        } else {
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
								item.renderWithOutIdList(that.$store.state.ctxOfSource, that.$store.state.colorSetting, null);
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
			},
			created: function () {
				this.seieiURL = location.href.split("SaasapsBackEnd/")[0] + "SaasapsBackEnd/api/";
			}
		})
	}
}