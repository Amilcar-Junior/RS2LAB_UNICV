<template>
  <div>
    <div class="container-fluid mt-5">
      <router-link to="/" class="btn btn-secondary mb-3">
        <i class="fa fa-arrow-left" aria-hidden="true"></i> Voltar
      </router-link>
      <div class="card">
        <div
          class="card-header d-flex justify-content-between align-items-center"
        >
          <h4>Topicos de Sensores</h4>
          <div>
            <input
              type="text"
              class="form-control d-inline-block w-auto"
              placeholder="Buscar por nome ou ID..."
              v-model="searchQuery"
            />
            <router-link
              to="/topico/create"
              class="btn btn-primary ml-2"
              v-show="
                keys.TipoUtilizador_Nome === userTypes.ADMINISTRATOR ||
                keys.TipoUtilizador_Nome === userTypes.GESTOR
              "
            >
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
                  <th scope="col" class="col-3">Topico</th>
                  <th scope="col" class="col-2">Valor</th>
                  <th scope="col" class="col-2">Data</th>
                  <th
                    scope="col"
                    class="col-2 text-right"
                    v-show="
                      keys.TipoUtilizador_Nome === userTypes.ADMINISTRATOR ||
                      keys.TipoUtilizador_Nome === userTypes.GESTOR
                    "
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody v-if="paginatedItems.length > 0">
                <tr v-for="(item, index) in paginatedItems" :key="index">
                  <td>{{ item.ID }}</td>
                  <td>{{ item.Topico }}</td>
                  <td>{{ item.Valor }}</td>
                  <td>{{ item.Data_Hora }}</td>
                  <td
                    class="text-right"
                    v-show="
                      keys.TipoUtilizador_Nome === userTypes.ADMINISTRATOR ||
                      keys.TipoUtilizador_Nome === userTypes.GESTOR
                    "
                  >
                    <router-link
                      :to="{ path: '/topico/' + item.ID + '/edit' }"
                      class="btn btn-success"
                    >
                      <i class="fa fa-pencil" aria-hidden="true"></i> Editar
                    </router-link>
                    <button
                      type="button"
                      @click="ShowConfirmDelete(item.ID)"
                      class="btn btn-danger"
                    >
                      <i class="fa fa-trash" aria-hidden="true"></i> Deletar
                    </button>
                  </td>
                </tr>
              </tbody>
              <tbody v-else>
                <td colspan="5">Carregando...</td>
              </tbody>
            </table>
          </div>
          <div class="d-flex justify-content-center">
            <b-pagination
              v-if="totalPages > 1"
              v-model="currentPage"
              :total-rows="totalRows"
              :per-page="perPage"
              aria-controls="valorsensor-table"
              class="custom-pagination"
            ></b-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  name: "valorsensor",
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
  computed: {
    totalRows() {
      return this.filteredItems.length;
    },
    totalPages() {
      return Math.ceil(this.totalRows / this.perPage);
    },
    filteredItems() {
      if (!this.searchQuery) {
        return this.items;
      }
      return this.items.filter((item) => {
        return (
          item.Topico.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          item.ID.toString().includes(this.searchQuery) ||
          item.Data_Hora.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      });
    },
    paginatedItems() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.filteredItems.slice(start, end);
    },
  },
  mounted() {
    this.retriveItem();
  },
  methods: {
    retriveItem() {
      axios
        .get("/rs2lab/valorsensor")
        .then((response) => {
          this.items = response.data;
          console.log(response);
        })
        .catch((error) => {
          console.error("Erro ao recuperar Topicos de sensor", error);
        });
    },
    deleteItem(ItemID) {
      axios
        .delete(`/rs2lab/deletevalorsensor/${ItemID}`)
        .then(() => {
          this.ShowDeleteNotification(
            "Topico deletado com sucesso.",
            "success",
            "Sucesso"
          );
          this.retriveItem();
        })
        .catch((error) => {
          console.error("Erro ao Deletar o tipo de sensor", error);
          this.ShowDeleteNotification(
            "Erro ao Deletar Topico.",
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
        .msgBoxConfirm("Deseja deletar esse Topico?", {
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
        .then((value) => {
          if (value) {
            this.deleteItem(ItemID);
          }
        })
        .catch((err) => {
          console.error("Erro ao exibir a caixa de diálogo", err);
        });
    },
  },
};
</script>
