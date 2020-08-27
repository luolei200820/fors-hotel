<template>
  <el-container>
    <el-header>
      <nav-bar></nav-bar>
    </el-header>
    <el-container class="page-container">
      <el-aside>
        <seller-menu></seller-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import SellerMenu from '@/components/SellerMenu.vue'
export default {
  name: 'Seller',
  data() {
    return {}
  },
  components: {
    'nav-bar': NavBar,
    'seller-menu': SellerMenu,
  },
}
</script>

<style scoped>
.page-container {
  height: calc(100vh - 60px);
}
</style>