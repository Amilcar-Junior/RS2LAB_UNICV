<template>
  <div class="container-fluid mt-5">
    <router-link to="/" class="btn btn-secondary mb-3">
      <i class="fa fa-arrow-left" aria-hidden="true"></i> Voltar
    </router-link>

    <div class="card">
      <div
        class="card-header d-flex justify-content-between align-items-center"
      >
        <h4>Relatório de Sensores</h4>
        <div>
          <select
            v-model="selectedAreaId"
            @change="fetchSensors"
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
            @change="fetchSensorHistory"
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
        <div class="d-flex align-items-center mb-3">
          <input
            type="date"
            v-model="startDate"
            class="form-control w-auto mr-2"
          />
          <input type="date" v-model="endDate" class="form-control w-auto" />
          <button @click="applyDateFilter" class="btn btn-primary ml-2">
            Filtrar
          </button>
        </div>
        <div v-if="filteredSensorHistory.length > 0">
          <canvas id="sensorChart" class="chart-canvas" height="500"></canvas>
        </div>
        <div v-else>
          <p class="text-center">
            Selecione um sensor para visualizar o histórico.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  name: "RelatorioSensores",
  data() {
    return {
      areas: [],
      sensors: [],
      sensorHistory: [],
      selectedAreaId: null,
      selectedSensorId: null,
      chartInstance: null,
      startDate: null,
      endDate: null,
      filteredSensorHistory: [],
    };
  },
  computed: {
    filteredAreas() {
      return this.areas; // Filtrar áreas se necessário
    },
    filteredSensors() {
      return this.sensors.filter(
        (sensor) => sensor.area_ID === this.selectedAreaId
      );
    },
  },
  methods: {
    fetchAreas() {
      axios
        .get("/rs2lab/areadeagricultura")
        .then((response) => {
          this.areas = response.data;
          // console.log("Áreas carregadas:", this.areas);
        })
        .catch((error) => {
          // console.error("Erro ao buscar áreas de agricultura:", error);
          this.showNotification(
            "Erro ao buscar áreas de agricultura. Tente novamente mais tarde.",
            "danger",
            "Erro"
          );
        });
    },

    fetchSensors() {
      if (!this.selectedAreaId) return;
      axios
        .get("/rs2lab/sensor")
        .then((response) => {
          this.sensors = response.data.filter(
            (sensor) => sensor.area_ID === this.selectedAreaId
          );
          // console.log("Sensores carregados:", this.sensors);
          if (this.sensors.length === 0) {
            this.showNotification(
              "Nenhum sensor encontrado para a área selecionada.",
              "info",
              "Informação"
            );
          }
        })
        .catch((error) => {
          // console.error("Erro ao buscar sensores:", error);
          this.showNotification(
            "Erro ao buscar sensores. Tente novamente mais tarde.",
            "danger",
            "Erro"
          );
        });
    },
    fetchSensorHistory() {
      if (!this.selectedSensorId) return;
      axios
        .get(`/rs2lab/historicosensor/${this.selectedSensorId}`)
        .then((response) => {
          this.sensorHistory = response.data;
          // console.log("Histórico de sensores carregados:", this.sensorHistory);
          this.filteredSensorHistory = [...this.sensorHistory]; // Inicialmente, todos os dados

          if (this.filteredSensorHistory.length === 0) {
            this.showNotification(
              "Nenhum histórico disponível para o sensor selecionado.",
              "info",
              "Informação"
            );
          }

          this.$nextTick(() => {
            this.renderChart(); // Tentar renderizar o gráfico
          });
        })
        .catch((error) => {
          // console.error("Erro ao buscar histórico do sensor:", error);
          this.showNotification(
            "Erro ao buscar histórico do sensor. Tente novamente mais tarde.",
            "danger",
            "Erro"
          );
        });
    },

    applyDateFilter() {
      if (!this.startDate || !this.endDate) {
        // console.error(
        //   "As datas de início e fim são obrigatórias para o filtro."
        // );
        this.showNotification(
          "As datas de início e fim são obrigatórias para o filtro.",
          "warning",
          "Alerta"
        );
        return;
      }

      // console.log("Datas de filtro:", this.startDate, this.endDate);

      // Ajusta a data de fim para incluir todo o dia
      const adjustedEndDate = new Date(this.endDate);
      adjustedEndDate.setHours(23, 59, 59, 999); // Define para o final do dia
      // console.log("Data de fim ajustada:", adjustedEndDate);

      // Filtrar o histórico de sensores com base nas datas
      this.filteredSensorHistory = this.sensorHistory.filter((entry) => {
        const entryDate = new Date(entry.DataHora);
        // console.log("Data do registro:", entryDate);
        return (
          entryDate >= new Date(this.startDate) && entryDate <= adjustedEndDate
        );
      });

      // Renderizar o gráfico após aplicar o filtro
      // console.log("Histórico filtrado:", this.filteredSensorHistory);
      if (this.filteredSensorHistory.length > 0) {
        this.renderChart();
      } else {
        this.showNotification(
          "Não há dados disponíveis para o gráfico após o filtro.",
          "danger",
          "Erro"
        );
        // console.error("Não há dados disponíveis para o gráfico após o filtro.");
      }
    },

    renderChart() {
      // Verifica se o canvas existe
      const ctx = document.getElementById("sensorChart");
      if (!ctx) {
        // console.error("Elemento canvas não encontrado.");
        return;
      }

      const context = ctx.getContext("2d");

      // Se o gráfico já existir, destruí-lo antes de criar um novo
      if (this.chartInstance) {
        this.chartInstance.destroy();
      }

      // Obter o nome do sensor usando o ID do sensor (presumindo que o ID está presente nas entradas)
      const sensorId = this.selectedSensorId; // O ID do sensor selecionado
      const sensor = this.sensors.find((s) => s.id === sensorId); // Ajuste conforme o seu modelo
      const sensorName = sensor ? sensor.name : "Sensor Desconhecido"; // Obter nome ou usar um padrão

      const labels = this.filteredSensorHistory.map((entry) =>
        new Date(entry.DataHora).toLocaleString()
      );
      const data = this.filteredSensorHistory.map(
        (entry) => entry.ValorColetado
      );

      const chartData = {
        labels: labels,
        datasets: [
          {
            label: `Valor Coletado do Sensor: ${sensorName}`, // Inclui o nome do sensor
            backgroundColor: "rgba(66, 165, 245, 0.5)",
            borderColor: "rgba(66, 165, 245, 1)",
            data: data,
            fill: false,
          },
        ],
      };

      // Criar novo gráfico
      this.chartInstance = new Chart(context, {
        type: "line",
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: true, // Mantenha a proporção do gráfico
          scales: {
            x: {
              title: {
                display: true,
                text: "Data/Hora",
              },
            },
            y: {
              title: {
                display: true,
                text: "Valor Coletado",
              },
            },
          },
        },
      });
    },

    showNotification(message, variant, title) {
      this.$bvToast.toast(message, {
        title: title,
        variant: variant, // Pode ser 'success', 'info', 'warning', 'danger', etc.
        autoHideDelay: 5000, // Tempo em milissegundos para ocultar automaticamente
        appendToast: true, // Adiciona ao final da lista de notificações
      });
    },
  },
  mounted() {
    this.fetchAreas();
  },
};
</script>

<style scoped>
.chart-canvas {
  height: 500px; /* Ajuste a altura conforme necessário */
  width: 100%; /* Largura flexível */
}
</style>
