import request from '@/utils/request'
//登录
export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}
//获取用户信息
export function getInfo() {
  return request({
    url: '/user/info',
    method: 'get',
    // params: { token }
  })
}
//退出登录
export function logout() {
  return request({
    url: '/logout',
    method: 'get'
  })
}
