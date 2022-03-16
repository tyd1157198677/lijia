import request from '@/utils/request'

 // 查询生成表数据
export function listjump(query) {
  return request({
    url: '/system/jumpSmall/list',
    method: 'get',
    params: query
  })
}
// 新增、编辑
export function addjump(data) {
  return request({
    url: '/system/jumpSmall/save',
    method: 'POST',
    data
  })
}
  // 删除
  export function jumpSmall(data) {
    return request({
      url: '/system/jumpSmall/delete/'+data,
      method: 'get'
    })
  }

