import axios from 'axios'
import { MessageBox, Message,Loading  } from 'element-ui'
import qs from 'qs'
import {getToken,allInfo} from "@/utils/myauths";
import loading from "@/api/loading";
import router from "@/router";
// create an axios instance

const service = axios.create({
  baseURL: 'http://www.bufantec.com', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})
// 打开loding状态




// request interceptor  拦截器
service.interceptors.request.use(

    config => {
      // do something before request is sent
      var token = getToken();
    if (token){
      config.headers['bufan-token'] = token
    }
        // let each request carry token
        // ['X-Token'] is a custom headers key
        // please modify it according to the actual situation

      loading.showLOding()

      return config
    },
    error => {
      // do something with request error
      console.log(error) // for debug
      return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
     */

    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
    response => {
      loading.hideLoding()
      const res = response.data
      if (res.tokenCode == 5000 || res.tokenCode == 5001 ){
        Message({
          message:'token失效,请重新登录!',
          type:'error',
          duration: 5 * 1000
        })
        //清除所有的信息
        allInfo()
        router.push('/login')
        return Promise.reject(new Error(res.message || 'Error'))
      }else {
        return res
      }

      // if the custom code is not 20000, it is judged as an error.
      // if (res.code !== 20000) {
      //   Message({
      //     message: res.message || 'Error',
      //     type: 'error',
      //     duration: 5 * 1000
      //   })

      //   // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      //   if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
      //     // to re-login
      //     MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
      //       confirmButtonText: 'Re-Login',
      //       cancelButtonText: 'Cancel',
      //       type: 'warning'
      //     }).then(() => {
      //       store.dispatch('user/resetToken').then(() => {
      //         location.reload()
      //       })
      //     })
      //   }
      //   return Promise.reject(new Error(res.message || 'Error'))
      // } else {
      //   return res
      // }
    },
    error => {
      console.log('err' + error) // for debug
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(error)
    }
)
// {
//   url: '/admin/xy/student/list',
//   method: 'GET',
//   kv
// }
// 把service 进一步加工
function http(config) {
  // config就是api传递的参数
  if (config.method.toLowerCase() === 'get') {
    // get类型 参数放哪?
    config.params = config.kv
  } else if (config.method.toLowerCase() === 'post') {
    // 设置数据默认提交格式 config 是从接口传递进来的参数默认没有headers 所以操作headers报错
    console.log('config', config)
    config.headers = {}
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    // 数据转换等需求...
    // 对象的序列化
    // https://www.npmjs.com/package/qs
    // 复杂对象: qs.stringify({ a: { b: { c: 'd', e: 'f' } } }, { allowDots: true }); 'a.b.c=d&a.b.e=f'
    // 数组: qs.stringify({ a: ['b', 'c'] }, { arrayFormat: 'repeat' })  'a=b&a=c'
    config.data = qs.stringify(config.kv, { allowDots: true, arrayFormat: 'repeat' })
  }
  // 重新进行回调的方式来进行操作
  return service(config)
}

export default http
