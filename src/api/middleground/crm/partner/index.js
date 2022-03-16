import request from '@/utils/request' 

 
// 合伙人列表接口
export function listPartner(query,data) {
  let pageNum=query.pageNum;
  let pageSize=query.pageSize;
  return request({
    url: '/system/szm/consumer/getPartnerUserListPage/'+pageNum+"/"+pageSize,
    method: 'POST',
    data: data
  }) 
}  
// 合伙人参与详情
export function getpartnerInfo(userId) {
  return request({
    url: '/system/szm/consumer/partnerAttendInfo/' + userId,
    method: 'get'

  })
}
//合伙人参与服务订单列表
export function getpartnerAttend(query,userId,data) {
  let pageNum=query.pageNum;
  let pageSize=query.pageSize;
  return request({
    url: '/system/szm/consumer/partnerAttendOrdersPage/'+userId+"/"+pageNum+"/"+pageSize,
    method: 'POST', 
    data:data
  })
} 

//合伙人修改（修改时详情在列表带过来）
export function editUser(data) {
  return request({
    url: '/system/szm/consumer/updatePartnerInfo',
    method: 'post',
    data: data
  })
}




// 字典//dic_customer_source：客户来源；dic_user_level：用户级别；dic_user_intention：用户意向 dic_course_teacher_type:讲师类型
//dic_partner_level：合伙人类型
export function getDicts(data) {
  return request({
    url: '/system/dict/data/type/'+data,
    method: 'GET'
  })
}
//城市列表（带大区id名称）
export function getCityList() {
  return request({
    url: '/system/dicArea/getCityList',
    method: 'GET'
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
