<template>
  <div class="container-fluid mt-5">
    <router-link to="/" class="btn btn-secondary mb-3">
      <i class="fa fa-arrow-left" aria-hidden="true"></i> Voltar
    </router-link>
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h4>Grupo Utilizadores</h4>
        <div>
          <input
            type="text"
            class="form-control d-inline-block w-auto"
            placeholder="Buscar por ID, Nome ou Utilizador..."
            v-model="searchQuery"
          />
          <router-link to="/grupoutilizadores/create" class="btn btn-primary ml-2" v-show="keys.TipoUtilizador_Nome === userTypes.ADMINISTRATOR || keys.TipoUtilizador_Nome === userTypes.GESTOR ">
            <i class="fa fa-plus" aria-hidden="true"></i> Adicionar
          </router-link>
        </div>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th scope="col" class="col-1">ID</th>
                <th scope="col" class="col-3">Nome</th>
                <th scope="col" class="col-6">Utilizadores</th>
                <th scope="col" class="col-2 text-right" v-show="keys.TipoUtilizador_Nome === userTypes.ADMINISTRATOR || keys.TipoUtilizador_Nome === userTypes.GESTOR ">Ações</th>
              </tr>
            </thead>
            <tbody v-if="filteredItems.length > 0">
              <tr v-for="(item, index) in filteredItems" :key="index">
                <td>{{ item.Grupo_ID }}</td>
                <td>{{ item.Grupo_Nome }}</td>
                <td>{{ formatUtilizadores(item.Utilizadores) }}</td>
                <td class="text-right" v-show="keys.TipoUtilizador_Nome === userTypes.ADMINISTRATOR || keys.TipoUtilizador_Nome === userTypes.GESTOR ">
                  <router-link
                    :to="{ path: '/grupoutilizadores/' + item.Grupo_ID + '/edit' }"
                    class="btn btn-success"
                  >
                    <i class="fa fa-pencil" aria-hidden="true"></i> Editar
                  </router-link>
                  <button
                    type="button"
                    @click="ShowConfirmDelete(item.Grupo_ID)"
                    class="btn btn-danger"
                  >
                    <i class="fa fa-trash" aria-hidden="true"></i> Deletar
                  </button>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <td colspan="4">Carregando...</td>
            </tbody>
          </table>
        </div>
        <div class="d-flex justify-content-center">
          <b-pagination
            v-if="totalPages > 1"
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            aria-controls="grupoutilizadores-table"
            class="custom-pagination"
          ></b-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  name: "grupoutilizadores",
  props: ["keys"],
  data() {
    return {
      perPage: 8,
      currentPage: 1,
      items: [],
      searchQuery: "",
      userTypes: window.appConfig.userTypes,
    };
  },
  mounted() {
    this.retrieveItems();
  },
  computed: {
    totalRows() {
      return this.filteredItems.length;
    },
    totalPages() {
      return Math.ceil(this.totalRows / this.perPage);
    },
    filteredItems() {
      return this.items
        .filter(item => {
          if (this.keys.TipoUtilizador_Nome === this.userTypes.ADMINISTRATOR) {
            return true;
          }
          const userGroupIds = this.keys.Grupos ? this.keys.Grupos.map(group => group.ID) : [];
          return userGroupIds.includes(item.Grupo_ID);
        })
        .filter(item => {
          const searchLower = this.searchQuery.toLowerCase();
          const matchesID = item.Grupo_ID.toString().includes(searchLower);
          const matchesName = item.Grupo_Nome.toLowerCase().includes(searchLower);
          const matchesUtilizadores = item.Utilizadores.some(utilizador =>
            utilizador.Nome.toLowerCase().includes(searchLower)
          );
          return matchesID || matchesName || matchesUtilizadores;
        });
    },
  },
  methods: {
    retrieveItems() {
      axios
        .get("/rs2lab/grupoutilizadores")
        .then(resp => {
          this.items = resp.data;
        })
        .catch(errors => {
          console.error(errors);
        });
    },
    formatUtilizadores(utilizadores) {
      if (!utilizadores || !Array.isArray(utilizadores)) return "";
      return utilizadores.map(utilizador => utilizador.Nome).join(", ");
    },
    deleteItem(ItemID) {
      axios
        .delete(`/rs2lab/deleteutilizadorgrupo/grupoutilizadores/${ItemID}`)
        .then(() => {})
        .catch(errors => {
          console.error(errors);
          this.ShowDeleteNotification(
            "Erro ao Deletar Grupo de Utilizadores.",
            "danger",
            "Erro"
          );
        });
      axios
        .delete(`/rs2lab/deletegrupoutilizadores/${ItemID}`)
        .then(() => {
          this.ShowDeleteNotification(
            "Grupo deletado com sucesso!",
            "success",
            "Sucesso"
          );
          this.retrieveItems();
        })
        .catch(errors => {
          console.error(errors);
          this.ShowDeleteNotification(
            "Erro ao Deletar Grupo.",
            "danger",
            "Erro"
          );
        });
    },
    ShowDeleteNotification(message, variant, title) {
      this.$bvToast.toast(message, {
        title: title,
        variant: variant,
        solid: true,
      });
    },
    ShowConfirmDelete(ItemID) {
      this.$bvModal
        .msgBoxConfirm("Deseja deletar esse Grupo?", {
          title: "Deletar",
          size: "sm",
          buttonSize: "sm",
          okVariant: "danger",
          okTitle: "Sim",
          cancelTitle: "Não",
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true,
        })
        .then(value => {
          if (value) {
            this.deleteItem(ItemID);
          }
        })
        .catch(err => {
          console.error(err);
          this.$bvToast.toast("Ocorreu um erro ao exibir a caixa de diálogo.", {
            title: "Erro",
            variant: "danger",
          });
        });
    },
  },
};
</script>

<style scoped>
.logo-img {
  width: 25px;
  height: auto;
}
</style>
