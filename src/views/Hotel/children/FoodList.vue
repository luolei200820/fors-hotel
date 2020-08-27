<template>
  <div class="food-list">
    <el-button style="margin-bottom:20px;" @click="goToFoodEdit('new')">添加菜品</el-button>
    <el-card class="title">
      <el-row :gutter="20">
        <el-col :span="9" style="text-align:center">菜品</el-col>
        <el-col :span="3">价格</el-col>
        <el-col :span="3">信息</el-col>
        <el-col :span="3">库存</el-col>
        <el-col :span="3">上架状态</el-col>
        <el-col :span="3">操作</el-col>
      </el-row>
    </el-card>
    <el-card v-for="i in 6" :key="i" class="food-card">
      <el-row class="body" :gutter="20">
        <el-col :span="3">
          <img :src="img" alt class="img" />
        </el-col>
        <el-col :span="6">foodName</el-col>
        <el-col :span="3">foodPrice</el-col>
        <el-col :span="3">foodInformation</el-col>
        <el-col :span="3">foodStock</el-col>
        <el-col :span="3">state</el-col>
        <el-col :span="3">
          <el-link @click="goToFoodEdit('edit')">编辑</el-link>
          <el-link style="margin-left:20px">删除</el-link>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'HotelFood',
  data() {
    return {
      img: '',
    }
  },
  methods: {
    goToFoodEdit(id) {
      this.$router.push({ name: 'food-edit', params: { id } })
    },
  },
}
</script>

<style scoped>
.food-list {
  min-width: 1002px;
}
.food-list .title {
  font-size: 12px;
  margin-bottom: 20px;
}
.food-card {
  margin-bottom: 20px;
  font-size: 12px;
}
.food-card .img {
  width: 100px;
  height: 100px;
}
.food-card .body {
  word-break: break-all;
}
</style>