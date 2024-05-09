<template>
  <div>
    <div class="card">
      <div class="card-header">
        <h4>
          Tipo Utilizador
          <router-link
            to="/tipoutilizador/create"
            class="btn btn-primary float-right"
          >
            Add Tipo Utilizador
          </router-link>
        </h4>
      </div>
      <div class="card-body">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Descrição</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody v-if="this.items.length > 0">
            <tr v-for="(item, index) in this.items" :key="index">
              <td>{{ item.ID }}</td>
              <td>{{ item.Nome }}</td>
              <td>{{ item.Descricao }}</td>
              <td class="text-right">
                <router-link
                  :to="{ path: '/tipoutilizador/' + item.ID + '/edit' }"
                  class="btn btn-success"
                >
                  Edit
                </router-link>
                <button
                  type="button"
                  @click="ShowConfirmDelete(item.ID)"
                  class="btn btn-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <td colspan="4">Carregando...</td>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  name: "tipoutilizador",
  data() {
    return {
      perPage: 10,
      currentPage: 1,
      items: [],
      utilizador: [],
    };
  },
  mounted() {
    this.retriveItem();
  },
  computed: {
    rows() {
      return this.items.length;
    },
  },
  methods: {
    retriveItem() {
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
                axios
                  .delete(`/rs2lab/deletetipoutilizador/${ItemID}`)
                  .then(() => {
                    self.retriveItem(); // Usar a variável self em vez de this
                    self.ShowDeleteNotification(); // Usar a variável self em vez de this
                  })
                  .catch((errors) => {
                    console.error(errors);
                    self.$bvToast.toast("Ocorreu um erro ao excluir o item.", {
                      title: "Erro",
                      variant: "danger",
                    });
                  });
              })
              .catch((errors) => {
                console.error(errors);
                self.$bvToast.toast(
                  "Ocorreu um erro ao atualizar os utilizadores.",
                  {
                    title: "Erro",
                    variant: "danger",
                  }
                );
              });
          });
        })
        .catch((errors) => {
          console.error(errors);
          this.$bvToast.toast("Ocorreu um erro ao obter os utilizadores.", {
            title: "Erro",
            variant: "danger",
          });
        });
    },

    ShowDeleteNotification() {
      this.boxOne = "";
      this.$bvToast.toast("Dados removidos com sucesso!", {
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
