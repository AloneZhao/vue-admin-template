import Cookies from 'js-cookie'

// 设置独一味二的key
const TokenKey = 'hrsaas-ihrm-token'
const timeStamp = 'timeStamp'

// 读取 token
export function getToken () {
  return Cookies.get(TokenKey)
}

// 设置token
export function setToken (token) {
  return Cookies.set(TokenKey, token)
}

// 移除token
export function removeToken () {
  return Cookies.remove(TokenKey)
}

// 设置时间戳
export function setTimeStamp () {
  return Cookies.set(timeStamp, Date.now())
}

// 读取时间戳
export function getTimeStamp () {
  return Cookies.get(timeStamp)
}
