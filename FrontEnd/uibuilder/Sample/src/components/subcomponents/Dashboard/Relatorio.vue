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
          <canvas id="sensorChart" class="chart-canvas" height="500px"></canvas>
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
        })
        .catch((error) => {
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
          if (this.sensors.length === 0) {
            this.showNotification(
              "Nenhum sensor encontrado para a área selecionada.",
              "info",
              "Informação"
            );
          }
        })
        .catch((error) => {
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
          this.sensorHistory = response.data.map((entry) => {
            try {
              // Interpretar a data retornada pela API
              const utcDate = new Date(entry.DataHora);

              if (isNaN(utcDate.getTime())) {
                throw new Error("Formato de data inválido.");
              }

              // Ajustar para o horário de Cabo Verde (UTC-1)
              const caboVerdeDate = new Date(
                utcDate.getTime() - 60 * 60 * 1000
              ); // Subtrair 1 hora

              // Formatar a data para o fuso horário de Cabo Verde
              const formattedDate = caboVerdeDate.toLocaleString("pt-PT", {
                timeZone: "Atlantic/Cape_Verde",
              });

              return {
                ...entry,
                DataHora: formattedDate, // Salvar a data formatada
              };
            } catch (error) {
              console.error("Erro ao processar a data:", entry.DataHora, error);
              return entry; // Retornar a entrada original em caso de erro
            }
          });
          this.filteredSensorHistory = [...this.sensorHistory];

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
          this.showNotification(
            "Erro ao buscar histórico do sensor. Tente novamente mais tarde.",
            "danger",
            "Erro"
          );
        });
    },

    applyDateFilter() {
      // Verificar se as datas de início e fim estão preenchidas
      if (!this.startDate || !this.endDate) {
        this.showNotification(
          "As datas de início e fim são obrigatórias para o filtro.",
          "warning",
          "Alerta"
        );
        return;
      }

      // Ajustar a data de início para o início do dia
      const adjustedStartDate = new Date(this.startDate);
      adjustedStartDate.setHours(0, 0, 0, 0); // 00:00:00.000

      // Ajustar a data final para o final do dia
      const adjustedEndDate = new Date(this.endDate);
      adjustedEndDate.setHours(23, 59, 59, 999); // 23:59:59.999

      // Filtrar o histórico do sensor com base nas datas fornecidas
      this.filteredSensorHistory = this.sensorHistory.filter((entry) => {
        const entryDate = new Date(entry.DataHora); // Certifique-se de que está em UTC
        return entryDate >= adjustedStartDate && entryDate <= adjustedEndDate;
      });

      // Renderizar o gráfico ou mostrar uma notificação se não houver dados
      if (this.filteredSensorHistory.length > 0) {
        this.renderChart();
      } else {
        this.showNotification(
          "Não há dados disponíveis para o gráfico após o filtro.",
          "danger",
          "Erro"
        );
      }
    },
    renderChart() {
      const ctx = document.getElementById("sensorChart");
      if (!ctx) return;

      const context = ctx.getContext("2d");

      // Destruir a instância anterior do gráfico se existir
      if (this.chartInstance) {
        this.chartInstance.destroy();
      }

      const sensorId = this.selectedSensorId;
      const sensor = this.sensors.find((s) => s.ID === sensorId);
      const sensorName = sensor ? sensor.Nome : "Sensor Desconhecido";

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
            label: `Valor Coletado do Sensor: ${sensorName}`,
            backgroundColor: "rgba(66, 134, 244, 0.2)",
            borderColor: "rgba(66, 134, 244, 1)",
            borderWidth: 1,
            data: data,
          },
        ],
      };

      this.chartInstance = new Chart(context, {
        type: "line", // Ou o tipo de gráfico que você estiver utilizando
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false, // Permite que o gráfico utilize a altura definida no CSS
        },
      });

      // Forçar o redimensionamento do gráfico
      this.chartInstance.resize();
    },
  },
  mounted() {
    this.fetchAreas(); // Carregar áreas ao montar o componente
  },
};
</script>

<style scoped>
.chart-canvas {
  width: 100%; /* Faz o gráfico ocupar 100% da largura do contêiner */
  height: 500px; /* Defina uma altura fixa adequada */
}
</style>
