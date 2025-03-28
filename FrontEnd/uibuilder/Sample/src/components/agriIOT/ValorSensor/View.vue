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
          <h4>Tópicos de Sensores / Atuadores</h4>
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
            <button
              class="btn btn-danger ml-2"
              @click="deleteSelectedItems"
              :disabled="selectedItems.length === 0"
            >
              <i class="fa fa-trash" aria-hidden="true"></i> Deletar Selecionados
            </button>
          </div>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th scope="col" class="col-1">
                    <input type="checkbox" @change="toggleSelectAll($event)" />
                  </th>
                  <th scope="col" class="col-1">ID</th>
                  <th scope="col" class="col-4">Tópico</th>
                  <th scope="col" class="col-1 text-center">Atuador</th>
                  <!-- <th scope="col" class="col-1 text-center">Valor</th>
                  <th scope="col" class="col-2">Data</th> -->
                  <th
                    scope="col"
                    class="col-2 text-right"
                    v-show="
                      keys.TipoUtilizador_Nome === userTypes.ADMINISTRATOR ||
                      keys.TipoUtilizador_Nome === userTypes.GESTOR
                    "
                  >
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody v-if="paginatedItems.length > 0">
                <tr v-for="(item, index) in paginatedItems" :key="index">
                  <td>
                    <input
                      type="checkbox"
                      :value="item.ID"
                      v-model="selectedItems"
                    />
                  </td>
                  <td>{{ item.ID }}</td>
                  <td>{{ item.Topico }}</td>
                  <td class="text-center">
                    <b-icon-check
                      v-if="item.is_activatable === 1"
                      variant="success"
                    ></b-icon-check>
                    <b-icon-x v-else variant="danger"></b-icon-x>
                  </td>
                  <!-- <td class="text-center">{{ item.Valor }}</td>
                  <td>{{ item.Data_Hora }}</td> -->
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
                <td colspan="7">Carregando...</td>
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
      selectedItems: [], // Para armazenar os IDs selecionados
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
        })
        .catch((error) => {
          console.error("Erro ao recuperar Tópicos de Sensor / Atuador", error);
        });
    },
    toggleSelectAll(event) {
      if (event.target.checked) {
        this.selectedItems = this.paginatedItems.map((item) => item.ID);
      } else {
        this.selectedItems = [];
      }
    },
    deleteSelectedItems() {
      this.$bvModal
        .msgBoxConfirm(
          `Deseja deletar os seguintes itens? ${this.selectedItems.join(", ")}`,
          {
            title: "Deletar Selecionados",
            size: "sm",
            buttonSize: "sm",
            okVariant: "danger",
            okTitle: "Sim",
            cancelTitle: "Não",
            footerClass: "p-2",
            hideHeaderClose: false,
            centered: true,
          }
        )
        .then((value) => {
          if (value) {
            Promise.all(
              this.selectedItems.map((id) =>
                axios.delete(`/rs2lab/deletevalorsensor/${id}`)
              )
            )
              .then(() => {
                this.ShowDeleteNotification(
                  "Tópicos deletados com sucesso.",
                  "success",
                  "Sucesso"
                );
                this.selectedItems = [];
                this.retriveItem();
              })
              .catch((error) => {
                console.error("Erro ao deletar tópicos", error);
                this.ShowDeleteNotification(
                  "Erro ao deletar tópicos.",
                  "danger",
                  "Erro"
                );
              });
          }
        })
        .catch((err) => {
          console.error("Erro ao exibir a caixa de diálogo", err);
        });
    },
    deleteItem(ItemID) {
      axios
        .delete(`/rs2lab/deletevalorsensor/${ItemID}`)
        .then(() => {
          this.ShowDeleteNotification(
            "Tópico deletado com sucesso.",
            "success",
            "Sucesso"
          );
          this.retriveItem();
        })
        .catch((error) => {
          console.error("Erro ao deletar o tópico", error);
          this.ShowDeleteNotification(
            "Erro ao deletar tópico.",
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
        .msgBoxConfirm("Deseja deletar esse tópico?", {
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
