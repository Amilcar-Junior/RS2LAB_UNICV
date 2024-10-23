<template>
  <div class="container-fluid mt-5">
    <router-link to="/areadeagricultura" class="btn btn-secondary mb-3">
      <i class="fa fa-arrow-left" aria-hidden="true"></i> Voltar
    </router-link>
    <div class="card">
      <div class="card-header">
        <h4>Editar Área de Agricultura</h4>
      </div>
      <div class="card-body">
        <div class="mb-3">
          <label for="nome" class="form-label">Nome</label>
          <input
            type="text"
            id="nome"
            v-model="model.item.Nome"
            class="form-control"
            required
          />
        </div>
        <div class="mb-3">
          <label for="id_Grupo" class="form-label">Grupo</label>
          <select v-model="model.item.Grupo_ID" class="form-control" required>
            <option disabled selected>Selecione o Grupo</option>
            <option
              v-for="grupo in filteredGrupos"
              :key="grupo.Grupo_ID"
              :value="grupo.Grupo_ID"
            >
              {{ grupo.Grupo_Nome }}
            </option>
          </select>
        </div>
        <div class="mb-3">
          <label for="localizacao" class="form-label">Localização</label>
          <div class="mb-3">
            <select
              v-model="model.item.Local_ID"
              @change="updateMapLocation"
              class="form-control"
            >
              <option disabled value="">Selecione uma localização</option>
              <option v-for="local in Local" :key="local.ID" :value="local.ID">
                {{ local.Nome }}
              </option>
            </select>
          </div>
          <div id="editMap" style="height: 500px"></div>
        </div>
        <div class="mb-3">
          <button
            type="button"
            @click="editAreaagricultura"
            class="btn btn-primary float-right"
          >
            <i class="fa fa-floppy-o" aria-hidden="true"></i> Salvar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
#editMap {
  height: 500px; /* Ensure the height is defined */
  width: 100%; /* Optionally set the width if necessary */
}
</style>

<script>
module.exports = {
  name: "editAreaagricultura",
  props: ["keys"],
  data() {
    return {
      model: {
        ID: "",
        item: {
          Nome: "",
          Localizacao: "",
          Grupo_ID: "",
          Local_ID: "",
          lat: 0,
          lng: 0,
        },
      },
      selectedLocal: "",
      Local: [],
      GrupoUtilizadores: [],
      editMap: null,
      drawnItems: new L.FeatureGroup(), // Initialize the drawnItems here
      baseMaps: null, // Base map layers
      userTypes: window.appConfig.userTypes,
    };
  },
  mounted() {
    this.model.ID = this.$route.params.ID;
    this.retrieveAreaDeAgricultura();
    this.getGrupos();
    this.getLocal();
    this.$nextTick(() => {
      setTimeout(() => {
        this.initMap();
      }, 500);
    });
  },
  computed: {
    filteredGrupos() {
      if (this.keys.TipoUtilizador_Nome === this.userTypes.ADMINISTRATOR) {
        return this.GrupoUtilizadores;
      } else {
        const userGroupIds = this.keys.Grupos ? this.keys.Grupos.map(group => group.ID) : [];
        return this.GrupoUtilizadores.filter(grupo => userGroupIds.includes(grupo.Grupo_ID));
      }
    },
  },
  methods: {
    retrieveAreaDeAgricultura() {
      axios
        .get(`/rs2lab/areadeagricultura/${this.model.ID}`)
        .then((response) => {
          console.log("Dados da área de agricultura:", response.data);
          this.model.item = response.data[0];
          this.selectedLocal = this.model.item.Local_ID; // Define selectedLocal
          this.updatePolygon();
          this.$nextTick(() => {
            setTimeout(() => {
              this.updateMapLocation(); // Chama para garantir que o mapa centralize no local correto
            }, 500);
          });
        })
        .catch((error) => {
          console.error(
            "Erro ao recuperar dados da área de agricultura:",
            error
          );
          this.showNotification(
            "Erro ao buscar dados das áreas de agricultura.",
            "danger", "Erro"
          );
        });
    },
    getGrupos() {
      axios
        .get("/rs2lab/grupoutilizadores")
        .then((response) => {
          console.log("Grupos de Utilizadores:", response.data);
          this.GrupoUtilizadores = response.data;
        })
        .catch((error) => {
          console.error("Erro ao buscar grupos:", error);
          this.showNotification(
            "Erro ao buscar dados dos grupos de utilizadores.",
            "danger", "Erro"
          );
        });
    },
    getLocal() {
      axios
        .get("/rs2lab/local")
        .then((response) => {
          console.log("Locais:", response.data);
          this.Local = response.data;
        })
        .catch((error) => {
          console.error("Erro ao buscar locais:", error);
          this.showNotification(
            "Erro ao buscar dados dos locais.",
            "danger", "Erro"
          );
        });
    },
    initMap() {
      // Definir diferentes tipos de camadas de mapa
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

      // Inicializar o mapa com a camada padrão (streets)
      this.editMap = L.map("editMap", {
        center: [0, 0],
        zoom: 1,
        layers: [streets],
      });

      // Definir as opções de camadas de base
      this.baseMaps = {
        Streets: streets,
        Hybrid: hybrid,
        Satellite: satellite,
        Terrain: terrain,
      };

      // Adicionar controle de camadas ao mapa
      L.control.layers(this.baseMaps).addTo(this.editMap);

      // Adicionar a camada de itens desenhados
      this.editMap.addLayer(this.drawnItems);

      // Adicionar o controle de desenho
      this.editMap.addControl(
        new L.Control.Draw({
          edit: { featureGroup: this.drawnItems },
          draw: {
            polygon: true,
            polyline: false,
            rectangle: false,
            circle: false,
            marker: false,
          },
        })
      );

      // Eventos de criação e edição de desenho
      this.editMap.on(L.Draw.Event.CREATED, (e) => {
        const layer = e.layer;
        this.drawnItems.addLayer(layer);
        this.updateLocalizacao();
      });

      this.editMap.on(L.Draw.Event.EDITED, (e) => {
        this.updateLocalizacao();
      });

      console.log("Mapa inicializado");
    },
    updatePolygon() {
      console.log(
        "Atualizando polígono com Localizacao:",
        this.model.item.Localizacao
      );
      if (
        !this.model.item.Localizacao ||
        this.model.item.Localizacao.trim() === ""
      ) {
        console.warn(
          "Localização não definida ou vazia para o item:",
          this.model.item
        );
        return;
      }

      const coordinates = this.model.item.Localizacao.split("; ")
        .map((coords) => {
          const [lat, lng] = coords.split(", ").map(Number);
          return lat && lng ? [lat, lng] : null;
        })
        .filter(Boolean);

      if (coordinates.length > 0) {
        const polygon = L.polygon(coordinates, { color: "red", weight: 4 });
        this.drawnItems.addLayer(polygon);
        console.log("Polígono atualizado:", polygon);
      } else {
        console.warn(
          "Nenhuma coordenada válida encontrada para Localizacao:",
          this.model.item.Localizacao
        );
      }
    },
    updateLocalizacao() {
      const layers = this.drawnItems.getLayers();
      const coords = layers
        .map((layer) => {
          const latlngs = layer.getLatLngs();
          if (latlngs.length > 0 && latlngs[0].length > 0) {
            return latlngs[0].map((ll) => `${ll.lat}, ${ll.lng}`).join("; ");
          }
          return "";
        })
        .join("; ");
      console.log("Localização atualizada:", coords);
      this.model.item.Localizacao = coords;
    },
    updateMapLocation() {
      console.log("Atualizando localização do mapa");

      // Tentar centralizar nas primeiras duas coordenadas de Localizacao
      if (this.model.item.Localizacao) {
        const coordsArray = this.model.item.Localizacao.split("; ").map(
          (coord) => coord.split(", ").map(Number)
        );
        if (
          coordsArray.length > 1 &&
          !isNaN(coordsArray[0][0]) &&
          !isNaN(coordsArray[0][1])
        ) {
          const latLng = [coordsArray[0][0], coordsArray[0][1]];
          this.editMap.setView(latLng, 13);
          console.log(
            "Mapa centralizado nas primeiras coordenadas da localização:",
            latLng
          );
          return;
        }
      }

      // Se não houver coordenadas válidas em Localizacao, tentar centralizar no Local
      const selectedLocation = this.Local.find(
        (loc) => loc.ID === this.model.item.Local_ID
      );
      if (selectedLocation) {
        const latLng = [selectedLocation.lat, selectedLocation.lng];
        if (latLng[0] && latLng[1]) {
          this.editMap.setView(latLng, 13);
          console.log("Mapa centralizado em:", latLng);
        }
      } else if (this.model.item.lat && this.model.item.lng) {
        const latLng = [this.model.item.lat, this.model.item.lng];
        this.editMap.setView(latLng, 13);
        console.log("Mapa centralizado em:", latLng);
      }
    },

    editAreaagricultura() {
      const payload = {
        Nome: this.model.item.Nome,
        Localizacao: this.model.item.Localizacao,
        ID_Grupo: this.model.item.Grupo_ID,
        ID_Local: this.model.item.Local_ID,
      };

      console.log("Enviando dados para atualização:", payload);

      axios
        .put(`/rs2lab/editareadeagricultura/${this.model.ID}`, payload)
        .then(() => {
          this.showNotification(
            "Área de Agricultura atualizado com sucesso!",
            "success", "Sucesso"
          );
          this.$router.push("/areadeagricultura");
        })
        .catch((error) => {
          console.error("Erro ao editar a área de agricultura:", error);
          this.showNotification(
            "Erro ao atualizar a área de agricultura.",
            "danger", "Erro"
          );
        });
    },
    showNotification(message, variant, title) {
      this.$bvToast.toast(message, {
        title: title,
        variant: variant,
        solid: true,
      });
    },
  },
};
</script>
