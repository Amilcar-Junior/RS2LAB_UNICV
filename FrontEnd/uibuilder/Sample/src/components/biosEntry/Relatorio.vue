<template>
    <div class="container">
      <h2>Gerar Relatório de Eventos</h2>
      <form @submit.prevent="generateReport">
        <div class="form-group">
          <label for="startDate">Data de Início:</label>
          <input type="date" v-model="startDate" class="form-control" required />
        </div>
        <div class="form-group">
          <label for="endDate">Data de Fim:</label>
          <input type="date" v-model="endDate" class="form-control" required />
        </div>
        <div class="form-group">
          <label for="logType">Tipo de Log:</label>
          <select v-model="logType" class="form-control">
            <option value="all">Todos</option>
            <option value="success">Sucesso</option>
            <option value="failure">Falha</option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary">Gerar Relatório</button>
      </form>
      <div v-if="reportData">
        <h3>Relatório</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Status</th>
              <th>Data/Hora</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in reportData" :key="item.id">
              <td>{{ item.name }}</td>
              <td>{{ item.status }}</td>
              <td>{{ formatDate(item.timestamp) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  module.exports = {
    data() {
      return {
        startDate: '',
        endDate: '',
        logType: 'all',
        reportData: null,
      };
    },
    methods: {
      generateReport() {
        // Chamada à API para buscar os dados do relatório
        axios
          .get('/api/report', {
            params: {
              startDate: this.startDate,
              endDate: this.endDate,
              logType: this.logType,
            },
          })
          .then((response) => {
            this.reportData = response.data;
          })
          .catch((error) => {
            console.error('Erro ao gerar relatório:', error);
          });
      },
      formatDate(dateString) {
        return new Date(dateString).toLocaleString();
      },
    },
  };
  </script>
  
  <style scoped>
  /* Adicione estilos conforme necessário */
  </style>