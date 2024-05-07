<template>
  <div>
    <div class="card">
      <div class="card-header">
        <h4>
          Utilizador
          <router-link
            to="/utilizador/create"
            class="btn btn-primary float-right"
          >
            Add Utilizador
          </router-link>
        </h4>
      </div>
      <div class="card-body">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Senha</th>
              <th>Tipo Utilizador</th>
              <th>Grupos</th>
              <th>Ativo</th>
              <th>Avatar</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody v-if="this.items.length > 0">
            <tr v-for="(item, index) in this.items" :key="index">
              <td>{{ item.Utilizador_ID }}</td>
              <td>{{ item.Utilizador_Nome }}</td>
              <td>{{ item.Utilizador_Email }}</td>
              <td>{{ maskPassword(item.Utilizador_Senha) }}</td>
              <td>{{ item.TipoUtilizador_Nome }}</td>
              <td>{{ formatGroups(item.Grupos) }}</td>
              <td>
                <b-icon-check
                  v-if="item.Utilizador_isActive === 1"
                  variant="success"
                ></b-icon-check>
                <b-icon-x v-else variant="danger"></b-icon-x>
              </td>
              <td class="text-center">
                <img
                  v-if="item.Utilizador_Avatar"
                  :src="getObjectURL(item.Utilizador_Avatar.data)"
                  alt="Avatar"
                  style="max-width: 50px; max-height: 50px"
                />
                <img
                  v-else
                  src="./images/no-avatar.png"
                  alt="no-avatar"
                  class="logo-img"
                  style="max-width: 25px; max-height: 25px"
                />
              </td>
              <td class="text-right">
                <router-link
                  :to="{ path: '/utilizador/' + item.Utilizador_ID + '/edit' }"
                  class="btn btn-success"
                >
                  Edit
                </router-link>
                <button
                  type="button"
                  @click="ShowConfirmDelete(item.Utilizador_ID)"
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
  name: "utilizador",
  data() {
    return {
      perPage: 10,
      currentPage: 1,
      items: [],
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
        .get("/rs2lab/utilizador")
        .then((resp) => {
          console.log(resp);
          this.items = resp.data;
          console.log(this.items);
        })
        .catch((errors) => {
          console.error(errors);
        });
    },
    maskPassword(password) {
      if (!password) return "";
      return "*".repeat(password.length);
    },
    getObjectURL(buffer) {
      if (!Array.isArray(buffer)) {
        return "";
      }

      const uint8Array = new Uint8Array(buffer);
      const blob = new Blob([uint8Array], { type: "image/jpeg" });
      return URL.createObjectURL(blob);
    },
    formatGroups(groups) {
      if (!groups) return "";
      const parsedGroups = JSON.parse(groups);
      return parsedGroups.map((group) => group.Nome).join(", ");
    },

    deleteItem(ItemID) {
      console.log(ItemID);
      axios
        .delete(`/rs2lab/deleteutilizadorgrupo/utilizador/${ItemID}`) // Exclui os registros da tabela utilizadorgrupo associados ao usuário
        .then(() => {
          // Após excluir os registros da tabela utilizadorgrupo, exclui o usuário
          axios
            .delete(`/rs2lab/deleteutilizador/${ItemID}`)
            .then(() => {
              // Atualiza a lista após excluir o usuário
              this.retriveItem();
              this.ShowDeleteNotification();
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
          this.$bvToast.toast("Ocorreu um erro ao excluir o item.", {
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
