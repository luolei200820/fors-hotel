<template>
  <el-container>
    <el-header>
      <nav-bar></nav-bar>
    </el-header>
    <el-container class="page-container">
      <el-aside>
        <hotel-menu></hotel-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import HotelMenu from '@/components/HotelMenu.vue'
export default {
  name: 'Hotel',
  data() {
    return {}
  },
  components: {
    'nav-bar': NavBar,
    'hotel-menu': HotelMenu,
  },
}
</script>

<style scoped>
.page-container {
  height: calc(100vh - 60px);
}
</style>