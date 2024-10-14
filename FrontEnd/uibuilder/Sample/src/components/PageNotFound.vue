<template>
    <b-container fluid class="d-flex align-items-center justify-content-center vh-100 text-center">
      <b-row class="w-100">
        <b-col md="6" class="text-center">
          <img src="./images/page_not_found.png" alt="Page Not Found" class="img-fluid" />
        </b-col>
        <b-col md="6" class="d-flex flex-column justify-content-center align-items-center">
          <h1 class="display-1">404</h1> 
          <p class="lead display-4">Pagina Não Encontrada</p>
          <p class="display-5">A página que você procura não existe ou foi movida.</p> 
          <router-link to="/" class="btn btn-custom mt-3">Home</router-link>
        </b-col>
      </b-row>
    </b-container>
  </template>

<style scoped>
.vh-100 {
  height: 100vh;
}
</style>

<script>
module.exports = {
  name: "PageNotFound",
  data() {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>
