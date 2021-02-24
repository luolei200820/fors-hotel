<template>
  <el-container style="height: 100vh">
    <el-aside width="200px">
      <el-menu
        style="height: 100%"
        :router="true"
        :default-active="$route.path"
      >
        <el-menu-item index="/seller">
          <template #title>首页</template>
        </el-menu-item>
        <el-menu-item index="/seller/product">
          <template #title>商品管理</template>
        </el-menu-item>
        <el-menu-item index="/seller/order">
          <template #title>订单管理</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="my-header">
        <el-page-header :content="pageHeader" @back="$router.go(-1)" />
      </el-header>

      <el-main class="my-main">
        <router-view></router-view>
      </el-main>

      <el-footer class="my-footer">
        <div style="position: relative; top: 20px">
          <i class="el-icon-edit"></i>
          <span>广州市方润斯电子锁有限公司</span>
        </div>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      pageHeader: "首页",
    };
  },
  methods: {
    getProductOrders(first) {
      const token = localStorage.getItem("token");
      this.$http
        .post("/product-order/seller", { token })
        .then((res) => {
          if (res.data.state === 1) {
            const oldOrders = this.$store.state.productOrders;
            const newOrders = res.data.productOrders;
            const changeNumber = newOrders.length - oldOrders.length;
            if (changeNumber > 0) {
              if (!first) {
                this.$notify({
                  title: "标题名称",
                  message: `有${changeNumber}条新订单`,
                });
              }
              this.$store.commit("setProductOrder", newOrders);
            }
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
  watch: {
    "$route.path": function (newPath) {
      switch (newPath) {
        case "/seller":
          this.pageHeader = "首页";
          break;
        case "/seller/product":
          this.pageHeader = "商品管理";
          break;
        case "/seller/product-edit":
          this.pageHeader = "商品编辑";
          break;
        case "/seller/order":
          this.pageHeader = "订单管理";
          break;
      }
    },
  },
  created() {
    this.getProductOrders("first");
    setInterval(this.getProductOrders, 1 * 60 * 1000);
  },
};
</script>

<style>
.my-header {
  background-color: #409eff;
}
.my-footer {
  background-color: #f2f6fc;
}
.my-header .el-page-header {
  line-height: 60px;
}
.my-header .el-page-header__left,
.el-page-header__content {
  color: white;
}
</style>
