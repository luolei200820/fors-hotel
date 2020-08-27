<template>
  <div>
    <el-form
      class="form-container"
      ref="hotelEditInfoForm"
      :model="hotelEditInfoForm"
      :rules="hotelEditInfoForm"
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
    return {
      hotelEditInfoForm: {
        name: '',
        province: '',
        city: '',
        district: '',
        address: '',
      },
      provinces: [],
      cities: [],
      districts: [],
    }
  },
  methods: {
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        console.log('submit', valid)
      })
    },
    getCities(name) {
      //name是省的名称
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
          } else {
            this.$message.error(res.data.info)
          }
        })
        .catch((err) => {
          this.$message.error('网络存在异常，获取市级列表失败')
          throw err
        })
    },
    getDistricts(name) {
      //name是市的名称
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
          } else {
            this.$message.error(res.data.info)
          }
        })
        .catch((err) => {
          this.$message.error('网络存在异常，获取区/县列表失败')
          throw err
        })
    },
  },
  mounted() {
    //挂载时获取省级行政区
    this.$http
      .get('https://restapi.amap.com/v3/config/district', {
        params: {
          key: process.env.VUE_APP_AMAPKEY,
          keywords: '100000',
          subdistrict: '1',
        },
      })
      .then((res) => {
        if (res.data.infocode === '10000') {
          this.provinces = res.data.districts[0].districts.map((p) => {
            return p.name
          })
        } else {
          this.$message.error(res.data.info)
        }
      })
      .catch((err) => {
        this.$message.error('网络存在异常，省级列表无法获取')
        throw err
      })
    this.hotelEditInfoForm.name = this.$store.state.hotelProfile.name
    this.hotelEditInfoForm.province = this.$store.state.hotelProfile.province
    this.hotelEditInfoForm.city = this.$store.state.hotelProfile.city
    this.hotelEditInfoForm.district = this.$store.state.hotelProfile.district
    this.hotelEditInfoForm.address = this.$store.state.hotelProfile.address
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