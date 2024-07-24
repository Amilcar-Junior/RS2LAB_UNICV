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
          <h4>Utilizador</h4>
          <div>
            <input
              type="text"
              class="form-control d-inline-block w-auto"
              placeholder="Buscar por Nome, Email..."
              v-model="searchQuery"
            />
            <router-link
              to="/utilizador/create"
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
                  <th scope="col" class="col-2">Nome</th>
                  <th scope="col" class="col-2">Email</th>
                  <th scope="col" class="col-1">Tipo</th>
                  <th scope="col" class="col-2">Grupos</th>
                  <th scope="col" class="col-1">Ativo</th>
                  <th scope="col" class="col-1">Avatar</th>
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
                    class="text-right"
                    v-show="
                      keys.TipoUtilizador_Nome === userTypes.ADMINISTRATOR ||
                      keys.TipoUtilizador_Nome === userTypes.GESTOR
                    "
                  >
                    <router-link
                      :to="{
                        path: '/utilizador/' + item.Utilizador_ID + '/edit',
                      }"
                      class="btn btn-success"
                    >
                      <i class="fa fa-pencil" aria-hidden="true"></i> Editar
                    </router-link>
                    <button
                      type="button"
                      @click="ShowConfirmDelete(item.Utilizador_ID)"
                      class="btn btn-danger"
                    >
                      <i class="fa fa-trash" aria-hidden="true"></i> Deletar
                    </button>
                  </td>
                </tr>
              </tbody>
              <tbody v-else>
                <td colspan="9">Carregando...</td>
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
        // Verifica se o nome, email, tipo, grupos ou ID correspondem à query de pesquisa
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
        .get("/rs2lab/utilizador")
        .then((response) => {
          this.items = response.data;
          console.log(response);
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

    deleteItem(ItemID) {
      axios
        .delete(`/rs2lab/deleteutilizadorgrupo/utilizador/${ItemID}`)
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
        .delete(`/rs2lab/deleteutilizador/${ItemID}`)
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
          console.error("Erro ao exibir a caixa de diálogo:", err);
        });
    },
  },
};
</script>
