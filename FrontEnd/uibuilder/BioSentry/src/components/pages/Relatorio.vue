<template>  
  <div class="relatorio-container">
     <router-link to="/biosentry/historico-acesso" class="btn btn-secondary mb-3 rounded-buttonback">
      <i class="fa fa-arrow-left" aria-hidden="true"></i> 
    </router-link>

    <h3
        class="text-center"
        style="
          font-family: 'Roboto', sans-serif;
          font-weight: 700;
          margin-bottom: 50px;
        "
      >
        Relatório 
      </h3>

    <div class="relatorio-content">
      <aside class="filters-sidebar">
        <h3>Filtros</h3>
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
            <label for="residence">Residência/Edifício:</label>
            <input type="text" v-model="residence" id="residence" placeholder="Ex.: Residência A" />
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
            <label for="studentName">Nome/Código do Estudante:</label>
            <input type="text" v-model="studentName" id="studentName" placeholder="Nome ou Código" />
          </div>
          <div class="form-group">
            <label for="accessType">Tipo de Acesso:</label>
            <select v-model="accessType" id="accessType">
              <option value="">Todos</option>
              <option value="in">Entrada</option>
              <option value="out">Saída</option>
            </select>
          </div>
          <button type="submit" class="btn btn-danger generate-btn">Gerar Relatório</button>
        </form>
      </aside>

      <main class="report-main">
        <section v-if="reportData" class="summary-section">
          <h3>Estatísticas Gerais</h3>
          <div class="summary-cards">
            <div class="card card-total-accesses">
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
          <h3>Detalhes do Relatório</h3>
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
                <td>{{ getStatusText(item.status) }}</td>
                <td>{{ formatAccessType(item.accessType) }}</td>
                <td>{{ formatDate(item.timestamp) }}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section v-if="reportData" class="charts-section">
          <h3>Visualizações</h3>
          <div class="charts-container">
            <div class="chart-wrapper">
              <h4>Acessos por Dia</h4>
              <canvas id="accessesPerDayChart"></canvas>
            </div>
            <div class="chart-wrapper">
              <h4>Tipos de Utilizador</h4>
              <canvas id="userTypePieChart"></canvas>
            </div>
            <div class="chart-wrapper">
              <h4>Horários de Pico</h4>
              <canvas id="peakHoursChart"></canvas>
            </div>
          </div>
        </section>

        <section v-if="reportData" class="export-buttons">
          <button @click="exportPDF" class="btn btn-secondary">Exportar PDF</button>
          <button @click="exportExcel" class="btn btn-secondary">Exportar Excel</button>
       
        </section>
      </main>
    </div>
  </div>
</template>

<script>

module.exports = {
  data() {
    return {
    statusOptions: [
      { text: 'Ativo', value: '1' },
      { text: 'Inativo', value: '0' }
    ],

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
   getStatusText(status_) {
        return {
          0: 'Inativo',
          1: 'Ativo'
        }[status_] || 'Desconhecido';
    },
  formatAccessType(logg_info) {
    return logg_info === 'in' ? 'Entrada' : 'Saída';
  },
   
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
      if (!this.reportData) {
        alert('Gere o relatório antes de exportar.');
        return;
      }

      this.isExporting = true; // Ativa o indicador de carregamento
      const { jsPDF } = window.jspdf; // Access jsPDF from global window.jspdf
      const doc = new jsPDF('p', 'mm', 'a4'); // PDF em orientação portrait, tamanho A4
      const reportElement = document.querySelector('.report-main');
      const exportButtons = document.querySelector('.export-buttons'); // Selecionar a seção dos botões
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = doc.internal.pageSize.getHeight();
      const margin = 10; // Margem em mm

      // Esconder temporariamente os botões de exportação
      if (exportButtons) {
        exportButtons.style.display = 'none';
      }

      // Captura o elemento como imagem usando html2canvas
      window.html2canvas(reportElement, {
        scale: 2, // Aumenta a resolução para melhor qualidade
        useCORS: true, // Se houver imagens externas
        logging: false,
        backgroundColor: '#ffffff', // Fundo branco
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pdfWidth - 2 * margin;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let positionY = margin + 10; // Espaço para o cabeçalho

        // Adiciona cabeçalho na primeira página
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Relatório BioSentry', margin, margin + 5);
        doc.setLineWidth(0.5);
        doc.line(margin, margin + 7, pdfWidth - margin, margin + 7); // Linha abaixo do cabeçalho

        // Adiciona a primeira página
        doc.addImage(imgData, 'PNG', margin, positionY, imgWidth, imgHeight);
        heightLeft -= (pdfHeight - 2 * margin - 10);

        // Adiciona páginas adicionais se o conteúdo for longo
        while (heightLeft > 0) {
          doc.addPage();
          positionY = -(pdfHeight - 2 * margin - 10 - (heightLeft % (pdfHeight - 2 * margin - 10))); // Ajusta a posição
          // Adiciona cabeçalho nas páginas subsequentes
          doc.setFontSize(16);
          doc.setFont('helvetica', 'bold');
          doc.text('Relatório BioSentry', margin, margin + 5);
          doc.setLineWidth(0.5);
          doc.line(margin, margin + 7, pdfWidth - margin, margin + 7);
          doc.addImage(imgData, 'PNG', margin, positionY, imgWidth, imgHeight);
          heightLeft -= (pdfHeight - 2 * margin - 10);
        }

        // Salva o PDF com um nome baseado nos filtros
        const fileName = `Relatorio_${this.startDate || 'inicio'}_a_${this.endDate || 'fim'}.pdf`;
        doc.save(fileName);

        // Restaurar a visibilidade dos botões e desativar o indicador
        if (exportButtons) {
          exportButtons.style.display = 'flex';
        }
        this.isExporting = false;
      }).catch((error) => {
        console.error('Erro ao exportar PDF:', error);
        alert('Ocorreu um erro ao exportar o PDF. Tente novamente.');
        // Garante que os botões sejam restaurados e o indicador desativado
        if (exportButtons) {
          exportButtons.style.display = 'flex';
        }
        this.isExporting = false;
      });
    },

 exportExcel() {
  if (!this.reportData) {
    alert('Gere o relatório antes de exportar.');
    return;
  }

  this.isExporting = true; // Mostrar spinner
  const XLSX = window.XLSX;
  const workbook = XLSX.utils.book_new();
  const exportButtons = document.querySelector('.export-buttons');

  // Desativar botões de exportação
      if (exportButtons) {
        exportButtons.style.pointerEvents = 'none';
      }

  // 1. Planilha de Estatísticas Gerais
  const statsData = [
    ['Estatísticas Gerais'],
    ['Total de Acessos', this.totalAccesses],
    [],
    ['Acessos por Residência'],
    ...Object.entries(this.accessesByResidence).map(([residence, count]) => [residence, count]),
    [],
    ['Acessos por Tipo de Utilizador'],
    ...Object.entries(this.accessesByUserType).map(([type, count]) => [type, count]),
  ];
  const statsSheet = XLSX.utils.aoa_to_sheet(statsData);
  // Aplicar estilos: negrito para títulos
      statsSheet['A1'].s = { font: { bold: true } };
      statsSheet['A4'].s = { font: { bold: true } };
      statsSheet['A7'].s = { font: { bold: true } };
      // Definir largura das colunas
      statsSheet['!cols'] = [{ wch: 30 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(workbook, statsSheet, 'Estatísticas Gerais');

  // 2. Planilha de Detalhes do Relatório
  const tableData = [
    ['Nome', 'Residência', 'Tipo de Utilizador', 'Status', 'Tipo de Acesso', 'Data/Hora'],
    ...this.reportData.map(item => [
      item.name,
      item.residence,
      item.userType,
      this.getStatusText(item.status),
      this.formatAccessType(item.accessType),
      this.formatDate(item.timestamp),
    ]),
  ];
  const tableSheet = XLSX.utils.aoa_to_sheet(tableData);
   // Aplicar estilos: negrito para cabeçalhos
      ['A1', 'B1', 'C1', 'D1', 'E1', 'F1'].forEach(cell => {
        tableSheet[cell].s = { font: { bold: true } };
      });
      // Definir largura das colunas
      tableSheet['!cols'] = [
        { wch: 20 }, // Nome
        { wch: 20 }, // Residência
        { wch: 20 }, // Tipo de Utilizador
        { wch: 15 }, // Status
        { wch: 15 }, // Tipo de Acesso
        { wch: 25 }, // Data/Hora
      ];
  XLSX.utils.book_append_sheet(workbook, tableSheet, 'Detalhes do Relatório');


   // Salvar o arquivo Excel
      try {
        const fileName = `Relatorio_${this.startDate || 'inicio'}_a_${this.endDate || 'fim'}.xlsx`;
        XLSX.writeFile(workbook, fileName);
      } catch (error) {
        console.error('Erro ao exportar Excel:', error);
        alert('Ocorreu um erro ao exportar o Excel. Tente novamente.');
      } finally {
        this.isExporting = false; // Esconder spinner
        if (exportButtons) {
          exportButtons.style.pointerEvents = 'auto'; // Reativar botões
        }
      }

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
  padding: 20px 30px;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  background-color: #f8fafc;
  color: #1f2937;
  min-height: 100vh;
}

.relatorio-container h2 {
  font-weight: 600;
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: #1f2937;
  text-align: left;
}

.relatorio-content {
  display: flex;
  gap: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.filters-sidebar {
  width: 280px;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.filters-sidebar h3 {
  margin-bottom: 15px;
  font-size: 1.2rem;
  font-weight: 500;
  color: #1f2937;
}

.filters-form .form-group {
  margin-bottom: 15px;
}

.filters-form label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
}

.filters-form input,
.filters-form select {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #1f2937;
}

.filters-form input:focus,
.filters-form select:focus {
  border-color: #912828;
  outline: none;
}

.generate-btn {
  width: 100%;
  padding: 10px;
  background-color: #AB162B;
  border: none;
  color: white;
  font-weight: 500;
  font-size: 0.95rem;
  border-radius: 6px;
  cursor: pointer;
}

.generate-btn:hover {
  background-color: #b72034;
}

.report-main {
  flex-grow: 1;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.summary-section {
  margin-bottom: 20px;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.summary-cards .card {
  background-color: #f9fafb;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
}

.card-total-accesses {
  background-color: #e0f2fe;
}

.summary-cards .card:hover {
  transform: translateY(-2px);
}

.summary-cards .card h4 {
  margin-bottom: 8px;
  font-weight: 500;
  font-size: 0.95rem;
  color: #1f2937;
}

.summary-cards .card p {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1f2937;
}

.table-section {
  margin-bottom: 20px;
}

.report-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.report-table thead tr {
  background-color: #1f2937;
  color: white;
  font-weight: 500;
}

.report-table th,
.report-table td {
  padding: 10px;
  text-align: left;
}

.report-table tbody tr {
  background-color: #f9fafb;
  transition: background-color 0.2s ease;
}

.report-table tbody tr:hover {
  background-color: #f1f5f9;
}

.charts-section {
  margin-bottom: 20px;
}

.chart-wrapper {
  padding: 10px;
}

.chart-wrapper h4 {
  font-size: 0.95rem;
  font-weight: 500;
  margin-bottom: 10px;
  color: #1f2937;
}

.charts-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.charts-container canvas {
  width: 100% !important;
  height: 200px !important;
  border-radius: 8px;
  background-color: #fff;
}

.export-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-start;
}

.export-buttons .btn {
  padding: 8px 16px;
  background-color: #6b7280;
  border: none;
  color: white;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.9rem;
}

.export-buttons .btn:hover {
  background-color: #4b5563;
}

@media (max-width: 900px) {
  .relatorio-content {
    flex-direction: column;
  }
  .filters-sidebar {
    width: 100%;
    margin-bottom: 20px;
  }
  .summary-cards {
    grid-template-columns: 1fr;
  }
  .charts-container {
    grid-template-columns: 1fr;
  }
}
</style>
