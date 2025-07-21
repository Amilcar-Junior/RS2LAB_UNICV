<template>
  <div>
    <div class="container-fluid mt-5">
      <!-- <router-link to="/" class="btn btn-secondary mb-3">
        <i class="fa fa-arrow-left" aria-hidden="true"></i> Voltar
      </router-link> -->
<h3
        class="text-left"
        style="
          font-family: 'Roboto', sans-serif;
          font-weight: 700;
          margin-bottom: 50px;
        "
      >
        Utilizadores
      </h3>

      <div class="card">
        <div
          class="card-header d-flex justify-content-between align-items-center"
        >
           <div>
            <input
            type="text"
            class="form-control d-inline-block w-auto"
            placeholder="Buscar"
            v-b-tooltip.hover.top ="'Buscar por Nome, Email, ID'"
            v-model="searchQuery"
          />
          <i class="fa fa-search" aria-hidden="true" style="margin-left: 2px;"></i>
          </div>
          <div>
           
            <router-link
              to="/biosentry/utilizador/create"
              class="btn btn-primary ml-2"
        
              style="
                background-color: #007bff;
                border-color: #007bff;
                color: white;
              "
              v-show="
                keys.TipoUtilizador_Nome === userTypes.ADMINISTRATOR ||
                keys.TipoUtilizador_Nome === userTypes.GESTOR ||
                keys.TipoUtilizador_Nome === userTypes.ADMINBIOSENTRY
              "
              v-b-tooltip.hover.top="'Adicionar'"
            >
              <i class="fa fa-plus" aria-hidden="true"></i> 
            </router-link>
            <button
              class="btn btn-danger ml-2"
              @click="deleteSelectedItems"
              :disabled="selectedItems.length === 0"
            >
              <i class="fa fa-check-square-o" aria-hidden="true"></i>
              <i class="fa fa-trash" aria-hidden="true"></i> 
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
                  <th scope="col" class="col-2">Nome</th>
                  <th scope="col" class="col-2">Email</th>
                  <th scope="col" class="col-1">Tipo</th>
                  <th scope="col" class="col-1">Grupos</th>
                  <th scope="col" class="col-1">Ativo</th>
                  <th scope="col" class="col-1">Avatar</th>
                  <th
                    scope="col"
                    class="col-1 text-center"
                    v-show="
                      keys.TipoUtilizador_Nome === userTypes.ADMINISTRATOR ||
                      keys.TipoUtilizador_Nome === userTypes.GESTOR ||
                keys.TipoUtilizador_Nome === userTypes.ADMINBIOSENTRY
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
                      :value="item.Utilizador_ID"
                      v-model="selectedItems"
                    />
                  </td>
                  <td>{{ item.Utilizador_ID }}</td>
                  <td>{{ item.Utilizador_Nome }}</td>
                  <td>{{ item.Utilizador_Email }}</td>
                  <td>{{ item.TipoUtilizador_Nome }}</td>
                  <td>
                    <span
                      v-for="grupo in item.Grupos"
                      :key="grupo.ID"
                      class="badge badge-primary m-1"
                    >
                      {{ grupo.Nome }}
                    </span>
                  </td>
                  <td class="text-center">
                    <b-icon-check
                      v-if="item.Utilizador_isActive === 1"
                      variant="success"
                    ></b-icon-check>
                    <b-icon-x v-else variant="danger"></b-icon-x>
                  </td>
                  <td class="text-center">
                    <button
                      v-if="item.Utilizador_image"
                      @click="showModal(item.Utilizador_image)"
                      class="btn btn-sm btn-info"
                    >
                      <i class="fa fa-picture-o" aria-hidden="true"></i> Ver
                    </button>
                    <i
                      v-else
                      class="fa fa-user"
                      aria-hidden="true"
                      style="font-size: 1.8rem"
                    ></i>
                  </td>
                  <td
                    class="text-center"
                    v-show="
                      keys.TipoUtilizador_Nome === userTypes.ADMINISTRATOR ||
                      keys.TipoUtilizador_Nome === userTypes.GESTOR ||
                keys.TipoUtilizador_Nome === userTypes.ADMINBIOSENTRY
                    "
                  >
                    <router-link
                      :to="{
                        path: '/biosentry/utilizador/' + item.Utilizador_ID + '/edit',
                      }"
                      class="btn btn-info mr-2 button"
                      v-b-tooltip.hover.top="'Editar estudante'"
                    >
                      <i class="fa fa-pencil-square-o" aria-hidden="true"></i> 
                    </router-link>
                    <button
                      type="button"
                      @click="ShowConfirmDelete(item.Utilizador_ID)"
                      class="btn btn-danger button"
                      v-b-tooltip.hover.top="'Deletar utilizador'"
                    >
                      <i class="fa fa-trash" aria-hidden="true"></i> 
                    </button>
                  </td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td colspan="6" class="text-center">
                    {{
                      searchQuery
                        ? "Não foi encontrado nenhum resultado para a pesquisa."
                        : "Nenhum estudante registada."
                    }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="d-flex justify-content-center">
            <b-pagination
              v-if="totalPages > 1"
              v-model="currentPage"
              :total-rows="totalRows"
              :per-page="perPage"
              aria-controls="utilizadores-table"
              class="custom-pagination"
            ></b-pagination>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal for Image Preview -->
    <b-modal
      id="image-preview-modal"
      v-model="modalShow"
      title="Avatar Preview"
      hide-footer
      centered
    >
      <div class="d-flex justify-content-center">
        <img
          :src="currentImage"
          alt="Avatar"
          style="max-width: 100%; height: auto"
        />
      </div>
    </b-modal>
  </div>
</template>

<script>
module.exports = {
  name: "utilizador",
  props: ["keys"],
  data() {
    return {
      perPage: 8,
      currentPage: 1,
      items: [],
      selectedItems: [], // Para armazenar os IDs selecionados
      modalShow: false,
      currentImage: "",
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
      const searchLower = this.searchQuery.toLowerCase();
      return this.items.filter((item) => {
        const matchesID = item.Utilizador_ID
          ? item.Utilizador_ID.toString().includes(searchLower)
          : false;
        const matchesName = item.Utilizador_Nome
          ? item.Utilizador_Nome.toLowerCase().includes(searchLower)
          : false;
        const matchesEmail = item.Utilizador_Email
          ? item.Utilizador_Email.toLowerCase().includes(searchLower)
          : false;
        const matchesType = item.TipoUtilizador_Nome
          ? item.TipoUtilizador_Nome.toLowerCase().includes(searchLower)
          : false;
        const matchesGroups =
          item.Grupos && item.Grupos.length > 0
            ? item.Grupos.some((group) =>
                group.Nome
                  ? group.Nome.toLowerCase().includes(searchLower)
                  : false
              )
            : false;

        return (
          matchesID ||
          matchesName ||
          matchesEmail ||
          matchesType ||
          matchesGroups
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
    this.retrieveItems();
  },
  methods: {
    retrieveItems() {
      axios
        .get("/biosentry/utilizador")
        .then((response) => {
          this.items = response.data;
          // console.log(response);
        })
        .catch((error) => {
          console.error("Erro ao recuperar utilizadores:", error);
        });
    },
    showModal(image) {
      this.currentImage = `data:image/jpeg;base64,${image}`;
      this.modalShow = true;
    },
    formatGroups(groups) {
      return groups.map((group) => group.Nome).join(", ");
    },
    toggleSelectAll(event) {
      if (event.target.checked) {
        this.selectedItems = this.paginatedItems.map(
          (item) => item.Utilizador_ID
        );
      } else {
        this.selectedItems = [];
      }
    },
    deleteSelectedItems() {
      // Exibir confirmação antes de deletar
      this.$bvModal
        .msgBoxConfirm(
          `Deseja deletar os seguintes utilizadores? ${this.selectedItems.join(
            ", "
          )}`,
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
            // Criar uma lista de promessas para lidar com a exclusão
            const deletePromises = this.selectedItems.map((id) =>
              axios
                .delete(`/biosentry/deleteutilizadorgrupo/utilizador/${id}`)
                .then(() => axios.delete(`/biosentry/deleteutilizador/${id}`))
            );

            // Executar todas as promessas em paralelo
            Promise.all(deletePromises)
              .then(() => {
                this.ShowDeleteNotification(
                  "Utilizadores deletados com sucesso!",
                  "success",
                  "Sucesso"
                );
                this.selectedItems = []; // Limpar itens selecionados
                this.retrieveItems(); // Atualizar a tabela
              })
              .catch((error) => {
                console.error("Erro ao deletar utilizadores:", error);
                this.ShowDeleteNotification(
                  "Erro ao deletar utilizadores.",
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
        .delete(`/biosentry/deleteutilizadorgrupo/utilizador/${ItemID}`)
        .then(() => {})
        .catch((errors) => {
          console.error(errors);
          this.ShowDeleteNotification(
            "Erro ao Excluir Grupo de Utilizadores.",
            "success",
            "Sucesso"
          );
        });
      axios
        .delete(`/biosentry/deleteutilizador/${ItemID}`)
        .then(() => {
          this.ShowDeleteNotification(
            "Utilizador deletado com sucesso!",
            "success",
            "Sucesso"
          );
          this.retrieveItems();
        })
        .catch((error) => {
          console.error("Erro ao deletar utilizador:", error);
          this.ShowDeleteNotification(
            "Erro ao Deletar Utilizador.",
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
        .msgBoxConfirm("Deseja deletar esse Utilizador?", {
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

<style scoped>
.logo-img {
  width: 25px;
  height: auto;
}

/* Table styling */
.table-responsive {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.table {
  margin-bottom: 0;
}

.table thead th {
  background-color: #ab162b;
  color: white;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
  border-bottom: none;
  padding: 12px 15px;
}

.table tbody tr {
  transition: all 0.2s ease;
}

.table tbody tr:hover {
  background-color: #f8f9fa;
}

.table tbody tr:nth-child(even) {
  background-color: #f8f9fa;
}

.table tbody td {
  padding: 12px 15px;
  vertical-align: middle;
  border-top: 1px solid #e9ecef;
}

/* Action buttons */
.button {
  min-width: 30px;
  padding: 5px 8px;
  margin: 3px 2px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.btn-info {
  background-color: #17a2b8;
  border-color: #17a2b8;
}

.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
}

/* Card styling */
.card {
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 15px 20px;
}

/* Search input */
.form-control {
  border-radius: 4px;
  border: 1px solid #ddd;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: #2c3e50;
  box-shadow: 0 0 0 0.2rem rgba(44, 62, 80, 0.25);
}



.text-primary {
  color: #007bff !important;
}

.text-success {
  color: #28a745 !important;
}

.text-danger {
  color: #dc3545 !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .table-responsive {
    border: 0;
  }
  
  .table thead {
    display: none;
  }
  
  .table tbody tr {
    display: block;
    margin-bottom: 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .table tbody td {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: right;
    padding-left: 50%;
    position: relative;
    border-top: 1px solid #e9ecef;
  }
  
  .table tbody td::before {
    content: attr(data-label);
    position: absolute;
    left: 15px;
    width: 45%;
    padding-right: 15px;
    font-weight: bold;
    text-align: left;
  }
}
</style>
