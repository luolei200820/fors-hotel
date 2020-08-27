import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLogin: false,
    userType: '',
    user: {
      name: '',
      phone: ''
    },
    hotelProfile: {
      name: '',
      province: '',
      city: '',
      district: '',
      address: ''
    },
    sellerProfile: {
      name: '',
      province: '',
      city: '',
      district: '',
      address: '',
      license: ''
    }
  },
  mutations: {
    setUserLogin(state, payload) {
      state.user.name = payload.name
      state.user.phone = payload.phone
      state.isLogin = true
    },
    setUserLogout(state) {
      state.isLogin = ''
      state.userType = ''
      state.user.name = ''
      state.user.phone = ''
      state.sellerProfile.name = ''
      state.sellerProfile.province = ''
      state.sellerProfile.city = ''
      state.sellerProfile.district = ''
      state.sellerProfile.address = ''
      state.sellerProfile.license = ''
      state.hotelProfile.name = ''
      state.hotelProfile.province = ''
      state.hotelProfile.city = ''
      state.hotelProfile.district = ''
      state.hotelProfile.address = ''
    },
    setSellerProfile(state, payload) {
      state.sellerProfile.name = payload.name
      state.sellerProfile.province = payload.province
      state.sellerProfile.city = payload.city
      state.sellerProfile.district = payload.district
      state.sellerProfile.address = payload.address
      state.sellerProfile.license = payload.license
      state.userType = 'seller'
    },
    setHotelProfile(state, payload) {
      state.hotelProfile.name = payload.name
      state.hotelProfile.province = payload.province
      state.hotelProfile.city = payload.city
      state.hotelProfile.district = payload.district
      state.hotelProfile.address = payload.address
      state.userType = 'hotel'
    },
  },
  actions: {
  },
  modules: {
  }
})
