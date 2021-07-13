import request from '@/utils/request'

/**
 *
 * @param {Object} data 请求数据
 * @returns 登录成功信息
 */
export function login (data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

/**
 *
 * @returns 用户信息 权限  userId 等信息
 */
export function getUserInfo () {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}

/**
 *
 * @param {Number} id 用户的 userId
 * @returns 用户的基本信息 头像等信息
 */
export function getUserBaseInfo (id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'get'
  })
}
