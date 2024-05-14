<template>
  <b-navbar toggleable="lg" type="dark" class="custom-navbar">
    <!-- <b-navbar-brand href="#">RS2LAB</b-navbar-brand> -->
    <b-navbar-brand href="#" to="/">
      <img src="./images/rs2lab_logo_black.png" alt="RS2LAB" class="logo-img" />
    </b-navbar-brand>

    <b-navbar-toggle target="nav-collapse" v-show="keys.islogged"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav v-show="keys.islogged">
          <b-nav-item-dropdown text="Rs2Lab IOT" right>
            <b-dropdown-item href="#" to="/grupoutilizadores">Grupos de Utilizadores</b-dropdown-item>
            <b-dropdown-item href="#" to="/utilizador">Utilizadores</b-dropdown-item>
            <b-dropdown-item href="#" to="/tipoutilizador">Tipos de Utilizadores</b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown v-show="keys.TipoUtilizador_ID === 3" text="Controlo de Residencia" right>
            <b-dropdown-item href="#">Submenu 1</b-dropdown-item>
            <b-dropdown-item href="#">Submenu 2</b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown text="Univerde" right>
            <b-dropdown-item href="#">Submenu 1</b-dropdown-item>
            <b-dropdown-item href="#">Submenu 2</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto" v-show="keys.islogged">
        <b-nav-item-dropdown right v-show="keys.islogged">
          <template #button-content>
            <em>
              <b-avatar src="./images/no-avatar.png" size="1.8rem"></b-avatar
              >&nbsp;{{keys.Utilizador_Nome}}
            </em>
          </template>
          <b-dropdown-item href="#" :to="{ path: '/perfil/' + keys.Utilizador_ID }">Perfil</b-dropdown-item>
          <b-dropdown-item href="#" @click="keys.performLogout()">Sign Out</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>
<style scoped>
.logo-img {
  width: 100px; /* Defina o tamanho desejado para a largura da imagem */
  height: auto; /* Mantenha a proporção da altura */
}
</style>
<script>
module.exports = {
  props:['keys'],
  data() {
    return {};
  },
  mounted() {
    console.log("keys: ",this.keys)
  },
  methods: {},
};
</script>
