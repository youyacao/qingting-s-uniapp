<template>
	<view>
		<button type="default" @tap="chooseVideo">Choose Video</button>
	</view>
</template>

<script>
	const TuSDKEdit = uni.requireNativePlugin('youyacao-TuSDKEdit')

	export default {
		data() {
			return {

			}
		},
		methods: {
			chooseVideo() {
				uni.chooseVideo({
					count: 1,
					sourceType: ['camera', 'album'],
					success: (res) => {
						console.log(res.tempFilePath)
						TuSDKEdit.edit({
							list: [res.tempFilePath]
						}, result => {
							const msg = JSON.stringify(result);
							uni.showModal({
								content: msg,
								showCancel: false
							});
						});
					}
				})
			}
		}
	}
</script>

<style>

</style>
