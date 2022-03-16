import request from '@/utils/request' 

// 课程订单新增
export function saveOrder(data) {
  return request({
    url: '/system/szm/course/order/saveOrder',
    method: 'post',
    data: data
  })
}

// 课程订单修改详情
export function updateOrder(data) {
  return request({
    url: '/system/szm/course/order/updateOrder',
    method: 'POST',
    data: data
  })
}
// 课程订单详情
export function orderDetail(orderId) {
  return request({
    url: '/system/szm/course/order/orderDetail/'+orderId,
    method: 'get'
  })
}

// 课程订单服务列表
export function getOrderPage(query,data) {
  let pageNum=query.pageNum;
  let pageSize=query.pageSize;
  return request({
    url: '/system/szm/course/order/getOrderPage/'+pageNum+"/"+pageSize,
    method: 'POST',
    data: data
  })
}

//课程列表接口
export function getCoursePage(query,data) {
  let pageNum=query.pageNum;
  let pageSize=query.pageSize;
  return request({
    url: '/system/szm/course/getCoursePage/'+pageNum+"/"+pageSize,
    method: 'POST',
    data: data
  })
}


 