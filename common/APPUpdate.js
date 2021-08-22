
// All rights Reserved, Designed By www.youyacao.com 
// @Description:APP热更新
// @author:成都市一颗优雅草科技有限公司     
// @version 蜻蜓S系统 前端源码 
// 注意：本前端源码遵循开源条款
// 详情访问：https://songshu.youyacao.com/detail/244.html
// 本内容仅限于个人参考，禁止用于其他的商业用途
// 需要商业用途或者定制开发等可访问songshu.youyacao.com   联系QQ:422108995 23625059584








let httpData = {
    version: version
}

if (platform === "android") {
    httpData.type = 1101
} else {
    httpData.type = 1102
}
/* 接口入参说明
 * version: 应用当前版本号（已自动获取）
 * type：平台（1101是安卓，1102是IOS）
 */

// 可以用自己项目的请求方法
$http.get("api/kemean/aid/app_version", httpData).then(res => {
    /*接口出参说明 （res数据说明）
    * | 参数名称         | 一定返回     | 类型        | 描述
    * | -------------|--------- | --------- | ------------- |
    * | versionCode  | y        | int       | 版本号        |
    * | versionName  | y        | String    | 版本名称      |
    * | versionInfo  | y        | String    | 版本信息 \n 换行（例如：1.修改了bug1 \n 2.修改了bug2 \n 3.修改了bug3）      |
    * | forceUpdate  | y        | boolean   | 是否强制更新  |
    * | downloadUrl  | y        | String    | 版本下载链接 `IOS安装包更新请放跳转store应用商店链接,安卓apk和wgt文件放文件下载链接` |
    */
   // 只要callback上面的数据就ok(返回数据就表示接口允许更新)
   // 示例返回数据
   callback && callback({
       versionCode: 101,
       versionName: "1.0.1",
       versionInfo: "1.修改了bug1 \n 2.修改了bug2 \n 3.修改了bug3",
       forceUpdate: false,
       downloadUrl: "http://www.xxx.com/download/123",
   })
})