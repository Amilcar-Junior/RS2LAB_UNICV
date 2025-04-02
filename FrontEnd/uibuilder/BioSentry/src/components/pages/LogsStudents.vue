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
            placeholder="Buscar por Edificio, Nome,Status..."
            v-model="searchQuery"
          />
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
                    <th scope="col" class="col-1">Status</th>
                    <th scope="col" class="col-1">Data/Hora </th>
                    <th scope="col" class="col-1">In/Out</th>
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
                    <td>{{ item.status_ }}</td>
                    <td>{{ formatDate(item.data_hora) }}</td>
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
        return (
          item.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          item.log_info.toLowerCase().includes(this.searchQuery.toLowerCase()) 
      //  item.edificio.toLowerCase().includes(this.searchQuery.toLowerCase()) 
        //  item.status_.toString().includes(this.searchQuery)
        );
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
      axios
          .get("/biosentry/logsStudents")
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
