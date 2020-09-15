import axios from "axios"
import qs from "qs"
import { config } from "@vue/test-utils"
import { getToken } from "@/utils/tokenAuth"
const service = axios.create({
    // baseURL:"http://www.bufantec.com",
    timeout: 5000
})
// 请求拦截器
service.interceptors.request.use(config => {
    // 获取token并设置请求头携带token
    if (getToken()) {
        config.headers["bufan-token"] = getToken()
    }
    return config
}, error => {
    console.log(config)
})
// 响应拦截器
service.interceptors.response.use(response => {
    return response
}, error => {
    console.log(error)
})
function http(config) {
    if (config.method.toLowerCase() === 'post') {
        // 序列化
        // arrayFormat: 'repeat'格式化数组参数 中括号转换为点allowDots
        var params = qs.stringify(config.data, { arrayFormat: 'repeat', allowDots: true })
        config.data = params
    } else {
        config.params = config.data
    }
    return service(config)
}
export default http