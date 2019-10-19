import ScrollUtil from "./scrollUtil";

// 注册自定义插件

export default{
	install: function(Vue, opt) {
		// 定义 goBack 实例方法，返回上一页
		Vue.mixin({
			data: function() {
				return {
					seieiURL: "http://localhost:8080/api/",
					scrollX: null,
					scrollY: null,
					scrollDirection: null,
				}
			},
			methods: {
				goBack: function() {
					this.$router.go(-1);
				},
			},
			created: function () {
				var that = this;
/*       			if (this.$store.state.userMsg.length == 0) {
                      
				  } */
				
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