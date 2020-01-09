<template>
    <div class="container">
        <Header />
        <h1>哈哈</h1>
        <div class="img"><img src="../../assets/images/timg.jpg" alt=""></div>
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
export default {
  name: 'index',
  components: {
    Header,
  },
  data() {
    return {};
  },
  methods: {},
  created() {},
};
</script>

<style lang="less" scoped>
h1{
    color: #f00;
}
</style>
