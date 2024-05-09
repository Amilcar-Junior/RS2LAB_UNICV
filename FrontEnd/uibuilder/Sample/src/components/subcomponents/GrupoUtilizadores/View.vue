<template>
  <div>
    <div class="card">
      <div class="card-header">
        <h4>
          Grupo Utilizadores
          <router-link
            to="/grupoutilizadores/create"
            class="btn btn-primary float-right"
          >
            Add Grupo Utilizadores
          </router-link>
        </h4>
      </div>
      <div class="card-body">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody v-if="this.items.length > 0">
            <tr v-for="(item, index) in this.items" :key="index">
              <td>{{ item.ID }}</td>
              <td>{{ item.Nome }}</td>
              <td class="text-right">
                <router-link
                  :to="{ path: '/grupoutilizadores/' + item.ID + '/edit' }"
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
  name: "grupoutilizadores",
  data() {
    return {
      perPage: 10,
      currentPage: 1,
      items: [],
      utilizadorGrupo: [],
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

    deleteItem(ItemID) {
      axios
        .get(`/rs2lab/utilizadorgrupo/grupoutilizadores/${ItemID}`)
        .then((res) => {
          this.utilizadorGrupo = res.data;
          let vm = this; // Armazena o "this" em uma variável
          console.log(this.utilizadorGrupo);
          let promises = []; // Array para armazenar as chamadas axios.delete
          this.utilizadorGrupo.forEach(function (utgrp) {
            console.log(utgrp.ID);
            promises.push(
              axios.delete(
                `/rs2lab/deleteutilizadorgrupo/grupoutilizadores/${utgrp.ID_Grupo}`
              )
            );
          });

          // Executa todas as chamadas axios.delete em paralelo
          Promise.all(promises).then(() => {
            axios
              .delete(`/rs2lab/deletegrupoutilizadores/${ItemID}`)
              .then(() => {
                console.log(ItemID)
                vm.ShowDeleteNotification(); // Usar a variável vm em vez de this
              })
              .catch((errors) => {
                console.error(errors);
                vm.$bvToast.toast("Ocorreu um erro ao excluir o item.", {
                  title: "Erro",
                  variant: "danger",
                });
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
