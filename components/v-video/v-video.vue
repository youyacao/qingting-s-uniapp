<template>
	<view class="body">
		<image class="poster" :src="video.thumb" mode="aspectFill" :style="{'width': `${windowWidth}px`, 'height': `${windowHeight}px`}" v-if="!isPlay && !isPause"></image>
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
		<v-slider
			class="progress"
			v-model="sliderValue"
			:is-start="isPause"
			@change="_sliderChange" 
			@changing="_sliderChanging"  />
	</view>
</template>

<script>
	import { mapGetters, mapState } from 'vuex'
	import { VideoPlayback, AddView } from '@/common/api.js'
	
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
				},
				sliderValue: 0,
				addViewTimer: null
			};
		},
		computed: {
			...mapGetters(['windowHeight', 'windowWidth']),
			...mapState(['appHide', 'path'])
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
				if (this.index === this.current && this.path === '/pages/home/home') {
					this.play()
				}
			})
		},
		methods: {
			pause(){
				if(this.videoContext) {
					this.videoContext.pause()
				}
			},
			stop(){
				if(this.videoContext) {
					this.videoContext.seek(0)
					this.sliderValue = 0
				}
			},
			seek(value){
				if(this.videoContext) {
					this.videoContext.seek(value)
					this.videoContext.play()
					this.isPause = false
				}
			},
			_sliderChange({ value }) {
				this.seek(value / 100 * this.detail.duration)
			},
			_sliderChanging() {
				this.pause()
			},
			timeUpdate({ detail }) {
				this.detail = detail
				this.sliderValue = this.detail.currentTime / this.detail.duration * 100
				if (this.path !== '/pages/home/home') {
					this.videoContext.pause()
				}
			},
			loadedmetadata(event) {
				console.log(event)
			},
			onPlay() {
				clearTimeout(this.addViewTimer)
				this.isPlay = true
				this.addViewTimer = setTimeout(() => {
					AddView({
						video_id: this.video.id
					}).then(res => {})
				}, 5000)
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
		onHide() {
			console.log('video Hide')
			this.videoContext.pause()
		},
		watch: {
			appHide(val) {
				if (this.index === this.current) {
					if (val) {
						this.videoContext.pause()
					} else {
						if (!this.isPause) {
							this.videoContext.play()
						}
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
