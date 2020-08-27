<template>
  <div>
    <el-card class="order-card">
      <div slot="header" class="header">
        <span>下单时间：{{new Date().getFullYear()}}</span>
        <span style="margin-left:40px">订单编号：{{this.$route.params.id}}</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="24">
          <h3 style="margin-top:0">买家信息</h3>
        </el-col>
        <el-col :span="12">收件人：</el-col>
        <el-col :span="12">联系电话：</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <h3>收货地址</h3>
        </el-col>
        <el-col :span="8">省：</el-col>
        <el-col :span="8">市：</el-col>
        <el-col :span="8">县：</el-col>
      </el-row>
      <el-row class="body" :gutter="20" style="border-bottom:none">
        <el-col :span="24">
          <h3>商品信息</h3>
        </el-col>
        <el-col :span="4">productImg</el-col>
        <el-col :span="4">productName</el-col>
        <el-col :span="4">productPrice</el-col>
        <el-col :span="4">quantity</el-col>
        <el-col :span="4">totalPrice</el-col>
        <el-col :span="4">state</el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
.order-card {
  width: 1002px;
  font-size: 12px;
}
.order-card .el-row {
  padding-bottom: 20px;
  border-bottom: 1px solid #dcdfe6;
}
</style>