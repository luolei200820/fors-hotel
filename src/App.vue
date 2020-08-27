<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {}
  },
}
</script>

<style>
body {
  margin: 0;
}
#app{
  height: 100vh;
  overflow: hidden;
}
</style>