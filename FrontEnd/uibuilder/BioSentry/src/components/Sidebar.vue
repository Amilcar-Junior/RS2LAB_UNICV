<template>
  <b-sidebar
    id="sidebar"
    shadow
    width="250px"
    class="sidebar"
    v-if="keys.islogged && $route.name !== 'login'"
    no-close-on-route-change
    no-close-on-esc
    no-header
    no-enforce-focus
    visible
    
  > 
    <div class="sidebar-menu">
      <div class="menu-section" v-if="keys.TipoUtilizador_Nome === userTypes.ADMINBIOSENTRY">
        <div class="menu-item">
          <router-link to="/" class="menu-link">
            <i class="fa fa-tachometer"></i>
            <span>Dashboard</span>
          </router-link>
        </div>
      </div>

      <div class="menu-section" v-if="keys.TipoUtilizador_Nome === userTypes.ADMINBIOSENTRY">
        <div class="menu-title">Registos</div>
        <div class="menu-item">
          <router-link to="/biosentry/gestao-alunos" class="menu-link">
            <i class="fa fa-users"></i>
            <span>Residentes</span>
          </router-link>
        </div>
        <div class="menu-item">
          <router-link to="/biosentry/gestao-visitantes" class="menu-link">
            <i class="fa fa-user-plus"></i>
            <span>Funcionários/Visitantes </span>
          </router-link>
        </div>
      </div>

      <div class="menu-section" v-if="keys.TipoUtilizador_Nome === userTypes.ADMINBIOSENTRY">
        <div class="menu-title">Acessos</div>
        <div class="menu-item">
          <router-link to="/biosentry/historico-acesso" class="menu-link">
            <i class="fa fa-history"></i>
            <span>Histórico</span>
          </router-link>
        </div>
        <!-- <div class="menu-item">
          <router-link to="/biosentry/gerar-relatorio" class="menu-link">
            <i class="fa fa-file-text"></i>
            <span>Relatório</span>
          </router-link>
        </div> -->
      </div>

      <div class="menu-section" v-if="keys.TipoUtilizador_Nome === userTypes.ADMINBIOSENTRY">
        <div class="menu-title">Gestão</div>
        <div class="menu-item">
          <router-link to="/biosentry/dispositivos" class="menu-link">
            <i class="fa fa-microchip"></i>
            <span>Dispositivos</span>
          </router-link>
        </div>
      </div>
    </div>
  </b-sidebar>
</template>

<script>
module.exports = {
  props: ["keys"],
  data() {
    return {
      userTypes: window.appConfig.userTypes
    };
  },
};
</script>

<style scoped>
.sidebar {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: rgb(113, 50, 50);
  
}

.sidebar-menu {
  padding: 1rem 0;
}

.menu-section {
  margin-bottom: 1.5rem;
}

.menu-title {
  color: rgba(0, 0, 0, 0.6);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0.5rem 1.5rem;
  margin-bottom: 0.5rem;
}

.menu-item {
  margin: 0.25rem 0;
}

.menu-link {
  display: flex;
  align-items: center;
  color: rgba(0, 0, 0, 0.8);
  padding: 0.75rem 1.5rem;
  text-decoration: none;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

.menu-link:hover {
  color: rgb(117, 6, 6);
  background-color: rgba(255, 255, 255, 0.05);
  border-left: 3px solid #8f2626;
}

.menu-link i {
  width: 24px;
  text-align: center;
  margin-right: 12px;
  font-size: 1.1rem;
}

.menu-link.router-link-exact-active {
  color: rgb(9, 9, 9);
  background-color: rgba(131, 30, 30, 0.2);
  border-left: 3px solid #831e1e;
}


</style>
  