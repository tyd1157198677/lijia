import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const TokenKeys = 'Refresh-Token'
const ExpiresInKey = 'Admin-Expires-In'

export function getToken() {
  return Cookies.get(TokenKey)
}
export function getTokens() {
  return Cookies.get(TokenKeys)
}

export function setToken(token) { 
  return Cookies.set(TokenKey, token)
}
export function setTokens(token) { 
  return Cookies.set(TokenKeys, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
export function removeTokens() {
  return Cookies.remove(TokenKeys)
}

export function getExpiresIn() {
  return Cookies.get(ExpiresInKey) || -1
}

export function setExpiresIn(time) {
  return Cookies.set(ExpiresInKey, time)
}

export function removeExpiresIn() {
  return Cookies.remove(ExpiresInKey)
}
