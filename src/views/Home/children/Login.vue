<template>
  <el-form
    class="form-container"
    ref="loginForm"
    :model="loginForm"
    :rules="rules"
    label-width="auto"
  >
    <el-form-item label="手机号" prop="phone">
      <el-input v-model="loginForm.phone"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input type="password" v-model="loginForm.password"></el-input>
    </el-form-item>
    <el-form-item label="用户类型" prop="userType">
      <el-select v-model="loginForm.userType" placeholder="请选用户类型">
        <el-option label="酒店" value="hotel"></el-option>
        <el-option label="商家" value="seller"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
      <el-button @click="resetForm('loginForm')">清空</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'Login',
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入手机号码'))
      }
      let pattern = /^(13[0-9]|14[0-9]|15[0-9]|16[2|5|6|7]|17[0-9]|18[0-9]|19[0-9])\d{8}$/
      if (!pattern.test(value)) {
        callback(new Error('手机号码不合法'))
      } else {
        callback()
      }
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
    return {
      loginForm: {
        phone: '',
        password: '',
        userType: '',
      },
      rules: {
        phone: [{ required: true, validator: checkPhone, trigger: 'blur' }],
        password: [
          { required: true, validator: checkPassword, trigger: 'blur' },
        ],
        userType: [
          { required: true, message: '请选择用户类型', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const user = {
            phone: this.loginForm.phone,
            password: this.loginForm.password,
          }
          if (this.loginForm.userType === 'hotel') {
            //酒店用户登录
            this.$http
              .post('/hotel/login', user)
              .then((res) => {
                if (res.data.state === 1) {
                  this.$store.commit('setUserLogin', res.data.user)
                  this.$store.commit('setHotelProfile', res.data.hotelProfile)
                  localStorage.setItem('token', res.data.token)
                  this.$message.success('登录成功')
                  this.$router.push('/hotel')
                } else {
                  this.$message.error(res.data.msg)
                }
              })
              .catch((err) => {
                this.$message.error('网络错误')
                throw err
              })
          } else {
            //商家用户登录
            this.$http
              .post('/seller/login', user)
              .then((res) => {
                if (res.data.state === 1) {
                  this.$store.commit('setUserLogin', res.data.user)
                  this.$store.commit('setSellerProfile', res.data.sellerProfile)
                  localStorage.setItem('token', res.data.token)
                  this.$message.success('登录成功')
                  this.$router.push('/seller')
                } else {
                  this.$message.error(res.data.msg)
                }
              })
              .catch((err) => {
                this.$message.error('网络错误')
                throw err
              })
          }
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
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