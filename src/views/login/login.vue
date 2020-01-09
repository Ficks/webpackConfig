<template>
  <div class="container">
    <Header />
    <h1>登录界面</h1>
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
export default {
  name: 'login',
  components: {
    Header,
    Footer,
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
    color: #0f0;
}
</style>
