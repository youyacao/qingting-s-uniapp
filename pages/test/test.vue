<!-- 
All rights Reserved, Designed By www.youyacao.com 
@Description:美颜调用部分
@author:成都市一颗优雅草科技有限公司     
@version 蜻蜓S系统 前端源码 
注意：本前端源码遵循开源条款
详情访问：https://songshu.youyacao.com/detail/244.html
本内容仅限于个人参考，禁止用于其他的商业用途
需要商业用途或者定制开发等可访问songshu.youyacao.com   联系QQ:422108995 23625059584

 -->




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
