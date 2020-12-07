<template>
	<view class="body">
		<u-cell-group>
			<!-- <u-cell-item icon="setting-fill" title="个人设置"></u-cell-item> -->
			<u-cell-item icon="level" title="当前版本" value="1.3.1"></u-cell-item>
			<u-cell-item title="退出" @click="_logout"></u-cell-item>
		</u-cell-group>
	</view>
</template>

<script>
	import { Logout } from '@/common/api.js'
	import { mapMutations } from 'vuex'
	
	export default {
		data() {
			return {};
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
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>
