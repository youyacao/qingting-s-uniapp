<template>
	<view class="body">
		<u-cell-group>
			<!-- <u-cell-item icon="setting-fill" title="个人设置"></u-cell-item> -->
			<u-cell-item icon="level" title="当前版本" :value="`${version}`" @click="onAPPUpdate"></u-cell-item>
			<u-cell-item title="退出" @click="_logout"></u-cell-item>
		</u-cell-group>
	</view>
</template>

<script>
	// #ifdef APP-PLUS
	import APPUpdate, { getCurrentNo } from "@/js_sdk/zhouWei-APPUpdate/APPUpdate"
	// #endif
	import { Logout } from '@/common/api.js'
	import { mapMutations } from 'vuex'
	
	export default {
		data() {
			return {
				version: '1.0.0'
			};
		},
		onLoad() {
			plus.runtime.getProperty(plus.runtime.appid, (wgtinfo) => {
				this.version = wgtinfo.version
			})
			// getCurrentNo(res => {
			// 	this.version = res.version
			// })
		},
		methods: {
			...mapMutations(['setPath']),
			_logout() {
				Logout().then(({ code }) => {
					if (code === 200) {
						try {
						    uni.setStorageSync('TOKEN', null)
						} catch (e) {
						    // error
						}
						this.setPath('/pages/home/home')
						uni.reLaunch({
							url: '/pages/home/home'
						})
					}
				})
			},
			onAPPUpdate() {
				// true 没有新版本的时候有提示，默认：false
				APPUpdate(true)
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>
