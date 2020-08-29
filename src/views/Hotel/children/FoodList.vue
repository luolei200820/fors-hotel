<template>
  <div class="list">
    <el-button style="margin-bottom:20px;" @click="goToFoodEdit('new')">添加菜品</el-button>

    <!-- 表头 -->
    <el-card class="list-title">
      <el-row :gutter="20">
        <el-col :span="7" style="text-align:center">菜品</el-col>
        <el-col :span="5">菜品信息</el-col>
        <el-col :span="2">价格</el-col>
        <el-col :span="2">库存</el-col>
        <el-col :span="2">上架状态</el-col>
        <el-col :span="6">操作</el-col>
      </el-row>
    </el-card>

    <!-- 列表 -->
    <!-- <h1 v-if="foodsList.length===0">还没有任何菜品</h1> -->
    <el-card v-for="food in foodsList" :key="food._id" class="list-card">
      <el-row class="list-card-body" :gutter="20">
        <el-col :span="4">
          <img :src="imgURL(food.imgSrc)" alt class="list-card-img" />
        </el-col>
        <el-col :span="3">{{food.name}}</el-col>
        <el-col :span="5">{{food.information}}</el-col>
        <el-col :span="2">{{food.price}}</el-col>
        <el-col :span="2">{{food.stock}}</el-col>
        <el-col :span="2">{{food.onSale?'上架':'下架'}}</el-col>
        <el-col :span="6">
          <el-link @click="goToFoodEdit(food._id)">编辑</el-link>
          <el-link style="margin-left:20px" @click="deleteFood(food._id)">删除</el-link>
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
      foodsList: [],
    }
  },
  computed: {},
  methods: {
    token() {
      return localStorage.getItem('token')
    },
    imgURL(imgSrc) {
      return process.env.VUE_APP_SERVER_URL + '/public/' + imgSrc
    },
    goToFoodEdit(id) {
      this.$router.push({ name: 'food-edit', params: { id } })
    },
    getFoodsList() {
      this.$http
        .post(
          '/food/manage',
          {},
          {
            headers: { Authorization: `Bearer ${this.token()}` },
          }
        )
        .then((res) => {
          this.foodsList = res.data.foodsList
        })
        .catch((err) => {
          throw err
        })
    },
    deleteFood(id) {
      let config = {
        headers: { Authorization: `Bearer ${this.token()}` },
      }
      this.$http
        .post('/food/delete', { food_id: id }, config)
        .then((res) => {
          if (res.data.state === 1) {
            this.$message.success(res.data.msg)
            const index = this.foodsList.findIndex((item) => {
              return item._id === id
            })
            this.foodsList.splice(index, 1)
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
    this.getFoodsList()
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