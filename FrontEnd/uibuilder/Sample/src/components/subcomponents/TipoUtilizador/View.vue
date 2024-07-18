<template>
  <div class="container-fluid mt-5">
    <router-link to="/" class="btn btn-secondary mb-3">
      <i class="fa fa-arrow-left" aria-hidden="true"></i> Voltar
    </router-link>
    <div class="card">
      <div
        class="card-header d-flex justify-content-between align-items-center"
      >
        <h4>Tipo Utilizador</h4>
        <div>
          <input
            type="text"
            class="form-control d-inline-block w-auto"
            placeholder="Buscar por ID ou Nome..."
            v-model="searchQuery"
          />
          <router-link to="/tipoutilizador/create" class="btn btn-primary ml-2">
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
                <th scope="col" class="col-6">Descrição</th>
                <th scope="col" class="col-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody v-if="paginatedItems.length > 0">
              <tr v-for="(item, index) in paginatedItems" :key="index">
                <td class="col-1">{{ item.ID }}</td>
                <td class="col-3">{{ item.Nome }}</td>
                <td class="col-6">{{ item.Descricao }}</td>
                <td class="col-2 text-right">
                  <router-link
                    :to="{ path: '/tipoutilizador/' + item.ID + '/edit' }"
                    class="btn btn-success"
                  >
                    <i class="fa fa-pencil" aria-hidden="true"></i>
                    Editar
                  </router-link>
                  <button
                    type="button"
                    @click="ShowConfirmDelete(item.ID)"
                    class="btn btn-danger"
                  >
                    <i class="fa fa-trash" aria-hidden="true"></i>
                    Deletar
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
            aria-controls="utilizadores-table"
            class="custom-pagination"
          ></b-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  name: "tipoutilizador",
  data() {
    return {
      perPage: 8,
      currentPage: 1,
      items: [],
      searchQuery: "", // Adicionado para rastrear a entrada de busca do usuário
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
      const searchLower = this.searchQuery.toLowerCase();
      return this.items.filter((item) => {
        const matchesID = item.ID.toString().includes(searchLower);
        const matchesName = item.Nome.toLowerCase().includes(searchLower);
        return matchesID || matchesName;
      });
    },
    paginatedItems() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.filteredItems.slice(start, end);
    },
  },
  methods: {
    retrieveItems() {
      axios
        .get("/rs2lab/tipoutilizador")
        .then((resp) => {
          console.log(resp);
          this.items = resp.data;
          console.log(this.items);
        })
        .catch((errors) => {
          console.error(errors);
        });
    },
    deleteItem(ItemID) {
      axios
        .get(`/rs2lab/utilizador/tipoutilizador/${ItemID}`)
        .then((res) => {
          this.utilizador = res.data;
          // console.log(this.utilizador);

          // Renomear as variáveis e ajustar o objeto
          let self = this; // Armazena o "this" em uma variável

          this.utilizador.forEach(function (user) {
            user.Nome = user.Utilizador_Nome;
            user.Senha = user.Utilizador_Senha;
            user.Email = user.Utilizador_Email;
            user.isActive = user.Utilizador_isActive;
            user.Avatar = user.Utilizador_Avatar;
            user.ID_TipoUtilizador = null;

            // console.log("Utilizador: ", user);

            // Atualizar os utilizadores
            axios
              .put(`/rs2lab/editutilizador/${user.Utilizador_ID}`, user)
              .then((resp) => {
                // console.log("PUT: ", resp);
              })
              .catch((errors) => {
                console.error(errors);
                this.ShowDeleteNotification(
                  "Erro ao Atualizar Tipo de Utilizador do Utilizador.",
                  "danger",
                  "Erro"
                );
              });
          });
        })
        .catch((errors) => {
          console.error(errors);
          this.ShowDeleteNotification(
            "Erro ao Obter dados do Utilizador.",
            "danger","Erro"
          );
        });
      axios
        .delete(`/rs2lab/deletetipoutilizador/${ItemID}`)
        .then(() => {
          this.ShowDeleteNotification(
            "Tipo Utilizador deletados com sucesso!",
            "success",
            "Sucesso"
          );
          this.retrieveItems();
        })
        .catch((errors) => {
          console.error(errors);
          this.ShowDeleteNotification(
            "Erro ao Deletar Tipo Utilizador.",
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
      this.boxTwo = "";
      this.$bvModal
        .msgBoxConfirm("Deseja deletar esse Tipo de Utilizador?", {
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
          // Verifica se o usuário clicou em "Sim" antes de excluir
          if (value) {
            this.deleteItem(ItemID);
          }
        })
        .catch((err) => {
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
