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
          <h4>Mapa</h4>
          <div>
            <select
              v-model="selectedAreaId"
              @change="zoomToArea"
              class="form-control d-inline-block w-auto"
            >
              <option value="" disabled selected>
                Selecione a Área de Agricultura
              </option>
              <option
                v-for="area in filteredAreas"
                :key="area.Area_ID"
                :value="area.Area_ID"
              >
                {{ area.Area_Nome }}
              </option>
            </select>
            <select
              v-model="selectedSensorId"
              @change="zoomToSensor"
              class="form-control d-inline-block w-auto ml-2"
            >
              <option value="" disabled selected>Selecione um Sensor</option>
              <option
                v-for="sensor in filteredSensors"
                :key="sensor.ID"
                :value="sensor.ID"
              >
                {{ sensor.Nome }}
              </option>
            </select>
          </div>
        </div>
        <div class="card-body">
          <div id="map" style="height: 500px"></div>
        </div>
      </div>
      <div class="row mt-3">
        <div
          v-for="sensor in filteredSensors"
          :key="sensor.ID"
          class="col-md-4" v-if="sensor.ValorSensor_IsActivable == 0"
        >
          <div class="card sensor-card mb-3 text-center">
            <div class="card-header text-center">
              <h5 class="card-title">{{ sensor.Nome }}</h5>
            </div>
            <div class="card-body">
              <img
                v-if="sensor.TipoSensor_Icon"
                :src="'data:image/png;base64,' + sensor.TipoSensor_Icon"
                alt="Sensor Icon"
                class="sensor-icon my-3"
              />
              <i v-else class="fa fa-microchip fa-4x my-3"></i>
              <!-- Ícone padrão quando TipoSensor_Icon for null -->
              <p class="sensor-value">{{ sensor.ValorSensor_Valor }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  name: "MapaAreaDeAgricultura",
  props: ["keys"],
  data() {
    return {
      items: [],
      allSensores: [],
      baseMaps: null, // Base map layers
      map: null,
      selectedSensorId: null,
      selectedAreaId: null,
      markers: null, // Marker cluster group
      client: null,
      userTypes: window.appConfig.userTypes,
      mqttConfig: window.appConfig.mqtt,
    };
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.initMap();
        if (this.map) {
          this.map.invalidateSize();
          this.retrieveItems();
          this.retrieveSensores();
          this.connectMQTT(); // Conecta ao broker MQTT
        }
      }, 500);
    });
  },
  computed: {
    filteredAreas() {
      if (this.keys.TipoUtilizador_Nome === this.userTypes.ADMINISTRATOR) {
        return this.items;
      }
      const userGroupIds = this.keys.Grupos ? this.keys.Grupos.map(group => group.ID) : [];
      return this.items.filter(area => userGroupIds.includes(area.Grupo_ID));
    },
    filteredSensors() {
      const filteredAreas = this.filteredAreas.map(area => area.Area_ID);
      if (this.keys.TipoUtilizador_Nome === this.userTypes.ADMINISTRATOR) {
        if (!this.selectedAreaId) return this.allSensores;
        return this.allSensores.filter(sensor => sensor.area_ID === this.selectedAreaId);
      }
      if (!this.selectedAreaId) {
        return this.allSensores.filter(sensor => filteredAreas.includes(sensor.area_ID));
      }
      return this.allSensores.filter(sensor => sensor.area_ID === this.selectedAreaId && filteredAreas.includes(sensor.area_ID));
    },
  },
  watch: {
    filteredAreas(newVal) {
      this.clearMap();
      this.addAreasToMap();
      this.addSensorsToMap();
    },
    filteredSensors(newVal) {
      this.clearMap();
      this.addSensorsToMap();
      this.addAreasToMap();
    }
  },
  methods: {
    retrieveItems() {
      axios
        .get("/rs2lab/areadeagricultura")
        .then((response) => {
          this.items = response.data;
          console.log("Dados recuperados:", response);
          this.addAreasToMap();
        })
        .catch((error) => {
          console.error("Erro ao recuperar Área de Agricultura:", error);
        });
    },
    retrieveSensores() {
      axios
        .get("/rs2lab/sensor")
        .then((response) => {
          this.allSensores = response.data.map((sensor) => ({
            ...sensor,
            ValorSensor_Valor: sensor.ValorSensor_Valor || 0, // Inicializa com 0 se não houver valor
          }));
          console.log("Sensores recuperados:", response);
          this.addSensorsToMap();
        })
        .catch((error) => {
          console.error("Erro ao recuperar Sensor:", error);
        });
    },
    initMap() {
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

      this.map = L.map("map", {
        center: [0, 0],
        zoom: 3,
        layers: [streets],
      });

  

      L.control.layers(this.baseMaps).addTo(this.map);

      // Initialize the marker cluster group
      this.markers = L.markerClusterGroup();
      this.map.addLayer(this.markers); // Ensure the cluster group is added to the map
      // console.log("Mapa inicializado");
    },
    clearMap() {
      if (this.markers) {
        this.markers.clearLayers();
      }
    },
    addAreasToMap() {
      if (!this.map || !this.markers) {
        console.error("Mapa ou marcadores não estão inicializados.");
        return;
      }

      this.filteredAreas.forEach((item) => {
        // Adiciona polígono da área de agricultura
        if (this.hasValidCoordinates(item.Area_Localizacao)) {
          const areaCoords = item.Area_Localizacao.split("; ").map((coords) => {
            const [lat, lng] = coords.split(", ").map(Number);
            return [lat, lng];
          });

          const polygon = L.polygon(areaCoords, {
            color: "lightblue", // Adjust color to be lighter
            weight: 2,
            opacity: 0.8,
            fillOpacity: 0.2
          }).bindPopup(
            `<b>${item.Area_Nome}</b>`
          );

          polygon.addTo(this.map);

          // Create an invisible marker in the center of the polygon
          const center = polygon.getBounds().getCenter();
          const invisibleMarker = L.marker(center, { opacity: 0 }).bindPopup(
            `<b>${item.Area_Nome}</b>`
          );

          this.markers.addLayer(invisibleMarker);
        }
      });
    },
    addSensorsToMap() {
      this.filteredSensors.forEach((sensor) => {
        if (this.hasValidCoordinates(sensor.coordenada)) {
          const sensorCoords = sensor.coordenada.split(",").map(Number);

          const iconUrl = sensor.TipoSensor_Icon
            ? `data:image/png;base64,${sensor.TipoSensor_Icon}`
            : null;

          const customIcon = iconUrl
            ? L.icon({
                iconUrl: iconUrl,
                iconSize: [32, 32], // Ajusta o tamanho do ícone conforme necessário
                iconAnchor: [16, 32], // Ajusta o ponto de ancoragem conforme necessário
              })
            : L.icon({
                iconUrl: L.Icon.Default.imagePath + "/marker-icon.png",
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41],
              });

          const marker = L.marker(sensorCoords, { icon: customIcon }).bindPopup(
            `<b>${sensor.Nome}</b><br>Tipo: ${sensor.TipoSensor_Nome}<br>Valor: ${sensor.ValorSensor_Valor}`
          );

          this.markers.addLayer(marker); // Add marker to the cluster group
        }
      });

      this.map.addLayer(this.markers); // Ensure the cluster group is added to the map
    },
    zoomToArea() {
      const selectedArea = this.items.find(
        (area) => area.Area_ID === this.selectedAreaId
      );
      if (
        selectedArea &&
        this.hasValidCoordinates(selectedArea.Area_Localizacao)
      ) {
        const coordsArray = selectedArea.Area_Localizacao.split("; ").map(
          (coord) => coord.split(", ").map(Number)
        );
        if (
          coordsArray.length > 1 &&
          !isNaN(coordsArray[0][0]) &&
          !isNaN(coordsArray[0][1])
        ) {
          const latLng = [coordsArray[0][0], coordsArray[0][1]];
          this.map.setView(latLng, 20);
          // console.log(
          //   "Mapa centralizado nas primeiras coordenadas da localização:",
          //   latLng
          // );
        } else {
          // console.error("Coordenadas inválidas na localização selecionada.");
        }
      } else {
        // console.error(
        //   "Erro: Localização não definida ou inválida para a área selecionada."
        // );
      }
    },
    zoomToSensor() {
      const selectedSensor = this.allSensores.find(
        (sensor) => sensor.ID === this.selectedSensorId
      );
      if (
        selectedSensor &&
        this.hasValidCoordinates(selectedSensor.coordenada)
      ) {
        const sensorCoords = selectedSensor.coordenada.split(",").map(Number);
        this.map.setView(sensorCoords, 20);
        // console.log(
        //   "Mapa centralizado nas coordenadas do sensor:",
        //   sensorCoords
        // );
      } else {
        // console.error(
        //   "Erro: Coordenada não definida ou inválida para o sensor selecionado."
        // );
      }
    },
    connectMQTT() {
      this.client = new Paho.Client(
        this.mqttConfig.brokerUrl,
        Number(this.mqttConfig.port),
        this.mqttConfig.clientId
      );

      this.client.onConnectionLost = (responseObject) => {
        // console.log("Connection Lost: " + responseObject.errorMessage);
        // Reconnect
        this.reconnect();
      };

      this.client.onMessageArrived = (message) => {
        let newValue = Number(message.payloadString).toFixed(2);
        let itemToUpdate = this.allSensores.find(
          (item) => item.ValorSensor_Topico === message.destinationName
        );
        if (itemToUpdate) {
          itemToUpdate.ValorSensor_Valor = newValue;
          this.updateSensorOnMap(itemToUpdate);
        }
      };

      this.client.connect({
        onSuccess: () => {
          // console.log("Conectado ao broker MQTT");
          this.allSensores.forEach((sensor) => {
            if (sensor.ValorSensor_Topico) {
              this.client.subscribe(sensor.ValorSensor_Topico);
            }
          });
        },
        onFailure: (message) => {
          // console.log("Falha na conexão: " + message.errorMessage);
        },
        userName: "",
        password: "",
        keepAliveInterval: 15,
        timeout: 15000,
        useSSL: false,
      });
    },
    reconnect() {
      setTimeout(() => {
        if (this.client && !this.client.isConnected()) {
          this.client.connect({
            onSuccess: () => {
              this.allSensores.forEach((sensor) => {
                if (sensor.ValorSensor_Topico) {
                  this.client.subscribe(sensor.ValorSensor_Topico);
                }
              });
            },
            onFailure: (message) => {
              // console.log("Falha na reconexão: " + message.errorMessage);
            },
          });
        }
      }, 5000); // Tenta reconectar após 5 segundos
    },
    updateSensorOnMap(sensor) {
      // Encontra o marcador correspondente no mapa e atualiza o popup com o novo valor
      this.markers.eachLayer((layer) => {
        if (
          layer.getLatLng().lat ===
            parseFloat(sensor.coordenada.split(",")[0]) &&
          layer.getLatLng().lng === parseFloat(sensor.coordenada.split(",")[1])
        ) {
          layer.bindPopup(
            `<b>${sensor.Nome}</b><br>Tipo: ${sensor.TipoSensor_Nome}<br>Valor: ${sensor.ValorSensor_Valor}`
          );
        }
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
  },
};
</script>

<style scoped>
#map {
  height: 500px; /* Assegura que a altura está definida */
  width: 100%; /* Opcionalmente, define a largura, se necessário */
}
.sensor-icon {
  width: 64px;
  height: 64px;
  display: block;
  margin: 0 auto;
}
.sensor-card .card-title {
  font-size: 1.25rem;
}
.sensor-card .sensor-value {
  font-size: 2rem;
  font-weight: bold;
}
</style>
