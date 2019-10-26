import ScrollUtil from "./scrollUtil";

// 注册自定义插件
export default{
	install: function(Vue, opt) {
		// 定义 goBack 实例方法，返回上一页
		Vue.mixin({
			data: function() {
				return {
					seieiURL: "http://localhost:8080/api/",
					scrollDirection: null, // 滚动方向
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
				}
			},
			created: function () {
				var that = this;
				// todo 检测用户登录信息
				
				// 检查滚动
				this.$nextTick(() => {
					var scrollUtil = new ScrollUtil();
					window.onscroll = function() {
						scrollUtil.scroll();
						if (scrollUtil.scrollDirection == 'down' || scrollUtil.scrollDirection == 'up') {
							that.$store.commit('scrollUpOrDown');
						} else if (scrollUtil.scrollDirection == 'right' || scrollUtil.scrollDirection == 'left') {
							that.$store.commit('scrollRightOrLeft');
						}
					}
				});
			}
		})
	}
}