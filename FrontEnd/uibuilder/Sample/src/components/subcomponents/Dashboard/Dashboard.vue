<template>
  <div class="container-fluid mt-5">
    <div class="card">
      <div
        class="card-header d-flex justify-content-between align-items-center"
      >
        <h4>Sensores</h4>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th scope="col" class="col-1">ID</th>
                <th scope="col" class="col-3">Nome</th>
                <th scope="col" class="col-3">Area</th>
                <th scope="col" class="col-2">Tipo Sensor</th>
                <th scope="col" class="col-2">Tópico</th>
                <th scope="col" class="col-1">Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in paginatedItems" :key="index">
                <td>{{ item.ID }}</td>
                <td>{{ item.Nome }}</td>
                <td>{{ item.Area_Nome }}</td>
                <td>{{ item.TipoSensor_Nome }}</td>
                <td>{{ item.ValorSensor_Topico }}</td>
                <td>{{ item.ValorSensor_Valor }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="d-flex justify-content-center">
          <b-pagination
            v-if="items.length > perPage"
            v-model="currentPage"
            :total-rows="rows"
            :per-page="perPage"
            aria-controls="my-table"
            class="custom-pagination"
          ></b-pagination>
        </div>
        <div class="row mt-3">
          <div v-for="sensor in items" :key="sensor.ID" class="col-md-4">
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

<script>
module.exports = {
  data() {
    return {
      perPage: 10,
      currentPage: 1,
      items: [],
      client: undefined,
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
      this.retrieveData();
      this.monitor();
    }
  },
  computed: {
    rows() {
      return this.items.length;
    },
    paginatedItems() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.items.slice(start, end);
    },
  },
  methods: {
    retrieveData() {
      axios
        .get("/rs2lab/sensor")
        .then((resp) => {
          this.items = resp.data.map((sensor) => {
            return {
              ...sensor,
              ValorSensor_Valor: sensor.ValorSensor_Valor || 0, // Inicializa com 0 se não houver valor
            };
          });
          this.$nextTick(() => {
            this.items.forEach((sensor) => {
              this.createChart(sensor);
            });
          });
        })
        .catch((errors) => {
          console.error(errors);
        });
    },
    createChart(sensor) {
      this.$nextTick(() => {
        const canvasArray = this.$refs["chart-" + sensor.ID];
        if (canvasArray && canvasArray.length > 0) {
          const canvas = canvasArray[0]; // Assumindo que o primeiro elemento é o correto
          const ctx = canvas.getContext("2d");
          this.charts[sensor.ID] = new Chart(ctx, {
            type: "line",
            data: {
              labels: [],
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
            "Canvas não encontrado ou não é válido para o sensor:",
            sensor.ID
          );
        }
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
        Number(this.mqttConfig.port),this.mqttConfig.clientId
      );


      this.client.onConnectionLost = (responseObject) => {
        console.log("Connection Lost: " + responseObject.errorMessage);
        // Reconnect
        this.reconnect();
      };
      

      this.client.onMessageArrived = (message) => {
        let newValue = Number(message.payloadString).toFixed(2);
        let timestamp = new Date().toLocaleTimeString();

        let itemToUpdate = this.items.find(
          (item) => item.ValorSensor_Topico === message.destinationName
        );
        if (itemToUpdate) {
          itemToUpdate.ValorSensor_Valor = newValue;
          this.updateChart(itemToUpdate, newValue);
        }
      };

      this.client.connect({
        onSuccess: () => {
          this.items.forEach((sensor) => {
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
              this.items.forEach((sensor) => {
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
