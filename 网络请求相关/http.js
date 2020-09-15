import baseUrl from "./baseUrl.js"
import qs from "./qs"
var obj = {
  get(url,params){
    return new Promise(function(resolve,rejected){
      wx.request({
        url: baseUrl + url ,
        data:params,
        header:{
          "bufan-token":wx.getStorageSync('adminToken') ? wx.getStorageSync('adminToken') : ""
        },
        success(res){
          resolve(res)
        },
        fail(res){
          rejected(res)
        }
      })
    })
   
  },
  post(url,params){
    return new Promise((resolve,rejected)=>{
      wx.request({
        url: baseUrl+url,
        data:qs.stringify(params,{ allowDots: true }),
        header:{
          "content-type":"application/x-www-form-urlencoded"
        },
        method:"POST",
        success(res){
          resolve(res)
        },
        fail(res){
          rejected(res)
        }
      })
    })
  }
}
export default obj