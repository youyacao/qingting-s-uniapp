<script>
	// #ifdef APP-PLUS
	import APPUpdate from "@/js_sdk/zhouWei-APPUpdate/APPUpdate"
	// #endif
	
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// #ifdef APP-PLUS
			APPUpdate()
			// #endif
			
			// 保持屏幕常亮
			uni.setKeepScreenOn({
				keepScreenOn: true
			})
			const systemInfo = uni.getSystemInfoSync()
			this.$store.commit('setSystemInfo', systemInfo)
		},
		onShow: function() {
			console.log('App Show')
			// this.$store.commit('setAppHide', false)
		},
		onHide: function() {
			console.log('App Hide')
			// this.$store.commit('setAppHide', true)
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	// #ifndef APP-PLUS-NVUE
	@import "uview-ui/index.scss";
	// #endif
</style>
