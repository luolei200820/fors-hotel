<template>
  <div>
    <el-form ref="sellerInfo" class="form-container" label-width="auto">
      <el-form-item label="公司名称">
        <el-input></el-input>
      </el-form-item>
      <el-form-item label="地址">
        <el-input></el-input>
      </el-form-item>
      <el-form-item label="电话">
        <el-input></el-input>
      </el-form-item>
      <el-form-item label="证书">
        <el-upload
          action="#"
          :show-file-list="false"
          :before-upload="beforeUpload"
          :on-success="handleUploadSuccess"
          class="license-uploader"
        >
          <img v-if="form.license" :src="form.license" class="license" />
          <i v-else class="el-icon-plus license-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">确认修改</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SellerInfo',
  data() {
    return {
      form: {
        name: '',
        address: '',
        phone: '',
        license: '',
      },
    }
  },
  methods: {
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      console.log(file)
      return isJPG && isLt2M
    },
    handleUploadSuccess(res, file, fileList) {
      console.log(res)
      console.log(file)
      console.log(fileList)
    },
    submit() {
      console.log('submit')
    },
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
.license-uploader >>> .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.license-uploader >>> .el-upload:hover {
  border-color: #409eff;
}
.license-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>