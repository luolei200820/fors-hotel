import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import Home from '../view/Home/index.vue'
import Login from '../view/Home/login.vue'
import Register_Seller from '../view/Home/register-seller.vue'
import Register_Hotel from '../view/Home/register-hotel.vue'

const router = new VueRouter({
    routes: [
        {
            path: '/',
            component: Home,
            children: [
                {
                    path: '',
                    component: Login,
                    meta: { requireAuth: false }
                },
                {
                    path: 'register-seller',
                    component: Register_Seller,
                    meta: { requireAuth: false }
                },
                {
                    path: 'register-hotel',
                    component: Register_Hotel,
                    meta: { requireAuth: false }
                }
            ]
        },
        {
            path: '/seller',
            component: () => import(/* webpackChunkName: "seller" */'../view/Seller/index.vue'),
            children: [
                {
                    path: '',
                    component: () => import(/* webpackChunkName: "seller" */'../view/Seller/seller.vue'),
                    meta: { requireAuth: true, userType: "seller" }
                },
                {
                    path: 'order',
                    component: () => import(/* webpackChunkName: "seller" */'../view/Seller/order.vue'),
                    meta: { requireAuth: true, userType: "seller" }
                },
                {
                    path: 'product',
                    component: () => import(/* webpackChunkName: "seller" */'../view/Seller/product.vue'),
                    meta: { requireAuth: true, userType: "seller" }
                },
                {
                    path: 'product/:id',
                    component: () => import(/* webpackChunkName: "seller" */'../view/Seller/product-check.vue'),
                    meta: { requireAuth: true, userType: "seller" }
                }
            ]
        }
    ]
})

//全局导航守卫
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem("token")
    const userType = localStorage.getItem("userType")
    if (to.meta.requireAuth) {
        if (token && userType === to.meta.userType) {
            next()
        } else {
            next('/')
        }
    } else {
        next()
    }
})

export default router