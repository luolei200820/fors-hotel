<template>
  <div class="home-container">
    <div class="link-container">
      <el-link @click="routerReplace('/login')">登录</el-link>
      <el-link style="margin-left:20px" @click="routerReplace('/sign-up')">注册</el-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {}
  },
  methods: {
    routerReplace(url) {
      if (this.$route.path === url) return
      else {
        this.$router.replace(url)
      }
    },
  },
}
</script>

<style scoped>
.home-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.link-container {
  margin-bottom: 20px;
}
</style>