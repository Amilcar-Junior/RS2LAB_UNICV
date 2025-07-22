<template>
  <div>
    <div class="container-fluid mt-5">
      <!-- <router-link to="/biosentry/dashboard" class="btn btn-secondary mb-3 rounded-buttonback">
        <i class="fa fa-arrow-left" aria-hidden="true"></i> 
      </router-link> -->
      <!-- Título da Página -->
      <h3
        class="text-left"
        style="
          font-family: 'Roboto', sans-serif;
          font-weight: 700;
          margin-bottom: 20px;
        "
      >
        Dispositivos
      </h3>
      <div class="card">
        <div
          class="card-header d-flex justify-content-between align-items-center"
        >
          <!-- <h4>Dispositivo</h4> -->
          <input 
              type="text"
              class="form-control d-inline-block w-auto"
              placeholder="Buscar por Edificio, ID..."
              v-model="searchQuery"
            />
          <div>
            <b-button
              class="ml-2"
              style="
                background-color: #007bff;
                border-color: #007bff;
                color: white;
              "
              @click="showModalAdd = true"
              v-show="
                keys.TipoUtilizador_Nome === userTypes.ADMINBIOSENTRY || keys.TipoUtilizador_Nome === userTypes.ADMINISTRATOR || keys.TipoUtilizador_Nome === userTypes.GESTOR
              "
              v-b-tooltip.hover.top="'Adicionar'"
            >
              <i class="fa fa-plus" aria-hidden="true"></i> 
            </b-button>

            <!-- <button
              class="btn btn-danger ml-2"
              @click="deleteSelectedItems"
              :disabled="selectedItems.length === 0"
             >
              <i class="fa fa-trash" aria-hidden="true"></i> Deletar Selecionados
            </button> -->
          </div>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-bordered">
              <thead>
                <tr>
                  <!-- <th scope="col" class="col-1">
                    <input type="checkbox" @change="toggleSelectAll($event)" />
                  </th> -->
                  <th scope="col" class="col-1">Identificador</th>
                  <th scope="col" class="col-1">Edificio</th>
                  <th scope="col" class="col-1">Tipo</th>
                  <th scope="col" class="col-1">Status</th>
                  <th scope="col" class="col-1">Data de Registo</th>
                  <th
                    scope="col"
                    class="col-1 text-center"
                    v-show="
                      keys.TipoUtilizador_Nome === userTypes.ADMINBIOSENTRY || keys.TipoUtilizador_Nome === userTypes.ADMINISTRATOR || keys.TipoUtilizador_Nome === userTypes.GESTOR
                    "
                  >
                    Ações
                  </th>
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
                  <td>{{ item.id_dispositivo }}</td>
                  <td>{{ item.nome_edificio  }}</td>
                  <td>{{ item.tipo }}</td>
                  <td>{{ item.status }}</td>
                  <td>{{formatDate(item.data_registo) }}</td>
                  <td
                    class="text-center"
                    v-show="
                      keys.TipoUtilizador_Nome === userTypes.ADMINBIOSENTRY || keys.TipoUtilizador_Nome === userTypes.ADMINISTRATOR || keys.TipoUtilizador_Nome === userTypes.GESTOR
                    "
                  >
                    <button
                      type="button"
                      @click="editItem(item)"
                      class="btn btn-info mr-2 "
                    >
                      <i class="fa fa-pencil-square-o" aria-hidden="true"></i> 
                    </button>
                    <button
                      type="button"
                      @click="ShowConfirmDelete(item.id_dispositivo)"
                      class="btn btn-danger "
                    >
                      <i class="fa fa-trash" aria-hidden="true"></i> 
                    </button>
                  </td>
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

      <!-- Modal para edicao -->
      <b-modal v-model="showModalEdit" title="Editar Dispositivo" hide-footer>
        <b-form @submit.prevent="saveDevice">
          <b-form-group label="Edifício" label-for="id_edificio">
            <b-form-select
              id="id_edificio"
              v-model="currentDevice.id_edificio"
              :options="edificios.map(edificio => ({ value: edificio.id_edificio, text: edificio.nome_edificio  }))"
              required
            ></b-form-select>
          </b-form-group>

          <b-form-group label="UID do Dispositivo" label-for="id_dispositivo">
            <b-form-input
              id="id_dispositivo"
              v-model="currentDevice.id_dispositivo"
              required
            ></b-form-input>
          </b-form-group>

          <b-form-group label="Tipo" label-for="tipo">
            <b-form-input
              id="tipo"
              v-model="currentDevice.tipo"
              required
            ></b-form-input>
          </b-form-group>

          <b-form-group label="Status" label-for="status">
            <b-form-input
              id="status"
              v-model="currentDevice.status"
              required
            ></b-form-input>
          </b-form-group>

          <!-- <b-form-group label="Data de Registro" label-for="data_registo">
              <b-form-input
                id="data_registo"
                v-model="currentDevice.data_registo"
                type="datetime-local"
                required
              ></b-form-input>
            </b-form-group> -->

          <b-button type="submit" variant="success">Salvar</b-button>
          <b-button variant="secondary" @click="showModalEdit = false"
            >Cancelar</b-button
          >
        </b-form>
      </b-modal>

      <!-- Modal para Adicionar -->
      <b-modal v-model="showModalAdd" title="Adicionar Dispositivo" hide-footer>
        <b-form @submit.prevent="saveDevice">
          <b-form-group label="Edifício" label-for="edificio">
            <b-form-select
              id="edificio"
              v-model="model.item.id_edificio"
              :options="edificios.map(edificio => ({ value: edificio.id_edificio, text: edificio.nome_edificio  }))"
              required
            ></b-form-select>
          </b-form-group>

          <b-form-group label="UID do Dispositivo" label-for="id_dispositivo">
            <b-form-input
              id="id_dispositivo"
              v-model="model.item.id_dispositivo"
              required
            ></b-form-input>
          </b-form-group>

          <b-form-group label="Tipo" label-for="tipo">
            <b-form-input
              id="tipo"
              v-model="model.item.tipo"
              required
            ></b-form-input>
          </b-form-group>

          <b-form-group label="Status" label-for="status">
            <b-form-input
              id="status"
              v-model="model.item.status"
              required
            ></b-form-input>
          </b-form-group>

          <b-button type="submit" variant="success">Salvar</b-button>
          <b-button variant="secondary" @click="showModalAdd = false"
            >Cancelar</b-button
          >
        </b-form>
      </b-modal>
    </div>
  </div>
</template>

<script>
module.exports = {
  // name: "sensor",
  props: ["keys"],
  data() {
    return {
      model: {
        item: {
          id_edificio: "",
          id_dispositivo: "",
          tipo: "",
          status: "",
        },
      },
      items: [],
      edificios: [],
      showModalEdit: false,
      showModalAdd: false,
      selectedItems: [], // Adiciona esta linha
      perPage: 10,
      currentPage: 1,
      searchQuery: "",
      userTypes: window.appConfig.userTypes,
      currentDevice: {
        id: null,
        id_edificio: "",
        id_dispositivo: "",
        tipo: "",
        status: "",
        
      },
    };
  },
  mounted() {
    this.retrieveItems();
    this.retrieveEdificios();
  },
  computed: {
    totalRows() {
      return this.filteredItems.length;
    },
    totalPages() {
      return Math.ceil(this.totalRows / this.perPage);
    },
    filteredItems() {
      return this.items
        .filter((item) => {
          if (this.keys.TipoUtilizador_Nome === this.userTypes.ADMINBIOSENTRY || this.keys.TipoUtilizador_Nome === this.userTypes.ADMINISTRATOR || this.keys.TipoUtilizador_Nome === this.userTypes.GESTOR) {
            return true;
          }
          const userGroupIds = this.keys.Grupos
            ? this.keys.Grupos.map((group) => group.ID)
            : [];
          return userGroupIds.includes(item.Grupo_ID);
        })
        .filter((item) => {
          return (
             item.nome_edificio
               .toLowerCase()
               .includes(this.searchQuery.toLowerCase()) ||
            item.id_dispositivo.toLowerCase().includes(
              this.searchQuery.toLowerCase()
            )
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
    formatDate(dateString) {
      const date = new Date(dateString);
      // Ajusta para o fuso horário de Cabo Verde (UTC -1)
    const caboVerdeDate = new Date(date.getTime()); // Subtrai 1 hora para Cabo Verde
    return caboVerdeDate.toLocaleString("pt-PT", { timeZone: "Atlantic/Cape_Verde" });
      },

    retrieveItems() {
      axios
        .get("/biosentry/devices")
        .then((response) => {
          this.items = response.data;
        })
        .catch((error) => {
          console.error("Erro ao recuperar Dispositivo:", error);
        });
    },
    retrieveEdificios() {
      axios
        .get("/biosentry/edificios")
        .then((response) => {
          this.edificios = response.data;
        })
        .catch((error) => {
          console.error("Erro ao recuperar Edificios:", error);
        });
    },
    toggleSelectAll(event) {
      if (event.target.checked) {
        this.selectedItems = this.paginatedItems.map((item) => item.id_dispositivo);
      } else {
        this.selectedItems = [];
      }
    },

    //Shows a dialog notification
    showNotification(message, variant, title) {
      this.$bvToast.toast(message, {
        title: title,
        variant: variant,
        solid: true,
      });
    },
    editItem(item) {
      // Map edificio to id_edificio if needed
      this.currentDevice = {
        ...item,
        id_edificio: item.id_edificio || item.nome_edificio  || "",
      };
      this.showModalEdit = true;
    },
    async saveDevice() {
      if (this.currentDevice.id_dispositivo) {
        const uidExists = this.items.some(
          (item) =>
            item.id_dispositivo === this.currentDevice.id_dispositivo &&
            item.id !== this.currentDevice.id
        );
        if (uidExists) {
          this.showNotification(
            "O UID do dispositivo já existe. Por favor, use um UID único.",
            "danger",
            "Erro"
          );
          return; // Impede o salvamento
        }
        // Atualiza um dispositivo existente
        axios
          .put(
            `/biosentry/devices/${this.currentDevice.id_dispositivo}`,
            this.currentDevice
          )
          .then(() => {
            this.showNotification(
              "Dispositivo atualizado com sucesso!",
              "success",
              "Atualização"
            );
            this.retrieveItems();
            this.resetCurrentDevice();
          })
          .catch(() => {
            this.showNotification(
              "Falha ao atualizar o dispositivo!",
              "danger",
              "Erro"
            );
          });
          this.showModalEdit = false;
      } else {
          // Verifica se o UID já existe antes de adicionar
          const uidExists = this.items.some(
            (item) => item.id_dispositivo === this.model.item.id_dispositivo
          );

          if (uidExists) {
            this.showNotification(
              "O UID do dispositivo já existe. Por favor, use um UID único.",
              "danger",
              "Erro"
            );
            return; // Impede o salvamento
          }

        // Adiciona um novo dispositivo
        axios
          .post("/biosentry/addDevices", this.model.item)
          .then(() => {
            this.showNotification(
              "Dispositivo adicionado com sucesso!",
              "success",
              "Sucesso"
            );
            this.retrieveItems();
            this.resetCurrentDevice();
          })
          .catch(() => {
            this.showNotification(
              "Falha ao adicionar o dispositivo!",
              "danger",
              "Erro"
            );
          });
      }
      this.showModalAdd = false;
    },
    resetCurrentDevice() {
      (this.model.item = {
        id: null,
        id_edificio: "",
        id_dispositivo: "",
        tipo: "",
        status: "",
        data_registo: "",
      }),
        (this.currentDevice = {
          id: null,
          id_edificio: "",
          id_dispositivo: "",
          tipo: "",
          status: "",
          data_registo: "",
        });
    },

    deleteItem(ItemID) {
      axios
        .get(`/biosentry/students/devices/${ItemID}`)
        .then((response) => {
          if (response.data.length > 0) {
            this.showNotification(
              "Este dispositivo possui estudantes registados. A eliminação não é permitida.",
              "warning",
              "Atenção"
            );
          } else {
            axios
              .delete(`/biosentry/deletedevices/${ItemID}`)
              .then(() => {
                this.ShowDeleteNotification(
                  "Dispositivo deletado com sucesso!",
                  "success",
                  "Sucesso"
                );
                this.retrieveItems();
              })
              .catch((error) => {
                console.error("Erro ao deletar Dispositivos:", error);
                this.ShowDeleteNotification(
                  "Erro ao Deletar Dispositivo.",
                  "danger",
                  "Erro"
                );
              });
          }
        })
        .catch((error) => {
          console.error("Erro ao verificar estudantes:", error);
          this.showNotification(
            "Erro ao verificar estudantes associados ao dispositivo.",
            "danger",
            "Erro"
          );
        });
    },
 
    ShowDeleteNotification(message, variant, title) {
      this.$bvToast.toast(message, {
        title: title,
        variant: variant,
        solid: true,
      });
    },
    ShowConfirmDelete(ItemID) {
      this.$bvModal
        .msgBoxConfirm("Deseja deletar esse Dispositivo?", {
          title: "Deletar",
          size: "sm",
          buttonSize: "sm",
          okVariant: "danger",
          okTitle: "Sim",
          cancelTitle: "Não",
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true,
        })
        .then((value) => {
          if (value) {
            this.deleteItem(ItemID);
          }
        })
        .catch((err) => {
          console.error("Erro ao exibir a caixa de diálogo:", err);
        });
    },

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

.btn {
  transition: all 0.2s ease;
  margin-left: 5px;
  margin-right: 5px;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.modal-content {
  border-radius: 8px;
}

.modal-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .table-responsive {
    overflow-x: auto;
  }
  
  .card-header {
    flex-direction: column;
    gap: 10px;
  }
  
  .btn {
    margin-bottom: 5px;
    margin-left: 0;
    margin-right: 0;
    width: 100%;
  }
  
  .table tbody td {
    padding: 8px;
  }
}
</style>
