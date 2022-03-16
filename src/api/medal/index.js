import request from "@/utils/request";

// 勋章列表接口 勋章类型dict_value
export function listmedal(query, dict_value) {
  let pageNum = query.pageNum;
  let pageSize = query.pageSize;
  return request({
    url:
      "/system/metal/listMetals/" + dict_value + "?" + pageSize + "&" + pageNum,
    method: "GET"
  });
}
// 勋章详情
export function selectMetalDetail(metalId) {
  return request({
    url: "/system/metal/selectMetalDetail/" + metalId,
    method: "GET"
  });
}
// 新增 勋章
export function addmetal(data) {
  return request({
    url: "/system/metal/insert",
    method: "post",
    data: data
  });
}
// 修改勋章
export function updatemetal(data) {
  return request({
    url: "/system/metal/update",
    method: "post",
    data: data
  });
}
// 删除勋章
export function updateDeleted(metalId) {
  return request({
    url: "/system/metal/updateDeleted/" + metalId,
    method: "GET"
  });
}
//勋章禁用
export function updateDisabled(metalId,disabled) {
  return request({
    url: "/system/metal/updateDisabled/" + metalId+"/"+disabled,
    method: "GET"
  });
}
// 勋章下拉框
export function listMetalSelect(metalTypeId) {
  return request({
    url: "/system/metal/listMetalSelect",
    method: "get",
    params: metalTypeId
  });
}

// 勋章获取记录
export function listMetalAwarded(params) {
  return request({
    url: "/system/metal/listMetalAwarded",
    method: "GET",
    params: params
  });
}

// 等级勋章列表
export function listMetalLevel(metalId) {
  return request({
    url: "/system/metal/listMetalLevel/" + metalId,
    method: "GET"
  });
}
// 勋章获得人员信息
export function listMetalUser(queryParams, metalLevelId) {
  return request({
    url: "/system/metal/listMetalUser/" + metalLevelId,
    method: "GET",
    params: queryParams
  });
}
