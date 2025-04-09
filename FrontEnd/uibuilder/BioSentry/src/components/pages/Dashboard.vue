<template>
  <b-container class="dashboard-container">
    <h2 class="dashboard-title">
      Dashboard
    </h2>
    <b-row class="metrics-row">
      <b-col md="3" class="mb-4">
        <b-card class="metric-card">
          <h4 class="metric-title">Estudantes Registrados</h4>
          <p class="metric-value">{{ studentCount }}</p>
        </b-card>
      </b-col>
      <b-col md="3" class="mb-4">
        <b-card class="metric-card">
          <h4 class="metric-title">Entradas Hoje</h4>
          <p class="metric-value">{{ entryCount }}</p>
        </b-card>
      </b-col>
      <b-col md="3" class="mb-4">
        <b-card class="metric-card">
          <h4 class="metric-title">Saídas Hoje</h4>
          <p class="metric-value">{{ exitCount }}</p>
        </b-card>
      </b-col>
      <b-col md="3" class="mb-4">
        <b-card class="metric-card">
          <h4 class="metric-title">Dispositivos Ativos</h4>
          <p class="metric-value">{{ deviceCount }}</p>
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-card class="chart-card">
          <h4 class="chart-title">Gráfico de Entradas e Saídas</h4>
          <div class="chart-container">
            <canvas id="entryExitChart"></canvas>
          </div>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>

module.exports = {
  data() {
    return {
      studentCount: 0,
      entryCount: 0,
      exitCount: 0,
      deviceCount: 0,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
         // Chamadas paralelas para melhor performance
    const [studentsRes, entriesRes, exitsRes, devicesRes] = await Promise.all([
      axios.get('/biosentry/studentsCount'),
      axios.get('/biosentry/entryCount'),
      axios.get('/biosentry/exitCount'), 
      axios.get('/biosentry/deviceCount')
    ]);

    this.studentCount = studentsRes.data.count;
    this.entryCount = entriesRes.data.count;
    this.exitCount = exitsRes.data.count;
    this.deviceCount = devicesRes.data.count;
    this.renderChart();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    renderChart() {
      const ctx = document.getElementById('entryExitChart').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Entradas', 'Saídas'],
          datasets: [{
            label: 'Contagem',
            data: [this.entryCount, this.exitCount],
            backgroundColor: ['#42A5F5', '#66BB6A'],
          }],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    },
  },
};
</script>

<style scoped>
.dashboard-container {
  padding: 2rem;
}

.dashboard-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  margin-bottom: 2rem;
  color: #333;
  text-align: center;
}

.metrics-row {
  margin-bottom: 2rem;
}

.metric-card {
  border: none;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
}

.metric-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.metric-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  font-size: 1.1rem;
  color: #555;
}

.metric-value {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 2rem;
  color: #AB162B;
  margin-top: 0.5rem;
}

.chart-card {
  border: none;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.chart-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  font-size: 1.2rem;
  color: #555;
  margin-bottom: 1.5rem;
}

.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}
</style>
