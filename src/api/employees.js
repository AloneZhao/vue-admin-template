/**
 * @description 员工管理相关接口
 */
import request from '@/utils/request'

// 获取员工接口
export function getEmployees () {
  return request({
    url: '/sys/user/simple',
    method: 'get'
  })
}

// 获取所有角色数据
export function getAllRol (params) {
  return request({
    url: '/sys/role',
    method: 'get',
    params
  })
}

// 根据 ID 删除角色
export function delRol (id) {
  return request({
    url: '/sys/role/' + id,
    method: 'delete'
  })
}

// 根据ID获取角色详情
export function getRolDetial (id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'get'
  })
}

// 根据ID更新角色
export function updataRolDetial (data) {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'put',
    data
  })
}

// 新增角色
export function addRolDetial (data) {
  return request({
    url: '/sys/role',
    method: 'post',
    data
  })
}

// 获取员工列表
export function getEmployeesList (params) {
  return request({
    url: '/sys/user',
    method: 'get',
    params: params
  })
}

// 删除员工信息
export function delEmployessOne (id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'delete'
  })
}

/**
 * @description 员工数据导入接口
 * @param {Array} data 导入的数据
 * @returns
 */
export function uploadExcel (data) {
  return request({
    url: '/sys/user/batch',
    method: 'post',
    data
  })
}
