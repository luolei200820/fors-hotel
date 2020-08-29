<template>
  <div>
    <el-form
      ref="roomEditForm"
      :model="roomEditForm"
      :rules="roomEditFormRules"
      class="form-container"
      label-width="auto"
    >
      <el-form-item label="房间名称" prop="name">
        <el-input v-model="roomEditForm.name"></el-input>
      </el-form-item>
      <el-form-item label="房间价格" prop="price">
        <el-input v-model.number="roomEditForm.price"></el-input>
      </el-form-item>
      <el-form-item label="房间信息" prop="information">
        <el-input v-model="roomEditForm.information"></el-input>
      </el-form-item>
      <el-form-item label="房间数量" prop="stock">
        <el-input v-model.number="roomEditForm.stock"></el-input>
      </el-form-item>
      <el-form-item label="是否上架" prop="onSale">
        <el-switch v-model="roomEditForm.onSale"></el-switch>
      </el-form-item>
      <el-form-item label="房间图片" prop="imgSrc">
        <el-upload
          :action="uploadURL"
          :show-file-list="false"
          :on-success="handleUploadSuccess"
          :before-upload="beforeUpload"
          :headers="{Authorization:`Bearer ${token()}`}"
          name="image"
          class="uploader"
        >
          <img v-if="roomEditForm.imgSrc" :src="imgURL(roomEditForm.imgSrc)" class="uploader-img" />
          <i v-else class="el-icon-plus uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button @click="addOrEdit==='add'?addRoom('roomEditForm'):editRoom('roomEditForm')">提交</el-button>
        <el-button @click="$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'RoomEdit',
  data() {
    return {
      roomEditForm: {
        name: '',
        price: '',
        information: '',
        stock: '',
        onSale: true,
        imgSrc: '',
      },
      roomEditFormRules: {
        name: [{ required: true, message: '请填写菜品名称', trigger: 'blur' }],
        price: [
          { required: true, message: '价格不能为空,', trigger: 'blur' },
          { type: 'number', message: '价格必须为数字值', trigger: 'blur' },
          {
            type: 'number',
            min: 0,
            message: '价格不能为负数',
            trigger: 'blur',
          },
        ],
        information: [
          { required: true, message: '商品描述不能为空', trigger: 'blur' },
        ],
        stock: [
          { required: true, message: '房间数量不能为空,', trigger: 'blur' },
          { type: 'number', message: '房间数量必须为数字值', trigger: 'blur' },
          {
            type: 'number',
            min: 1,
            message: '房间数量不能小于1',
            trigger: 'blur',
          },
        ],
        imgSrc: [{ required: true, message: '需要上传图片', trigger: 'blur' }],
      },
    }
  },
  computed: {
    uploadURL() {
      return process.env.VUE_APP_SERVER_URL + '/album/upload'
    },
    addOrEdit() {
      if (this.$route.params.id === 'new') {
        return 'add'
      } else {
        return 'edit'
      }
    },
  },
  methods: {
    imgURL(imgSrc) {
      return process.env.VUE_APP_SERVER_URL + '/public/' + imgSrc
    },
    token() {
      return localStorage.getItem('token')
    },
    addRoom(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return
        this.$http
          .post('/room/add', this.roomEditForm, {
            headers: { Authorization: `Bearer ${this.token()}` },
          })
          .then((res) => {
            if (res.data.state === 1) {
              this.$message.success(res.data.msg)
              this.$router.go(-1)
            } else {
              this.$message.error('添加商品失败')
            }
          })
          .catch((err) => {
            this.$message.error('网络错误')
            throw err
          })
      })
    },
    editRoom(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return
        this.roomEditForm.room_id = this.$route.params.id
        this.$http
          .post('/room/edit', this.roomEditForm, {
            headers: { Authorization: `Bearer ${this.token()}` },
          })
          .then((res) => {
            if (res.data.state === 1) {
              this.$message.success(res.data.msg)
              this.$router.go(-1)
            } else {
              this.$message.error(res.data.msg)
            }
          })
          .catch((err) => {
            this.$message.error('网络错误')
            throw err
          })
      })
    },
    getRoomInfo(id) {
      this.$http
        .get('/room', { params: { id } })
        .then((res) => {
          if (res.data.state === 1) {
            let {
              name,
              price,
              imgSrc,
              information,
              stock,
              onSale,
            } = res.data.room
            this.roomEditForm.name = name
            this.roomEditForm.price = price
            this.roomEditForm.imgSrc = imgSrc
            this.roomEditForm.information = information
            this.roomEditForm.stock = stock
            this.roomEditForm.onSale = onSale
          } else {
            this.$message.error(res.data.msg)
          }
        })
        .catch((err) => {
          this.$message.error('网络错误')
          throw err
        })
    },
    handleUploadSuccess(res) {
      this.roomEditForm.imgSrc = res.fileName
    },
    beforeUpload(file) {
      const fileType = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 1

      if (!fileType) {
        this.$message.error('上传头像图片只能是 .jpg .jpeg .png 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 1MB!')
      }
      return fileType && isLt2M
    },
  },
  mounted() {
    if (this.addOrEdit === 'edit') {
      this.getRoomInfo(this.$route.params.id)
    }
  },
}
</script>

<style scoped>
.form-container {
  width: 370px;
  padding: 25px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.uploader >>> .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.uploader >>> .el-upload:hover {
  border-color: #409eff;
}
.uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.uploader-img {
  width: 178px;
  display: block;
}
</style>