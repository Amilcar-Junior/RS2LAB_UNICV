<template>
  <b-container>
    <h2 class="text-center" style="font-family: 'Roboto', sans-serif; font-weight: 700; margin-bottom: 20px;">
      Dashboard
    </h2>
    <b-row>
      <b-col md="4">
        <b-card>
          <h4>Estudantes Registrados</h4>
          <p>{{ studentCount }}</p>
        </b-card>
      </b-col>
      <b-col md="4">
        <b-card>
          <h4>Entradas Hoje</h4>
          <p>{{ entryCount }}</p>
        </b-card>
      </b-col>
      <b-col md="4">
        <b-card>
          <h4>Saídas Hoje</h4>
          <p>{{ exitCount }}</p>
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-card>
          <h4>Dispositivos Ativos</h4>
          <p>{{ deviceCount }}</p>
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-card>
          <h4>Gráfico de Entradas e Saídas</h4>
          <canvas id="entryExitChart"></canvas>
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
        const response = await axios.get('API_ENDPOINT'); // Replace with actual API endpoint
        this.studentCount = response.data.studentCount;
        this.entryCount = response.data.entryCount;
        this.exitCount = response.data.exitCount;
        this.deviceCount = response.data.deviceCount;
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
/* Add any additional styles here */
</style>
