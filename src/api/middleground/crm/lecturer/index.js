import request from '@/utils/request' 
 
// 保存、修改讲师
export function addTeacher(data) {
  return request({
    url: '/system/szm/consumer/saveCourseTeacher',
    method: 'post',
    data: data
  })
}
// 讲师列表
export function listArrange(query,data) {
  let pageNum=query.pageNum;
  let pageSize=query.pageSize;
  return request({
    url: '/system/szm/consumer/getCourseTeacherPage/'+pageNum+"/"+pageSize,
    method: 'POST',
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

 