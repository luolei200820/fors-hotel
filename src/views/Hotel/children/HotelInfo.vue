<template>
  <div>
    <el-form
      class="form-container"
      ref="hotelEditInfoForm"
      :model="hotelEditInfoForm"
      :rules="hotelEditInfoFormRules"
      label-width="auto"
    >
      <el-form-item label="酒店名称" prop="name">
        <el-input v-model="hotelEditInfoForm.name"></el-input>
      </el-form-item>
      <el-form-item label="省" prop="province">
        <el-select
          v-model="hotelEditInfoForm.province"
          :disabled="provinces.length===0"
          @change="getCities"
        >
          <el-option v-for="p in provinces" :key="p" :value="p" :label="p"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="市" prop="city">
        <el-select
          v-model="hotelEditInfoForm.city"
          :disabled="cities.length===0"
          @change="getDistricts"
        >
          <el-option v-for="city in cities" :key="city" :value="city" :label="city"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="区/县" prop="district">
        <el-select v-model="hotelEditInfoForm.district" :disabled="districts.length===0">
          <el-option
            v-for="district in districts"
            :key="district"
            :value="district"
            :label="district"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="详细地址" prop="address">
        <el-input v-model="hotelEditInfoForm.address"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit('hotelEditInfoForm')">确认修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'HotelInfo',
  data() {
    var checkHotelName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入酒店名称'))
      } else if (value === this.hotelOriginalName) {
        callback()
      } else {
        this.$http
          .get('/hotel/check-name', { params: { name: value } })
          .then((res) => {
            if (res.data.exist === 0) {
              callback()
            } else {
              callback(new Error('酒店名称已经被注册了'))
            }
          })
          .catch((err) => {
            callback(new Error('网络错误'))
            throw err
          })
      }
    }
    return {
      hotelEditInfoForm: {
        name: '',
        province: '',
        city: '',
        district: '',
        address: '',
      },
      hotelOriginalName: '',
      hotelEditInfoFormRules: {
        name: [{ required: true, validator: checkHotelName, trigger: 'blur' }],
        province: [{ required: true, message: '请选择省份', trigger: 'blur' }],
        city: [{ required: true, message: '请选择城市', trigger: 'blur' }],
        district: [{ required: true, message: '请选择区/县', trigger: 'blur' }],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
        ],
      },
      provinces: [],
      cities: [],
      districts: [],
    }
  },
  methods: {
    token() {
      return localStorage.getItem('token')
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return
        let config = {
          headers: { Authorization: `Bearer ${this.token()}` },
        }
        this.$http
          .post('/hotel/edit-profile', this.hotelEditInfoForm, config)
          .then((res) => {
            if (res.data.state === 1) {
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
    getHotelInfo() {
      let config = { headers: { Authorization: `Bearer ${this.token()}` } }
      this.$http
        .post('/hotel', {}, config)
        .then(async (res) => {
          if (res.data.state === 1) {
            this.hotelEditInfoForm = res.data.hotelProfile
            this.hotelOriginalName = res.data.hotelProfile.name
          } else {
            this.$message.error(res.data.msg)
          }
        })
        .catch((err) => {
          this.$message.error('网络错误')
          throw err
        })
    },
    getProvinces() {
      //挂载时获取省级行政区
      new Promise((resolve, reject) => {
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
            this.$message.error('网络存在异常，获取省级列表失败')
            reject(err)
            throw err
          })
      })
    },
    getCities(name) {
      //name是省的名称
      new Promise((resolve, reject) => {
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
              this.hotelEditInfoForm.city = ''
              this.hotelEditInfoForm.district = ''
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
      new Promise((resolve, reject) => {
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
              this.hotelEditInfoForm.district = ''
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
  mounted() {
    this.getHotelInfo()
    this.getProvinces()
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