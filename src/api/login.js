import request from '@/utils/request'

// 登录方法
// export function login(username, password, code, uuid) {
//   return request({
//     url: '/auth/login',
//     method: 'post',
//     data: { username, password, code, uuid }
//   })
// }
// 新登录方法
export function login(username, password, code, uuid) {
  return request({
    url: '/auth/oauth/token?scope=all&client_id=lijia&grant_type=pwd&client_secret=lijia-secret&username='+username+'&password='+password,
    method: 'post'
  })
}

// 注册方法
export function register(data) {
  return request({
    url: '/auth/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 刷新方法
export function refreshToken(refreshtoken) {
  return request({ 
    url: '/auth/oauth/token?scope=all&client_id=lijia&grant_type=refresh_token&client_secret=lijia-secret&refresh_token='+refreshtoken,
    method: 'post'
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/system/user/getInfo',
    method: 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/auth/logout',
    method: 'delete'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/code',
    method: 'get'
  })
}