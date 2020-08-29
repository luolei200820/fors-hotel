<template>
  <div>
    <el-card class="form-container">
      <el-form
        ref="productEditForm"
        :model="productEditForm"
        :rules="productEditFormRules"
        label-width="auto"
      >
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="productEditForm.name"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="productEditForm.price"></el-input>
        </el-form-item>
        <el-form-item label="商品信息" prop="information">
          <el-input v-model="productEditForm.information"></el-input>
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input-number v-model="productEditForm.stock" :min="1" :max="2000"></el-input-number>
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="productEditForm.category" placeholder="请选择商品分类">
            <el-option v-for="item in categories" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否上架" prop="onSale">
          <el-switch v-model="productEditForm.onSale"></el-switch>
        </el-form-item>
        <el-form-item label="商品图片" prop="imgSrc">
          <!-- 上传控件 -->
          <el-upload
            :action="actionURL()"
            :headers=" { Authorization: `Bearer ${this.token()}` }"
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
          <el-button type="primary" @click="submit">提交</el-button>
          <el-button @click="$router.go(-1)">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ProductEdit',
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
      fileList: [],
      dialogVisible: false,
      dialogImageUrl: '',
      productEditForm: {
        name: '',
        price: '',
        information: '',
        stock: 1,
        onSale: true,
        category: '',
        imgSrc: [],
      },
      productEditFormRules: {
        name: [{ required: true, message: '请填写商品名称', trigger: 'blur' }],
        price: [{ required: true, validator: priceValidator, trigger: 'blur' }],
        information: [
          { required: true, message: '请输入商品信息', trigger: 'blur' },
        ],
        stock: [
          { required: true, message: '请输入商品库存数量', trigger: 'blur' },
        ],
        category: [
          { required: true, message: '请选择商品分类', trigger: 'blur' },
        ],
        imgSrc: [
          { required: true, message: '请上传商品图片', trigger: 'blur' },
        ],
      },
      categories: [
        '客房用品',
        '清洁用品',
        '餐饮用品',
        '家具用品',
        '休闲设备',
        '单次用品',
        '智能设备',
        '卫浴用品',
      ],
    }
  },
  methods: {
    actionURL() {
      return process.env.VUE_APP_SERVER_URL + '/album/upload'
    },
    token() {
      return localStorage.getItem('token')
    },
    handleUploadSuccess(res) {
      if (res.state === 1) {
        //图片编辑流程：图片名从imgSrc中删除->上传新的图片->
        //得到新的图片的文件名并push到imgSrc中->保存到数据库
        this.productEditForm.imgSrc.push(res.filename)
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
    handleRemove(file) {
      //此时图片已经上传到了服务器，从imgSrc中删掉，再在数据库中保存即可
      if (this.$route.params.id === 'new') {
        let index = this.productEditForm.imgSrc.findIndex((filename) => {
          return filename === file.response.filename
        })
        this.productEditForm.imgSrc.splice(index, 1)
      } else {
        let index = this.productEditForm.imgSrc.findIndex((filename) => {
          return filename === this.fileList.filename
        })
        this.productEditForm.imgSrc.splice(index, 1)
      }
    },
    submit() {
      this.$refs.productEditForm.validate((valid) => {
        if (!valid) return
        let config = {
          headers: { Authorization: `Bearer ${this.token()}` },
        }
        let uploadPath =
          this.$route.params.id === 'new' ? '/product/add' : '/product/edit'
        this.$http
          .post(uploadPath, this.productEditForm, config)
          .then((res) => {
            if (res.data.state == 1) {
              this.$message.success('成功编辑了商品')
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
    getProdcutInfo() {
      let config = { headers: { Authorization: `Bearer ${this.token()}` } }
      this.$http
        .post('/product', { product_id: this.$route.params.id }, config)
        .then((res) => {
          if (res.data.state === 1) {
            this.productEditForm = res.data.product
            res.data.product.imgSrc.forEach((filename) => {
              this.fileList.push({
                name: filename,
                url: process.env.VUE_APP_SERVER_URL + '/public/' + filename,
              })
            })
          } else {
            this.$message.error(res.data.msg)
          }
        })
        .catch((err) => {
          this.$message.error('网络错误')
          throw err
        })
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
  mounted() {
    if (this.$route.params.id !== 'new') {
      this.getProdcutInfo()
    }
  },
}
</script>

<style scoped>
.form-container {
  width: 600px;
}
</style>