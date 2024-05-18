<template>
  <div class="container-fluid mt-5">
    <router-link to="/" class="btn btn-secondary mb-3">
      <i class="fa fa-arrow-left" aria-hidden="true"></i> Voltar
    </router-link>
    <div class="card">
      <div class="card-header">
        <h4>
          Grupo Utilizadores
          <router-link
            to="/grupoutilizadores/create"
            class="btn btn-primary float-right"
          >
            <i class="fa fa-plus" aria-hidden="true"></i> Adicionar
          </router-link>
        </h4>
      </div>
      <div class="card-body">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th scope="col" class="col-1">ID</th>
              <th scope="col" class="col-4">Nome</th>
              <th scope="col" class="col-5">Utilizadores</th>
              <th scope="col" class="col-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody v-if="this.items.length > 0">
            <tr v-for="(item, index) in paginatedItems" :key="index">
              <td>{{ item.Grupo_ID }}</td>
              <td>{{ item.Grupo_Nome }}</td>
              <td>{{ formatUtilizadores(item.Utilizadores) }}</td>
              <td class="text-right">
                <router-link
                  :to="{ path: '/grupoutilizadores/' + item.Grupo_ID + '/edit' }"
                  class="btn btn-success"
                >
                  <i class="fa fa-pencil" aria-hidden="true"></i>
                  Editar
                </router-link>
                <button
                  type="button"
                  @click="ShowConfirmDelete(item.Grupo_ID)"
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
  data() {
    return {
      perPage: 8,
      currentPage: 1,
      items: [],
    };
  },
  mounted() {
    this.retrieveItems();
  },
  computed: {
    totalRows() {
      return this.items.length;
    },
    totalPages() {
      return Math.ceil(this.totalRows / this.perPage);
    },
    paginatedItems() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.items.slice(start, end);
    },
  },
  methods: {
    retrieveItems() {
      axios
        .get("/rs2lab/grupoutilizadores")
        .then((resp) => {
          console.log(resp);
          this.items = resp.data;
          console.log(this.items);
        })
        .catch((errors) => {
          console.error(errors);
        });
    },
    formatUtilizadores(utilizadores) {
      if (!utilizadores || !Array.isArray(utilizadores)) return "";
      return utilizadores.map((utilizadores) => utilizadores.Nome).join(", ");
    },

    deleteItem(ItemID) {
      axios
        .delete(
          `/rs2lab/deleteutilizadorgrupo/grupoutilizadores/${ItemID}`
        )
        .then(() => {
          axios
            .delete(`/rs2lab/deletegrupoutilizadores/${ItemID}`)
            .then(() => {
              console.log(ItemID);
              this.ShowDeleteNotification(); // Usar a variável vm em vez de this
            })
            .catch((errors) => {
              console.error(errors);
              this.$bvToast.toast("Ocorreu um erro ao excluir o item.", {
                title: "Erro",
                variant: "danger",
              });
            });
        })
        .catch((errors) => {
          console.error(errors);
          this.$bvToast.toast(
            "Ocorreu um erro ao obter os grupos de utilizadores.",
            {
              title: "Erro",
              variant: "danger",
            }
          );
        });
    },

    ShowDeleteNotification() {
      this.boxOne = "";
      this.$bvToast.toast("Dados deletados com sucesso!", {
        title: "Sucesso",
        variant: "success",
      });
      this.retriveItem();
    },
    ShowConfirmDelete(ItemID) {
      this.boxTwo = "";
      this.$bvModal
        .msgBoxConfirm("Deseja deletar esses dados?", {
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
