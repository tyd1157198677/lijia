import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

// 查询用户列表
export function userList(data,query) {
  return request({
    url: '/system/appUser/userList',
    method: 'POST',
    params: query,
    data: data
  })
} 
// 用户状态修改
export function changeUserStatus(userId,status) {
 
  
  return request({ 
    url: '/system/appUser/updateIsDisabled/'+userId+'/'+status,
    method: 'GET'
     
  })
}
// 用户状态修改
export function changeUserofficialedit(userId,isofficialedit) { 
  return request({
    url: '/system/appUser/updateIsOfficialEdit/'+userId+'/'+isofficialedit,
    method: 'GET'
     
  })
} 
