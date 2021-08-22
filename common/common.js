

// All rights Reserved, Designed By www.youyacao.com 
// @Description:TOKEN
// @author:成都市一颗优雅草科技有限公司     
// @version 蜻蜓S系统 前端源码 
// 注意：本前端源码遵循开源条款
// 详情访问：https://songshu.youyacao.com/detail/244.html
// 本内容仅限于个人参考，禁止用于其他的商业用途
// 需要商业用途或者定制开发等可访问songshu.youyacao.com   联系QQ:422108995 23625059584




export const getToken = () => {
	let token = null
	try {
		const _token = uni.getStorageSync('TOKEN')
		if (_token) {
			token = _token
		}
	} catch (e) {
		// error
	}
	return token
}

// 1维数组转2维数组
export const toTwoArray = (arr, count) => {
	let result = []
	let num = Math.ceil(arr.length / count);
	for(let i = 0 ;i < num; i++){
		result.push(arr.slice(i * count, i * count + count))
	}
	return result
}