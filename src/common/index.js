// 注册自定义插件
export default{
	install: function(Vue, opt) {
		// seieiURL: "http://www.etscn.com.cn:58080/SaasapsBackEnd/api/",
		// seieiURL: "http://localhost:8080/api/",
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
				},
				// 用户 session 失效
				isInvaildSession: function(status) {
					if (status == 10) {
						var href = window.location.href;
						href = href.split("/ps")[0] + "/#/signIn";
						window.location.assign(href);
					}
				}
			},
			created: function () {
			}
		})
	}
}