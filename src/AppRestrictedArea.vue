<template>
  <div class="" id="app-restricted">
    <appnav></appnav>
    <div class="container-app">
      <router-view :key="$route.fullPath"></router-view>
    </div>
  </div>
</template>

<script>
import appnav from '@/components/nav/Index.vue';

export default {
  name: 'app-restricted',
  components: { appnav },
};
</script>

<style lang="scss" scoped>
</style>
