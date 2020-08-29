<template>
  <el-card style="width:400px">
    <el-form ref="loginForm" :model="loginForm" :rules="rules" label-width="auto">
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
        <el-button type="primary" @click="login()">登录</el-button>
        <el-button @click="resetForm('loginForm')">清空</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        phone: '',
        password: '',
        userType: '',
      },
      rules: {
        phone: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        userType: [
          { required: true, message: '请选择用户类型', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    //酒店登录
    hotelLogin() {
      this.$http
        .post('/hotel/login', this.loginForm)
        .then((res) => {
          if (res.data.state === 1) {
            this.$store.commit('setHotelLogin')
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
    },
    //商家登录
    sellerLogin() {
      this.$http
        .post('/seller/login', this.loginForm)
        .then((res) => {
          if (res.data.state === 1) {
            this.$store.commit('setSellerLogin')
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
    },
    login() {
      this.$refs['loginForm'].validate((valid) => {
        if (!valid) return
        if (this.loginForm.userType === 'hotel') this.hotelLogin()
        else this.sellerLogin()
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
  },
}
</script>

<style scoped>
</style>