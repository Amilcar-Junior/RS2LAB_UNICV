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
          <router-link to="/tipoutilizador/create" class="btn btn-primary ml-2" v-show="keys.TipoUtilizador_Nome === userTypes.ADMINISTRATOR || keys.TipoUtilizador_Nome === userTypes.GESTOR ">
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
                <th scope="col" class="col-2 text-right" v-show="keys.TipoUtilizador_Nome === userTypes.ADMINISTRATOR || keys.TipoUtilizador_Nome === userTypes.GESTOR ">Actions</th>
              </tr>
            </thead>
            <tbody v-if="paginatedItems.length > 0">
              <tr v-for="(item, index) in paginatedItems" :key="index">
                <td class="col-1">{{ item.ID }}</td>
                <td class="col-3">{{ item.Nome }}</td>
                <td class="col-6">{{ item.Descricao }}</td>
                <td class="col-2 text-right" v-show="keys.TipoUtilizador_Nome === userTypes.ADMINISTRATOR || keys.TipoUtilizador_Nome === userTypes.GESTOR ">
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
  props: ["keys"],
  data() {
    return {
      perPage: 8,
      currentPage: 1,
      items: [],
      searchQuery: "", // Adicionado para rastrear a entrada de busca do usuário
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

<style scoped>
.table-responsive {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.table {
  margin-bottom: 0;
  width: 100%;
}

.table thead th {
  background-color: #2c3e50;
  color: white;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
  border-bottom: none;
  padding: 12px 15px;
  vertical-align: middle;
}

.table tbody tr {
  transition: all 0.2s ease;
}

.table tbody tr:hover {
  background-color: #f8f9fa;
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.table tbody tr:nth-child(even) {
  background-color: #f8f9fa;
}

.table tbody td {
  padding: 12px 15px;
  vertical-align: middle;
  border-top: 1px solid #e9ecef;
}

.card {
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.card-header {
  background-color: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-control {
  border-radius: 4px;
  border: 1px solid #ddd;
  transition: all 0.3s ease;
  padding: 8px 12px;
}

.form-control:focus {
  border-color: #2c3e50;
  box-shadow: 0 0 0 0.2rem rgba(44, 62, 80, 0.25);
}

.custom-pagination .page-item.active .page-link {
  background-color: #2c3e50;
  border-color: #2c3e50;
}

.custom-pagination .page-link {
  color: #2c3e50;
  padding: 8px 16px;
}

.btn {
  transition: all 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

@media (max-width: 768px) {
  .table-responsive {
    overflow-x: auto;
  }
  
  .card-header {
    flex-direction: column;
    gap: 10px;
  }
  
  .btn {
    margin-bottom: 5px;
  }
}
</style>
