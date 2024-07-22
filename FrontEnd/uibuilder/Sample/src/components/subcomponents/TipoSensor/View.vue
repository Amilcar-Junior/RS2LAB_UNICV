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
          <h4>Tipo Sensor</h4>
          <div>
            <input
              type="text"
              class="form-control d-inline-block w-auto"
              placeholder="Buscar por nome ou ID..."
              v-model="searchQuery"
            />
            <router-link to="/tiposensor/create" class="btn btn-primary ml-2" v-show="keys.TipoUtilizador_Nome === userTypes.ADMINISTRATOR || keys.TipoUtilizador_Nome === userTypes.GESTOR ">
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
                  <th scope="col" class="col-7">Nome</th>
                  <th scope="col" class="col-2">Icon</th>
                  <th scope="col" class="col-2 text-right" v-show="keys.TipoUtilizador_Nome === userTypes.ADMINISTRATOR || keys.TipoUtilizador_Nome === userTypes.GESTOR ">Actions</th>
                </tr>
              </thead>
              <tbody v-if="paginatedItems.length > 0">
                <tr v-for="(item, index) in paginatedItems" :key="index">
                  <td>{{ item.ID }}</td>
                  <td>{{ item.Nome }}</td>
                  <td class="text-center" v-show="keys.TipoUtilizador_Nome === userTypes.ADMINISTRATOR || keys.TipoUtilizador_Nome === userTypes.GESTOR ">
                    <button
                      v-if="item.icon"
                      @click="showModal(item.icon)"
                      class="btn btn-sm btn-info"
                    >
                      <i class="fa fa-picture-o" aria-hidden="true"></i> Ver
                    </button>
                    <i
                      v-else
                      class="fa fa-map-marker"
                      aria-hidden="true"
                      style="font-size: 1.8rem"
                    ></i>
                  </td>
                  <td class="text-right">
                    <router-link
                      :to="{ path: '/tiposensor/' + item.ID + '/edit' }"
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
                <td colspan="3">Carregando...</td>
              </tbody>
            </table>
          </div>
          <div class="d-flex justify-content-center">
            <b-pagination
              v-if="totalPages > 1"
              v-model="currentPage"
              :total-rows="totalRows"
              :per-page="perPage"
              aria-controls="tiposensor-table"
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
      title="Icon"
      hide-footer
      centered
    >
      <div class="d-flex justify-content-center">
        <img
          :src="currentIcon"
          alt="Icon"
          style="max-width: 100%; height: auto"
        />
      </div>
    </b-modal>
  </div>
</template>

<script>
module.exports = {
  name: "tiposensor",
  props: ["keys"],
  data() {
    return {
      perPage: 8,
      currentPage: 1,
      items: [],
      modalShow: false,
      searchQuery: "",
      currentIcon: "",
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
          item.Nome.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          item.ID.toString().includes(this.searchQuery)
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
        .get("/rs2lab/tiposensor")
        .then((response) => {
          this.items = response.data;
          console.log(response);
        })
        .catch((error) => {
          console.error("Erro ao recuperar tipos de sensor", error);
        });
    },
    deleteItem(ItemID) {
      axios
        .get(`/rs2lab/sensor/tiposensor/${ItemID}`)
        .then((res) => {
          this.sensor = res.data;
          console.log(this.sensor);
          // Renomear as variáveis e ajustar o objeto
          let self = this; // Armazena o "this" em uma variável
          this.sensor.forEach(function (sens) {
            sens.Nome = sens.Sensor_Nome;
            sens.area_ID = sens.Area_ID;
            sens.coordenada = sens.Sensor_Coordenada;
            sens.isActive = sens.Utilizador_isActive;
            sens.ID_ValorSensor = sens.ValorSensor_ID;
            sens.ID_TipoSensor = null;

            console.log("Sensor: ", sens);
            axios
              .put(`/rs2lab/editsensor/${sens.Sensor_ID}`, sens)
              .then((resp) => {
                console.log("PUT: ", resp);
              })
              .catch((errors) => {
                console.error(errors);
                this.ShowDeleteNotification(
                  "Erro ao Deletar Tipo de Sensor do Sensor.",
                  "danger",
                  "Erro"
                );
              });
          });
        })
        .catch((errors) => {
          console.error(errors);
          this.ShowDeleteNotification(
            "Erro ao Obter dados Do Sensor.",
            "danger",
            "Erro"
          );
        });
      axios
        .delete(`/rs2lab/deletetiposensor/${ItemID}`)
        .then(() => {
          this.ShowDeleteNotification(
            "Tipo Sensor deletado com sucesso!",
            "success",
            "Sucesso"
          );
          this.retriveItem();
        })
        .catch((error) => {
          console.error("Erro ao Deletar o tipo de sensor", error);
          this.ShowDeleteNotification(
            "Erro ao Deletar Tipo Sensor.",
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
        .msgBoxConfirm("Deseja deletar esse Tipo de Sensor?", {
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
    showModal(icon) {
      this.currentIcon = `data:image/jpeg;base64,${icon}`;
      this.modalShow = true;
    },
  },
};
</script>
