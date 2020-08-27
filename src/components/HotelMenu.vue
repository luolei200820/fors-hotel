<template>
  <el-menu :default-active="this.$route.path" :router="true" class="el-menu-vertical">
    <el-menu-item index="/hotel/info">酒店信息管理</el-menu-item>
    <el-menu-item index="/hotel/food">菜品管理</el-menu-item>
    <el-menu-item index="/hotel/food-orderList">菜品订单</el-menu-item>
    <el-menu-item index="/hotel/room">房间管理</el-menu-item>
    <el-menu-item index="/hotel/room-orderList">房间订单</el-menu-item>
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