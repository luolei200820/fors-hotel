<template>
  <el-container>
    <el-header>
      <div class="header-container">
        <img class="logo" :src="logo" />
        <el-button icon="el-icon-back" @click="userLogout">登出</el-button>
      </div>
    </el-header>
    <el-container class="body-container">
      <el-aside style="width:200px">
        <el-menu :default-active="this.$route.path" :router="true" class="aside-nav">
          <el-menu-item index="/seller/info">商家信息管理</el-menu-item>
          <el-menu-item index="/seller/product">产品管理</el-menu-item>
          <el-menu-item index="/seller/product-order">产品订单管理</el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import logo from '@/assets/fors-logo.png'
export default {
  name: 'NavBar',
  data() {
    return {
      logo,
    }
  },
  methods: {
    userLogout() {
      this.$store.commit('setUserLogout')
      localStorage.clear()
      this.$message.info('再见~')
      this.$router.push('/')
    },
  },
}
</script>

<style scoped>
.body-container {
  height: calc(100vh - 60px);
}
.header-container {
  height: 59px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #dcdfe6;
}
.aside-nav {
  height: 100%;
}
.logo {
  height: 59px;
}
</style>