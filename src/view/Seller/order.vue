<template>
  <div>
    <el-button @click="reflush">刷新</el-button>
    <el-table :data="tableData" border>
      <el-table-column width="180">
        <template #default="scope">
          <el-image
            style="height: 100px"
            fit="contain"
            lazy
            :src="combineURL(scope.row.product.carousel[0])"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="下单时间" width="180">
        <template #default="scope">
          {{ new Date(scope.row.date).toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column prop="product.name" label="商品名称" width="180" />
      <el-table-column label="标签" width="180">
        <template #default="scope">
          <el-tag
            style="margin-right: 10px"
            v-for="tag in scope.row.product.tag"
            :key="tag"
          >
            {{ tag }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="quantity" label="数量" width="180">
      </el-table-column>
      <el-table-column prop="reciver" label="收件人" width="180">
      </el-table-column>
      <el-table-column prop="address" label="地址" width="180">
      </el-table-column>
      <el-table-column label="价格">
        <template #default="scope">
          {{ scope.row.quantity * scope.row.product.price }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  computed: {
    tableData: function () {
      return this.$store.state.productOrders;
    },
  },
  methods: {
    combineURL(fileName) {
      if (!fileName) return;
      return `${process.env.VUE_APP_API}/public/product/${fileName}`;
    },
    reflush() {
      const token = localStorage.getItem("token");
      this.$http
        .post("/product-order/seller", { token })
        .then((res) => {
          if (res.data.state === 1) {
            const oldOrders = this.$store.state.productOrders;
            const newOrders = res.data.productOrders;
            const changeNumber = newOrders.length - oldOrders.length;
            if (changeNumber > 0) {
              this.$notify({
                title: "标题名称",
                message: `有${changeNumber}条订单`,
              });
              this.$store.commit("setProductOrder", newOrders);
            } else {
              this.$notify({
                title: "标题名称",
                message: "没有新的订单",
              });
            }
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
};
</script>

<style>
</style>