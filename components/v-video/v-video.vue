<template>
	<view class="body">
		<image class="poster" :src="video.thumb" mode="aspectFill" :style="{'width': `${windowWidth}px`, 'height': `${windowHeight}px`}" v-if="!isPlay"></image>
		<video id="video" src="" :style="{'width': `${windowWidth}px`, 'height': `${windowHeight}px`}"
			:controls="controls"
			:show-center-play-btn="false"
			:src="video.video_url"
			:show-loading="false"
			:enable-progress-gesture="false"
			:loop="true"
			@play="onPlay"
			@pause="onPause"
			@tap="onTap"
			@loadedmetadata="loadedmetadata"
			@timeupdate="timeUpdate"></video>
			<view class="play-icon__box" v-if="isPause" @tap="onTap">
				<image class="play-icon" src="/static/images/play-icon.png" mode=""></image>
			</view>
		<v-progress class="progress" :detail="detail"></v-progress>
	</view>
</template>

<script>
	import { mapGetters, mapState } from 'vuex'
	import VProgress from '@/components/v-progress/v-progress'
	import { VideoPlayback } from '@/common/api.js'
	
	export default {
		data() {
			return {
				controls: false,
				videoContext: null,
				isPlay: false,
				isPause: false,
				detail: {
					currentTime: 0,
					duration: 0
				}
			};
		},
		computed: {
			...mapGetters(['windowHeight', 'windowWidth']),
			...mapState(['isLeave'])
		},
		props: {
			video: {
				type: Object,
				default: null
			},
			index: {
				type: Number,
				default: null
			},
			current: {
				type: Number,
				default: null
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.videoContext = uni.createVideoContext('video', this)
				const _pages = getCurrentPages()
				const _page = _pages[_pages.length - 1]
				const _route = _page.route
				if (this.index === this.current && _route === 'pages/home/home') {
					this.play()
				}
			})
		},
		methods: {
			timeUpdate({ detail }) {
				// console.log(detail)
				this.detail = detail
			},
			loadedmetadata(event) {
				console.log(event)
			},
			onPlay() {
				this.isPlay = true
				this.$emit('play', this.videoContext)
			},
			play() {
				this.videoContext.play()
				VideoPlayback({
					vid: this.video.id
				}).then(res => {
					// console.log(res)
				})
			},
			_isPuase() {
				if (this.isPause) {
					this.isPause = false
				}
			},
			onTap() {
				if (this.isPlay) {
					this.videoContext.pause()
					this.isPause = true
				} else {
					this.videoContext.play()
					this.isPause = false
				}
			},
			onPause() {
				this.isPlay = false
			}
		},
		watch: {
			isLeave(val) {
				if (val) {
					if (this.index === this.current) {
						this.videoContext.pause()
					}
				} else {
					if (this.index === this.current && !this.isPause) {
						this.videoContext.play()
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.progress {
		position: absolute;
		right: 0;
		bottom: 50px;
		left: 0;
	}
	.play-icon__box {
		align-items: center;
		justify-content: center;
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
	}
	.play-icon {
		width: 100rpx;
		height: 100rpx;
		opacity: 0.25;
	}
	.body {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
	}
</style>
