<template>
  <div>
    <el-card class="form-container">
      <el-form
        ref="sellerInfoForm"
        :model="sellerInfoForm"
        :rules="sellerInfoFormRules"
        label-width="auto"
      >
        <el-form-item label="商家名称" prop="name">
          <el-input v-model="sellerInfoForm.name"></el-input>
        </el-form-item>
        <el-form-item label="省" prop="province">
          <el-select
            v-model="sellerInfoForm.province"
            :disabled="provinces.length===0"
            @change="getCities"
          >
            <el-option v-for="p in provinces" :key="p" :value="p" :label="p"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="市" prop="city">
          <el-select
            v-model="sellerInfoForm.city"
            :disabled="cities.length===0"
            @change="getDistricts"
          >
            <el-option v-for="city in cities" :key="city" :value="city" :label="city"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="区/县" prop="district">
          <el-select v-model="sellerInfoForm.district" :disabled="districts.length===0">
            <el-option
              v-for="district in districts"
              :key="district"
              :value="district"
              :label="district"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="sellerInfoForm.address"></el-input>
        </el-form-item>
        <el-form-item label="证书" prop="license">
          <!-- 上传控件 -->
          <el-upload
            ref="uploader"
            v-if="!imgURL"
            :action="actionsURL()"
            :headers="{ Authorization: `Bearer ${token()}` }"
            list-type="picture-card"
            :show-file-list="false"
            :on-success="handleSuccess"
            accept=".png, .jpg, .jpeg"
            name="image"
          >
            <i class="el-icon-plus"></i>
          </el-upload>

          <!-- 选择文件之后隐藏上传控件 -->
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
          <el-button type="primary" @click="submit">确认修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'SellerInfo',
  data() {
    var checkSellerName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入商家名称'))
      } else if (value === this.originalName) {
        //如果没有修改名字则不检查是否重名
        return callback()
      } else {
        this.$http
          .get('/seller/check-name', { params: { name: value } })
          .then((res) => {
            if (res.data.exist === 0) {
              callback()
            } else {
              callback(new Error('商家名称已经被注册了'))
            }
          })
          .catch((err) => {
            callback(new Error('网络错误'))
            throw err
          })
      }
    }
    return {
      imgURL: '',
      dialogVisable: false,
      provinces: [],
      cities: [],
      districts: [],
      originalName: '',
      sellerInfoForm: {
        name: '',
        province: '',
        city: '',
        district: '',
        address: '',
        license: null,
      },
      sellerInfoFormRules: {
        name: [{ required: true, validator: checkSellerName, trigger: 'blur' }],
        province: [
          { required: true, message: '所在省份不能为空', trigger: 'blur' },
        ],
        city: [
          { required: true, message: '所在城市不能为空', trigger: 'blur' },
        ],
        district: [
          { required: true, message: '所在区/县不能为空', trigger: 'blur' },
        ],
        address: [
          { required: true, message: '详细地址不能为空', trigger: 'blur' },
        ],
        license: [{ required: true, message: '证书不能为空', trigger: 'blur' }],
      },
    }
  },
  methods: {
    token() {
      return localStorage.getItem('token')
    },
    actionsURL() {
      return process.env.VUE_APP_SERVER_URL + '/album/upload'
    },
    handleRemove() {
      this.sellerInfoForm.license = ''
      this.imgURL = ''
    },
    handlePreview() {
      this.dialogVisable = true
    },
    handleSuccess(res, file) {
      if (res.state === 1) {
        this.imgURL = URL.createObjectURL(file.raw)
        this.sellerInfoForm.license = res.filename
      } else {
        this.$message.error(res.data.msg)
      }
    },
    submit() {
      this.$refs.sellerInfoForm.validate((valid) => {
        if (!valid) return
        let config = {
          headers: { Authorization: `Bearer ${this.token()}` },
        }
        this.$http
          .post('/seller/edit-profile', this.sellerInfoForm, config)
          .then((res) => {
            if (res.data.state === 1) {
              //修改originalName
              this.originalName = this.sellerInfoForm.name
              this.$message.success('修改成功')
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
    getSellerProfile() {
      let config = { headers: { Authorization: `Bearer ${this.token()}` } }
      return new Promise((resolve, reject) => {
        this.$http
          .post('/seller', {}, config)
          .then((res) => {
            if (res.data.state === 1) {
              this.sellerInfoForm = res.data.sellerProfile
              //记录一个原始名称，防止检查自己是否重名
              this.originalName = res.data.sellerProfile.name
              this.imgURL =
                process.env.VUE_APP_SERVER_URL +
                '/public/' +
                this.sellerInfoForm.license
              resolve()
            } else {
              this.$message.error(res.data.msg)
              reject(res.data.msg)
            }
          })
          .catch((err) => {
            this.$message.error('网络错误')
            reject(err)
            throw err
          })
      })
    },
    getProvinces() {
      //挂载时获取省级行政区
      return new Promise((resolve, reject) => {
        this.$http
          .get('https://restapi.amap.com/v3/config/district', {
            params: {
              key: process.env.VUE_APP_AMAPKEY,
              keywords: name,
              subdistrict: '1',
            },
          })
          .then((res) => {
            if (res.data.infocode === '10000') {
              this.provinces = res.data.districts[0].districts.map((p) => {
                return p.name
              })
              resolve()
            } else {
              this.$message.error(res.data.info)
              reject(res.data.info)
            }
          })
          .catch((err) => {
            this.$message.error('网络存在异常，省级列表无法获取')
            reject(err)
            throw err
          })
      })
    },
    getCities(name) {
      //name是省的名称
      return new Promise((resolve, reject) => {
        this.$http
          .get('https://restapi.amap.com/v3/config/district', {
            params: {
              key: process.env.VUE_APP_AMAPKEY,
              keywords: name,
              subdistrict: '1',
            },
          })
          .then((res) => {
            if (res.data.infocode === '10000') {
              this.cities = res.data.districts[0].districts.map((c) => {
                return c.name
              })
              this.sellerInfoForm.city = ''
              this.sellerInfoForm.district = ''
              this.districts = []
              resolve()
            } else {
              this.$message.error(res.data.info)
              reject(res.data.info)
            }
          })
          .catch((err) => {
            this.$message.error('网络存在异常，获取市级列表失败')
            reject(err)
            throw err
          })
      })
    },
    getDistricts(name) {
      //name是市的名称
      return new Promise((resolve, reject) => {
        this.$http
          .get('https://restapi.amap.com/v3/config/district', {
            params: {
              key: process.env.VUE_APP_AMAPKEY,
              keywords: name,
              subdistrict: '1',
            },
          })
          .then((res) => {
            if (res.data.infocode === '10000') {
              this.districts = res.data.districts[0].districts.map((d) => {
                return d.name
              })
              this.sellerInfoForm.district = ''
              resolve()
            } else {
              this.$message.error(res.data.info)
              reject(res.data.info)
            }
          })
          .catch((err) => {
            this.$message.error('网络存在异常，获取区/县列表失败')
            reject(err)
            throw err
          })
      })
    },
  },
  async mounted() {
    this.getProvinces()
    await this.getSellerProfile()
    const province = this.sellerInfoForm.province
    const city = this.sellerInfoForm.city
    const district = this.sellerInfoForm.district
    await this.getCities(province)
    await this.getDistricts(city)
    this.sellerInfoForm.city = city
    this.sellerInfoForm.district = district
  },
}
</script>

<style scoped>
.form-container {
  width: 370px;
}
</style>