<template>
    <div>
      <div class="container-fluid mt-5">
        <!-- <router-link to="/biosentry/dashboard" class="btn btn-secondary mb-3 rounded-buttonback">
          <i class="fa fa-arrow-left" aria-hidden="true"></i> 
        </router-link> -->
         <!-- Título da Página -->
         <h2 class="text-center" style="font-family: 'Roboto', sans-serif; font-weight: 700; margin-bottom: 20px;">
            Histórico de acesso
          </h2>
        <div class="card">
          <div
            class="card-header d-flex justify-content-between align-items-center"
          >
          <input
            type="text"
            class="form-control d-inline-block w-auto"
            placeholder="Buscar por Edificio, Nome,..."
            v-model="searchQuery"
          />
          <div class="d-inline-block mx-2" style="max-width: 150px;">
            <label for="accessTypeSelect" class="form-label">Tipo de Acesso</label>
            <select id="accessTypeSelect" v-model="accessType" class="form-control w-100">
              <option value="Todos">Todos</option>
              <option value="in">Entrada</option>
              <option value="out">Saída</option>
            </select>
          </div>
          <div class="d-inline-block mx-2" style="max-width: 180px;">
            <label for="startDateInput" class="form-label">Data de Início</label>
            <input id="startDateInput" type="date" v-model="startDate" class="form-control w-100" />
          </div>
          <div class="d-inline-block mx-2" style="max-width: 180px;">
            <label for="endDateInput" class="form-label">Data de Fim</label>
            <input id="endDateInput" type="date" v-model="endDate" class="form-control w-100" />
          </div>
          <router-link
            :to="{
              path: '/biosentry/gerar-relatorio',
              query: {
                searchQuery: searchQuery,
                accessType: accessType,
                startDate: startDate,
                endDate: endDate
              }
            }"
            class="btn btn-primary"
          >
            Gerar Relatório
          </router-link>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <!-- <th scope="col" class="col-1">
                      <input type="checkbox" @change="toggleSelectAll($event)" />
                    </th> -->
                    <!-- <th scope="col" class="col-1">ID</th> -->
                    <th scope="col" class="col-2">Nome</th>
                    <th scope="col" class="col-1">Data/Hora </th>
                    <th scope="col" class="col-1">Edificio</th>
                    <th scope="col" class="col-1">Entrada/Saída</th>
                  </tr>
                </thead>
                <tbody v-if="paginatedItems.length > 0">
                  <tr v-for="(item, index) in paginatedItems" :key="index">
                    <!-- <td>
                      <input
                        type="checkbox"
                        :value="item.id"
                        v-model="selectedItems"
                      />
                    </td> -->
                    <!-- <td>{{ item.id }}</td> -->
                    <td>{{ item.name }}</td>
                    <td>{{ formatDate(item.data_hora) }}</td>
                    <td>{{ item.nome_edificio  }}</td>
                    <td>{{ item.logg_info}}</td>
                  </tr>
                </tbody>
                <tbody v-else>
                <tr>
                  <td colspan="6" class="text-center">
                    {{
                      searchQuery
                        ? "Não foi encontrado nenhum resultado para a pesquisa."
                        : "Nenhum dispositivo registrado."
                    }}
                  </td>
                </tr>
              </tbody>
              </table>

              <!-- Loader para indicar carregamento -->
            <!-- <div v-show="isLoading" class="text-center">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div> -->
            </div>
            <div class="d-flex justify-content-center">
              <b-pagination
                v-if="totalPages > 1"
                v-model="currentPage"
                :total-rows="totalRows"
                :per-page="perPage"
                aria-controls="utilizadores-table"
                class="custom-pagination"
              ></b-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

<script>
module.exports = {
  props: ["keys"],
  data() {
    return {
      // model: {
      //   item: {
      //     nome: "",
      //     codigo_estudante:'',
      //     device_id: "",
      //     email: "",
      //     curso:"",
      //     status_: ""
      //   },
      // },
      items: [],
      perPage: 100,
      currentPage: 1,
      searchQuery: "",
      accessType: "Todos",
      startDate: null,
      endDate: null,
      userTypes: window.appConfig.userTypes,
    };
  },
  mounted() {
    this.fetchLogs();
    this.updateInterval = setInterval(this.fetchLogs, 5000);
    // this.retrieveItems();
    // this.getEdificio();
  },
  beforeDestroy() {
    // Limpa o intervalo ao sair da página
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  },
  computed: {
    totalRows() {
      return this.filteredItems.length;
    },
    totalPages() {
      return Math.ceil(this.totalRows / this.perPage);
    },

    filteredItems() {
      return this.items.filter((item) => {
        const matchesSearch =
          item.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          item.logg_info.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          item.nome_edificio.toLowerCase().includes(this.searchQuery.toLowerCase());

        const matchesAccessType =
          this.accessType === "Todos" || item.logg_info === this.accessType;

        const itemDate = new Date(item.data_hora);
        const startDate = this.startDate ? new Date(this.startDate) : null;
        const endDate = this.endDate ? new Date(this.endDate) : null;

        const matchesStartDate = !startDate || itemDate >= startDate;
        const matchesEndDate = !endDate || itemDate <= endDate;

        return matchesSearch && matchesAccessType && matchesStartDate && matchesEndDate;
      });
    },

    paginatedItems() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.filteredItems.slice(start, end);
    },
  },
  methods: {
   
    fetchLogs() {
      const params = {
        searchQuery: this.searchQuery,
      };
      if (this.accessType && this.accessType !== "Todos") {
        params.accessType = this.accessType;
      }
      if (this.startDate) {
        params.startDate = this.startDate;
      }
      if (this.endDate) {
        params.endDate = this.endDate;
      }
      axios
          .get("/biosentry/logsStudents", { params })
          .then((response) => {
          console.log("Dados recebidos da API:", response.data);
          this.items = response.data;

          })
          .catch((error) => {
            console.error("Erro ao recuperar Logestudantes:", error);
          });
    },

    formatDate(dateString) {
      const options = { 
        timeZone: 'Atlantic/Cape_Verde', 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      };
      return new Date(dateString).toLocaleString('pt-PT', options);
    }

  },
};
</script>

<style scoped>
.table-responsive {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.table {
  margin-bottom: 0;
  width: 100%;
}

.table thead th {
  background-color: #ab162b;
  color: white;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
  border-bottom: none;
  padding: 12px 15px;
  vertical-align: middle;
}

.table tbody tr {
  transition: all 0.2s ease;
}

.table tbody tr:hover {
  background-color: #f8f9fa;
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.table tbody tr:nth-child(even) {
  background-color: #f8f9fa;
}

.table tbody td {
  padding: 12px 15px;
  vertical-align: middle;
  border-top: 1px solid #e9ecef;
}

.card {
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.card-header {
  background-color: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-control {
  border-radius: 4px;
  border: 1px solid #ddd;
  transition: all 0.3s ease;
  padding: 8px 12px;
}

.form-control:focus {
  border-color: #2c3e50;
  box-shadow: 0 0 0 0.2rem rgba(44, 62, 80, 0.25);
}

.custom-pagination .page-item.active .page-link {
  background-color: #2c3e50;
  border-color: #2c3e50;
}

.custom-pagination .page-link {
  color: #2c3e50;
  padding: 8px 16px;
}

@media (max-width: 768px) {
  .table-responsive {
    overflow-x: auto;
  }
  
  .card-header {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
