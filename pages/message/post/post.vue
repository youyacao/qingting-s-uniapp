<template>
	<view class="body">
		<view class="content">
			<u-input v-model="content" type="textarea" height="250" auto-height placeholder="此刻的想法..." />
		</view>
		<view class="upload-box">
			<u-upload :auto-upload="false" max-count="6" @on-choose-complete="onChooseComplete" @on-remove="onRemove"></u-upload>
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
	import { Categories, PostArticle } from '@/common/api.js'
	import { BASE_URL } from '@/common/config.js'
	import { getToken } from '@/common/common.js'
	
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
				loading: false
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
			onChooseComplete(lists) {
				uni.showLoading({
				    title: '上传中'
				})
				let _length = 0
				lists.map(item => {
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
								console.log('>>>>>>>', data)
								this.fileList.push(data.url)
							}
						},
						fail: (error) => {
							console.log(error)
						},
						complete: () => {
							_length++
							if (_length === lists.length) {
								console.log(this.fileList)
								uni.hideLoading()
								this.$refs.uToast.show({
									title: '上传成功',
									type: 'success'
								})
							}
						}
					})
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
