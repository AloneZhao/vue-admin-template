// 权限管理模块路由规则
import Layout from '@/layout'
export default {
  path: '/permission',
  name: 'permission', // 给模块的一级路由加一个name属性，这个属性 我们后面在做权限的时候用到
  component: Layout,
  children: [
    {
      path: '', // 这里不用写  表示 /permission 不但有布局组件 还有员工主页
      component: () => import('@/views/permission'),
      meta: {
        title: '权限管理', // 左侧导航读取了这里的title属性
        icon: 'lock'
      }
    }
  ]
}
