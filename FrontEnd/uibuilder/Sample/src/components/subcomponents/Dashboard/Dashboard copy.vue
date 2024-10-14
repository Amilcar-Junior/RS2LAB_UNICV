<template>
  <div class="container-fluid mt-5">
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h4>Sensores</h4>
        <div>
          <select v-model="selectedAreaId" class="form-control d-inline-block w-auto">
            <option value="" disabled selected>
              Selecione a Área de Agricultura
            </option>
            <option v-for="area in filteredAreas" :key="area.Area_ID" :value="area.Area_ID">
              {{ area.Area_Nome }}
            </option>
          </select>
          <select v-model="selectedSensorId" class="form-control d-inline-block w-auto ml-2">
            <option value="" disabled selected>Selecione um Sensor</option>
            <option v-for="sensor in filteredSensors" :key="sensor.ID" :value="sensor.ID">
              {{ sensor.Nome }}
            </option>
          </select>
        </div>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th scope="col" class="col-1">ID</th>
                <th scope="col" class="col-3">Nome</th>
                <th scope="col" class="col-3">Area</th>
                <th scope="col" class="col-3">Grupo</th>
                <th scope="col" class="col-2">Tipo Sensor</th>
                <th scope="col" class="col-2">Tópico</th>
                <th scope="col" class="col-2">Ativavel</th>
                <th scope="col" class="col-1">Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in paginatedItems" :key="index">
                <td>{{ item.ID }}</td>
                <td>{{ item.Nome }}</td>
                <td>{{ item.Area_Nome }}</td>
                <td>{{ item.Grupo_Nome }}</td>
                <td>{{ item.TipoSensor_Nome }}</td>
                <td>{{ item.ValorSensor_Topico }}</td>
                <td>{{ item.ValorSensor_IsActivable }}</td>
                <td>{{ item.ValorSensor_Valor }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="d-flex justify-content-center">
          <b-pagination
            v-if="filteredSensors.length > perPage"
            v-model="currentPage"
            :total-rows="filteredSensors.length"
            :per-page="perPage"
            aria-controls="my-table"
            class="custom-pagination"
          ></b-pagination>
        </div>
        <div class="row mt-3">
          <div v-for="sensor in filteredSensors" :key="sensor.ID" class="col-md-4">
            <div class="card sensor-card mb-3 text-center">
              <div class="card-header text-center">
                <h5>{{ sensor.Nome }}</h5>
              </div>
              <div class="card-body">
                <canvas :ref="'chart-' + sensor.ID" height="210"></canvas>
                <p class="sensor-value">{{ sensor.ValorSensor_Valor }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<!-- sensor ou ativador
 
  enviar payload com id: e com stats: 
  
  topico
  ai4afs/node/cmd/unicv
  
  -->


<script>
module.exports = {
  props: ["keys"],
  data() {
    return {
      perPage: 10,
      currentPage: 1,
      items: [],
      allSensores: [],
      client: undefined,
      selectedSensorId: null,
      selectedAreaId: null,
      charts: {}, // Armazena os gráficos de cada sensor
      isMonitoring: false, // Flag para monitoramento
      MAX_POINTS: 20, // Número máximo de pontos no gráfico
      userTypes: window.appConfig.userTypes,
      mqttConfig: window.appConfig.mqtt,
    };
  },
  mounted() {
    if (typeof Chart === "undefined") {
      console.error("Chart.js não foi carregado corretamente!");
    } else {
      this.retrieveItems();
      this.retrieveSensores();
      this.monitor();
    }
  },
  watch: {
    filteredSensors() {
      this.recreateCharts();
    }
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
      if (this.keys.TipoUtilizador_Nome === this.userTypes.ADMINISTRATOR) {
        if (!this.selectedAreaId) return this.allSensores;
        return this.allSensores.filter(sensor => sensor.area_ID === this.selectedAreaId);
      }
      const userGroupIds = this.keys.Grupos ? this.keys.Grupos.map(group => group.ID) : [];
      const areas = this.items.filter(area => userGroupIds.includes(area.Grupo_ID)).map(area => area.Area_ID);
      if (!this.selectedAreaId) {
        return this.allSensores.filter(sensor => areas.includes(sensor.area_ID));
      }
      return this.allSensores.filter(sensor => sensor.area_ID === this.selectedAreaId && areas.includes(sensor.area_ID));
    },
    paginatedItems() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.filteredSensors.slice(start, end);
    },
  },
  methods: {
    retrieveItems() {
      axios
        .get("/rs2lab/areadeagricultura")
        .then((response) => {
          this.items = response.data;
          console.log("Dados recuperados:", response);
        })
        .catch((error) => {
          console.error("Erro ao recuperar Área de Agricultura:", error);
        });
    },
    retrieveSensores() {
      axios
        .get("/rs2lab/sensor")
        .then((resp) => {
          console.log("sensores:", resp)
          this.allSensores = resp.data.map((sensor) => {
            return {
              ...sensor,
              ValorSensor_Valor: sensor.ValorSensor_Valor || 0, // Inicializa com 0 se não houver valor
            };
          });
          this.$nextTick(() => {
            this.allSensores.forEach((sensor) => {
              this.createChart(sensor);
            });
          });
        })
        .catch((errors) => {
          console.error(errors);
        });
    },
    createChart(sensor) {
      console.log("Sensor:", sensor);
      if (!sensor.ID) {
        console.error("ID do sensor não está definido:", sensor);
        return;
      }

      this.$nextTick(() => {
        console.log("Refs:", this.$refs);
        const canvasArray = this.$refs["chart-" + sensor.ID];
        if (canvasArray) {
          console.log(
            "CanvasArray encontrado para sensor ID",
            sensor.ID,
            ":",
            canvasArray
          );
        }
        if (canvasArray && canvasArray.length > 0) {
          const canvas = canvasArray[0]; // Assumindo que o primeiro elemento é o correto
          const ctx = canvas.getContext("2d");
          this.charts[sensor.ID] = new Chart(ctx, {
            type: "line",
            data: {
              labels: [], // Adicione os labels conforme necessário
              datasets: [
                {
                  label: sensor.Nome,
                  data: [sensor.ValorSensor_Valor],
                  borderColor: "#AB162B",
                  fill: false,
                  tension: 0.1,
                },
              ],
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            },
          });
        } else {
          console.error(
            "Canvas não encontrado ou não é válido para o sensor com ID:",
            sensor.ID
          );
        }
      });
    },
    recreateCharts() {
      // Limpa todos os gráficos existentes
      Object.keys(this.charts).forEach((key) => {
        this.charts[key].destroy();
      });
      this.charts = {};

      // Cria os gráficos novamente para os sensores filtrados
      this.$nextTick(() => {
        this.filteredSensors.forEach((sensor) => {
          this.createChart(sensor);
        });
      });
    },
    monitor() {
      this.isMonitoring = !this.isMonitoring;
      if (this.isMonitoring) {
        this.connect();
      } else {
        if (this.client) {
          this.client.disconnect();
        }
      }
    },
    connect() {
      this.client = new Paho.Client(
        this.mqttConfig.brokerUrl,
        Number(this.mqttConfig.port),
        this.mqttConfig.clientId
      );

      this.client.onConnectionLost = (responseObject) => {
        console.log("Connection Lost: " + responseObject.errorMessage);
        // Reconnect
        this.reconnect();
      };

      this.client.onMessageArrived = (message) => {
        let newValue = Number(message.payloadString).toFixed(2);
        let timestamp = new Date().toLocaleTimeString();

        let itemToUpdate = this.allSensores.find(
          (item) => item.ValorSensor_Topico === message.destinationName
        );
        if (itemToUpdate) {
          itemToUpdate.ValorSensor_Valor = newValue;
          this.updateChart(itemToUpdate, newValue);
        }
      };

      this.client.connect({
        onSuccess: () => {
          this.allSensores.forEach((sensor) => {
            if (sensor.ValorSensor_Topico) {
              this.client.subscribe(sensor.ValorSensor_Topico);
            }
          });
        },
        onFailure: (message) => {
          console.log("Falha na conexão: " + message.errorMessage);
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
              console.log("Falha na reconexão: " + message.errorMessage);
            },
          });
        }
      }, 5000); // Tenta reconectar após 5 segundos
    },
    updateChart(sensor, value) {
      const chart = this.charts[sensor.ID];
      if (chart) {
        const time = new Date().toLocaleTimeString();
        if (chart.data.labels.length >= this.MAX_POINTS) {
          chart.data.labels.shift();
          chart.data.datasets.forEach((dataset) => {
            dataset.data.shift();
          });
        }
        chart.data.labels.push(time);
        chart.data.datasets.forEach((dataset) => {
          dataset.data.push(value);
        });
        chart.update();
      } else {
        console.error("Gráfico não encontrado para o sensor:", sensor.ID);
      }
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
