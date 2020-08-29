<template>
  <div class="sign-up">
    <!--步骤条-->
    <el-steps :active="step" finish-status="success">
      <el-step title="是否已经注册"></el-step>
      <el-step title="注册/登录"></el-step>
      <el-step title="选择用户类型"></el-step>
      <el-step title="填写资料"></el-step>
      <el-step title="结束"></el-step>
    </el-steps>

    <!-- 之前是否在APP注册过 -->
    <el-form v-if="step===0" key="0" class="form-container">
      <el-form-item label="是否已经注册">
        <el-select v-model="registered">
          <el-option label="是" :value="true"></el-option>
          <el-option label="否" :value="false"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="step++">下一步</el-button>
      </el-form-item>
    </el-form>

    <!-- 用户登录 -->
    <el-form
      v-if="step===1&&registered"
      key="1"
      :model="userLoginForm"
      :rules="userLoginFormRules"
      ref="userLoginForm"
      label-width="auto"
      class="form-container"
    >
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="userLoginForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="userLoginForm.password" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="step--">上一步</el-button>
        <el-button type="primary" @click="userLogin('userLoginForm')">下一步</el-button>
      </el-form-item>
    </el-form>

    <!--用户注册-->
    <el-form
      v-if="step===1&&!registered"
      key="2"
      class="form-container"
      ref="userSignUpForm"
      :model="userSignUpForm"
      :rules="userSignUpFormRules"
      label-width="auto"
    >
      <el-form-item label="用户名" prop="name">
        <el-input v-model="userSignUpForm.name"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="userSignUpForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="userSignUpForm.password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPassword">
        <el-input type="password" v-model="userSignUpForm.checkPassword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="step--">上一步</el-button>
        <el-button type="primary" @click="userSignUp('userSignUpForm')">下一步</el-button>
      </el-form-item>
    </el-form>

    <!-- 选择用户类型 -->
    <el-form v-if="step===2" key="3" class="form-container" label-width="auto">
      <el-form-item label="用户类型" :rules="[{required:true,message:'请选择'}]">
        <el-select v-model="selectedUserType">
          <el-option label="酒店" value="hotel"></el-option>
          <el-option label="商家" value="seller"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="step++">下一步</el-button>
      </el-form-item>
    </el-form>

    <!-- 填写酒店用户资料 -->
    <el-form
      v-if="step===3&&selectedUserType==='hotel'"
      key="4"
      class="form-container"
      ref="hotelSignUpForm"
      :model="hotelSignUpForm"
      :rules="hotelSignUpFormRules"
      label-width="auto"
    >
      <el-form-item label="酒店名称" prop="name">
        <el-input v-model="hotelSignUpForm.name"></el-input>
      </el-form-item>
      <el-form-item label="省" prop="province">
        <el-select
          v-model="hotelSignUpForm.province"
          :disabled="provinces.length===0"
          @change="getCities"
        >
          <el-option v-for="p in provinces" :key="p" :value="p" :label="p"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="市" prop="city">
        <el-select
          v-model="hotelSignUpForm.city"
          :disabled="cities.length===0"
          @change="getDistricts"
        >
          <el-option v-for="city in cities" :key="city" :value="city" :label="city"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="区/县" prop="district">
        <el-select v-model="hotelSignUpForm.district" :disabled="districts.length===0">
          <el-option
            v-for="district in districts"
            :key="district"
            :value="district"
            :label="district"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="详细地址" prop="address">
        <el-input v-model="hotelSignUpForm.address"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="step--">上一步</el-button>
        <el-button type="primary" @click="hotelSignUp('hotelSignUpForm')">下一步</el-button>
      </el-form-item>
    </el-form>

    <!-- 填写商家注册资料 -->
    <el-form
      v-if="step===3&&selectedUserType==='seller'"
      key="5"
      class="form-container"
      ref="sellerSignUpForm"
      :model="sellerSignUpForm"
      :rules="sellerSignUpFormRules"
      label-width="auto"
    >
      <el-form-item label="商家名称" prop="name">
        <el-input v-model="sellerSignUpForm.name"></el-input>
      </el-form-item>
      <el-form-item label="省" prop="province">
        <el-select
          v-model="sellerSignUpForm.province"
          :disabled="provinces.length===0"
          @change="getCities"
        >
          <el-option v-for="p in provinces" :key="p" :value="p" :label="p"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="市" prop="city">
        <el-select
          v-model="sellerSignUpForm.city"
          :disabled="cities.length===0"
          @change="getDistricts"
        >
          <el-option v-for="city in cities" :key="city" :value="city" :label="city"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="区/县" prop="district">
        <el-select v-model="sellerSignUpForm.district" :disabled="districts.length===0">
          <el-option
            v-for="district in districts"
            :key="district"
            :value="district"
            :label="district"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="详细地址" prop="address">
        <el-input v-model="sellerSignUpForm.address"></el-input>
      </el-form-item>
      <el-form-item label="证书" prop="license">
        <!-- 上传控件 -->
        <el-upload
          ref="uploader"
          v-if="!imgURL"
          action="#"
          :auto-upload="false"
          list-type="picture-card"
          :show-file-list="false"
          :on-change="handleChange"
          accept=".png, .jpg, .jpeg"
          name="license"
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
        <el-button @click="step--">上一步</el-button>
        <el-button type="primary" @click="sellerSignUp('sellerSignUpForm')">下一步</el-button>
      </el-form-item>
    </el-form>

    <div v-if="step===4" key="6" class="form-container">
      <h1>恭喜你完成了注册</h1>
      <el-button @click="loginNow" type="primary">立即登录</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SignUp',
  data() {
    var checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入用户名'))
      }
      this.$http
        .get('/user/check-name', { params: { name: value } })
        .then((res) => {
          if (res.data.exist === 1) {
            return callback(new Error('此用户名已经被注册了'))
          }
          callback()
        })
        .catch((err) => {
          callback(new Error('网络错误'))
          throw err
        })
    }
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入手机号码'))
      }
      let pattern = /^(13[0-9]|14[0-9]|15[0-9]|16[2|5|6|7]|17[0-9]|18[0-9]|19[0-9])\d{8}$/
      if (!pattern.test(value)) {
        return callback(new Error('手机号码不合法'))
      }
      this.$http
        .get('/user/check-phone', { params: { phone: value } })
        .then((res) => {
          if (res.data.exist === 1) {
            return callback(new Error('此手机号码已经被注册了'))
          }
          callback()
        })
        .catch((err) => {
          callback(new Error('网络错误'))
          throw err
        })
    }
    var checkPassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入密码'))
      }
      let pattern = /^[\x21-\x7e]{6,16}$/
      if (!pattern.test(value)) {
        callback(new Error('只能输入字母、特殊符号、数字，6-16位'))
      } else {
        callback()
      }
    }
    var checkPassword2 = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请再次输入密码'))
      } else if (value !== this.userSignUpForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    var checkHotelName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入酒店名称'))
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
    var checkSellerName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入商家名称'))
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
      step: 0,
      dialogVisable: false,
      selectedUserType: 'hotel',
      registered: true,
      provinces: [],
      cities: [],
      districts: [],
      imgURL: '',
      userLoginForm: {
        phone: '',
        password: '',
      },
      userLoginFormRules: {
        phone: [{ required: true, message: '请输入手机号码' }],
        password: [{ required: true, message: '请输入密码' }],
      },
      userSignUpForm: {
        name: '',
        phone: '',
        password: '',
        checkPassword: '',
      },
      userSignUpFormRules: {
        name: [{ required: true, validator: checkName, trigger: 'blur' }],
        phone: [{ required: true, validator: checkPhone, trigger: 'blur' }],
        password: [
          { required: true, validator: checkPassword, trigger: 'blur' },
        ],
        checkPassword: [
          { required: true, validator: checkPassword2, trigger: 'blur' },
        ],
      },
      hotelSignUpForm: {
        name: '',
        province: '',
        city: '',
        district: '',
        address: '',
      },
      hotelSignUpFormRules: {
        name: [{ required: true, validator: checkHotelName, trigger: 'blur' }],
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
      },
      sellerSignUpForm: {
        name: '',
        province: '',
        city: '',
        district: '',
        address: '',
        license: null,
      },
      sellerSignUpFormRules: {
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
  computed: {},
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    token() {
      return localStorage.getItem('token')
    },
    userSignUp(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return
        this.$http
          .post('/user/sign-up', this.userSignUpForm)
          .then((res) => {
            if (res.data.state === 1) {
              localStorage.setItem('token', res.data.token)
              this.$message.success('用户注册成功')
              this.step++
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
    userLogin(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return
        this.$http
          .post('/user/login', this.userLoginForm)
          .then((res) => {
            if (res.data.state === 1) {
              localStorage.setItem('token', res.data.token)
              this.$message.success('用户登录成功')
              this.step++
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
    sellerSignUp(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return
        let formData = new FormData()
        for (let key in this.sellerSignUpForm) {
          formData.append(key, this.sellerSignUpForm[key])
        }
        let config = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${this.token()}`,
          },
        }
        this.$http
          .post('/seller/sign-up', formData, config)
          .then((res) => {
            if (res.data.state === 1) {
              this.$message.success('商家注册成功')
              this.$store.commit('setSellerLogin')
              this.step++
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
    hotelSignUp(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return
        this.$http
          .post('/hotel/sign-up', this.hotelSignUpForm, {
            headers: { Authorization: 'Bearer ' + this.token() },
          })
          .then((res) => {
            if (res.data.state === 1) {
              this.$store.commit('setHotelLogin')
              this.$message.success('酒店注册成功')
              this.step++
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
    handleChange(file) {
      this.sellerSignUpForm.license = file.raw
      this.imgURL = URL.createObjectURL(file.raw)
    },
    handleRemove() {
      this.sellerSignUpForm.license = ''
      this.imgURL = ''
    },
    handlePreview() {
      this.dialogVisable = true
    },
    loginNow() {
      if (this.selectedUserType === 'seller') {
        this.$router.replace('/seller')
      } else {
        this.$router.replace('/hotel')
      }
    },
    getProvinces() {
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
          } else {
            this.$message.error(res.data.info)
          }
        })
        .catch((err) => {
          this.$message.error('网络存在异常，省级列表无法获取')
          throw err
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
            this.hotelSignUpForm.city = ''
            this.hotelSignUpForm.district = ''
            this.sellerSignUpForm.city = ''
            this.sellerSignUpForm.district = ''
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
            this.hotelSignUpForm.district = ''
            this.sellerSignUpForm.district = ''
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
    this.getProvinces()
  },
}
</script>

<style scoped>
.sign-up {
  width: 600px;
}
.form-container {
  margin: 20px auto;
  padding: 25px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  width: 370px;
}
</style>