<template>
  <div class="order-list">
    <el-card class="title">
      <el-row :gutter="20">
        <el-col :span="9" style="text-align:center">菜品</el-col>
        <el-col :span="3">价格</el-col>
        <el-col :span="3">数量</el-col>
        <el-col :span="3">总价</el-col>
        <el-col :span="3">支付状态</el-col>
        <el-col :span="3">操作</el-col>
      </el-row>
    </el-card>
    <el-card v-for="i in 6" :key="i" class="order-card">
      <div slot="header" class="header">
        <span>下单时间：{{new Date().getFullYear()}}</span>
        <span style="margin-left:40px">订单编号：1115515778048619850</span>
      </div>
      <el-row class="body" :gutter="20">
        <el-col :span="3">
          <img :src="img" alt class="img" />
        </el-col>
        <el-col :span="6">foodName</el-col>
        <el-col :span="3">foodPrice</el-col>
        <el-col :span="3">quantity</el-col>
        <el-col :span="3">totalPrice</el-col>
        <el-col :span="3">state</el-col>
        <el-col :span="3">
          <el-link>查看详情</el-link>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'FoodOrderList',
  data() {
    return {
      img: '',
    }
  },
}
</script>

<style scoped>
.order-list {
  min-width: 1002px;
}
.order-list .title {
  font-size: 12px;
  margin-bottom: 20px;
}
.order-card {
  margin-bottom: 20px;
  font-size: 12px;
}
.order-card .img {
  width: 100px;
  height: 100px;
}
.order-card .body {
  word-break: break-all;
}
</style>