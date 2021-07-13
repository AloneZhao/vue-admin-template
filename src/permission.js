// 权限拦截 路由跳转前执行 利用导航守卫
import router from '@/router'
import store from '@/store' // 相当于一个sotre实例，与组件中的this.$sotre等效

import NProgress from 'nprogress' // 引入进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式

const whiteList = ['/login', '/404'] // 白名单

// 前置守卫
router.beforeEach(async (to, from, next) => {
  console.log('开始')
  // 有token
  if (store.getters.token) {
    // 只有token的情况下，才能获取资料

    // 如果要访问的是登录页，跳到主页
    // 但不在此处获取用户资料
    if (to.path === '/login') {
      next('/')
    } else {
      // 只有放过的时候才去获取用户资料
      // 是每次都获取么？
      // 如果当前vuex中有用户资料的id，标识已经有资料了 不需要获取 没有id才获取
      if (!store.getters.userId) {
        // 如果没有id 表示当前用户资料没有获取过
        try {
          await store.dispatch('user/getUserInfo')
        } catch (error) {
          console.log('错误', error)
        }
      }
      next()
    }
    // 没有token
  } else {
    if (whiteList.indexOf(to.path) > -1) {
      next()
    } else {
      next('/login')
    }
  }
  NProgress.done() // 手动强制关闭一次  为了解决 手动切换地址时  进度条的不关闭的问题
})

// 后置守卫
router.afterEach(() => {
  console.log('结束')
  console.log('afterEach')
  NProgress.done() // 关闭进度条
})
