<template>
  <div class="list">
    <!-- 列表头部 -->
    <el-card class="list-title">
      <el-row :gutter="20">
        <el-col :span="7" style="text-align:center">商品</el-col>
        <el-col :span="4">商品信息</el-col>
        <el-col :span="2">单价</el-col>
        <el-col :span="2">数量</el-col>
        <el-col :span="2">总价</el-col>
        <el-col :span="2">交易状态</el-col>
        <el-col :span="2">用户昵称</el-col>
        <el-col :span="2">操作</el-col>
      </el-row>
    </el-card>

    <el-card v-for="productOrder in productOrderList" :key="productOrder._id" class="list-card">
      <div slot="header" class="list-card-header">
        <span>下单时间：{{DateTimeFormatter(productOrder.time)}}</span>
        <span style="margin-left:40px">订单编号：{{productOrder._id}}</span>
      </div>
      <el-row class="list-card-body" :gutter="20">
        <el-col :span="4">
          <img :src="imgURL(productOrder.product.imgSrc)" alt class="list-card-img" />
        </el-col>
        <el-col :span="3">{{productOrder.product.name}}</el-col>
        <el-col :span="4">{{productOrder.product.information}}</el-col>
        <el-col :span="2">{{productOrder.product.price}}</el-col>
        <el-col :span="2">{{productOrder.product.quantity}}</el-col>
        <el-col :span="2">{{productOrder.total}}</el-col>
        <el-col :span="2">{{productOrder.state}}</el-col>
        <el-col :span="2">{{productOrder.user.name}}</el-col>
        <el-col :span="3">
          <el-link @click="handleDialogVisable(productOrder._id)">查看详情</el-link>
        </el-col>
      </el-row>
    </el-card>

    <!-- 查看详情对话框 -->
    <el-dialog title="订单信息" :visible.sync="dialogVisable" width="30%">
      <p>
        <b>订单编号：</b>
        {{dialogData._id}}
      </p>
      <p>
        <b>下单时间：</b>
        {{DateTimeFormatter(dialogData.time)}}
      </p>
      <p>
        <b>订单状态：</b>
        {{dialogData.state}}
      </p>
      <p>
        <b>商品名称：</b>
        {{dialogData.product.name}}
      </p>
      <p>
        <b>商品信息：</b>
        {{dialogData.product.information}}
      </p>
      <p>
        <b>商品单价：</b>
        {{dialogData.product.price}}
      </p>
      <p>
        <b>数量：</b>
        {{dialogData.product.quantity}}
      </p>
      <p>
        <b>总价格：</b>
        {{dialogData.total}}
      </p>
      <h1>收件信息：</h1>
      <p>
        <b>收件人：</b>
        {{dialogData.addressee}}
      </p>
      <p>
        <b>收件人地址：</b>
        {{dialogData.province}} {{dialogData.city}} {{dialogData.district}} {{dialogData.address}}
      </p>
      <p>
        <b>联系电话：</b>
        {{dialogData.phone}}
      </p>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ProductOrderList',
  data() {
    return {
      dialogVisable: false,
      dialogData: {
        _id: '',
        address: '',
        city: '',
        district: '',
        phone: '',
        product: {
          _id: '',
          imgSrc: '',
          information: '',
          name: '',
          price: '',
          quantity: '',
        },
        province: '',
        seller: '',
        state: '',
        time: '',
        total: '',
        user: {
          _id: '',
          name: '',
        },
      },
      productOrderList: [],
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
    handleDialogVisable(id) {
      let index = this.productOrderList.findIndex((productOrder) => {
        return productOrder._id === id
      })
      this.dialogData = this.productOrderList[index]
      this.dialogVisable = true
    },
    getProductOrderList() {
      let config = {
        headers: { Authorization: `Bearer ${this.token()}` },
      }
      this.$http
        .post('/productOrder/manage', {}, config)
        .then((res) => {
          if (res.data.state === 1) {
            this.productOrderList = res.data.productOrderList
          } else {
            this.$message.error(res.data.msg)
          }
        })
        .catch((err) => {
          this.$message.error('网络错误')
          throw err
        })
    },
  },
  mounted() {
    this.getProductOrderList()
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