<template>
  <div class="home">
    <div style="margin-bottom: 20px">
      <el-link type="primary" @click="router_push('/')">登录</el-link>
      <el-link
        type="primary"
        style="margin-left: 20px"
        @click="router_push('/register-seller')"
        >注册商家</el-link
      >
      <el-link
        type="primary"
        style="margin-left: 20px"
        @click="router_push('/register-hotel')"
        >注册酒店</el-link
      >
    </div>

    <router-view></router-view>
  </div>
</template>

<script>
export default {
  methods: {
    router_push(path) {
      if (this.$route.path === path) return;
      this.$router.push(path);
    },
  },
};
</script>

<style>
.home {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
.home .el-form {
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  width: 400px;
}
</style>