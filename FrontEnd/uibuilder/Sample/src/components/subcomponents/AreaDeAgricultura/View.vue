<template>
  <div>
    <div class="container-fluid mt-5">
      <router-link to="/" class="btn btn-secondary mb-3">
        <i class="fa fa-arrow-left" aria-hidden="true"></i> Voltar
      </router-link>
      <div class="card">
        <div class="card-header">
          <h4>
            Área de Agricultura
            <router-link
              to="/areadeagricultura/create"
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
                <th scope="col" class="col-2">Nome</th>
                <th scope="col" class="col-2">Localização</th>
                <th scope="col" class="col-1">Grupo</th>
                <th scope="col" class="col-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody v-if="paginatedItems.length > 0">
              <tr v-for="(item, index) in paginatedItems" :key="index">
                <td>{{ item.ID }}</td>
                <td>{{ item.Nome }}</td>
                <td>{{ item.Localizacao }}</td>
                <td>{{ item.Grupo_Nome }}</td>
                
                
                <td class="text-right">
                  <router-link
                    :to="{
                      path: '/areadeagricultura/' + item.ID + '/edit',
                    }"
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
              <td colspan="9">Carregando...</td>
            </tbody>
          </table>
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

    <!-- Modal for MAP Preview -->
    <!-- <b-modal
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
    </b-modal> -->
  </div>
</template>

<script>
module.exports = {
  name: "utilizador",
  data() {
    return {
      perPage: 8,
      currentPage: 1,
      items: [],
      //modalShow: false,
      //currentImage: "",
    };
  },
  mounted() {
    this.retriveItem();
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
    retriveItem() {
      axios
        .get("/rs2lab/areadeagricultura")
        .then((response) => {
          this.items = response.data;
        })
        .catch((error) => {
          console.error("Erro ao recuperar Área de Agricultura:", error);
        });
    },
    // showModal(image) {
    //   this.currentImage = `data:image/jpeg;base64,${image}`;
    //   this.modalShow = true;
    // },
    // formatGroups(groups) {
    //   return groups.map((group) => group.Nome).join(", ");
    // },
    ShowConfirmDelete(ItemID) {
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
          console.error("Erro ao exibir a caixa de diálogo:", err);
        });
    },
    deleteItem(ItemID) {
      axios
        .delete(`/rs2lab/deleteareadeagricultura/${ItemID}`)
        .then(() => {
          this.ShowDeleteNotification();
          this.retriveItem();
        })
        .catch((error) => {
          console.error("Erro ao deletar areadeagricultura:", error);
          this.$bvToast.toast("Ocorreu um erro ao excluir o item.", {
            title: "Erro",
            variant: "danger",
          });
        });
    },
    ShowDeleteNotification() {
      this.$bvToast.toast("Dados deletados com sucesso!", {
        title: "Sucesso",
        variant: "success",
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
</style>
