import request from '@/utils/request' 

// 用户列表接口
export function listUser(query,data) {
  let pageNum=query.pageNum;
  let pageSize=query.pageSize;
  return request({
    url: '/system/szm/user/userInfoListPage/'+pageNum+"/"+pageSize,
    method: 'POST',
    data: data
  })
}
// 字典
export function getDicts(data) {
  return request({
    url: '/system/dict/data/type/'+data,
    method: 'GET'
  })
}
//大区
export function getCityList() {
  return request({
    url: '/system/dicArea/getCityList',
    method: 'GET'
  })
}

// 新增
export function addUser(data) {
  return request({
    url: '/system/szm/user/saveUser',
    method: 'post',
    data: data
  })
}
// 用户详情
export function getUser(userId) {
  return request({
    url: '/system/szm/user/userInfo/' + userId,
    method: 'get'

  })
}
//  删除
export function delUser(orderId,type) {
  return request({
    url: '/system//szm/user/deleteOrder/'+orderId+"/"+type,
    method: 'GET', 
  })
}
//用户课程订单列表
export function getCourse(query,userId,data) {
  let pageNum=query.pageNum;
  let pageSize=query.pageSize;
  return request({
    url: '/system/szm/user/getCourseOrderListPage/'+userId+"/"+pageNum+"/"+pageSize,
    method: 'POST', 
    data:data
  })
}
//用户服务订单列表
export function getService(query,userId,data) {
  let pageNum=query.pageNum;
  let pageSize=query.pageSize;
  return request({
    url: '/system/szm/user/getServiceOrderListPage/'+userId+"/"+pageNum+"/"+pageSize,
    method: 'POST',
    data:data
  })
}
//用户商品订单列表
export function getGoods(query,userId,data) {
  let pageNum=query.pageNum;
  let pageSize=query.pageSize;
  return request({
    url: '/system/szm/user/getGoodsOrderListPage/'+userId+"/"+pageNum+"/"+pageSize,
    method: 'POST',
    data:data
  })
}

 
// //修改
// export function delUser(userId) {
//   return request({
//     url: '/system/user/' + userId,
//     method: 'delete'
//   })
// }
 