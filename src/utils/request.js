import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import router from '../router'

import qs from 'qs'

let io = localStorage.getItem("IO")


const service = axios.create({
  baseURL: io == 'i'?process.env.VUE_APP_BASE_API_IN : process.env.VUE_APP_BASE_API_OUT, // url = base url + request url
  timeout: 50000, // request timeout
  //-----------------------设置为formData格式传参------------------------------------------------
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})


// request interceptor
service.interceptors.request.use(
  config => {
    config.data = qs.stringify(config.data) // 转为formdata数据格式
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
    const res = response.data

    if (res.code !== '0000') {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 3 * 1000
      })
      if (res.code === '4444' ) {
        // to re-login
        MessageBox.confirm('尚未登录或用户登陆信息已失效!', '重新登录', {
          confirmButtonText: '确定',
          showCancelButton:false,
          type: 'warning'
        }).then(() => {
          store.dispatch('flag/getFlag',false)
          router.push(`/login`)
        })
        return false
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
