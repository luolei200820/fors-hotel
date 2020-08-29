<template>
  <div class="list">
    <!-- 表头 -->
    <el-card class="list-title">
      <el-row :gutter="20">
        <el-col :span="7" style="text-align:center">菜品</el-col>
        <el-col :span="4">菜品信息</el-col>
        <el-col :span="2">价格</el-col>
        <el-col :span="2">数量</el-col>
        <el-col :span="2">总价</el-col>
        <el-col :span="2">支付状态</el-col>
        <el-col :span="2">客户名称</el-col>
        <el-col :span="3">客户电话</el-col>
      </el-row>
    </el-card>

    <!-- 列表 -->
    <el-card v-for="foodOrder in foodOrders" :key="foodOrder._id" class="list-card">
      <div slot="header" class="list-card-header">
        <span>下单时间：{{DateTimeFormatter(foodOrder.time)}}</span>
        <span style="margin-left:40px">订单编号：{{foodOrder._id}}</span>
      </div>
      <el-row class="list-card-body" :gutter="20">
        <el-col :span="4">
          <img :src="imgURL(foodOrder.food.imgSrc)" alt class="list-card-img" />
        </el-col>
        <el-col :span="3">{{foodOrder.food.name}}</el-col>
        <el-col :span="4">{{foodOrder.food.information}}</el-col>
        <el-col :span="2">{{foodOrder.food.price}}</el-col>
        <el-col :span="2">{{foodOrder.quantity}}</el-col>
        <el-col :span="2">{{foodOrder.totalPrice}}</el-col>
        <el-col :span="2">{{foodOrder.state}}</el-col>
        <el-col :span="2">{{foodOrder.user.name}}</el-col>
        <el-col :span="3">{{foodOrder.user.phone}}</el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'FoodOrderList',
  data() {
    return {
      foodOrders: [],
    }
  },
  methods: {
    token() {
      return localStorage.getItem('token')
    },
    imgURL(imgSrc) {
      return process.env.VUE_APP_SERVER_URL + '/public/' + imgSrc
    },
    DateTimeFormatter(value) {
      let date = new Date(value)
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()
      let hours = date.getHours()
      let min = date.getMinutes()
      return year + '年' + month + '月' + day + '日' + hours + ':' + min
    },
  },
  mounted() {
    let config = { headers: { Authorization: `Bearer ${this.token()}` } }
    this.$http
      .post('/foodOrder/manage', {},config)
      .then((res) => {
        if (res.data.state === 1) {
          this.foodOrders = res.data.foodOrders
        } else {
          this.$message.error(res.data.msg)
        }
      })
      .catch((err) => {
        this.$message.error('网络错误')
        throw err
      })
  },
}
</script>

<style scoped>
.list {
  width: 1100px;
}
.list-title {
  font-size: 14px;
  margin-bottom: 20px;
  position: sticky;
  top: -20px;
  z-index: 1;
}
.list-card {
  margin-bottom: 20px;
  font-size: 12px;
}
.list-card-img {
  width: 100%;
}
.list-card-body {
  word-break: break-all;
}
</style>