<template>
  <div class="container-fluid mt-5">
    <router-link to="/" class="btn btn-secondary mb-3">
      <i class="fa fa-arrow-left" aria-hidden="true"></i> Voltar
    </router-link>
    <div class="card">
      <div
        class="card-header d-flex justify-content-between align-items-center"
      >
        <h4>Local</h4>
        <div>
          <input
            type="text"
            class="form-control d-inline-block w-auto"
            placeholder="Buscar por nome, ID, Grupo ou Localização..."
            v-model="searchQuery"
          />
          <router-link to="/local/create" class="btn btn-primary ml-2" v-show="keys.TipoUtilizador_Nome === userTypes.ADMINISTRATOR || keys.TipoUtilizador_Nome === userTypes.GESTOR ">
            <i class="fa fa-plus" aria-hidden="true" ></i> Adicionar
          </router-link>
        </div>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th scope="col" class="col-1">ID</th>
                <th scope="col" class="col-4">Nome</th>
                <th scope="col" class="col-2">lat</th>
                <th scope="col" class="col-2">lng</th>
                <th scope="col" class="col-1">Mapa</th>
                <th scope="col" class="col-2 text-right" v-show="keys.TipoUtilizador_Nome === userTypes.ADMINISTRATOR || keys.TipoUtilizador_Nome === userTypes.GESTOR ">Ações</th>
              </tr>
            </thead>
            <tbody v-if="paginatedItems.length > 0">
              <tr v-for="(item, index) in paginatedItems" :key="index">
                <td>{{ item.ID }}</td>
                <td>{{ item.Nome }}</td>
                <td>{{ item.lat }}</td>
                <td>{{ item.lng }}</td>
                <td  class="text-center">
                  <button
                    v-if="hasValidCoordinates(item.lat, item.lng)"
                    class="btn btn-info btn-sm"
                    @click="showMap(item)"
                  >
                    <i class="fa fa-map" aria-hidden="true"></i> Mapa
                  </button>
                </td>
                <td class="text-right" v-show="keys.TipoUtilizador_Nome === userTypes.ADMINISTRATOR || keys.TipoUtilizador_Nome === userTypes.GESTOR ">
                  <router-link
                    :to="{ path: '/local/' + item.ID + '/edit' }"
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
              <td colspan="6">Carregando...</td>
            </tbody>
          </table>
        </div>
        <div class="d-flex justify-content-center">
          <b-pagination
            v-if="totalPages > 1"
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            aria-controls="local-table"
            class="custom-pagination"
          ></b-pagination>
        </div>
      </div>
    </div>

    <!-- Modal for Map Preview -->
    <b-modal
      id="map-preview-modal"
      v-model="mapModalShow"
      title="Localização no Mapa"
      hide-footer
      centered
      @shown="initModalMap"
    >
      <div id="modalMap" style="height: 300px"></div>
    </b-modal>
  </div>
</template>

<script>
module.exports = {
  name: "Local",
  props: ["keys"],
  data() {
    return {
      items: [],
      perPage: 10,
      currentPage: 1,
      mapModalShow: false,
      modalMap: null,
      selectedLocation: null,
      searchQuery: "",
      baseMaps: null, // Base map layers
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
      return this.items.filter((item) => {
        return (
          item.Nome.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          item.ID.toString().includes(this.searchQuery) ||
          (item.Grupo_Nome &&
            item.Grupo_Nome.toLowerCase().includes(
              this.searchQuery.toLowerCase()
            )) ||
          (item.Local_Nome &&
            item.Local_Nome.toLowerCase().includes(
              this.searchQuery.toLowerCase()
            ))
        );
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
        .get("/rs2lab/local")
        .then((response) => {
          this.items = response.data;
        })
        .catch((error) => {
          console.error("Erro ao recuperar os Locais:", error);
        });
    },
    hasValidCoordinates(lat, lng) {
      return !isNaN(lat) && !isNaN(lng);
    },
    showMap(item) {
      if (this.hasValidCoordinates(item.lat, item.lng)) {
        this.selectedLocation = [item.lat, item.lng];
        this.locationName = item.Nome; // Save the name for the popup
        this.mapModalShow = true;
        this.$nextTick(() => {
          this.initModalMap();
        });
      } else {
        console.error(
          "Erro: Localização não definida ou inválida para o item:",
          item
        );
      }
    },
    initModalMap() {
      if (this.modalMap) {
        this.modalMap.remove();
      }

      const streets = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution: "© OpenStreetMap contributors",
        }
      );

      const hybrid = L.tileLayer(
        "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
        {
          attribution: "© OpenTopoMap contributors",
        }
      );

      const satellite = L.tileLayer(
        "https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
        {
          attribution: "Map data ©2023 Google",
          subdomains: ["mt0", "mt1", "mt2", "mt3"],
        }
      );

      const terrain = L.tileLayer(
        "https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}",
        {
          attribution: "©2023 Google",
          subdomains: ["mt0", "mt1", "mt2", "mt3"],
        }
      );

      this.modalMap = L.map("modalMap", {
        layers: [streets],
        zoom: 15,
      });

      this.baseMaps = {
        Streets: streets,
        Satellite: satellite,
        Hibrido: hybrid,
        Terreno: terrain,
      };

      L.control.layers(this.baseMaps).addTo(this.modalMap);

      if (this.selectedLocation) {
        this.modalMap.setView(this.selectedLocation, this.modalMap.zoom);

        L.marker(this.selectedLocation, {
          color: "blue",
        })
          .addTo(this.modalMap)
          .bindPopup(this.locationName)
          .openPopup();
      } else {
        console.error(
          "Erro: Localização selecionada é inválida ou não está definida."
        );
      }

      this.modalMap.invalidateSize();
    },
    
    deleteItem(ItemID) {
      axios
        .delete(`/rs2lab/deletelocal/${ItemID}`)
        .then(() => {
          this.ShowDeleteNotification(
            "Local deletado com sucesso!",
            "success", "Sucesso"
          );
          this.retrieveItems();
        })
        .catch((error) => {
          console.error("Erro ao deletar o local:", error);
          this.ShowDeleteNotification(
            "Erro ao Deletar Local.",
            "danger","Erro"
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
        .msgBoxConfirm("Deseja deletar esse Local?", {
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

<style scoped>
.logo-img {
  width: 25px;
  height: auto;
}
</style>
