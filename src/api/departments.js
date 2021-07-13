/**
 * @description 组织架构模块相关接口
 */
import request from '@/utils/request'

// 获取组织架构数据
export function getDepartments () {
  return request({
    url: '/company/department'
  })
}

// 删除组织部门
export function delDepartment (id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}

// 新增部门
export function addDepartment (data) {
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}

// 根据id获取部门详情
export function getDepartmentDetial (id) {
  return request({
    url: `/company/department/${id}`
  })
}

// 根据id修改部门详情
export function updataDepart (data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}
