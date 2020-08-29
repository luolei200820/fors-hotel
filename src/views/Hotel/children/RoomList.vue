<template>
  <div class="list">
    <el-button style="margin-bottom:20px;" @click="goToRoomEdit('new')">添加房间</el-button>

    <!-- 表头 -->
    <el-card class="list-title">
      <el-row :gutter="20">
        <el-col :span="7" style="text-align:center">房间</el-col>
        <el-col :span="4">房间信息</el-col>
        <el-col :span="2">价格</el-col>
        <el-col :span="2">房间数量</el-col>
        <el-col :span="2">上架状态</el-col>
        <el-col :span="2">操作</el-col>
      </el-row>
    </el-card>

    <!-- 列表 -->
    <el-card v-for="room in roomList" :key="room._id" class="list-card">
      <el-row class="list-card-body" :gutter="20">
        <el-col :span="4">
          <img :src="imgURL(room.imgSrc)" alt class="list-card-img" />
        </el-col>
        <el-col :span="3">{{room.name}}</el-col>
        <el-col :span="4">{{room.information}}</el-col>
        <el-col :span="2">{{room.price}}</el-col>
        <el-col :span="2">{{room.stock}}</el-col>
        <el-col :span="2">{{room.onSale?'上架':'下架'}}</el-col>
        <el-col :span="2">
          <el-link @click="goToRoomEdit(room._id)">编辑</el-link>
          <el-link style="margin-left:20px" @click="deleteRoom(room._id)">删除</el-link>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'RoomList',
  data() {
    return {
      roomList: [],
    }
  },
  methods: {
    token() {
      return localStorage.getItem('token')
    },
    imgURL(imgSrc) {
      return process.env.VUE_APP_SERVER_URL + '/public/' + imgSrc
    },
    goToRoomEdit(id) {
      this.$router.push({ name: 'room-edit', params: { id } })
    },
    getRoomList() {
      let config = { headers: { Authorization: `Bearer ${this.token()}` } }
      this.$http
        .post('/room/manage', {}, config)
        .then((res) => {
          if (res.data.state === 1) {
            this.roomList = res.data.roomList
          } else {
            this.$message.error(res.data.msg)
          }
        })
        .catch((err) => {
          this.$message.error('网络错误')
          throw err
        })
    },
    deleteRoom(id) {
      let config = { headers: { Authorization: `Bearer ${this.token()}` } }
      this.$http
        .post('/room/delete', { room_id: id }, config)
        .then((res) => {
          if (res.data.state === 1) {
            this.$message.success(res.data.msg)
            //删除data中的房间
            const index = this.roomList.findIndex((item) => {
              return item._id === id
            })
            this.roomList.splice(index, 1)
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
    this.getRoomList()
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