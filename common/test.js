import MD5 from 'crypto-js/md5'

const Test = (type, content) => {
	const n = '422108995@qq.com'
	const app_key = 'c817446b0d1c45dda93b4abaffaadac0e6051ed687cb4d0cb42ffdf592e4debe'
	const customer_code = '232020122515494276'
	const content_id = new Date().getTime()
	const s = parseInt(content_id / 1000)
	const t = MD5(`${s}${app_key}`).toString()
	
	return new Promise((resolve, reject) => {
		uni.request({
		    url: `https://kmscli.qixincha.com/client/purify/${type}/?n=${n}&t=${t}&s=${s}`,
			method: 'POST',
		    data: {
				customer_code,
				content_id,
				content
			},
		    header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
		    success: ({ data }) => {
				resolve(data)
		    },
			fail: (err) => {
				reject(err)
			},
			complete: () => {
				console.log('complete')
			}
		})
	})
}

export default Test