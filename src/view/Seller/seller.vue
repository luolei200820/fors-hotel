<template>
  <el-tabs v-model="activeTab">
    <el-tab-pane label="账户信息" name="first">
      <img src="@/assets/logo.png" alt="logo" />
      <div class="my-title">{{ seller.name }}</div>
      <div class="my-subtext">
        {{ seller.province }}-{{ seller.city }}-{{ seller.district }}
      </div>
      <div class="my-subtext">{{ seller.address }}</div>
      <div class="my-subtext">联系电话：{{ seller.phone }}</div>
      <div class="my-title">证书</div>
      <img
        style="width: 500px; height: 333px"
        :src="combineURL(seller.license)"
      />
    </el-tab-pane>

    <el-tab-pane label="修改资料" name="second">
      <el-form
        ref="form"
        class="seller-form"
        label-width="80px"
        :model="form"
        :rules="rules"
      >
        <el-form-item label="商家名称" prop="name">
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
            <img
              class="uploader-img"
              v-if="imgURL"
              :src="imgURL"
              alt="license"
            />
            <i v-else class="el-icon-plus uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过1mb
            </div>
          </el-upload>
        </el-form-item>

        <el-form-item label="当前密码" prop="password">
          <el-input v-model="form.password" type="password"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="退出登录" name="third">
      <el-button @click="logout">确认退出</el-button>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  data() {
    return {
      activeTab: "first",
      seller: {},
      districts: [],
      province: [],
      city: [],
      district: [],
      imgURL: "",
      form: {
        name: "",
        phone: "",
        province: "",
        city: "",
        district: "",
        address: "",
        password: "",
        license: "",
      },
      rules: {
        name: [
          {
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("请输入用户名/商家名称"));
              } else if (value !== this.seller.name) {
                this.$http
                  .get(`/seller/check-name?name=${value}`)
                  .then((res) => {
                    if (res.data.state === 1 && res.data.exist === 1) {
                      callback(new Error("此用户名已经被注册了"));
                    } else {
                      callback();
                    }
                  });
              } else {
                callback();
              }
            },
          },
        ],
        phone: [
          {
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              let regx = /^(13[0-9]|14[0-9]|15[0-9]|16[2|5|6|7]|17[0-9]|18[0-9]|19[0-9])\d{8}$/;
              if (value === "") {
                callback(new Error("请输入手机号码"));
              } else if (!regx.test(value)) {
                callback(new Error("手机号码不合法"));
              } else if (value !== this.seller.phone) {
                this.$http
                  .get(`/seller/check-phone?phone=${value}`)
                  .then((res) => {
                    if (res.data.state === 1 && res.data.exist === 1) {
                      callback(new Error("此手机号码已经被注册了"));
                    } else {
                      callback();
                    }
                  });
              } else {
                callback();
              }
            },
          },
        ],
        province: [{ required: true, message: "请选择省份", trigger: "blur" }],
        city: [{ required: true, message: "请选择城市", trigger: "blur" }],
        district: [{ required: true, message: "请选择区/县", trigger: "blur" }],
        address: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入当前使用的密码", trigger: "blur" },
        ],
        license: [{ required: true, message: "请上传证书", trigger: "blur" }],
      },
    };
  },
  methods: {
    logout() {
      this.$store.commit("logout");
      localStorage.removeItem("token");
      localStorage.removeItem("userType");
      this.$router.push("/");
      this.$message.success("成功退出登录");
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
    handleFileChange(file) {
      this.form.license = file.raw;
      const fileReader = new FileReader();
      let vue = this;
      fileReader.readAsDataURL(file.raw);
      fileReader.onload = function () {
        vue.imgURL = this.result;
      };
    },
    combineURL(fileName) {
      if (!fileName) return;
      return `${process.env.VUE_APP_API}/public/license/${fileName}`;
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
          formData.append("token", localStorage.getItem("token"));
          //如果修改了证书
          if (this.form.license !== this.seller.license)
            formData.append("license", this.form.license);

          this.$http
            .post("/seller/edit-profile", formData)
            .then((res) => {
              if (res.data.state === 1) {
                //修改当前显示的用户信息
                this.seller = res.data.seller;
                this.activeTab = "first";
                this.form.password = "";
                this.$message.success("修改成功");
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
    fetchDistricts() {
      this.$http
        .get("/district")
        .then((res) => {
          if (res.data.state === 1) {
            this.districts = res.data.districts;
            this.province = res.data.districts.map((p) => {
              return p.name;
            });
            //尝试设置和用户关联的市、区选项
            const province = this.districts.find((p) => {
              //查找用户所在省份
              return p.name === this.seller.province;
            });
            if (!province) return;
            const city = province.children.find((c) => {
              //查找用户所在城市
              return c.name === this.seller.city;
            });
            if (!city) return;
            this.city = province.children.map((c) => {
              //设置和用户关联的市
              return c.name;
            });
            this.district = city.children.map((d) => {
              //设置和用户关联的区
              return d.name;
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
  },
  created() {
    const token = localStorage.getItem("token");
    this.$http
      .post("/seller", { token })
      .then((res) => {
        if (res.data.state === 1) {
          //设置seller
          this.seller = res.data.seller;
          //异步获取行政区域信息
          this.fetchDistricts();
          //设置form
          this.form.name = this.seller.name;
          this.form.phone = this.seller.phone;
          this.form.province = this.seller.province;
          this.form.city = this.seller.city;
          this.form.district = this.seller.district;
          this.form.address = this.seller.address;
          this.form.license = this.seller.license;
          this.imgURL = this.combineURL(this.form.license);
        } else {
          this.$router.replace("/");
        }
      })
      .catch((err) => {
        console.error(err);
        this.$message.error("网络错误，登录失败");
        this.$router.replace("/");
      });
  },
};
</script>

<style>
.seller-form {
  width: 500px;
}
.seller-form .el-select {
  width: 100%;
}
.my-title {
  margin: 15px 0;
  font-size: 20px;
  font-weight: bold;
  color: #303133;
}
.my-subtext {
  font-size: 14px;
  color: #909399;
}
.seller-form .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.seller-form .el-upload:hover {
  border-color: #409eff;
}
.seller-form .uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 420px;
  height: 236px;
  line-height: 236px;
  text-align: center;
}
.seller-form .uploader-img {
  width: 420px;
  height: 236px;
}
</style>