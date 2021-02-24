<template>
  <el-form
    ref="form"
    class="register-form"
    label-position="top"
    size="small"
    :model="form"
    :rules="rules"
  >
    <el-form-item label="用户名/商家名称" prop="name">
      <el-input
        placeholder="支持中文、字母、数字、特殊符号"
        maxlength="20"
        show-word-limit
        v-model="form.name"
      ></el-input>
    </el-form-item>

    <el-form-item label="手机号码" prop="phone">
      <el-input v-model="form.phone"></el-input>
    </el-form-item>

    <el-form-item label="省" prop="province">
      <el-select
        placeholder="请选择"
        v-model="form.province"
        @change="handleProvinceChange"
      >
        <el-option
          v-for="item in province"
          :key="item"
          :label="item"
          :value="item"
        ></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="市" prop="city">
      <el-select
        placeholder="请选择"
        v-model="form.city"
        @change="handleCityChange"
      >
        <el-option
          v-for="item in city"
          :key="item"
          :label="item"
          :value="item"
        ></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="区/县" prop="district">
      <el-select placeholder="请选择" v-model="form.district">
        <el-option
          v-for="item in district"
          :key="item"
          :label="item"
          :value="item"
        ></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="详细地址" prop="address">
      <el-input v-model="form.address"></el-input>
    </el-form-item>

    <el-form-item label="证书" prop="license">
      <el-upload
        action="whatever"
        :auto-upload="false"
        :show-file-list="false"
        :on-change="handleFileChange"
      >
        <img class="uploader-img" v-if="imgURL" :src="imgURL" alt="license" />
        <i v-else class="el-icon-plus uploader-icon"></i>
        <div slot="tip" class="el-upload__tip">
          只能上传jpg/png文件，且不超过1mb
        </div>
      </el-upload>
    </el-form-item>

    <el-form-item label="密码" prop="password">
      <el-input
        type="password"
        placeholder="长度8-14 支持字母、数字、特殊符号"
        v-model="form.password"
      ></el-input>
    </el-form-item>

    <el-form-item label="确认密码" prop="password2">
      <el-input
        type="password"
        placeholder="请再次输入密码"
        v-model="form.password2"
      ></el-input>
    </el-form-item>

    <el-form-item>
      <el-button>清空</el-button>
      <el-button type="primary" @click="submit">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      districts: [],
      province: [],
      city: [],
      district: [],
      form: {
        name: "",
        phone: "",
        province: "",
        city: "",
        district: "",
        address: "",
        password: "",
        password2: "",
        license: "",
      },
      imgURL: "",
      rules: {
        name: [
          {
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("请输入用户名/商家名称"));
              } else {
                this.$http
                  .get(`/seller/check-name?name=${value}`)
                  .then((res) => {
                    if (res.data.state === 1 && res.data.exist === 1) {
                      callback(new Error("此用户名已经被注册了"));
                    } else {
                      callback();
                    }
                  });
              }
            },
            required: true,
            trigger: "blur",
          },
        ],
        phone: [
          {
            validator: (rule, value, callback) => {
              let regx = /^(13[0-9]|14[0-9]|15[0-9]|16[2|5|6|7]|17[0-9]|18[0-9]|19[0-9])\d{8}$/;
              if (value === "") {
                callback(new Error("请输入手机号码"));
              } else if (!regx.test(value)) {
                callback(new Error("手机号码不合法"));
              } else {
                this.$http
                  .get(`/seller/check-phone?phone=${value}`)
                  .then((res) => {
                    if (res.data.state === 1 && res.data.exist === 1) {
                      callback(new Error("此手机号码已经被注册了"));
                    } else {
                      callback();
                    }
                  });
              }
            },
            required: true,
            trigger: "blur",
          },
        ],
        province: [{ required: true, message: "请选择省份", trigger: "blur" }],
        city: [{ required: true, message: "请选择城市", trigger: "blur" }],
        district: [{ required: true, message: "请选择区/县", trigger: "blur" }],
        address: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
        ],
        password: [
          {
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("请输入密码"));
              } else if (value.length < 8 || value.length > 14) {
                callback(new Error("长度为8-14位"));
              } else if (!/^[\x21-\x7E]+$/.test(value)) {
                callback(new Error("只支持字母、数字、特殊符号"));
              } else {
                callback();
              }
            },
            required: true,
            trigger: "blur",
          },
        ],
        password2: [
          {
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("请再次输入密码"));
              } else if (value !== this.form.password) {
                callback(new Error("两次输入的密码不一致"));
              } else {
                callback();
              }
            },
            required: true,
            trigger: "blur",
          },
        ],
        license: [{ required: true, message: "请上传证书", trigger: "blur" }],
      },
    };
  },
  methods: {
    handleFileChange(file) {
      this.form.license = file.raw;
      const fileReader = new FileReader();
      let vue = this;
      fileReader.readAsDataURL(file.raw);
      fileReader.onload = function () {
        vue.imgURL = this.result;
      };
    },
    handleProvinceChange(provinceName) {
      const province = this.districts.find((p) => {
        return p.name === provinceName;
      });
      this.city = province.children.map((c) => {
        return c.name;
      });
      this.form.city = "";
      this.form.district = "";
      this.district = [];
    },
    handleCityChange(cityName) {
      const province = this.districts.find((p) => {
        return p.name === this.form.province;
      });
      const city = province.children.find((c) => {
        return c.name === cityName;
      });
      this.district = city.children.map((d) => {
        return d.name;
      });
      this.form.district = "";
    },
    fetchDistricts() {
      this.$http
        .get("/district")
        .then((res) => {
          if (res.data.state === 1) {
            this.districts = res.data.districts;
            this.province = res.data.districts.map((p) => {
              return p.name;
            });
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch((err) => {
          console.error(err);
          this.$message.error("网络错误，获取区域信息失败");
        });
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let formData = new FormData();
          formData.append("name", this.form.name);
          formData.append("phone", this.form.phone);
          formData.append("province", this.form.province);
          formData.append("city", this.form.city);
          formData.append("district", this.form.district);
          formData.append("address", this.form.address);
          formData.append("password", this.form.password);
          formData.append("license", this.form.license);
          this.$http
            .post("/seller/sign-up", formData)
            .then((res) => {
              if (res.data.state === 1) {
                this.$message.success("注册成功");
                //存储token和用户类型，供自动登录使用及以后请求使用
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("userType", "seller");
                //路由跳转
                this.$router.push("/seller");
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch((err) => {
              console.error(err);
              this.$message.error("网络错误");
            });
        } else {
          return false;
        }
      });
    },
  },
  created() {
    this.fetchDistricts();
  },
};
</script>

<style>
.register-form .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.register-form .el-upload:hover {
  border-color: #409eff;
}
.register-form .uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 400px;
  height: 225px;
  line-height: 225px;
  text-align: center;
}
.register-form .uploader-img {
  width: 400px;
  height: 225px;
  display: block;
}
.register-form .el-select {
  width: 100%;
}
</style>