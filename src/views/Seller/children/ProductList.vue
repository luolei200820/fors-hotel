<template>
  <div class="product-list">
    <el-button class="add-product" style="margin-bottom:20px">添加商品</el-button>
    <el-card class="title">
      <el-row :gutter="20">
        <el-col :span="9" style="text-align:center">商品</el-col>
        <el-col :span="3">单价</el-col>
        <el-col :span="3">库存</el-col>
        <el-col :span="3">销售状态</el-col>
        <el-col :span="3">类别</el-col>
        <el-col :span="3">操作</el-col>
      </el-row>
    </el-card>

    <el-card class="product-card">
      <el-row class="body" :gutter="20">
        <el-col :span="3">
          <img :src="img" alt class="img" />
        </el-col>
        <el-col :span="6">productName</el-col>
        <el-col :span="3">productPrice</el-col>
        <el-col :span="3">stock</el-col>
        <el-col :span="3">onSale</el-col>
        <el-col :span="3">category</el-col>
        <el-col :span="3">
          <el-link @click="editProduct('productId')">修改信息</el-link>
          <br />
          <el-link @click="openDialog">删除商品</el-link>
          <el-dialog title="确认删除商品？" :visible.sync="dialogVisible" width="200px">
            <el-button @click="closeDialog">取消</el-button>
            <el-button @click="closeDialog">确认</el-button>
          </el-dialog>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import img from '@/assets/6453300ed108e990.jpg'
export default {
  data() {
    return {
      img,
      dialogVisible: false,
    }
  },
  methods: {
    editProduct(id) {
      this.$router.push({ name: 'editProduct', params: { id } })
    },
    openDialog() {
      this.dialogVisible = true
    },
    closeDialog() {
      this.dialogVisible = false
    },
  },
}
</script>

<style scoped>
.product-list {
  width: 1002px;
}
.product-list .title {
  font-size: 12px;
  margin-bottom: 20px;
}
.product-card {
  font-size: 12px;
}
.product-card .img {
  width: 100px;
  height: 100px;
}
</style>