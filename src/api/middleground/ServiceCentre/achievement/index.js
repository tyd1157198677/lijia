import request from '@/utils/request' 

// 查询列表 
export function listServiceCentre(query,data) {
  let pageNum=query.pageNum;
  let pageSize=query.pageSize;
  return request({
    url: '/system/szm/statUserPerformance/list/'+pageNum+"/"+pageSize,
    method: 'POST',
    data: data
  })
}