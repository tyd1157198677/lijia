//Client.js  
import request from '@/utils/request' 
 
 
export function ailoss(Token) { 
  return request({
    url: '/file/oss/getStsToken',
    method: 'get'
  })
}
 
