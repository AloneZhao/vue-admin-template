// 导出员工模块路由规则
import Layout from '@/layout'
export default {
  path: '/employees',
  name: 'employees', // 给模块的一级路由加一个name属性，这个属性 我们后面在做权限的时候用到
  component: Layout,
  redirect: 'index',
  meta: {
    title: '员工模块',
    icon: 'people'
  },
  children: [
    {
      path: 'index', // 这里不用写  表示 /employees 不但有布局组件 还有员工主页
      component: () => import('@/views/employees'),
      meta: {
        title: '员工管理', // 左侧导航读取了这里的title属性
        icon: 'people'
      }
    },
    {
      name: 'employessUploadExcel',
      path: 'uploadExcel', // 这里不用写  表示 /employees 不但有布局组件 还有员工主页
      component: () => import('@/views/employees/uploadExcel'),
      meta: {
        title: '员工导入', // 左侧导航读取了这里的title属性
        icon: 'excel'
      }
    },
    {
      name: 'employeesDetial',
      path: 'detail/:id',
      component: () => import('@/views/employees/detail'),
      hidden: true, // 不在左侧菜单显示
      meta: {
        title: '员工详情'
      }
    }
  ]
}
