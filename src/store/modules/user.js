import { login, logout, getInfo, Xylogin, getUserInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    permissions: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password

      return new Promise((resolve, reject) => {
        Xylogin({ username: username.trim(), password: password }).then(response => {
          const data = response.data
          commit('SET_TOKEN', data.token)
          setToken(response.data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
        // login(username, password, code, uuid).then(res => {
        //   setToken(res.token)
        //   commit('SET_TOKEN', res.token)
        //   resolve()
        // }).catch(error => {
        //   reject(error)
        // })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token).then(res => {
          const { data } = res

          if (!data) {
            reject('Verification failed, please Login again.')
          }

          const { roleList, user, menuList } = data

          // roles must be a non-empty array
          if (!roleList || roleList.length <= 0) {
            reject('getInfo: roles must be a non-null array!')
          }
          const roles = roleList.map(item => item.role_id)

          commit('SET_ROLES', roles)
          commit('SET_NAME', user.userName)
          commit('SET_AVATAR', user.avatar)
          // commit('SET_INTRODUCTION', user.introduction|| '')
          resolve(data)
        }).catch(error => {
          reject(error)
        })
        // getInfo().then(res => {
        //   const user = res.user
        //   const avatar = (user.avatar == "" || user.avatar == null) ? require("@/assets/images/profile.jpg") : process.env.VUE_APP_BASE_API + user.avatar;
        //   if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
        //     commit('SET_ROLES', res.roles)
        //     commit('SET_PERMISSIONS', res.permissions)
        //   } else {
        //     commit('SET_ROLES', ['ROLE_DEFAULT'])
        //   }
        //   commit('SET_NAME', user.userName)
        //   commit('SET_AVATAR', avatar)
        //   resolve(res)
        // }).catch(error => {
        //   reject(error)
        // })
      })
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        // logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          removeToken()
          resolve()
        // }).catch(error => {
        //   reject(error)
        // })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
