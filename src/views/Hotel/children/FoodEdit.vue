<template>
  <div>
    <el-form class="form-container" label-width="auto">
      <h1>{{this.$route.params.id}}</h1>
      <el-form-item label="菜品名称">
        <el-input v-model="name"></el-input>
      </el-form-item>
      <el-form-item label="菜品价格">
        <el-input-number :min="0" v-model="price"></el-input-number>
      </el-form-item>
      <el-form-item label="菜品信息">
        <el-input v-model="information"></el-input>
      </el-form-item>
      <el-form-item label="库存">
        <el-input-number :min="1" v-model="stock"></el-input-number>
      </el-form-item>
      <el-form-item label="是否上架">
        <el-switch v-model="onSale"></el-switch>
      </el-form-item>
      <el-form-item label="菜品图片">
        <el-upload
          action="#"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img :src="dialogImageUrl" alt />
        </el-dialog>
      </el-form-item>
      <el-form-item>
        <el-button>提交</el-button>
        <el-button>返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: '',
      price: 1,
      information: '',
      stock: 1,
      onSale: true,
      dialogVisible: false,
      dialogImageUrl: '',
    }
  },
  methods: {
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
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
</style>