<template>
  <div class="room-list">
    <el-button style="margin-bottom:20px;" @click="goToRoomEdit('new')">添加房间</el-button>
    <el-card class="title">
      <el-row :gutter="20">
        <el-col :span="6" style="text-align:center">房间</el-col>
        <el-col :span="3">价格</el-col>
        <el-col :span="6">信息</el-col>
        <el-col :span="3">剩余数量</el-col>
        <el-col :span="3">上架状态</el-col>
        <el-col :span="3">操作</el-col>
      </el-row>
    </el-card>
    <el-card v-for="i in 6" :key="i" class="room-card">
      <el-row class="body" :gutter="20">
        <el-col :span="3">
          <img :src="img" alt class="img" />
        </el-col>
        <el-col :span="3">roomName</el-col>
        <el-col :span="3">roomPrice</el-col>
        <el-col :span="6">roomInformation</el-col>
        <el-col :span="3">roomStock</el-col>
        <el-col :span="3">state</el-col>
        <el-col :span="3">
          <el-link @click="goToRoomEdit('123')">编辑</el-link>
          <el-link style="margin-left:20px">删除</el-link>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'HotelRoom',
  data() {
    return {
      img: '',
    }
  },
  methods: {
    goToRoomEdit(id) {
      this.$router.push({ name: 'room-edit', params: { id } })
    },
  },
}
</script>

<style scoped>
.room-list {
  min-width: 1002px;
}
.room-list .title {
  font-size: 12px;
  margin-bottom: 20px;
}
.room-card {
  margin-bottom: 20px;
  font-size: 12px;
}
.room-card .img {
  width: 100px;
  height: 100px;
}
.room-card .body {
  word-break: break-all;
}
</style>