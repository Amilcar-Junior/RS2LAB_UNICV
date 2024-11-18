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
          <h4>Área de Agricultura</h4>
          <div>
            <input
              type="text"
              class="form-control d-inline-block w-auto"
              placeholder="Buscar por nome, ID, Grupo ou Localização..."
              v-model="searchQuery"
            />
            <router-link
              to="/areadeagricultura/create"
              class="btn btn-primary ml-2"
              v-show="keys.TipoUtilizador_Nome === userTypes.ADMINISTRATOR || keys.TipoUtilizador_Nome === userTypes.GESTOR"
            >
              <i class="fa fa-plus" aria-hidden="true"></i> Adicionar
            </router-link>
            <button
              class="btn btn-danger ml-2"
              @click="deleteSelectedItems"
              :disabled="selectedItems.length === 0"
            >
              <i class="fa fa-trash" aria-hidden="true"></i> Deletar Selecionados
            </button>
          </div>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th scope="col" class="col-1">
                    <input type="checkbox" @change="toggleSelectAll($event)" />
                  </th>
                  <th scope="col" class="col-1">ID</th>
                  <th scope="col" class="col-2">Nome</th>
                  <th scope="col" class="col-3">Sensores</th>
                  <th scope="col" class="col-1" v-show="keys.TipoUtilizador_Nome === userTypes.ADMINISTRATOR">Grupo</th>
                  <th scope="col" class="col-1">Localização</th>
                  <th scope="col" class="col-1">Mapa</th>
                  <th scope="col" class="col-2 text-right" v-show="keys.TipoUtilizador_Nome === userTypes.ADMINISTRATOR || keys.TipoUtilizador_Nome === userTypes.GESTOR">Ações</th>
                </tr>
              </thead>
              <tbody v-if="paginatedItems.length > 0">
                <tr v-for="(item, index) in paginatedItems" :key="index">
                  <td>
                    <input
                      type="checkbox"
                      :value="item.Area_ID"
                      v-model="selectedItems"
                    />
                  </td>
                  <td>{{ item.Area_ID }}</td>
                  <td>{{ item.Area_Nome }}</td>
                  <td>{{ formatSensores(item.Sensores) }}</td>
                  <td v-show="keys.TipoUtilizador_Nome === userTypes.ADMINISTRATOR"><span class="badge badge-primary m-1">{{ item.Grupo_Nome }}</span></td>
                  <td>{{ item.Local_Nome }}</td>
                  <td class="text-center">
                    <button
                      v-if="hasValidCoordinates(item.Area_Localizacao)"
                      class="btn btn-info btn-sm"
                      @click="showMap(item)"
                    >
                      <i class="fa fa-map" aria-hidden="true"></i> Mapa
                    </button>
                  </td>
                  <td
                    class="text-right"
                     v-show="keys.TipoUtilizador_Nome === userTypes.ADMINISTRATOR || keys.TipoUtilizador_Nome === userTypes.GESTOR"
                  >
                    <router-link
                      :to="{
                        path: '/areadeagricultura/' + item.Area_ID + '/edit',
                      }"
                      class="btn btn-success"
                    >
                      <i class="fa fa-pencil" aria-hidden="true"></i> Editar
                    </router-link>
                    <button
                      type="button"
                      @click="ShowConfirmDelete(item.Area_ID)"
                      class="btn btn-danger"
                    >
                      <i class="fa fa-trash" aria-hidden="true"></i> Deletar
                    </button>
                  </td>
                </tr>
              </tbody>
              <tbody v-else>
                <td colspan="8">Carregando...</td>
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
  name: "areaDeAgricultura",
  props: ["keys"],
  data() {
    return {
      items: [],
      selectedItems: [], // Para armazenar os IDs selecionados
      perPage: 10,
      currentPage: 1,
      mapModalShow: false,
      modalMap: null,
      selectedLocation: [],
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
      return this.items
        .filter((item) => {
          if (this.keys.TipoUtilizador_Nome === this.userTypes.ADMINISTRATOR) {
            return true;
          }
          const userGroupIds = this.keys.Grupos
            ? this.keys.Grupos.map((group) => group.ID)
            : [];
          return userGroupIds.includes(item.Grupo_ID);
        })
        .filter((item) => {
          return (
            item.Area_Nome.toLowerCase().includes(
              this.searchQuery.toLowerCase()
            ) ||
            item.Area_ID.toString().includes(this.searchQuery) ||
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
        .get("/rs2lab/areadeagricultura")
        .then((response) => {
          this.items = response.data;
        })
        .catch((error) => {
          console.error("Erro ao recuperar Área de Agricultura:", error);
        });
    },
    hasValidCoordinates(localizacao) {
      if (!localizacao) return false;
      const coordinates = localizacao.split("; ").map((coords) => {
        const [lat, lng] = coords.split(", ").map(Number);
        return !isNaN(lat) && !isNaN(lng);
      });
      return coordinates.length > 0 && coordinates.every((coord) => coord);
    },
    showMap(item) {
      if (
        item &&
        item.Area_Localizacao &&
        this.hasValidCoordinates(item.Area_Localizacao)
      ) {
        this.selectedLocation = item.Area_Localizacao.split("; ").map(
          (coords) => {
            const [lat, lng] = coords.split(", ").map(Number);
            return [lat, lng];
          }
        );
        this.locationName = item.Area_Nome; // Save the name for the popup
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

      const satellite = L.tileLayer(
        "https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
        {
          attribution: "Map data ©2023 Google",
          subdomains: ["mt0", "mt1", "mt2", "mt3"],
        }
      );

      const hybrid = L.tileLayer(
        "https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
        {
          attribution: "Map data ©2023 Google",
          subdomains: ["mt0", "mt1", "mt2", "mt3"],
        }
      );

      const terrain = L.tileLayer(
        "https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}",
        {
          attribution: "Map data ©2023 Google",
          subdomains: ["mt0", "mt1", "mt2", "mt3"],
        }
      );


      // Definir as opções de camadas de base
      this.baseMaps = {
        Streets: streets,
        Hybrid: hybrid,
        Satelite: satellite,
        Terrain: terrain,
      };

      this.modalMap = L.map("modalMap", {
        layers: [streets],
      });

      

      L.control.layers(this.baseMaps).addTo(this.modalMap);

      if (this.selectedLocation && this.selectedLocation.length > 0) {
        this.modalMap.fitBounds(this.selectedLocation);

        L.polygon(this.selectedLocation, {
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
    formatSensores(sensores) {
      return sensores.map((sensor) => sensor.Sensor_Nome).join(", ");
    },
    toggleSelectAll(event) {
      if (event.target.checked) {
        this.selectedItems = this.paginatedItems.map(item => item.Area_ID);
      } else {
        this.selectedItems = [];
      }
    },
    deleteSelectedItems() {
      this.$bvModal
        .msgBoxConfirm(
          `Deseja deletar os seguintes itens? ${this.selectedItems.join(", ")}`,
          {
            title: "Deletar Selecionados",
            size: "sm",
            buttonSize: "sm",
            okVariant: "danger",
            okTitle: "Sim",
            cancelTitle: "Não",
            footerClass: "p-2",
            hideHeaderClose: false,
            centered: true,
          }
        )
        .then((value) => {
          if (value) {
            // Faz a chamada para deletar cada item selecionado
            Promise.all(
              this.selectedItems.map((id) =>
                axios.delete(`/rs2lab/deleteareadeagricultura/${id}`)
              )
            )
              .then(() => {
                this.ShowDeleteNotification(
                  "Áreas de Agricultura deletadas com sucesso!",
                  "success",
                  "Sucesso"
                );
                this.selectedItems = [];
                this.retrieveItems();
              })
              .catch((error) => {
                console.error("Erro ao deletar Áreas de Agricultura:", error);
                this.ShowDeleteNotification(
                  "Erro ao Deletar Áreas de Agricultura.",
                  "danger",
                  "Erro"
                );
              });
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
          this.ShowDeleteNotification(
            "Área de Agricultura deletada com sucesso!",
            "success",
            "Sucesso"
          );
          this.retrieveItems();
        })
        .catch((error) => {
          console.error("Erro ao deletar área de agricultura:", error);
          this.ShowDeleteNotification(
            "Erro ao Deletar Área de Agricultura.",
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
        .msgBoxConfirm("Deseja deletar essa Área de Agricultura?", {
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
