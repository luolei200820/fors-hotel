import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLogin: false,
    userType: '',
  },
  mutations: {
    setUserLogout(state) {
      state.isLogin = false
      state.userType = ''
    },
    setSellerLogin(state) {
      state.isLogin = true
      state.userType = 'seller'
    },
    setHotelLogin(state) {
      state.isLogin = true
      state.userType = 'hotel'
    },
  },
  actions: {
  },
  modules: {
  }
})
