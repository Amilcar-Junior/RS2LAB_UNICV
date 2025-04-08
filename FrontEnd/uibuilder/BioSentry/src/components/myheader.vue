<template>

  <b-navbar toggleable="lg" type="dark" class="custom-navbar" >
    <b-navbar-brand href="#" @click.prevent="toggleSidebar" v-show="keys.islogged">
      <i class="fa fa-bars"></i>
    </b-navbar-brand>
    <!-- 
    <b-navbar-toggle
      target="nav-collapse"
      v-show="keys.islogged"
    ></b-navbar-toggle> -->

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav class="ml-auto" v-show="keys.islogged">
        <b-nav-item-dropdown right v-show="keys.islogged">
          <template #button-content>
            <em>
              <template v-if="keys.Utilizador_image">
                <b-avatar :src="avatarImage" size="1.8rem"></b-avatar>
              </template>
              <template v-else>
                <i
                  class="fa fa-user"
                  aria-hidden="true"
                  style="font-size: 1.8rem"
                ></i>
              </template>
              &nbsp;{{ keys.Utilizador_Nome }}
            </em>
          </template>
          <b-dropdown-item
            href="#"
            :to="{ path: '/perfil/' + keys.Utilizador_ID }"
            >Perfil</b-dropdown-item
          >
          <b-dropdown-item
            href="#"
            :to="{ path: '/alterarsenha/' + keys.Utilizador_ID }"
            >Alterar palavra-passe</b-dropdown-item
          >
          <b-dropdown-item href="#" @click="keys.performLogout()">
            <i class="fa fa-sign-out" aria-hidden="true"></i> Sign Out
          </b-dropdown-item>
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
      return this.keys.Utilizador_image
        ? `data:image/jpeg;base64,${this.keys.Utilizador_image}`
        : "./components/images/no-avatar.png";
    },
  },
  mounted() {
    // console.log("keys: ", this.keys);
    // console.log("User Types:", this.userTypes);
    // console.log("MQTT Config:", this.mqttConfig);
  },
  methods: {
    toggleSidebar() {
      this.$root.$emit('toggle-sidebar')
    }
  },
};
</script>
