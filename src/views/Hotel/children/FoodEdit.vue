<template>
  <div>
    <el-form
      ref="foodEditForm"
      :model="foodEditForm"
      :rules="foodEditFormRules"
      class="form-container"
      label-width="auto"
    >
      <el-form-item label="菜品名称" prop="name">
        <el-input v-model="foodEditForm.name"></el-input>
      </el-form-item>
      <el-form-item label="菜品价格" prop="price">
        <el-input v-model="foodEditForm.price"></el-input>
      </el-form-item>
      <el-form-item label="菜品信息" prop="information">
        <el-input v-model="foodEditForm.information"></el-input>
      </el-form-item>
      <el-form-item label="库存" prop="stock">
        <el-input-number v-model="foodEditForm.stock" :min="1" :max="2000"></el-input-number>
      </el-form-item>
      <el-form-item label="是否上架" prop="onSale">
        <el-switch v-model="foodEditForm.onSale"></el-switch>
      </el-form-item>
      <el-form-item label="菜品图片" prop="imgSrc">
        <!-- 上传控件 -->
        <el-upload
          ref="uploader"
          v-if="!imgURL"
          :action="actionURL()"
          :headers="{Authorization: 'Bearer ' + token()}"
          list-type="picture-card"
          :show-file-list="false"
          :on-change="handleChange"
          :before-upload="beforeUpload"
          :on-success="handleUploadSuccess"
          accept=".png, .jpg, .jpeg"
          name="image"
        >
          <i class="el-icon-plus"></i>
        </el-upload>

        <!-- 选择文件之后上传图片，隐藏上传控件 -->
        <div v-else class="el-upload-list el-upload-list--picture-card">
          <div class="el-upload-list__item is-success">
            <img :src="imgURL" width="100%" />
            <label class="el-upload-list__item-state-label">
              <i class="el-icon-upload-success el-icon-check"></i>
            </label>
            <span class="el-upload-list__item-actions">
              <span class="el-upload-list__item-delete">
                <i class="el-icon-delete" @click.stop="handleRemove"></i>
              </span>
              <span class="el-upload-list__item-delete">
                <i class="el-icon-zoom-in" @click.stop="handlePreview"></i>
              </span>
            </span>
          </div>
        </div>

        <!-- 预览对话框 -->
        <el-dialog :visible.sync="dialogVisable">
          <img :src="imgURL" width="100%" />
        </el-dialog>
      </el-form-item>
      <el-form-item>
        <el-button @click="submit">提交</el-button>
        <el-button @click="$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'FoodEdit',
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
      imgURL: '',
      dialogVisable: false,
      foodEditForm: {
        name: '',
        price: '',
        information: '',
        stock: 1,
        onSale: false,
        imgSrc: '',
      },
      foodEditFormRules: {
        name: [{ required: true, message: '请填写菜品名称', trigger: 'blur' }],
        price: [{ required: true, validator: priceValidator, trigger: 'blur' }],
        information: [
          { required: true, message: '菜品描述不能为空', trigger: 'blur' },
        ],
        imgSrc: [
          { required: true, message: '请上传菜品图片', trigger: 'blur' },
        ],
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
    //获取菜品信息用于编辑
    getFoodInfo(food_id) {
      let config = { headers: { Authorization: `Bearer ${this.token()}` } }
      this.$http
        .post('/food', { food_id }, config)
        .then((res) => {
          if (res.data.state === 1) {
            //放到foodEditForm和生成imgURL用于预览
            this.foodEditForm = res.data.food
            this.imgURL = `${process.env.VUE_APP_SERVER_URL}/public/${res.data.food.imgSrc}`
          } else {
            this.$message.error(res.data.msg)
          }
        })
        .catch((err) => {
          this.$message.error('网络错误')
          throw err
        })
    },
    //添加/编辑菜品
    submit() {
      this.$refs.foodEditForm.validate((valid) => {
        if (!valid) return
        let path = '/food/add'
        let successMsg = '添加菜品成功'
        //如果是编辑菜品则修改路径和提示信息
        if (this.$route.params.id !== 'new') {
          path = '/food/edit'
          successMsg = '编辑菜品信息成功'
        }
        let config = { headers: { Authorization: `Bearer ${this.token()}` } }
        this.$http
          .post(path, this.foodEditForm, config)
          .then((res) => {
            if (res.data.state === 1) {
              this.$message.success(successMsg)
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
    //从本地文件里生成预览
    handleChange(file) {
      this.imgURL = URL.createObjectURL(file.raw)
    },
    //上传前检查文件是否符合规格
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
    //将后端返回的文件名赋值给foodEditForm.imgSrc
    handleUploadSuccess(res) {
      this.foodEditForm.imgSrc = res.filename
    },
    handleRemove() {
      this.foodEditForm.imgSrc = ''
      this.imgURL = ''
    },
    handlePreview() {
      this.dialogVisable = true
    },
  },
  mounted() {
    if (this.$route.params.id !== 'new') {
      this.getFoodInfo(this.$route.params.id)
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
</style>