import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

const Home = () => import(/* webpackChunkName: "Home" */'../views/Home/Home.vue')
const Login = () => import(/* webpackChunkName: "Login" */'../views/Home/children/Login.vue')
const SignUp = () => import(/* webpackChunkName: "SignUp" */'../views/Home/children/SignUp.vue')
const Seller = () => import(/* webpackChunkName: "Seller" */'../views/Seller/Seller.vue')
const SellerInfo = () => import(/* webpackChunkName: "SellerInfo" */'../views/Seller/children/SellerInfo.vue')
const ProductOrderList = () => import(/* webpackChunkName: "ProductOrderList" */'../views/Seller/children/ProductOrderList.vue')
const ProductList = () => import(/* webpackChunkName: "ProductList" */'../views/Seller/children/ProductList.vue')
const ProductEdit = () => import(/* webpackChunkName: "ProductEdit" */'../views/Seller/children/ProductEdit.vue')
const Hotel = () => import(/* webpackChunkName: "Hotel" */'../views/Hotel/Hotel.vue')
const HotelInfo = () => import(/* webpackChunkName: "HotelInfo" */'../views/Hotel/children/HotelInfo.vue')
const FoodList = () => import(/* webpackChunkName: "FoodList" */'../views/Hotel/children/FoodList.vue')
const FoodOrderList = () => import(/* webpackChunkName: "FoodOrderList" */'../views/Hotel/children/FoodOrderList.vue')
const FoodEdit = () => import(/* webpackChunkName: "FoodEdit" */'../views/Hotel/children/FoodEdit.vue')
const RoomList = () => import(/* webpackChunkName: "RoomList" */'../views/Hotel/children/RoomList.vue')
const RoomOrderList = () => import(/* webpackChunkName: "RoomOrderList" */'../views/Hotel/children/RoomOrderList.vue')
const RoomEdit = () => import(/* webpackChunkName: "RoomEdit" */'../views/Hotel/children/RoomEdit.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login',
    component: Home,
    children: [
      {
        path: 'login',
        component: Login
      },
      {
        path: 'sign-up',
        component: SignUp
      }
    ]
  },
  {
    path: '/seller',
    name: 'seller',
    redirect: '/seller/info',
    component: Seller,
    children: [
      {
        path: 'info',
        component: SellerInfo,
        meta: {
          requireAuth: true,
          userType: 'seller'
        }
      },
      {
        path: 'product-order',
        name: 'productOrderList',
        component: ProductOrderList,
        meta: {
          requireAuth: true,
          userType: 'seller'
        }
      },
      {
        path: 'product',
        component: ProductList,
        meta: {
          requireAuth: true,
          userType: 'seller'
        }
      },
      {
        path: 'edit-product/:id',
        name: 'editProduct',
        component: ProductEdit,
        meta: {
          requireAuth: true,
          userType: 'seller'
        }
      }
    ]
  },
  {
    path: '/hotel',
    name: 'hotel',
    redirect: '/hotel/info',
    component: Hotel,
    children: [
      {
        path: 'info',
        component: HotelInfo,
        meta: {
          requireAuth: true,
          userType: 'hotel'
        }
      },
      {
        path: 'food',
        component: FoodList,
        meta: {
          requireAuth: true,
          userType: 'hotel'
        }
      },
      {
        path: 'food-orderList',
        component: FoodOrderList,
        meta: {
          requireAuth: true,
          userType: 'hotel'
        }
      },
      {
        path: 'food-edit/:id',
        name: 'food-edit',
        component: FoodEdit,
        meta: {
          requireAuth: true,
          userType: 'hotel'
        }
      },
      {
        path: 'room',
        component: RoomList,
        meta: {
          requireAuth: true,
          userType: 'hotel'
        }
      },
      {
        path: 'room-orderList',
        component: RoomOrderList,
        meta: {
          requireAuth: true,
          userType: 'hotel'
        }
      },
      {
        path: 'room-edit/:id',
        name: 'room-edit',
        component: RoomEdit,
        meta: {
          requireAuth: true,
          userType: 'hotel'
        }
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

//check auth
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    if (store.state.isLogin && to.meta.userType === store.state.userType) {
      next()
    } else {
      next('/')
    }
  } else {
    next()
  }
})

export default router
