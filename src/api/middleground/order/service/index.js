import request from "@/utils/request";

// 新建服务订单
export function saveOrder(data) {
  return request({
    url: "/system/szm/arrange/order/saveOrder",
    method: "post",
    data: data
  });
}

// 修改服务订单
export function updateOrder(data) {
  return request({
    url: "/system/szm/arrange/order/updateOrder",
    method: "post",
    data: data
  });
}
// 服务订单详情
export function detailorder(id) {
  return request({
    url: "/system/szm/arrange/order/detail/" + id,
    method: "get"
  });
}

// 服务订单列表
export function listorder(query, data) {
  let pageNum = query.pageNum;
  let pageSize = query.pageSize;
  return request({
    url: "/system/szm/arrange/order/list/" + pageNum + "/" + pageSize,
    method: "POST",
    data: data
  });
}

// 服务商品列表
export function getServiceItemList() {
  return request({
    url: "/system/szm/serviceItem/getServiceItemList",
    method: "GET"
  });
}

//城市列表（带大区id名称）
export function getCityList() {
  return request({
    url: "/system/dicArea/getCityList",
    method: "GET"
  });
}
//整理师+服务人员列表
export function getAllArrangeUserList(query,data) {
  let pageNum = query.pageNum;
  let pageSize = query.pageSize;
  return request({
    url:
      "/system/szm/consumer/getAllArrangeUserList/" + pageNum + "/" + pageSize,
    method: "POST",
    data: data
  });
}
