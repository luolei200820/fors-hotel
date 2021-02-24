<template>
  <el-form
    label-position="top"
    size="small"
    :model="form"
    :rules="rules"
    ref="form"
  >
    <el-form-item label="用户名或手机号码" prop="identity">
      <el-input v-model="form.identity"></el-input>
    </el-form-item>

    <el-form-item prop="password" label="密码">
      <el-input type="password" v-model="form.password"></el-input>
    </el-form-item>

    <el-form-item label="用户类型" prop="userType">
      <el-select
        placeholder="请选择"
        v-model="form.userType"
        style="width: 100%"
      >
        <el-option label="商家" value="seller"></el-option>
        <el-option label="酒店" value="hotel"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item>
      <el-button>取消</el-button>
      <el-button type="primary" @click="login">登录</el-button>
      <el-button type="text">忘记密码？</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      form: {
        identity: "",
        password: "",
        userType: "",
      },
      rules: {
        identity: [
          {
            required: true,
            message: "请输入用户名或手机号码",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
        ],
        userType: [
          {
            required: true,
            message: "请选择要登陆的用户类型",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    login() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$http
            .post(`/${this.form.userType}/login`, {
              identity: this.form.identity,
              password: this.form.password,
            })
            .then((res) => {
              if (res.data.state === 1) {
                //vuex存储用户类型，进行路由拦截
                this.$store.commit("login", { type: this.form.userType });
                //存储token和用户类型，供自动登录使用及以后请求使用
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("userType", this.form.userType);
                //路由跳转
                this.$message.success("登录成功");
                this.$router.push(`/${this.form.userType}`);
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch((err) => {
              console.error(err);
              this.$message.error("网络错误");
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style>
</style>