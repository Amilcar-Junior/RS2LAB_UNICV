<template>
  <div class="container-fluid mt-5">
    <router-link to="/areadeagricultura" class="btn btn-secondary mb-3">
      <i class="fa fa-arrow-left" aria-hidden="true"></i> Voltar
    </router-link>
    <div class="card">
      <div class="card-header">
        <h4>Adicionar Área de Agricultura</h4>
      </div>
      <div class="card-body">
        <form @submit.prevent="addAreadeagricultura">
          <div class="mb-3">
            <label for="nome" class="form-label">Nome</label>
            <input
              type="text"
              id="nome"
              v-model="model.item.Nome"
              class="form-control"
              placeholder="Insira o nome da Área"
              required
            />
          </div>
          <div class="mb-3">
            <label for="id_grupo" class="form-label">Grupo</label>
            <select v-model="model.item.ID_Grupo" class="form-control" required>
              <option value="" disabled selected>Selecione o Grupo</option>
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
                id="localizacao"
                v-model="selectedLocal"
                @change="zoomToLocal"
                class="form-control"
              >
                <option disabled value="">Selecione um Local</option>
                <option
                  v-for="local in Local"
                  :key="local.ID"
                  :value="local.ID"
                >
                  {{ local.Nome }}
                </option>
              </select>
            </div>
            <div id="map" style="height: 500px"></div>
          </div>

          <div class="mb-3">
            <button type="submit" class="btn btn-primary float-right">
              <i class="fa fa-floppy-o" aria-hidden="true"></i> Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style>
#map {
  height: 300px; /* Assegure que a altura está definida */
  width: 100%; /* Opcionalmente, defina a largura, se necessário */
}
</style>

<script>
module.exports = {
  name: "CreateAreadeAgricultura",
  props: ["keys"],
  data() {
    return {
      model: {
        item: {
          Nome: "",
          Localizacao: "",
          ID_Grupo: "",
          ID_Local: "", // Adicionado ID_Local
        },
      },
      GrupoUtilizadores: [],
      Local: [],
      map: null,
      drawnItems: new L.FeatureGroup(), // Initialize drawnItems
      selectedLocal: "",
      baseMaps: null, // Adicionado baseMaps para camadas de mapa
      userTypes: window.appConfig.userTypes,
    };
  },
  mounted() {
    this.getGrupos();
    this.getLocal();
    this.$nextTick(() => {
      setTimeout(() => {
        this.initMap();
        if (this.map) {
          this.map.invalidateSize();
        }
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
      this.map = L.map("map", {
        center: [0, 0],
        zoom: 1,
        layers: [streets],
      });

      // Definir as opções de camadas de base
      this.baseMaps = {
        Streets: streets,
        Hybrid: hybrid,
        Satelite: satellite,
        Terrain: terrain,
      };

      // Adicionar controle de camadas ao mapa
      L.control.layers(this.baseMaps).addTo(this.map);

      // Adicionar a camada de itens desenhados
      this.map.addLayer(this.drawnItems);

      // Adicionar o controle de desenho
      this.map.addControl(
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
      this.map.on(L.Draw.Event.CREATED, (e) => {
        const layer = e.layer;
        // Limpar os polígonos existentes
        this.drawnItems.clearLayers();
        this.drawnItems.addLayer(layer);
        this.updateLocationField();
      });

      this.map.on(L.Draw.Event.EDITED, (e) => {
        this.updateLocationField();
      });
    },

    updateLocationField() {
      const layers = this.drawnItems.getLayers();
      const coords = layers
        .map((layer) => {
          const latlngs = layer.getLatLngs()[0];
          return latlngs.map((ll) => `${ll.lat}, ${ll.lng}`).join("; ");
        })
        .join("; ");
      this.model.item.Localizacao = coords;
    },
    zoomToLocal() {
      const selectedLocation = this.Local.find(
        (loc) => loc.ID === this.selectedLocal
      );
      if (selectedLocation) {
        const latLng = [selectedLocation.lat, selectedLocation.lng];
        this.map.setView(latLng, 13);
        this.model.item.ID_Local = selectedLocation.ID; // Define ID_Local
      }
    },
    addAreadeagricultura() {
      axios
        .post("/rs2lab/addareadeagricultura", this.model.item)
        .then(() => {
          this.showNotification(
            "Área de Agricultura adicionada com sucesso!",
            "success","Sucesso"
          );
          this.cleanForm();
        })
        .catch((error) => {
          console.error("Erro ao adicionar a área de agricultura:", error);
          this.showNotification(
            "Erro ao adicionar a Área de Agricultura.",
            "danger","Erro"
          );
        });
    },
    cleanForm() {
      this.model.item.Nome = "";
      this.model.item.Localizacao = "";
      this.model.item.ID_Grupo = "";
      this.model.item.ID_Local = "";
      this.selectedLocal = "";
      this.drawnItems.clearLayers();
    },
    getGrupos() {
      axios
        .get("/rs2lab/grupoutilizadores")
        .then((response) => {
          this.GrupoUtilizadores = response.data;
        })
        .catch((error) => {
          console.error("Erro ao buscar grupos de utilizadores:", error);
          this.showNotification(
            "Erro ao buscar dados dos grupos de utilizadores.",
            "danger","Erro"
          );
        });
    },
    getLocal() {
      axios
        .get("/rs2lab/local")
        .then((response) => {
          this.Local = response.data;
        })
        .catch((error) => {
          console.error("Erro ao buscar dados locais:", error);
          this.showNotification(
            "Erro ao buscar dados dos locais.",
            "danger","Erro"
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
