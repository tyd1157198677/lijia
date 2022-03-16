import request from '@/utils/request'

export function getArticleList(userId,params) {
  return request({
    url: '/system/appUser/blackList/'+userId,
    method: 'get',
    params
  })
}
 