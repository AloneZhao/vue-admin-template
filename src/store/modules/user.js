import { login, getUserInfo, getUserBaseInfo } from '@/api/user'
import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
// import { resetRouter } from '@/router'
// import { reject, resolve } from 'core-js/fn/promise'

// const getDefaultState = () => {
//   return {
//     token: getToken(),
//     name: '',
//     avatar: ''
//   }
// }

const state = {
  // 设置 token 为共享状态  初始化的时候先从缓存中读取
  token: getToken() || null,
  userInfo: {} // 这里不能设置null  因为会在getters中引用userinfo的变量，如果设置为null，则会引起异常和报错
}

const mutations = {
  // 设置token
  setToken (state, payload) {
    state.token = payload // 当token改变后，同步到vuex中
    setToken(payload) // vuex改变 同步到缓存中
  },
  // 移除token
  removeToken (state) {
    state.token = null
    removeToken()
  },
  // 设置用户信息
  setUserInfo (state, payload) {
    state.userInfo = { ...payload }
  },
  // 删除用户信息
  removeGetUserInfo (state) {
    state.userInfo = {}
  }
}

const actions = {
  async login ({ commit }, params) {
    const result = await login(params)
    commit('setToken', result)

    // 登录成功，拿到token后设置时间戳
    setTimeStamp()

    // return new Promise((resolve, reject) => {
    //   login(params)
    //     .then(res => {
    //       console.log('成功回调', res)
    //       commit('setToken', res)
    //       resolve(res)
    //     })
    //     .catch(err => {
    //       console.log('失败回调', err)
    //       reject(err)
    //     })
    // })
  },

  // 获取用户信息
  async getUserInfo ({ commit }) {
    const result = await getUserInfo() // 用户信息 权限组 userId
    const baseInfo = await getUserBaseInfo(result.userId)
    const obj = { ...result, ...baseInfo }
    commit('setUserInfo', obj)
    return result // 为后面权限 做伏笔
  },

  // 退出登录
  logout ({ commit }) {
    commit('removeToken')
    commit('removeGetUserInfo')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
