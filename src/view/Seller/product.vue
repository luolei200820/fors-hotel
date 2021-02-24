<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="商品列表" name="first">
        <el-table border :data="tableData" v-loading="tableLoading">
          <el-table-column prop="carousel" width="180">
            <template #default="scope">
              <el-image
                style="height: 100px"
                fit="contain"
                lazy
                :src="combineURL(scope.row.carousel[0])"
              ></el-image>
            </template>
          </el-table-column>
          <el-table-column prop="brand" label="品牌" width="180" />
          <el-table-column prop="name" label="商品名称" width="180" />
          <el-table-column prop="tag" label="标签" width="180">
            <template #default="scope">
              <el-tag
                v-for="tag in scope.row.tag"
                :key="tag"
                style="margin-right: 5px"
                size="mini"
              >
                {{ tag }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="价格" />
          <el-table-column label="操作" width="210">
            <template #default="scope">
              <el-button size="small" @click="handleClickCheck(scope.row._id)">
                查看
              </el-button>
              <el-button size="small" @click="handleClickDelete(scope.row._id)">
                删除
              </el-button>
              <el-dialog title="提示" :visible.sync="confirmDialog" width="30%">
                <span>确认删除？</span>
                <template #footer>
                  <el-button @click="confirmDialog = false">取 消</el-button>
                  <el-button type="primary" @click="confirmDelete">
                    确 定
                  </el-button>
                </template>
              </el-dialog>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="添加商品" name="second">
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          label-width="80px"
          style="width: 500px"
        >
          <el-form-item label="商品名称" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>

          <el-form-item label="品牌" prop="brand">
            <el-input v-model="form.brand"></el-input>
          </el-form-item>

          <el-form-item label="分类" prop="category">
            <el-select style="width: 100%" v-model="form.category">
              <el-option label="智能门锁" value="智能门锁"></el-option>
              <el-option label="酒店锁" value="酒店锁"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="价格" prop="price">
            <el-input v-model="form.price"></el-input>
          </el-form-item>

          <el-form-item label="标签" prop="tag">
            <el-checkbox-group v-model="form.tag">
              <el-checkbox label="自营"></el-checkbox>
              <el-checkbox label="商家包邮"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item
            :label="`规格${index}`"
            v-for="(name, index) in form.spec_name"
            :key="name.key"
            prop="spec_name"
          >
            <el-input
              placeholder="规格名称"
              class="spec-input"
              v-model="name.value"
            ></el-input>
            <el-input
              placeholder="规格值"
              class="spec-input"
              v-model="form.spec_value[index].value"
            ></el-input>
            <el-button
              :disabled="form.spec_name.length === 1"
              @click="handleRemoveSpec(index)"
            >
              删除
            </el-button>
          </el-form-item>

          <el-form-item>
            <el-button
              style="width: 100%"
              :disabled="form.spec_name.length === 6"
              @click="handleAddSpec"
            >
              增加
            </el-button>
          </el-form-item>

          <el-form-item label="轮播图" prop="carousel">
            <el-upload
              :auto-upload="false"
              action="whatever"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-change="handleAddCarousel"
              :on-remove="handleRemoveCarousel"
              :multiple="true"
              :limit="6"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>

          <el-form-item label="商品详情" prop="detail">
            <el-upload
              :auto-upload="false"
              action="whatever"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-change="handleAddDetail"
              :on-remove="handleRemoveDetail"
              :multiple="true"
              :limit="10"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submit" :loading="submitLoading">
              提交
            </el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>

        <el-dialog :visible.sync="dialogVisible2">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: "first",
      tableLoading: true,
      confirmDialog: false,
      confirmDeleteId: "",
      submitLoading: false,
      tableData: [],
      form: {
        name: "",
        brand: "",
        category: "",
        price: "",
        tag: [],
        spec_name: [{ value: "" }],
        spec_value: [{ value: "" }],
        carousel: [],
        detail: [],
      },
      dialogImageUrl: "",
      dialogVisible2: false,
      rules: {
        name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
        brand: [{ required: true, message: "请输入品牌名称", trigger: "blur" }],
        category: [
          { required: true, message: "请选择分类名称", trigger: "blur" },
        ],
        price: [{ required: true, message: "请输入商品价格", trigger: "blur" }],
        tag: [{ required: true, message: "请选择商品标签", trigger: "blur" }],
        spec_name: [
          {
            validator: (rule, value, callback) => {
              this.form.spec_name.forEach((item) => {
                if (item.value === "") {
                  callback(new Error("请将规格输入完整"));
                  return;
                }
              });
              this.form.spec_value.forEach((item) => {
                if (item.value === "") {
                  callback(new Error("请将规格输入完整"));
                  return;
                }
              });
              callback();
            },
            required: true,
            trigger: "blur",
          },
        ],
        carousel: [
          { required: true, message: "请上传轮播图片", trigger: "blur" },
        ],
        detail: [
          { required: true, message: "请上传商品图片", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    combineURL(filename) {
      if (!filename) return;
      return `${process.env.VUE_APP_API}/public/product/${filename}`;
    },
    router_push(path) {
      if (this.$route.path === path) return;
      this.$router.push(path);
    },
    handleClickCheck(id) {
      this.$router.push(`/seller/product/${id}`);
    },
    handleClickDelete(id) {
      this.confirmDialog = true;
      this.confirmDeleteId = id;
    },
    confirmDelete() {
      const token = localStorage.getItem("token");
      this.$http
        .post("/product/delete", { id: this.confirmDeleteId, token })
        .then((res) => {
          if (res.data.state === 1) {
            this.$message.success("删除成功");
            const index = this.tableData.findIndex((item) => {
              return item._id === this.confirmDeleteId;
            });
            this.tableData.splice(index, 1);
            this.confirmDialog = false;
          }
        });
    },
    handleAddCarousel(file) {
      this.form.carousel.push(file.raw);
    },
    handleRemoveCarousel(file) {
      const index = this.form.carousel.findIndex((raw) => {
        return raw === file.raw;
      });
      if (index !== -1) {
        this.form.carousel.splice(index, 1);
      }
    },
    handleAddDetail(file) {
      this.form.detail.push(file.raw);
    },
    handleRemoveDetail(file) {
      const index = this.form.detail.findIndex((raw) => {
        return raw === file.raw;
      });
      if (index !== -1) {
        this.form.detail.splice(index, 1);
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible2 = true;
    },
    handleAddSpec() {
      this.form.spec_name.push({ value: "" });
      this.form.spec_value.push({ value: "" });
    },
    handleRemoveSpec(index) {
      this.form.spec_name.splice(index, 1);
      this.form.spec_value.splice(index, 1);
    },
    resetForm() {
      this.$refs.form.resetFields();
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          const formData = new FormData();
          const token = localStorage.getItem("token");
          formData.append("category", this.form.category);
          formData.append("brand", this.form.brand);
          formData.append("price", this.form.price);
          this.form.tag.forEach((t) => {
            formData.append("tag", t);
          });
          formData.append("name", this.form.name);
          this.form.spec_name.forEach((obj, index) => {
            formData.append("spec_name", obj.value);
            formData.append("spec_value", this.form.spec_value[index].value);
          });
          this.form.carousel.forEach((raw) => {
            formData.append("carousel", raw);
          });
          this.form.detail.forEach((raw) => {
            formData.append("detail", raw);
          });
          formData.append("token", token);
          this.$http
            .post("/product/add", formData)
            .then((res) => {
              if (res.data.state === 1) {
                this.$message.success("添加成功");
                this.submitLoading = false;
                //刷新列表
                this.tableLoading = true;
                this.activeName = "first";
                this.$http
                  .post("/product/seller", { token })
                  .then((res) => {
                    if (res.data.state === 1) {
                      this.tableData = res.data.products;
                      this.tableLoading = false;
                    }
                  })
                  .catch((err) => {
                    console.error(err);
                    this.$message.error("网络错误");
                  });
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch((err) => {
              console.log(err);
              this.$message.error("网络错误");
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
  mounted() {
    const token = localStorage.getItem("token");
    this.$http
      .post("/product/seller", { token })
      .then((res) => {
        if (res.data.state === 1) {
          this.tableData = res.data.products;
          this.tableLoading = false;
        }
      })
      .catch((err) => {
        console.error(err);
        this.$message.error("网络错误");
      });
  },
};
</script>

<style>
.spec-input {
  width: 165px;
  margin-right: 10px;
}
</style>