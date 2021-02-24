<template>
  <div class="product-container">
    <el-carousel height="418px" class="product-carousel" :autoplay="false">
      <el-carousel-item v-for="item in product.carousel" :key="item">
        <el-image
          :src="combineURL(item)"
          fit="cover"
          style="width: 418px; height: 418px"
        ></el-image>
      </el-carousel-item>
    </el-carousel>

    <div class="product-info">
      <div class="product-name">{{ product.name }}</div>
      <div>
        <el-tag class="product-tag" v-for="tag in product.tag" :key="tag">
          {{ tag }}
        </el-tag>
      </div>
      <div>
        <span>价格：{{ product.price }}</span>
        <span>销量：{{ product.salesVolume }}</span>
      </div>

      <div>参数：</div>

      <div v-for="(name, index) in product.spec_name" :key="name">
        <span>{{ name }}：</span>
        <span>{{ product.spec_value[index] }}</span>
      </div>

      <div>分类：{{ product.category }}</div>
      <div>品牌：{{ product.brand }}</div>
    </div>

    <div>商品详情</div>

    <el-image
      lazy
      style="width: 100%"
      v-for="img in product.detail"
      :key="img"
      :src="combineURL(img)"
    ></el-image>
  </div>
</template>

<script>
export default {
  data() {
    return {
      product: {},
    };
  },
  methods: {
    combineURL(filename) {
      return `${process.env.VUE_APP_API}/public/product/${filename}`;
    },
  },
  created() {
    this.$http
      .get(`/product?id=${this.$route.params.id}`)
      .then((res) => {
        if (res.data.state === 1) {
          this.product = res.data.product;
        } else {
          this.$message.error(res.data.msg);
        }
      })
      .catch((err) => {
        console.log(err);
        this.$message.error("网络错误");
      });
  },
};
</script>

<style>
.product-container {
  width: 863px;
}
.product-carousel,
.product-info {
  width: 50%;
  box-sizing: border-box;
  float: left;
}
.product-info {
  padding: 0 20px;
  height: 418px;
}
</style>