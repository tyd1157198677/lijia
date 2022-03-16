import request from '@/utils/request'

export function getArticleList(userId,params) {
  return request({
    url: '/system/appUser/favoritesList/'+userId,
    method: 'get',
    params
  })
}
 