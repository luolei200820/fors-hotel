<template>
  <div class="nav-container">
    <img class="logo" :src="logo" />
    <el-button icon="el-icon-back" @click="userLogout">登出</el-button>
  </div>
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
.nav-container {
  height: 59px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #dcdfe6;
}
.logo {
  height: 59px;
}
</style>