<template>
  <b-navbar toggleable="lg" type="dark" class="custom-navbar">
     <b-navbar-toggle target="nav-collapse" v-show="keys.islogged"></b-navbar-toggle>
    <button class="sidebar-toggle" v-show="keys.islogged" @click="toggleSidebar" style="margin-right: 2px;">
      <i class="fa fa-bars"></i>
    </button>
    <b-navbar-brand href="#" to="/">
      <img src="./components/images/logo3.png" alt="RS2LAB" class="logo-img" />
    </b-navbar-brand>

   

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav class="ml-auto" v-show="keys.islogged">
        <b-nav-item-dropdown right v-show="keys.islogged">
          <template #button-content>
            <em>
              <template v-if="keys.Utilizador_image">
                <b-avatar :src="avatarImage" size="1.8rem"></b-avatar>
              </template>
              <template v-else>
                <i class="fa fa-user" aria-hidden="true" style="font-size: 1.8rem"></i>
              </template>
               {{ keys.Utilizador_Nome }}
            </em>
          </template>
          <b-dropdown-item :to="{ path: '/perfil/' + keys.Utilizador_ID }">Perfil</b-dropdown-item>
          <b-dropdown-item :to="{ path: '/alterarsenha/' + keys.Utilizador_ID }">Alterar palavra-passe</b-dropdown-item>
          <b-dropdown-item @click="keys.performLogout()">
            <i class="fa fa-sign-out" aria-hidden="true"></i> Sign Out
          </b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<style scoped>
.logo-img {
  width: 200px;
  height: 30px;
}

.sidebar-toggle {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  margin-left: 1rem;
  cursor: pointer;
}

@media (max-width: 768px) {
  .logo-img {
    width: 150px;
    height: auto;
  }

  .sidebar-toggle {
    font-size: 1.2rem;
  }
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
  methods: {
    toggleSidebar() {
      this.$root.$emit('toggle-sidebar');
    },
  },
};
</script>