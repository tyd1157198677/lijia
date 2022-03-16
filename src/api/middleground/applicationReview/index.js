import request from "@/utils/request";

// 新建服务订单
export function saveOrder(data) {
  return request({
    url: "/system/szm/arrange/order/check/save",
    method: "post",
    data: data
  });
}
 
// 审核报单
export function updateStatus(type,arrangeorderNumber) {
  return request({
    url: "/system/szm/arrange/order/check/updateStatus/" + type+"/"+arrangeorderNumber,
    method: "POST"
  });
}

// 报单列表
export function listorder(query, data) {
  let pageNum = query.pageNum;
  let pageSize = query.pageSize;
  return request({
    url: "/system/szm/arrange/order/check/listPage/" + pageNum + "/" + pageSize,
    method: "POST",
    data: data
  });
}
 
// 订单详情
export function detailorder(id) {
  return request({
    url: "/system/szm/arrange/order/detailByOrderNum/" + id,
    method: "get"
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
export function getAllArrangeUserList(query) {
  let pageNum = query.pageNum;
  let pageSize = query.pageSize;
  return request({
    url:
      "/system/szm/consumer/getAllArrangeUserList/" + pageNum + "/" + pageSize,
    method: "POST"
  });
}
