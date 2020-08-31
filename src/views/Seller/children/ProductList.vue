<template>
  <div class="list">
    <el-button style="margin-bottom:20px" @click="goToProductEdit('new')">添加商品</el-button>
    <el-card class="list-title">
      <el-row :gutter="20">
        <el-col :span="7" style="text-align:center">商品</el-col>
        <el-col :span="5">商品信息</el-col>
        <el-col :span="2">单价</el-col>
        <el-col :span="2">库存</el-col>
        <el-col :span="2">销售状态</el-col>
        <el-col :span="2">类别</el-col>
        <el-col :span="4">操作</el-col>
      </el-row>
    </el-card>

    <el-card class="list-card" v-for="product in productList" :key="product._id">
      <el-row class="list-card-body" :gutter="20">
        <el-col :span="4">
          <img :src="imgURL(product.imgSrc)" alt class="list-card-img" />
        </el-col>
        <el-col :span="3">{{product.name}}</el-col>
        <el-col :span="5">{{product.information}}</el-col>
        <el-col :span="2">{{product.price}}</el-col>
        <el-col :span="2">{{product.stock}}</el-col>
        <el-col :span="2">{{product.onSale?'上架':'下架'}}</el-col>
        <el-col :span="2">{{product.category}}</el-col>
        <el-col :span="4">
          <el-link @click="goToProductEdit(product._id)">修改信息</el-link>
          <el-link @click="deleteProduct(product._id)" style="margin-left:10px">删除商品</el-link>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ProductList',
  data() {
    return {
      dialogVisible: false,
      productList: [],
    }
  },
  methods: {
    token() {
      return localStorage.getItem('token')
    },
    imgURL(imgSrc) {
      return process.env.VUE_APP_SERVER_URL + '/public/' + imgSrc[0]
    },
    goToProductEdit(id) {
      this.$router.push({ name: 'editProduct', params: { id } })
    },
    deleteProduct(id) {
      this.$http
        .post(
          '/product/delete',
          { product_id: id },
          { headers: { Authorization: `Bearer ${this.token()}` } }
        )
        .then((res) => {
          if (res.data.state === 1) {
            this.$message.success('商品删除成功')
            //删除商品
            let index = this.productList.findIndex((p) => {
              return p._id === id
            })
            this.productList.splice(index, 1)
            //关闭对话框
            this.dialogVisible = false
          } else {
            this.$message.error(res.data.msg)
            this.dialogVisible = false
          }
        })
        .catch((err) => {
          this.$message.error('网络错误')
          this.dialogVisible = false
          throw err
        })
    },
  },
  mounted() {
    this.$http
      .post(
        '/product/manage',
        {},
        {
          headers: { Authorization: `Bearer ${this.token()}` },
        }
      )
      .then((res) => {
        if (res.data.state === 1) {
          this.productList = res.data.productList
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