
<!-- 
All rights Reserved, Designed By www.youyacao.com 
@Description:广告页面
@author:成都市一颗优雅草科技有限公司     
@version 蜻蜓S系统 前端源码 
注意：本前端源码遵循开源条款
详情访问：https://songshu.youyacao.com/detail/244.html
本内容仅限于个人参考，禁止用于其他的商业用途
需要商业用途或者定制开发等可访问songshu.youyacao.com   联系QQ:422108995 23625059584

 -->

<template>
	<view class="body" @tap="_tap">
		<image class="ad" :src="ad.img_url" mode="scaleToFill" :style="{'width': `${windowWidth}px`, 'height': `${windowHeight - 0}px`}"></image>
		<view class="countdown" @tap="_skip" v-if="ad.img_url">
			<text>{{ countdown }}s｜跳过</text>
		</view>
		<view class="foot">
			<image class="logo" src="/static/start-logo.png" mode="aspectFit"></image>
		</view>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	import { AD } from '@/common/api.js'
	
	export default {
		data() {
			return {
				ad: {
					img_url: ''
				},
				countdown: 5,
				timer: null
			};
		},
		onLoad() {
			this._getAD()
		},
		computed: {
			...mapGetters(['windowWidth', 'windowHeight'])
		},
		methods: {
			_getAD() {
				AD({
					type: 1
				}).then(({ code, data }) => {
					if (code === 200) {
						this.ad = data[0]
						this._startCountdown()
					}
				})
			},
			_tap() {
				plus.runtime.openURL(this.ad.ad_url, () => {})
			},
			_startCountdown() {
				clearInterval(this.timer)
				this.timer = setInterval(() => {
					this.countdown--
					if (this.countdown < 0) {
						clearInterval(this.timer)
						uni.switchTab({
							url: '/pages/home/home'
						})
					}
				}, 1000)
			},
			_skip() {
				clearInterval(this.timer)
				uni.switchTab({
					url: '/pages/home/home'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.logo {
		height: 90rpx;
		width: 364rpx;
	}
	.foot {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 120px;
		background-color: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.countdown {
		position: absolute;
		top: var(--status-bar-height);
		right: 24rpx;
		background-color: rgba($color: #000000, $alpha: 0.2);
		border-radius: 6rpx;
		color: #FFFFFF;
		width: 130rpx;
		text-align: center;
		font-size: 24rpx;
		padding: 6rpx 0;
	}
	.body {
		width: 100%;
		height: 100%;
		position: relative;
	}
</style>
