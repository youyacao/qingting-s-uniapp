<template>
	<view class="body">
		<view class="head">
			<textarea class="textarea" placeholder="请输入标题~" v-model="title" />
			<view class="head-right" @tap="_chooseVideo">
				<view class="video-box">
					<video class="video" id="video" :src="src" v-if="src" :controls="false" autoplay></video>
					<image class="add-icon" src="/static/images/add-icon-1.png" mode="" v-else></image>
				</view>
				<view class="progress-box" v-if="uploadProgress">
					<text class="progress-text">{{ uploadProgress }}%</text>
				</view>
			</view>
		</view>
		<view class="line"></view>
		<view class="select" @tap="show = true">
			<view class="select-left">
				<image class="select-left__right" src="/static/images/categories.png" mode=""></image>
				<text>{{ selectItem.label }}</text>
			</view>
			<image class="select-icon" src="/static/images/right-arrow.png" mode=""></image>
		</view>
		<view class="btn-box">
			<u-button type="success" @click="_verify" :loading="loading">发布</u-button>
		</view>
		<u-select v-model="show" mode="mutil-column-auto" :list="list" @confirm="_confirm"></u-select>
		<u-toast ref="uToast" />
		<view class="nav-box">
			<v-tabbar></v-tabbar>
		</view>
	</view>
</template>

<script>
	import { Categories, ReleaseVideo } from '@/common/api.js'
	import { BASE_URL } from '@/common/config.js'
	import { getToken } from '@/common/common.js'
	import VTabbar from '@/components/v-tabbar/v-tabbar.nvue'
	import { mapActions } from 'vuex'
	
	export default {
		data() {
			return {
				video: '',
				src: '',
				show: false,
				list: [],
				selectItem: {
					value: '',
					label: '选择分类'
				},
				title: '',
				loading: false,
				uploadProgress: 0,
				videoContext: null
			};
		},
		components: { VTabbar },
		onLoad() {
			uni.hideTabBar()
			this._getCategories()
		},
		onShow() {
			if (this.videoContext) {
				this.videoContext.play()
			}
			this.updateUserinfo()
		},
		methods: {
			...mapActions(['updateUserinfo']),
			_chooseVideo() {
				uni.chooseVideo({
					count: 1,
					sourceType: ['camera', 'album'],
					success: (res) => {
						this.src = res.tempFilePath
						this.videoContext = uni.createVideoContext('video', this)
						this._uploadVideo()
					}
				})
			},
			_getCategories() {
				Categories().then(({ code, data }) => {
					if (code === 200) {
						data.map((item, index) => {
							this.list.push({
								value: item.id,
								label: item.name,
								children: []
							})
							if (item.children.length) {
								item.children.map(item => {
									this.list[index].children.push({
										value: item.id,
										label: item.name
									})
								})
							} else {
								this.list[index].children[0] = {
									value: item.id,
									label: item.name
								}
							}
						})
					}
				})
			},
			_confirm(e) {
				this.selectItem = e[1]
			},
			_submit() {
				ReleaseVideo({
					category_id: this.selectItem.value,
					title: this.title,
					thumb: this.video.img_url,
					video_url: this.video.url
				}).then(({ code, msg }) => {
					uni.showToast({
						title: msg,
						icon: 'none'
					})
					this.loading = false
					if (code === 200) {
						this.title = ''
						this.src = ''
						this.video = ''
						setTimeout(() => {
							this.uploadProgress = 0
						}, 200)
						this.selectItem = {
							value: '',
							label: '选择分类'
						}
					}
				}).catch(err => {
					this.loading = false
				})
			},
			_verify() {
				if (!this.title) {
					return this.$refs.uToast.show({
						title: '请输入标题',
						type: 'warning'
					})
				}
				if (!this.src) {
					return this.$refs.uToast.show({
						title: '请选择视频',
						type: 'warning'
					})
				}
				if (!this.selectItem.value) {
					return this.$refs.uToast.show({
						title: '请选择分类',
						type: 'warning'
					})
				}
				if (this.uploadProgress === 100) {
					this.loading = true
					this._submit()
				} else {
					uni.showToast({
						title: '请等待文件上传完成',
						icon: 'none'
					})
				}
			},
			_uploadVideo() {
				const uploadTask = uni.uploadFile({
					url: `${BASE_URL}uploadVideo`,
					header: {
						authorization: getToken()
					},
					filePath: this.src,
					name: 'file',
					formData: {},
					success: (uploadFileRes) => {
						const { code, msg, data } = JSON.parse(uploadFileRes.data)
						console.log('视频上传成功', code, msg, data)
						if (code === 200) {
							this.video = data
						} else {
							uni.showToast({
								title: msg,
								icon: 'none'
							})
						}
					},
					fail: (err) => {
						console.log('视频上传失败', err)
					}
				})
				uploadTask.onProgressUpdate((res) => {
					this.uploadProgress = res.progress
					console.log('上传进度', res.progress)
					// console.log('已经上传的数据长度', res.totalBytesSent)
					// console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
				})
			}
		},
		onHide() {
			if (this.videoContext) {
				this.videoContext.pause()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.progress-box {
		width: 150rpx;
		text-align: center;
	}
	.progress-text {
		font-size: 24rpx;
		color: #808080;
		margin-top: 12rpx;
	}
	.nav-box {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #0E1727;
	}
	.video {
		width: 150rpx;
		height: 200rpx;
	}
	.select-left {
		display: flex;
		align-items: center;
	}
	.select-left__right {
		width: 45rpx;
		height: 45rpx;
		margin-right: 12rpx;
	}
	.select {
		height: 80rpx;
		display: flex;
		justify-content: space-between;
		padding: 0 32rpx;
		align-items: center;
		color: #FFFFFF;
		font-size: 28rpx;
	}
	.select-icon {
		width: 40rpx;
		height: 40rpx;
	}
	.btn-box {
		position: fixed;
		right: 0;
		bottom: 50px;
		left: 0;
		padding: 32rpx;
	}
	.line {
		margin: 32rpx;
		height: 1rpx;
		background-color: #808080;
	}
	.add-icon {
		width: 50rpx;
		height: 50rpx;
	}
	.textarea {
		flex: 1;
		color: #FFFFFF;
	}
	.video-box {
		height: 200rpx;
		border-radius: 12rpx;
		background-color: #808080;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}
	.head-right {
		width: 150rpx;
	}
	.head {
		display: flex;
		padding: 32rpx;
	}
	.body {
		height: 100vh;
		background-color: #252a34;
	}
</style>
