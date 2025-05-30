<template>
  <div class="relatorio-container">
       <router-link to="/biosentry/historico-acesso" class="btn btn-secondary mb-3 rounded-buttonback">
          <i class="fa fa-arrow-left" aria-hidden="true"></i> 
        </router-link>
         <!-- Título da Página -->
    <h2>Gerar Relatório de Eventos</h2>
    <div class="relatorio-content">
      <aside class="filters-sidebar">
        <h3>Filtros de Pesquisa</h3>
        <form @submit.prevent="generateReport" class="filters-form">
          <div class="form-group">
            <label for="startDate">Data de Início:</label>
            <input type="date" v-model="startDate" id="startDate" required />
          </div>
          <div class="form-group">
            <label for="endDate">Data de Fim:</label>
            <input type="date" v-model="endDate" id="endDate" required />
          </div>
          <div class="form-group">
            <label for="residence">Residência / Edifício:</label>
            <input type="text" v-model="residence" id="residence" placeholder="Residência ou Edifício" />
          </div>
          <div class="form-group">
            <label for="userType">Tipo de Utilizador:</label>
            <select v-model="userType" id="userType">
              <option value="">Todos</option>
              <option value="Estudante">Estudante</option>
              <option value="Funcionário">Funcionário</option>
              <option value="Guarda">Guarda</option>
            </select>
          </div>
          <div class="form-group">
            <label for="studentName">Nome ou Código do Estudante:</label>
            <input type="text" v-model="studentName" id="studentName" placeholder="Nome ou Código" />
          </div>
          <div class="form-group">
            <label for="accessType">Tipo de Acesso:</label>
            <select v-model="accessType" id="accessType">
              <option value="">Todos</option>
              <option value="Entrada">Entrada</option>
              <option value="Saída">Saída</option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary generate-btn">Gerar Relatório</button>
        </form>
      </aside>

      <main class="report-main">
        <section v-if="reportData" class="summary-section">
          <h3>Estatísticas Resumidas</h3>
          <div class="summary-cards">
            <div class="card">
              <h4>Total de Acessos</h4>
              <p>{{ totalAccesses }}</p>
            </div>
            <div class="card">
              <h4>Acessos por Residência</h4>
              <ul>
                <li v-for="(count, residence) in accessesByResidence" :key="residence">
                  {{ residence }}: {{ count }}
                </li>
              </ul>
            </div>
            <div class="card">
              <h4>Acessos por Tipo de Utilizador</h4>
              <ul>
                <li v-for="(count, type) in accessesByUserType" :key="type">
                  {{ type }}: {{ count }}
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section v-if="reportData" class="table-section">
          <h3>Relatório</h3>
          <table class="table report-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Residência</th>
                <th>Tipo de Utilizador</th>
                <th>Status</th>
                <th>Tipo de Acesso</th>
                <th>Data/Hora</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in reportData" :key="item.id">
                <td>{{ item.name }}</td>
                <td>{{ item.residence }}</td>
                <td>{{ item.userType }}</td>
                <td>{{ item.status }}</td>
                <td>{{ item.accessType }}</td>
                <td>{{ formatDate(item.timestamp) }}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section v-if="reportData" class="charts-section">
          <h3>Gráficos</h3>
          <div class="charts-container">
            <canvas id="accessesPerDayChart"></canvas>
            <!-- <canvas id="entryExitComparisonChart"></canvas> -->
            <canvas id="userTypePieChart"></canvas> 
           <canvas id="peakHoursChart"></canvas>
          </div>
        </section>

        <section v-if="reportData" class="export-buttons">
          <button @click="exportPDF" class="btn btn-secondary">Gerar PDF</button>
          <button @click="exportExcel" class="btn btn-secondary">Exportar para Excel</button>
          <button @click="printReport" class="btn btn-secondary">Imprimir</button>
        </section>
      </main>
    </div>
  </div>
</template>

<script>

module.exports = {
  data() {
    return {
      searchQuery: '',
      startDate: '',
      endDate: '',
      residence: '',
      device: '',
      userType: '',
      studentName: '',
      accessStatus: '',
      accessType: '',
      reportData: null,
      charts: {},
    };
  },
  mounted() {
    const query = this.$route.query;
    if (query) {
     this.searchQuery = query.searchQuery || '';
      this.startDate = query.startDate || '';
      this.endDate = query.endDate || '';
    this.residence = query.residence || '';
    this.device = query.device || '';
    this.userType = query.userType || '';
    this.studentName = query.studentName || '';
    this.accessStatus = query.accessStatus || '';
      this.accessType = query.accessType || '';
    // Chama generateReport apenas se pelo menos um filtro relevante estiver presente
    if (this.startDate || this.endDate || this.residence || this.device || this.userType || this.studentName || this.accessStatus || this.accessType || this.searchQuery) {
        this.generateReport();
      }
    }
  },
  computed: {
    totalAccesses() {
      return this.reportData ? this.reportData.length : 0;
    },
    accessesByResidence() {
      if (!this.reportData) return {};
      return this.reportData.reduce((acc, item) => {
        acc[item.residence] = (acc[item.residence] || 0) + 1;
        return acc;
      }, {});
    },
    accessesByUserType() {
      if (!this.reportData) return {};
      return this.reportData.reduce((acc, item) => {
        acc[item.userType] = (acc[item.userType] || 0) + 1;
        return acc;
      }, {});
    },
  },
  methods: {
    generateReport() {
      axios
        .get('/biosentry/report', {
          params: {
            searchQuery: this.searchQuery,
            startDate: this.startDate,
            endDate: this.endDate,
            residence: this.residence,
            device: this.device,
            userType: this.userType,
            studentName: this.studentName,
            accessStatus: this.accessStatus,
            accessType: this.accessType,
          },
        })
        .then((response) => {
          this.reportData = response.data;
          this.renderCharts();
        })
        .catch((error) => {
          console.error('Erro ao gerar relatório:', error);
        });
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleString();
    },
    renderCharts() {
  this.destroyCharts();

  if (!this.reportData || this.reportData.length === 0) return;

  this.$nextTick(() => {
    // Accesses per day chart
    const accessesPerDayCanvas = document.getElementById('accessesPerDayChart');
    if (accessesPerDayCanvas) {
      const accessesPerDayCtx = accessesPerDayCanvas.getContext('2d');
      const accessesPerDayData = this.aggregateByDay();
      this.charts.accessesPerDayChart = new Chart(accessesPerDayCtx, {
        type: 'bar',
        data: {
          labels: Object.keys(accessesPerDayData),
          datasets: [{
            label: 'Acessos por Dia',
            data: Object.values(accessesPerDayData),
             backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(201, 203, 207, 0.2)'
            ],
              borderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)'
              ],
              borderWidth: 1
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
                  ticks: {
                    stepSize: 1, // Força incrementos inteiros
                    precision: 0 // Remove decimais
                  }
            }
          }
        },
      });
    }

    // Entry vs Exit comparison chart
    const entryExitCanvas = document.getElementById('entryExitComparisonChart');
    if (entryExitCanvas) {
      const entryExitCtx = entryExitCanvas.getContext('2d');
      const entryCount = this.reportData.filter(item => item.accessType === 'Entrada').length;
      const exitCount = this.reportData.filter(item => item.accessType === 'Saída').length;
      this.charts.entryExitComparisonChart = new Chart(entryExitCtx, {
        type: 'bar',
        data: {
          labels: ['Entrada', 'Saída'],
          datasets: [{
            label: 'Comparativo Entrada vs Saída',
            data: [entryCount, exitCount],
            backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1, // Força incrementos inteiros
                precision: 0 // Remove decimais
              }
            }
          }
        },
      });
    }

    // User type pie chart
    const userTypeCanvas = document.getElementById('userTypePieChart');
    if (userTypeCanvas) {
      const userTypeCtx = userTypeCanvas.getContext('2d');
      const userTypeData = this.accessesByUserType;
      this.charts.userTypePieChart = new Chart(userTypeCtx, {
        type: 'pie',
        data: {
          labels: Object.keys(userTypeData),
          datasets: [{
            data: Object.values(userTypeData),
            backgroundColor: [
              'rgba(255, 206, 86, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 99, 132, 0.6)',
            ],
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `${context.label}: ${Math.round(context.raw)}`; // Força inteiros nos tooltips
                }
              }
            }
          }
        },
      });
    }

    // Peak hours chart
    const peakHoursCanvas = document.getElementById('peakHoursChart');
    if (peakHoursCanvas) {
      const peakHoursCtx = peakHoursCanvas.getContext('2d');
      const peakHoursData = this.aggregateByHour();
      this.charts.peakHoursChart = new Chart(peakHoursCtx, {
        type: 'line',
        data: {
          labels: Object.keys(peakHoursData),
          datasets: [{
            label: 'Horários de Pico',
            data: Object.values(peakHoursData),
            fill: false,
            borderColor: 'rgba(153, 102, 255, 0.6)',
            tension: 0.1,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1, // Força incrementos inteiros
                precision: 0 // Remove decimais
              }
            }
          }
        },
      });
    }
  });
},
    destroyCharts() {
      Object.values(this.charts).forEach(chart => {
        if (chart) {
          chart.destroy();
        }
      });
      this.charts = {};
    },
    aggregateByDay() {
      return this.reportData.reduce((acc, item) => {
        const day = new Date(item.timestamp).toLocaleDateString();
        acc[day] = (acc[day] || 0) + 1;
        return acc;
      }, {});
    },
    aggregateByHour() {
      return this.reportData.reduce((acc, item) => {
        const hour = new Date(item.timestamp).getHours();
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      }, {});
    },
    exportPDF() {
      // Placeholder for PDF export functionality
      alert('Funcionalidade de exportar PDF ainda não implementada.');
    },
    exportExcel() {
      // Placeholder for Excel export functionality
      alert('Funcionalidade de exportar Excel ainda não implementada.');
    },
    printReport() {
      window.print();
    },
  },
  beforeDestroy() {
    this.destroyCharts();
  },
};
</script>

<style scoped>
.relatorio-container {
  padding: 30px 40px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f4f7f9;
  color: #333;
  min-height: 100vh;
}

.relatorio-container h2 {
  font-weight: 700;
  font-size: 2.2rem;
  margin-bottom: 25px;
  color: #2c3e50;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.relatorio-content {
  display: flex;
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.filters-sidebar {
  width: 320px;
  background-color: #ffffff;
  padding: 25px 20px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(44, 62, 80, 0.1);
  transition: box-shadow 0.3s ease;
}

.filters-sidebar:hover {
  box-shadow: 0 12px 30px rgba(44, 62, 80, 0.15);
}

.filters-sidebar h3 {
  margin-bottom: 20px;
  font-size: 1.4rem;
  font-weight: 600;
  color: #34495e;
  border-bottom: 2px solid #3498db;
  padding-bottom: 8px;
}

.filters-form .form-group {
  margin-bottom: 18px;
}

.filters-form label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #34495e;
  font-size: 0.95rem;
}

.filters-form input,
.filters-form select {
  width: 100%;
  padding: 10px 12px;
  border: 1.8px solid #d1d9e6;
  border-radius: 8px;
  font-size: 1rem;
  color: #2c3e50;
  transition: border-color 0.3s ease;
}

.filters-form input:focus,
.filters-form select:focus {
  border-color: #3498db;
  outline: none;
  box-shadow: 0 0 8px rgba(52, 152, 219, 0.4);
}

.generate-btn {
  width: 100%;
  padding: 14px 0;
  background: linear-gradient(90deg, #007bff, #007bff);
  border: none;
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 6px 15px rgba(52, 152, 219, 0.4);
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

.generate-btn:hover {
  background: linear-gradient(90deg, #348ddb, #297bb9);
  box-shadow: 0 8px 20px rgba(52, 149, 219, 0.6);
}

.report-main {
  flex-grow: 1;
  background-color: #ffffff;
  padding: 25px 30px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(44, 62, 80, 0.1);
  display: flex;
  flex-direction: column;
}

.summary-section {
  margin-bottom: 30px;
}

.summary-cards {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.summary-cards .card {
  background-color: white;
  color: #ab162b;
  padding: 20px 25px;
  border-radius: 12px;
  flex: 1;
  min-width: 150px;
  text-align: center;
  box-shadow: 0 6px 15px rgba(219, 52, 52, 0.2);
  transition: background-color 0.3s ease;
}

.summary-cards .card:hover {
  background-color: rgb(248, 239, 239);
}

.summary-cards .card h4 {
  margin-bottom: 10px;
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: 0.05em;
}

.summary-cards .card p {
  font-size: 1.5rem;
  font-weight: 700;
}

.table-section {
  margin-bottom: 30px;
  overflow-x: auto;
}

.report-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px;
  font-size: 0.95rem;
  color: #34495e;
}

.report-table thead tr {
  background-color: #ab162b;
  color: white;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.05em;
  border-radius: 12px;
}

.report-table th,
.report-table td {
  padding: 12px 15px;
  text-align: left;
  vertical-align: middle;
}

.report-table tbody tr {
  background-color: #ecf0f1;
  border-radius: 12px;
  transition: background-color 0.3s ease;
}

.report-table tbody tr:hover {
  background-color: #f8d6d6;
  cursor: pointer;
}

.charts-section {
  margin-bottom: 30px;
}

.charts-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
}

.charts-container canvas {
  width: 100% !important;
  height: 280px !important;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(44, 62, 80, 0.1);
  background-color: white;
}

.export-buttons {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
}

.export-buttons .btn {
  padding: 10px 18px;
  background-color: #34495e;
  border: none;
  color: white;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 6px 15px rgba(52, 73, 94, 0.4);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.export-buttons .btn:hover {
  background-color: #2c3e50;
  box-shadow: 0 8px 20px rgba(44, 62, 80, 0.6);
}

@media (max-width: 900px) {
  .relatorio-content {
    flex-direction: column;
  }
  .filters-sidebar {
    width: 100%;
    margin-bottom: 25px;
  }
  .summary-cards {
    flex-direction: column;
  }
  .summary-cards .card {
    min-width: 100%;
  }
  .charts-container {
    grid-template-columns: 1fr;
  }
}
</style>
