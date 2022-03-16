import request from '@/utils/request'

// 查询文章列表
export function listNotice(data,query,) { 
  return request({
    url: '/system/article/listArticleInfo',
    method: 'POST',
    params: query,
    data: data
  })
}
//设置为推荐或者不推荐
export function updateRecommand(articleId,recommand) {
  return request({
    url: '/system/article/updateRecommand/'+articleId+'/'+recommand,
    method: 'post'
  })
}
//删除文章
export function delNotice(articleId) {
  return request({
    url: '/system/article/deleteArticle/' + articleId,
    method: 'GET'
  })
}

// 修改文章状态
export function checkStatu(data) {  
  return request({
    url: '/system/check/insertCheckLog',
    method: 'post',
    data: data
  })
}
//更换banner图
export function updateBanner(data) {
  return request({
    url: '/system/article/updateBanner',
    method: 'POST',
    data: data
  })
}
//设置为banner区显示
export function updateRecommandWithBanner(data) {
  return request({
    url: '/system/article/updateRecommandWithBanner',
    method: 'POST',
    data: data
  })
}
//取消在banner区显示
export function cancelShowBanner(articleId) {
  return request({
    url: '/system/article/cancelShowBanner/' + articleId,
    method: 'GET',
    
  })
}