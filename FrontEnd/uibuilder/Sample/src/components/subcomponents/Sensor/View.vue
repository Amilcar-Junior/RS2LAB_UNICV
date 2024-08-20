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
          <h4>Sensor / Atuador</h4>
          <div>
            <input
              type="text"
              class="form-control d-inline-block w-auto"
              placeholder="Buscar por nome, ID, Grupo ou Localização..."
              v-model="searchQuery"
            />
            <router-link to="/sensor/create" class="btn btn-primary ml-2" v-show="keys.TipoUtilizador_Nome === userTypes.ADMINISTRATOR || keys.TipoUtilizador_Nome === userTypes.GESTOR ">
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
                  <th scope="col" class="col-2">Tipo Sensor / Atuador</th>
                  <th scope="col" class="col-2">Tópico</th>
                  <th scope="col" class="col-2">Ativavel</th>
                  <th scope="col" class="col-2">Grupo</th>
                  <th scope="col" class="col-2">Area</th>
                  <th scope="col" class="col-1">Mapa</th>
                  <th scope="col" class="col-2 text-right" v-show="keys.TipoUtilizador_Nome === userTypes.ADMINISTRATOR || keys.TipoUtilizador_Nome === userTypes.GESTOR ">Ações</th>
                </tr>
              </thead>
              <tbody v-if="paginatedItems.length > 0">
                <tr v-for="(item, index) in paginatedItems" :key="index">
                  <td>{{ item.ID }}</td>
                  <td>{{ item.Nome }}</td>
                  <td>{{ item.TipoSensor_Nome }}</td>
                  <td>{{ item.ValorSensor_Topico }}</td>
                  <td>{{ item.ValorSensor_IsActivable ? "Sim" : "Não" }}</td>
                  <td>{{ item.Grupo_Nome }}</td>
                  <td>{{ item.Area_Nome }}</td>
                  <td  class="text-center">
                    <button
                      v-if="hasValidCoordinates(item.coordenada)"
                      class="btn btn-info btn-sm"
                      @click="showMap(item)"
                    >
                      <i class="fa fa-map" aria-hidden="true"></i> Mapa
                    </button>
                  </td>
                  <td class="text-right" v-show="keys.TipoUtilizador_Nome === userTypes.ADMINISTRATOR || keys.TipoUtilizador_Nome === userTypes.GESTOR ">
                    <router-link
                      :to="{ path: '/sensor/' + item.ID + '/edit' }"
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
              aria-controls="utilizadores-table"
              class="custom-pagination"
            ></b-pagination>
          </div>
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
  name: "sensor",
  props: ["keys"],
  data() {
    return {
      items: [],
      perPage: 10,
      currentPage: 1,
      mapModalShow: false,
      modalMap: null,
      selectedCoordenada: [],
      searchQuery: "",
      baseMaps: null, // Base map layers
      iconBase64: "", // Store the icon base64 string
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
      return this.items
        .filter(item => {
          if (this.keys.TipoUtilizador_Nome === this.userTypes.ADMINISTRATOR) {
            return true;
          }
          const userGroupIds = this.keys.Grupos ? this.keys.Grupos.map(group => group.ID) : [];
          return userGroupIds.includes(item.Grupo_ID);
        })
        .filter(item => {
          return (
            item.Nome.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            item.ID.toString().includes(this.searchQuery) ||
            (item.Area_Nome &&
              item.Area_Nome.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
            (item.TipoSensor_Nome &&
              item.TipoSensor_Nome.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
            (item.Grupo_Nome &&
              item.Grupo_Nome.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
            (item.ValorSensor_Topico &&
              item.ValorSensor_Topico.toLowerCase().includes(this.searchQuery.toLowerCase()))
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
        .get("/rs2lab/sensor")
        .then((response) => {
          this.items = response.data;
          console.log(response);
        })
        .catch((error) => {
          console.error("Erro ao recuperar Sensor / Atuador:", error);
        });
    },
    hasValidCoordinates(coordenada) {
      if (!coordenada) return false;
      const coordinates = coordenada
        .split(",")
        .map((coord) => parseFloat(coord.trim()));
      return (
        coordinates.length === 2 && coordinates.every((coord) => !isNaN(coord))
      );
    },
    showMap(item) {
      if (
        item &&
        item.coordenada &&
        this.hasValidCoordinates(item.coordenada)
      ) {
        this.selectedCoordenada = item.coordenada
          .split(",")
          .map((coord) => parseFloat(coord.trim()));
        this.iconBase64 = item.TipoSensor_Icon || ""; // Store the base64 icon string, default to empty string if null
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

      if (this.selectedCoordenada && this.selectedCoordenada.length === 2) {
        const latLng = this.selectedCoordenada;

        let customIcon = L.icon({
          iconUrl: `data:image/png;base64,${this.iconBase64}`,
          iconSize: [32, 32], // Define o tamanho do ícone
          iconAnchor: [16, 32], // Define o ponto do ícone que será ancorado no ponto do mapa
        });

        // Use the default Leaflet icon if iconBase64 is empty
        if (!this.iconBase64) {
          customIcon = L.icon({
            iconUrl: L.Icon.Default.prototype._getIconUrl("icon"), // Default Leaflet icon
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          });
        }

        L.marker(latLng, { icon: customIcon })
          .addTo(this.modalMap)
          .bindPopup(this.locationName)
          .openPopup();

        this.modalMap.setView(latLng, this.modalMap.zoom);
      } else {
        console.error(
          "Erro: Coordenada selecionada é inválida ou não está definida."
        );
      }

      this.modalMap.invalidateSize();
    },
    
    deleteItem(ItemID) {
      axios
        .delete(`/rs2lab/deletesensor/${ItemID}`)
        .then(() => {
          this.ShowDeleteNotification(
            "Sensor / Atuador deletado com sucesso!",
            "success", "Sucesso"
          );
          this.retrieveItems();
        })
        .catch((error) => {
          console.error("Erro ao deletar Sensor / Atuador:", error);
          this.ShowDeleteNotification(
            "Erro ao Deletar Sensor / Atuador.",
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
        .msgBoxConfirm("Deseja deletar esse Sensor / Atuador?", {
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
