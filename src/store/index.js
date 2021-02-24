import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        productOrders: []
    },
    mutations: {
        setProductOrder(state, payload) {
            state.productOrders = payload
        }
    }
})

export default store