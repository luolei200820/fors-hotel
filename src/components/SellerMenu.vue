<template>
  <el-menu :default-active="this.$route.path" :router="true" class="el-menu-vertical">
    <el-menu-item index="/seller/info">经销商信息管理</el-menu-item>
    <el-menu-item index="/seller/order">订单管理</el-menu-item>
    <el-menu-item index="/seller/product">产品管理</el-menu-item>
  </el-menu>
</template>

<script>
export default {}
</script>

<style scoped>
.el-menu-vertical {
  height: 100%;
}
</style>