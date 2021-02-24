<template>
  <el-form label-position="top" size="small">
    <el-form-item label="用户名/酒店名称">
      <el-input
        placeholder="支持中文、字母、数字、特殊符号"
        maxlength="20"
      ></el-input>
    </el-form-item>
    <el-form-item label="密码">
      <el-input
        type="password"
        placeholder="长度8-14 支持字母、数字、特殊符号"
        maxlength="14"
        min="8"
      ></el-input>
    </el-form-item>
    <el-form-item label="确认密码">
      <el-input type="password"></el-input>
    </el-form-item>
    <el-form-item label="省">
      <el-select placeholder="请选择" v-model="province" style="width: 100%">
        <el-option label="1" value="1"></el-option>
        <el-option label="2" value="2"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="市">
      <el-select placeholder="请选择" v-model="province" style="width: 100%">
        <el-option label="1" value="1"></el-option>
        <el-option label="2" value="2"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="区">
      <el-select placeholder="请选择" v-model="province" style="width: 100%">
        <el-option label="1" value="1"></el-option>
        <el-option label="2" value="2"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="街道">
      <el-input></el-input>
    </el-form-item>
    <el-form-item>
      <el-button>清空</el-button>
      <el-button type="primary">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      province: "",
    };
  },
};
</script>

<style>
</style>