import request from '@/utils/request'
//发布文章
export function postArticle(data) {
  return request({
    url: '/system/article/saveArticle/',
    method: 'post',
    data
  })
}
//文章列表
export function getArticleList(userId,params) {
  return request({
    url: '/system/appUser/articleList/'+userId,
    method: 'get',
    params
  })
}


export function appUser() {
  return request({
    url: '/system/appUser/officialUserList',
    method: 'get'
  })
}
// 文章详情
export function getselectArticleDetail(userId) {
  return request({
    url: '/system/article/selectArticleDetail/'+userId,
    method: 'get'
  })
}
// 文章修改
export function updateArticle(data) {
  return request({
    url: '/system/article/updateArticle',
    method: 'POST',
    data
  })
}

// 收藏
export function getlistStores(data) {
  return request({
    url: '/system/article/listStores/'+data,
    method: 'get'
  })
}
 // 点赞
export function listLikesStores(data) {
  return request({
    url: '/system/article/listLikes/'+data,
    method: 'get'
  })
}  
   // 评论
export function listCommentStores(data,issupper) {
  return request({
    url: '/system/comment/listComment/'+data+'/'+issupper,
    method: 'get'
  })
}
//优质评论
export function updateByCommentId(data,issupper) {
  return request({
    url: '/system/comment/updateByCommentId/'+data+'/'+issupper,
    method: 'get'
  })
}
  // 删除评论
  export function deleteByCommentId(data,commentId) {
  return request({
    url: '/system/comment/deleteByCommentId/'+data+'/'+commentId,
    method: 'get'
  })
}