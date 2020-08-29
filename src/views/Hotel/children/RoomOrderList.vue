<template>
  <div class="list">
    <el-card class="list-title">
      <el-row :gutter="20">
        <el-col :span="7" style="text-align:center">房间</el-col>
        <el-col :span="3">房间信息</el-col>
        <el-col :span="3">入住时间</el-col>
        <el-col :span="2">价格/每晚</el-col>
        <el-col :span="2">总天数</el-col>
        <el-col :span="1">总价</el-col>
        <el-col :span="2">支付状态</el-col>
        <el-col :span="2">客户名称</el-col>
        <el-col :span="2">手机号码</el-col>
      </el-row>
    </el-card>
    <el-card v-for="roomOrder in roomOrders" :key="roomOrder._id" class="list-card">
      <div slot="header" class="list-card-header">
        <span>下单时间：{{DateTimeFormatter(roomOrder.time)}}</span>
        <span style="margin-left:40px">订单编号：{{roomOrder._id}}</span>
      </div>
      <el-row class="list-card-body" :gutter="20">
        <el-col :span="4">
          <img :src="imgURL(roomOrder.room.imgSrc)" alt class="list-card-img" />
        </el-col>
        <el-col :span="3">{{roomOrder.room.name}}</el-col>
        <el-col :span="3">{{roomOrder.room.information}}</el-col>
        <el-col :span="3">{{DateTimeFormatter(roomOrder.startDate)}}</el-col>
        <el-col :span="2">{{roomOrder.room.price}}</el-col>
        <el-col :span="2">{{calcDays(roomOrder.startDate,roomOrder.endDate)}}</el-col>
        <el-col :span="1">{{roomOrder.totalPrice}}</el-col>
        <el-col :span="2">{{roomOrder.state}}</el-col>
        <el-col :span="2">{{roomOrder.user.name}}</el-col>
        <el-col :span="2">{{roomOrder.user.phone}}</el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'RoomOrderList',
  data() {
    return {
      roomOrders: [],
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
    calcDays(startDate, endDate) {
      return new Date(endDate).getDate() - new Date(startDate).getDate()
    },
  },
  mounted() {
    this.$http
      .post(
        '/roomOrder/manage',
        {},
        {
          headers: { Authorization: `Bearer ${this.token()}` },
        }
      )
      .then((res) => {
        if (res.data.state === 1) {
          this.roomOrders = res.data.roomOrders
        } else {
          this.$message.error('获取菜品订单失败')
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
  width: 1200px;
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