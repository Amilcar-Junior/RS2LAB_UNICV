<template>
  <div class="container-fluid mt-5">
    <router-link to="/sensor" class="btn btn-secondary mb-3">
      <i class="fa fa-arrow-left" aria-hidden="true"></i> Voltar
    </router-link>
    <div class="card">
      <div class="card-header">
        <h4>Editar Sensor / Atuador</h4>
      </div>
      <div class="card-body">
        <form @submit.prevent="editSensor">
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
            <label for="id_tiposensor" class="form-label">Tipo Sensor / Atuador</label>
            <select
              v-model="model.item.ID_TipoSensor"
              class="form-control"
              required
            >
              <option value="" disabled selected>
                Selecione o Tipo Sensor / Atuador
              </option>
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
            <label for="id_tiposensor" class="form-label">Topico Sensor / Atuador</label>
            <select
              v-model="model.item.ID_ValorSensor"
              class="form-control"
              required
            >
              <option value="" disabled selected>
                Selecione o Topico do Sensor / Atuador
              </option>
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
            <label for="area" class="form-label">Área de Agricultura</label>
            <div class="mb-3">
              <select
                id="area"
                v-model="model.item.area_ID"
                @change="zoomToLocal"
                class="form-control"
              >
                <option disabled value="">
                  Selecione uma Área de Agricultura
                </option>
                <option
                  v-for="area in filteredAreas"
                  :key="area.Area_ID"
                  :value="area.Area_ID"
                >
                  {{ area.Area_Nome }}
                </option>
              </select>
            </div>
            <div id="editMap" style="height: 500px"></div>
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
#editMap {
  height: 500px; /* Assegure que a altura está definida */
  width: 100%; /* Opcionalmente, defina a largura, se necessário */
}
</style>

<script>
module.exports = {
  name: "EditSensor",
  props: ["keys"],
  data() {
    return {
      model: {
        ID: "",
        item: {
          Nome: "",
          area_ID: "",
          ID_TipoSensor: "",
          ID_ValorSensor: "",
          coordenada: "",
          TipoSensor_Icon: "", // Adicionado para ícone do Sensor / Atuador
        },
      },
      AreadeAgricultura: [],
      TipoSensor: [],
      ValorSensor: [],
      map: null,
      drawnItems: new L.FeatureGroup(), // Initialize drawnItems
      selectedAreadeAgricultura: "",
      baseMaps: null, // Adicionado baseMaps para camadas de mapa
      userTypes: window.appConfig.userTypes,
    };
  },
  mounted() {
    this.model.ID = this.$route.params.ID;
    this.retrieveSensor();
    this.getAreadeAgricultura();
    this.getTipoSensor();
    this.getValorSensor();
    this.$nextTick(() => {
      setTimeout(() => {
        this.initMap();
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
    retrieveSensor() {
      axios
        .get(`/rs2lab/sensor/${this.model.ID}`)
        .then((response) => {
          console.log("Dados do Sensor / Atuador:", response.data);
          this.model.item = response.data[0];
          this.$nextTick(() => {
            setTimeout(() => {
              this.updateMarker();
              this.zoomToLocation();
            }, 500);
          });
        })
        .catch((error) => {
          console.error("Erro ao recuperar dados do Sensor / Atuador:", error);
          this.showNotification(
            "Erro ao recuperar dados do Sensor / Atuador.",
            "danger",
            "Erro"
          );
        });
    },
    getAreadeAgricultura() {
      axios
        .get("/rs2lab/areadeagricultura")
        .then((response) => {
          this.AreadeAgricultura = response.data;
        })
        .catch((error) => {
          console.error("Erro ao buscar áreas de agricultura:", error);
          this.showNotification(
            "Erro ao buscar dados das Áreas de Agricultura.",
            "danger",
            "Erro"
          );
        });
    },
    getTipoSensor() {
      axios
        .get("/rs2lab/tiposensor")
        .then((response) => {
          this.TipoSensor = response.data;
        })
        .catch((error) => {
          console.error("Erro ao buscar tipos de Sensores / Atuadores:", error);
          this.showNotification(
            "Erro ao buscar dados dos Tipos de Sensores / Atuadores.",
            "danger",
            "Erro"
          );
        });
    },
    getValorSensor() {
      axios
        .get("/rs2lab/valorsensor")
        .then((response) => {
          this.ValorSensor = response.data;
        })
        .catch((error) => {
          console.error("Erro ao buscar topicos de Sensor / Atuador:", error);
          this.showNotification(
            "Erro ao buscar dados dos Topicos.",
            "danger",
            "Erro"
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
          attribution: "Map data ©2023 Google",
          subdomains: ["mt0", "mt1", "mt2", "mt3"],
        }
      );

      // Inicializar o mapa com a camada padrão (streets)
      this.map = L.map("editMap", {
        center: [0, 0],
        zoom: 2,
        layers: [streets],
      });

      // Definir as opções de camadas de base
      this.baseMaps = {
        Streets: streets,
        Satellite: satellite,
        Hibrido: hybrid,
        Terreno: terrain,
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

      console.log("Mapa inicializado");
    },
    updateMarker() {
      if (this.model.item.coordenada) {
        const coordsArray = this.model.item.coordenada.split(",").map(Number);
        if (coordsArray.length === 2) {
          const latLng = coordsArray;
          console.log("Atualizando marcador para coordenadas:", latLng);
          const markerIcon = L.icon({
            iconUrl: `data:image/png;base64,${this.model.item.TipoSensor_Icon}`,
            iconSize: [25, 41], // Ajuste conforme necessário
            iconAnchor: [12, 41], // Ajuste conforme necessário
          });
          const marker = L.marker(latLng, { icon: markerIcon });
          this.drawnItems.clearLayers(); // Clear existing layers
          this.drawnItems.addLayer(marker);
          console.log("Marcador atualizado no mapa.");
          if (this.map) {
            this.map.setView(latLng, 13);
            console.log("Mapa centralizado nas coordenadas do Sensor / Atuador:", latLng);
          } else {
            console.warn("Mapa não está inicializado.");
          }
          return;
        }
      }
      console.warn("Coordenada do Sensor / Atuador não está disponível ou é inválida.");
    },
    updateLocationField() {
      const layers = this.drawnItems.getLayers();
      const coords = layers
        .map((layer) => {
          const latlng = layer.getLatLng();
          return `${latlng.lat}, ${latlng.lng}`;
        })
        .join("; ");
      console.log("Localização atualizada:", coords);
      this.model.item.coordenada = coords;
    },
    zoomToLocal() {
      const selectedLocation = this.AreadeAgricultura.find(
        (loc) => loc.Area_ID === this.model.item.area_ID
      );
      if (selectedLocation && selectedLocation.Area_Localizacao) {
        const coordinates = selectedLocation.Area_Localizacao.split(";").map(
          (coord) => coord.split(",").map(Number)
        );
        if (coordinates.length > 0) {
          const firstTwoCoordinates = coordinates.slice(0, 2);
          const latLng = [firstTwoCoordinates[0][0], firstTwoCoordinates[0][1]];
          console.log(
            "Centralizando o mapa nas coordenadas da área de agricultura:",
            latLng
          );
          if (this.map) {
            this.map.setView(latLng, 13);
          } else {
            console.warn("Mapa não está inicializado.");
          }
        } else {
          console.warn("A área de agricultura não tem coordenadas válidas.");
        }
      } else {
        console.warn(
          "Localização da área de agricultura não está disponível ou é inválida."
        );
      }
    },
    zoomToLocation() {
      if (this.model.item.coordenada) {
        const coordsArray = this.model.item.coordenada.split(",").map(Number);
        if (coordsArray.length === 2) {
          const latLng = coordsArray;
          console.log(
            "Centralizando o mapa nas coordenadas do Sensor / Atuador:",
            latLng
          );
          if (this.map) {
            this.map.setView(latLng, 13);
          } else {
            console.warn("Mapa não está inicializado.");
          }
          return;
        }
      }
      console.warn(
        "Coordenada do Sensor / Atuador não está disponível ou é inválida. Tentando área de agricultura."
      );
      this.zoomToLocal(); // Se não houver coordenadas do Sensor / Atuador, zoom na área de agricultura
    },
    editSensor() {
      const payload = {
        Nome: this.model.item.Nome,
        area_ID: this.model.item.area_ID,
        ID_TipoSensor: this.model.item.ID_TipoSensor,
        coordenada: this.model.item.coordenada,
        ID_ValorSensor: this.model.item.ID_ValorSensor,
      };
      console.log("Enviando dados para atualização:", payload);

      axios
        .put(`/rs2lab/editsensor/${this.model.ID}`, payload)
        .then(() => {
          this.showNotification(
            "Sensor / Atuador atualizado com sucesso!",
            "success",
            "Atualização"
          );
          this.$router.push("/sensor");
        })
        .catch((error) => {
          console.error("Erro ao editar o Sensor / Atuador:", error);
          this.showNotification(
            "Erro ao atualizar o Sensor / Atuador.",
            "danger",
            "Erro"
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
