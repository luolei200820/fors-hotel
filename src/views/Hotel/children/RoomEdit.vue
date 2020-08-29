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
        <el-input-number v-model="roomEditForm.stock" :min="1" :max="2000"></el-input-number>
      </el-form-item>
      <el-form-item label="是否上架" prop="onSale">
        <el-switch v-model="roomEditForm.onSale"></el-switch>
      </el-form-item>
      <el-form-item label="房间图片" prop="imgSrc">
        <!-- 上传控件 -->
        <el-upload
          :action="actionURL()"
          :headers=" { Authorization: `Bearer ${token()}` }"
          name="image"
          list-type="picture-card"
          accept=".jpeg, .png, .jpg"
          :limit="6"
          :file-list="fileList"
          :before-upload="beforeUpload"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>

        <!-- 预览对话框 -->
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" />
        </el-dialog>
      </el-form-item>
      <el-form-item>
        <el-button>提交</el-button>
        <el-button @click="$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'RoomEdit',
  data() {
    var priceValidator = (rule, value, callback) => {
      let patten = /^\d+(.\d{1,2})?$/
      if (!value) {
        callback(new Error('请输入价格'))
      } else if (!patten.test(value)) {
        callback(new Error('输入非数值或者超过两位小数'))
      } else callback()
    }
    return {
      dialogVisible: false,
      dialogImageUrl: '',
      fileList: [],
      roomEditForm: {
        name: '',
        price: '',
        information: '',
        stock: 0,
        onSale: true,
        imgSrc: '',
      },
      roomEditFormRules: {
        name: [{ required: true, message: '请填写菜品名称', trigger: 'blur' }],
        price: [{ required: true, validator: priceValidator, trigger: 'blur' }],
        information: [
          { required: true, message: '商品描述不能为空', trigger: 'blur' },
        ],
        imgSrc: [{ required: true, message: '需要上传图片', trigger: 'blur' }],
      },
    }
  },
  computed: {},
  methods: {
    actionURL() {
      return process.env.VUE_APP_SERVER_URL + '/album/upload'
    },
    token() {
      return localStorage.getItem('token')
    },
    addRoom() {
      this.$refs.roomEditForm.validate((valid) => {
        if (!valid) return
        let config = { headers: { Authorization: `Bearer ${this.token()}` } }
        this.$http
          .post('/room/add', this.roomEditForm, config)
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
    handleUploadSuccess(res) {
      if (res.state === 1) {
        this.roomEditForm.imgSrc.push(res.filename)
      } else {
        this.$message.error(res.msg)
      }
    },
    handleUploadError() {
      this.$message('网络错误，图片上传失败')
    },
    handlePictureCardPreview(file) {
      this.dialogVisible = true
      this.dialogImageUrl = URL.createObjectURL(file.raw)
    },
    beforeUpload(file) {
      const fileType = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt1M = file.size / 1024 / 1024 < 1

      if (!fileType) {
        this.$message.error('上传头像图片只能是 .jpg .jpeg .png 格式!')
      }
      if (!isLt1M) {
        this.$message.error('上传头像图片大小不能超过 1MB!')
      }
      return fileType && isLt1M
    },
  },
  mounted() {},
}
</script>

<style scoped>
.form-container {
  width: 370px;
  padding: 25px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>