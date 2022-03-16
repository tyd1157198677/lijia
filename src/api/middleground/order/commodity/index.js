import request from '@/utils/request' 


// 商品订单列表
export function listorder(query,data) {
  let pageNum=query.pageNum;
  let pageSize=query.pageSize;
  return request({
    url: '/system/szm/goods/order/list/'+pageNum+"/"+pageSize,
    method: 'POST',
    data: data
  })
}
//商品列表
export function getGoodList(query,data) {
  let pageNum=query.pageNum;
  let pageSize=query.pageSize;
  return request({
    url: '/system/szm/goods/getGoodList/'+pageNum+"/"+pageSize,
    method: 'POST',
    data: data
  })
}

// 商品订单保存
export function saveOrder(data) {
  return request({
    url: '/system/szm/goods/order/saveOrder',
    method: 'post',
    data: data
  })
}

// 商品订单修改
export function updateOrder(data) {
  return request({
    url: '/system/szm/goods/order/updateOrder',
    method: 'POST',
    data: data
  })
} 
// 商品订单详情（用于修改）
export function orderDetail(orderId) {
  return request({
    url: '/system/szm/goods/order/orderDetail/'+orderId,
    method: 'get'
  })
}
//快递公司列表
export function goodsExpress() {
  return request({
    url: '/system//szm/goodsExpress/list',
    method: 'get'
  })
}
//城市列表（带大区id名称）
export function getCityList() {
  return request({
    url: "/system/dicArea/getCityList",
    method: "GET"
  });
}