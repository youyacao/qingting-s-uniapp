<template>
	<view class="body">
		<view class="content">
			<u-input v-model="content" type="textarea" height="250" auto-height placeholder="此刻的想法..." />
		</view>
		<view class="upload-box">
			<u-upload ref="uUpload" :auto-upload="false" max-count="6" @on-choose-complete="onChooseComplete" @on-remove="onRemove"></u-upload>
		</view>
		<u-cell-item icon="grid" :title="selectItem.label" @click="show = true"></u-cell-item>
		<u-select v-model="show" mode="mutil-column-auto" :list="list" @confirm="_confirm"></u-select>
		<u-toast ref="uToast" />
		<view class="btn-box">
			<u-button type="success" :loading="loading" @click="_submit">提交</u-button>
		</view>
	</view>
</template>

<script>
	import { Categories, PostArticle, UploadImage } from '@/common/api.js'
	import { BASE_URL } from '@/common/config.js'
	import { getToken } from '@/common/common.js'
	import Test from '@/common/test.js'
	
	export default {
		data() {
			return {
				content: '',
				show: false,
				list: [],
				selectItem: {
					value: '',
					label: '选择分类'
				},
				fileList: [],
				loading: false,
				machineResult: {
					Normal: "正常",
					Polity: "涉政",
					Sex: "色情",
					Terror: "暴恐",
					Legal: "违法违规",
					Ad: "广告"
				}
			};
		},
		onLoad() {
			this._getCategories()
		},
		methods: {
			_submit() {
				if (!this.content) {
					return this.$refs.uToast.show({
						title: '请输入内容',
						type: 'warning'
					})
				}
				if (!this.selectItem.value) {
					return this.$refs.uToast.show({
						title: '请选择分类',
						type: 'warning'
					})
				}
				this.loading = true
				this._checkText(this.content)
			},
			onChooseComplete(lists) {
				uni.showLoading({
				    title: '上传中'
				})
				let _length = 0
				let _count = 0
				let _errIndex = []
				lists.map((item, index) => {
					uni.uploadFile({
						url: `${BASE_URL}upload`,
						filePath: item.url,
						header: {
							authorization: getToken()
						},
						name: 'file',
						success: (uploadFileRes) => {
							const { code, data } = JSON.parse(uploadFileRes.data)
							if (code === 200) {
								_length++
								if (data.url) {
									this._checkImage(data.url, index)
								}
							} else {
								_errIndex.push(index)
							}
						},
						fail: (error) => {
							_errIndex.push(index)
						},
						complete: () => {
							_count++
							if (_count === lists.length) {
								if (_length === lists.length) {
									uni.hideLoading()
									this.$refs.uToast.show({
										title: '上传成功',
										type: 'success'
									})
								} else {
									uni.hideLoading()
									this.$refs.uToast.show({
										title: `成功上传${_length}张，${lists.length - _length}张上传失败`,
										type: 'success'
									})
									_errIndex.map(item => {
										this.$refs.uUpload.remove(item)
									})
								}
							}
						}
					})
				})
			},
			_checkImage(content, index) {
				Test('image', content).then(({ machine_result }) => {
					if (machine_result === 'Normal') {
						this.fileList.push(content)
					} else {
						const msg = this.machineResult[machine_result]
						uni.showToast({
							title: `检测到您的图片涉及${msg}，已自动删除。`,
							icon: 'none'
						})
						this.$refs.uUpload.remove(index)
					}
				})
			},
			_checkText(content) {
				Test('text', content).then(({ machine_result }) => {
					if (machine_result === 'Normal') {
						this._post()
					} else {
						const msg = this.machineResult[machine_result]
						uni.showToast({
							title: `检测到您的文字内容涉及${msg}，请重新输入。`,
							icon: 'none'
						})
						this.loading = false
						this.content = ''
					}
				})
			},
			_post() {
				PostArticle({
					type: 1,
					category_id: this.selectItem.value,
					content: this.content,
					images: this.fileList
				}).then(({ code, msg }) => {
					this.loading = false
					if (code === 200) {
						this.$refs.uToast.show({
							title: msg,
							type: 'success',
							back: true
						})
					} else {
						this.$refs.uToast.show({
							title: msg,
							type: 'error'
						})
					}
				})
			},
			onRemove(index, lists, name) {
				console.log(index, lists, name)
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
			}
		}
	}
</script>

<style lang="scss" scoped>
	.btn-box {
		position: absolute;
		bottom: 32rpx;
		left: 32rpx;
		right: 32rpx;
 	}
	.upload-box {
		padding: 32rpx 22rpx;
		display: flex;
		flex-flow: row wrap;
	}
	.content {
		padding: 32rpx;
	}
	.body {
		height: 100vh;
	}
</style>
