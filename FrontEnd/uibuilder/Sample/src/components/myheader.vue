<template>
  <b-navbar toggleable="lg" type="dark" class="custom-navbar">
    <!-- <b-navbar-brand href="#">RS2LAB</b-navbar-brand> -->
    <b-navbar-brand href="#" to="/">
      <img src="./images/rs2lab_logo_black.png" alt="RS2LAB" class="logo-img" />
    </b-navbar-brand>

    <b-navbar-toggle
      target="nav-collapse"
      v-show="keys.islogged"
    ></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav v-show="keys.islogged">
        <b-nav-item-dropdown text="Rs2Lab IOT" right>
          <b-dropdown-item href="#" to="/tipoutilizador" v-show="keys.TipoUtilizador_Nome === userTypes.ADMINISTRATOR">
            <i class="fa fa-user-plus" aria-hidden="true"></i> Tipos de
            Utilizadores
          </b-dropdown-item>
          <b-dropdown-item href="#" to="/utilizador" v-show="keys.TipoUtilizador_Nome === userTypes.ADMINISTRATOR"
            ><i class="fa fa-user" aria-hidden="true"></i>
            Utilizadores</b-dropdown-item
          >
          <b-dropdown-item href="#" to="/grupoutilizadores" v-show="keys.TipoUtilizador_Nome === userTypes.ADMINISTRATOR"
            ><i class="fa fa-users" aria-hidden="true"></i> Grupos de
            Utilizadores</b-dropdown-item
          >
          
          <b-dropdown-item href="#" to="/areadeagricultura" v-show="keys.TipoUtilizador_Nome === userTypes.ADMINISTRATOR || keys.TipoUtilizador_Nome === userTypes.GESTOR ">
            <i class="fa fa-leaf" aria-hidden="true"></i>
            Area De Agricultura
          </b-dropdown-item>
          <b-dropdown-item href="#" to="/local" v-show="keys.TipoUtilizador_Nome === userTypes.ADMINISTRATOR">
            <i class="fa fa-location-arrow" aria-hidden="true"></i>
            Locais
          </b-dropdown-item>
          <b-dropdown-item href="#" to="/sensor" v-show="keys.TipoUtilizador_Nome === userTypes.ADMINISTRATOR">
            <i class="fa fa-microchip" aria-hidden="true"></i>
            Sensores
          </b-dropdown-item>
          <b-dropdown-item href="#" to="/tiposensor" v-show="keys.TipoUtilizador_Nome === userTypes.ADMINISTRATOR">
            <i class="fa fa-list" aria-hidden="true"></i>
            Tipos de Sensores
          </b-dropdown-item>
          <b-dropdown-item href="#" to="/topico" v-show="keys.TipoUtilizador_Nome === userTypes.ADMINISTRATOR">
            <i class="fa fa-microchip" aria-hidden="true"></i>
            Topicos de Sensores
          </b-dropdown-item>
          <b-dropdown-item href="#" to="/map">
            <i class="fa fa-map" aria-hidden="true"></i>
            Mapa
          </b-dropdown-item>
          <b-dropdown-item href="#" to="/dashboard">
            <i class="fa fa-tachometer" aria-hidden="true"></i>
            DashBoard
          </b-dropdown-item>
          
        </b-nav-item-dropdown>

        <b-nav-item-dropdown
          v-show="keys.TipoUtilizador_ID === 1"
          text="Controlo de Residencia"
          right
        >
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
              <template v-if="keys.Utilizador_image">
                <b-avatar :src="avatarImage" size="1.8rem"></b-avatar>
              </template>
              <template v-else>
                <i class="fa fa-user" aria-hidden="true" style="font-size: 1.8rem;"></i>
              </template>
              &nbsp;{{ keys.Utilizador_Nome }}
            </em>
          </template>
          <b-dropdown-item
            href="#"
            :to="{ path: '/perfil/' + keys.Utilizador_ID }"
            >Perfil</b-dropdown-item
          >
          <b-dropdown-item href="#" @click="keys.performLogout()"
            ><i class="fa fa-sign-out" aria-hidden="true"></i> Sign
            Out</b-dropdown-item
          >
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
  props: ["keys"],
  data() {
    return {
      userTypes: window.appConfig.userTypes,
      mqttConfig: window.appConfig.mqtt,
    };
  },
  computed: {
    avatarImage() {
      return this.keys.Utilizador_image ? `data:image/jpeg;base64,${this.keys.Utilizador_image}` : './images/no-avatar.png';
    }
  },
  mounted() {
    console.log("keys: ", this.keys);
    // console.log("User Types:", this.userTypes);
    // console.log("MQTT Config:", this.mqttConfig);
  },
  methods: {},
};
</script>

