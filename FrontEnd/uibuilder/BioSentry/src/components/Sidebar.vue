<template>
  <b-sidebar
    id="sidebar"
    title="BiosEntry"
    shadow
    width="250px"
    :class="['sidebar', {'hidden': !isVisible}]"
    v-if="keys.islogged"
    no-close-on-route-change
    no-enforce-focus
    :visible="isVisible"
    @hidden="isVisible = false"
    @shown="isVisible = true"
  >
    <b-nav vertical>
      <b-nav-item 
        href="#" 
        to="/" 
        v-if="keys.TipoUtilizador_Nome === userTypes.ADMINBIOSENTRY"
      >
        <i class="fa fa-tachometer mr-2"></i> Dashboard
      </b-nav-item>

      <b-nav-item-dropdown
        text="Cadastro"
        v-if="keys.TipoUtilizador_Nome === userTypes.ADMINBIOSENTRY"
      >
        <b-dropdown-item href="#" to="/biosentry/gestao-alunos">
          <i class="fa fa-users mr-2"></i> Residentes
        </b-dropdown-item>
        <b-dropdown-item href="#" to="/biosentry/gestao-visitantes">
          <i class="fa fa-user-plus mr-2"></i> Visitantes
        </b-dropdown-item>
      </b-nav-item-dropdown>

      <b-nav-item-dropdown
        text="Acessos"
        v-if="keys.TipoUtilizador_Nome === userTypes.ADMINBIOSENTRY"
      >
        <b-dropdown-item href="#" to="/biosentry/historico-acesso">
          <i class="fa fa-history mr-2"></i> Histórico
        </b-dropdown-item>
        <b-dropdown-item href="#" to="/biosentry/gerar-relatorio">
          <i class="fa fa-file-text mr-2"></i> Relatório
        </b-dropdown-item>
      </b-nav-item-dropdown>

      <b-nav-item 
        href="#" 
        to="/biosentry/dispositivos"
        v-if="keys.TipoUtilizador_Nome === userTypes.ADMINBIOSENTRY"
      >
        <i class="fa fa-microchip mr-2"></i> Dispositivos
      </b-nav-item>
    </b-nav>
  </b-sidebar>
</template>

<script>
module.exports = {
  props: ["keys"],
  data() {
    return {
      userTypes: window.appConfig.userTypes,
      isVisible: true
    };
  },
  mounted() {
    this.$root.$on('toggle-sidebar', () => {
      this.isVisible = !this.isVisible
    })
  },
  beforeDestroy() {
    this.$root.$off('toggle-sidebar')
  },
};
</script>

<style scoped>
.sidebar {
  background-color: var(--sidebar-color);
  color: white;
}

.sidebar .nav-link {
  color: rgba(255, 255, 255, 0.8);
  padding: 0.75rem 1.5rem;
}

.sidebar .nav-link:hover {
  color: white;
  background-color: rgba(255, 255, 255, 0.1);
}

.sidebar .nav-link.active {
  color: white;
  background-color: rgb(131, 30, 30);
}

.sidebar .dropdown-menu {
  background-color: #2c0505;
  border: none;
}

.sidebar .dropdown-item {
  color: rgba(40, 157, 159, 0.8);
  padding: 0.5rem 1.5rem;
}

.sidebar .dropdown-item:hover {
  color: white;
  background-color: rgba(54, 163, 116, 0.1);
}
</style>
