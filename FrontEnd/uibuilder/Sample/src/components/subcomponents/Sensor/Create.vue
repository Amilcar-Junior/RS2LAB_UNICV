<template>
  <div class="container-fluid mt-5">
    <router-link to="/sensor" class="btn btn-secondary mb-3">
      <i class="fa fa-arrow-left" aria-hidden="true"></i> Voltar
    </router-link>
    <div class="card">
      <div class="card-header">
        <h4>Adicionar Sensor / Atuador</h4>
      </div>
      <div class="card-body">
        <form @submit.prevent="addSensor">
          <div class="mb-3">
            <label for="nome" class="form-label">Nome</label>
            <input
              type="text"
              id="nome"
              v-model="model.item.Nome"
              class="form-control"
              placeholder="Insira o nome do Sensor / Atuador"
              required
            />
          </div>
          <div class="mb-3">
            <label for="id_grupo" class="form-label">Tipo Sensor / Atuador</label>
            <select v-model="model.item.ID_TipoSensor" class="form-control" required>
              <option value="" disabled selected>Selecione o Tipo Sensor / Atuador</option>
              <option
                v-for="tipo in TipoSensor"
                :key="tipo.ID"
                :value="tipo.ID"
              >
                {{ tipo.Nome }}
              </option>
            </select>
          </div>
          
          <div class="mb-3">
            <label for="id_grupo" class="form-label">Tópico Sensor / Atuador</label>
            <select v-model="model.item.ID_ValorSensor" class="form-control">
              <option value="" selected>Selecione o Tópico Sensor / Atuador</option>
              <option
                v-for="topico in ValorSensor"
                :key="topico.ID"
                :value="topico.ID"
              >
                {{ topico.Topico }}
              </option>
            </select>
          </div>
          <div class="mb-3">
            <label for="id_grupo" class="form-label">Tópico Principal ( Atuadores )</label>
            <select v-model="model.item.ID_ValorSensor_Principal" class="form-control">
              <option value="" selected>Selecione o Topico Principal</option>
              <option
                v-for="topico in ValorSensor_Principal"
                :key="topico.ID"
                :value="topico.ID"
              >
                {{ topico.Topico }}
              </option>
            </select>
          </div>
          <div class="mb-3">
            <label for="localizacao" class="form-label">Área de Agricultura</label>
            <div class="mb-3">
              <select
                id="localizacao"
                v-model="model.item.area_ID"
                @change="zoomToLocal"
                class="form-control"
              >
                <option disabled value="">Selecione uma Área de Agricultura</option>
                <option
                  v-for="area in filteredAreas"
                  :key="area.Area_ID"
                  :value="area.Area_ID"
                >
                  {{ area.Area_Nome }}
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
  height: 500px; /* Assegure que a altura está definida */
  width: 100%; /* Opcionalmente, defina a largura, se necessário */
}
</style>

<script>
module.exports = {
  name: "CreateSensor",
  props: ["keys"],
  data() {
    return {
      model: {
        item: {
          Nome: "",
          area_ID: "",
          ID_TipoSensor: "",
          ID_ValorSensor: "",
          ID_ValorSensor_Principal: "",
          coordenada: "",
        },
      },
      AreadeAgricultura: [],
      TipoSensor: [],
      ValorSensor: [],
      ValorSensor_Principal: [],
      map: null,
      drawnItems: new L.FeatureGroup(), // Initialize drawnItems
      baseMaps: null, // Adicionado baseMaps para camadas de mapa
      userTypes: window.appConfig.userTypes,
    };
  },
  mounted() {
    this.getAreadeAgricultura();
    this.getTipoSensor();
    this.getValorSensor();
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
    filteredAreas() {
      if (this.keys.TipoUtilizador_Nome === this.userTypes.ADMINISTRATOR) {
        return this.AreadeAgricultura;
      } else {
        const userGroupIds = this.keys.Grupos ? this.keys.Grupos.map(group => group.ID) : [];
        return this.AreadeAgricultura.filter(area => userGroupIds.includes(area.Grupo_ID));
      }
    },
  },
  methods: {
    initMap() {
      // Definir diferentes tipos de camadas de mapa
      const streets = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      });

      const hybrid = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenTopoMap contributors",
      });

      const satellite = L.tileLayer("https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}", {
        attribution: "Map data ©2023 Google",
        subdomains: ["mt0", "mt1", "mt2", "mt3"]
      });

      const terrain = L.tileLayer("https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}", {
        attribution: "Map data ©2023 Google",
        subdomains: ["mt0", "mt1", "mt2", "mt3"]
      });

      // Inicializar o mapa com a camada padrão (streets)
      this.map = L.map("map", {
        center: [0, 0],
        zoom: 2,
        layers: [streets],
      });

      // Definir as opções de camadas de base
      this.baseMaps = {
        "Streets": streets,
        "Satellite": satellite,
        "Hibrido": hybrid,
        "Terreno": terrain,
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
            polygon: false,
            polyline: false,
            rectangle: false,
            circle: false,
            marker: true,
          },
        })
      );

      // Eventos de criação e edição de desenho
      this.map.on(L.Draw.Event.CREATED, (e) => {
        const layer = e.layer;
        this.drawnItems.clearLayers(); // Clear existing layers
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
          const latlng = layer.getLatLng();
          return `${latlng.lat}, ${latlng.lng}`;
        })
        .join("; ");
      this.model.item.coordenada = coords;
    },
    zoomToLocal() {
      const selectedLocation = this.AreadeAgricultura.find(loc => loc.Area_ID === this.model.item.area_ID);
      if (selectedLocation) {
        const coordinates = selectedLocation.Area_Localizacao.split(";").map(coord => coord.split(",").map(Number));
        if (coordinates.length > 0) {
          const firstTwoCoordinates = coordinates.slice(0, 2);
          const latLng = firstTwoCoordinates[0];
          const polygon = L.polygon(coordinates, { color: "red", weight: 4 });
          this.drawnItems.clearLayers(); // Limpa qualquer desenho anterior
          this.drawnItems.addLayer(polygon);
          this.map.setView(latLng, 20);
          this.model.item.coordenada = firstTwoCoordinates.map(coord => coord.join(",")).join("; ");
        }
      }
    },
    addSensor() {
      axios
        .post("/rs2lab/addsensor", this.model.item)
        .then(() => {
          this.showNotification(
            "Sensor / Atuador adicionado com sucesso!",
            "success", "Sucesso"
          );
          this.cleanForm();
        })
        .catch((error) => {
          console.error("Erro ao adicionar o Sensor / Atuador:", error);
          this.showNotification("Erro ao adicionar o Sensor / Atuador.", "danger", "Erro");
        });
    },
    getAreadeAgricultura() {
      axios
        .get("/rs2lab/areadeagricultura")
        .then((response) => {
          this.AreadeAgricultura = response.data;
          console.log("Área:", response)
        })
        .catch((error) => {
          console.error("Erro ao buscar Área de Agricultura:", error);
          this.showNotification(
            "Erro ao buscar dados das Áreas de Agricultura.",
            "danger", "Erro"
          );
        });
    },
    getTipoSensor() {
      axios
        .get("/rs2lab/tiposensor")
        .then((response) => {
          console.log(response)
          this.TipoSensor = response.data;
        })
        .catch((error) => {
          console.error("Erro ao buscar dados locais:", error);
          this.showNotification(
            "Erro ao buscar dados dos locais.",
            "danger", "Erro"
          );
        });
    },
    getValorSensor() {
      axios
        .get("/rs2lab/valorsensor")
        .then((response) => {
          console.log(response)
          this.ValorSensor = response.data;
          this.ValorSensor_Principal = response.data;
        })
        .catch((error) => {
          console.error("Erro ao buscar dados dos Tópicos:", error);
          this.showNotification(
            "Erro ao buscar dados dos Tópicos.",
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
    cleanForm() {
      this.model.item.Nome = "";
      this.model.item.area_ID = "";
      this.model.item.ID_TipoSensor = "";
      this.model.item.ID_ValorSensor = "";
      this.model.item.ID_ValorSensor_Principal = "";
      this.model.item.coordenada = "";
      this.model.item.map = null;
      this.drawnItems.clearLayers();
    },
  },
};
</script>
