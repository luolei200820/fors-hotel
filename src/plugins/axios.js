import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

const instance = axios.create({
    baseURL: process.env.VUE_APP_SERVER_URL
})

Vue.use(VueAxios, instance)