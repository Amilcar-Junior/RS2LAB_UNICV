<template>
  <div>
    <div class="container-fluid mt-5">
      <router-link to="/biosentry/dashboard" class="btn btn-secondary mb-3 rounded-buttonback">
        <i class="fa fa-arrow-left" aria-hidden="true"></i> 
      </router-link>
      <!-- Título da Página -->
      <h2
        class="text-center"
        style="
          font-family: 'Roboto', sans-serif;
          font-weight: 700;
          margin-bottom: 20px;
        "
      >
        Dispositivos
      </h2>
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
                keys.TipoUtilizador_Nome === userTypes.ADMINBIOSENTRY 
              "
            >
              <i class="fa fa-plus" aria-hidden="true"></i> Adicionar
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
                  <th scope="col" class="col-1">ID</th>
                  <th scope="col" class="col-2">Edificio</th>
                  <th scope="col" class="col-2">UID do Dispositivo</th>
                  <th scope="col" class="col-1">Data de Registro</th>
                  <th
                    scope="col"
                    class="col-1 text-center"
                    v-show="
                      keys.TipoUtilizador_Nome === userTypes.ADMINBIOSENTRY
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
                  <td>{{ item.id }}</td>
                  <td>{{ item.edificio }}</td>
                  <td>{{ item.UID_disposit }}</td>
                  <td>{{ item.data_registo }}</td>
                  <td
                    class="text-center"
                    v-show="
                      keys.TipoUtilizador_Nome === userTypes.ADMINBIOSENTRY
                    "
                  >
                    <button
                      type="button"
                      @click="editItem(item)"
                      class="btn btn-info mr-2 button"
                    >
                      <i class="fa fa-pencil-square-o" aria-hidden="true"></i> 
                    </button>
                    <button
                      type="button"
                      @click="ShowConfirmDelete(item.id)"
                      class="btn btn-danger button"
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
          <b-form-group label="Edifício" label-for="edificio">
            <b-form-input
              id="edificio"
              v-model="currentDevice.edificio"
              required
            ></b-form-input>
          </b-form-group>

          <b-form-group label="UID do Dispositivo" label-for="UID_disposit">
            <b-form-input
              id="UID_disposit"
              v-model="currentDevice.UID_disposit"
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
            <b-form-input
              id="edificio"
              v-model="model.item.edificio"
              required
            ></b-form-input>
          </b-form-group>

          <b-form-group label="UID do Dispositivo" label-for="UID_disposit">
            <b-form-input
              id="UID_disposit"
              v-model="model.item.UID_disposit"
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
          edificio: "",
          UID_disposit: "",
        },
      },
      items: [],
      showModalEdit: false,
      showModalAdd: false,
      selectedItems: [], // Adiciona esta linha
      perPage: 10,
      currentPage: 1,
      searchQuery: "",
      userTypes: window.appConfig.userTypes,
      currentDevice: {
        id: null,
        edificio: "",
        UID_disposit: "",
        // data_registo: ''
      },
    };
  },
  mounted() {
    this.retrieveItems();
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
          if (this.keys.TipoUtilizador_Nome === this.userTypes.ADMINBIOSENTRY) {
            return true;
          }
          const userGroupIds = this.keys.Grupos
            ? this.keys.Grupos.map((group) => group.ID)
            : [];
          return userGroupIds.includes(item.Grupo_ID);
        })
        .filter((item) => {
          return (
            item.edificio
              .toLowerCase()
              .includes(this.searchQuery.toLowerCase()) ||
            item.id.toString().includes(this.searchQuery) ||
            item.UID_disposit.toLowerCase().includes(
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
    toggleSelectAll(event) {
      if (event.target.checked) {
        this.selectedItems = this.paginatedItems.map((item) => item.id);
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
      this.currentDevice = { ...item };
      this.showModalEdit = true;
    },
    async saveDevice() {
      if (this.currentDevice.id) {
        const uidExists = this.items.some(
          (item) =>
            item.UID_disposit === this.currentDevice.UID_disposit &&
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
            `/biosentry/devices/${this.currentDevice.id}`,
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
      } else {
          // Verifica se o UID já existe antes de adicionar
          const uidExists = this.items.some(
            (item) => item.UID_disposit === this.model.item.UID_disposit
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
        edificio: "",
        UID_disposit: "",
        data_registo: "",
      }),
        (this.currentDevice = {
          id: null,
          edificio: "",
          UID_disposit: "",
          data_registo: "",
        });
    },

    deleteItem(ItemID) {
      axios
        .get(`/biosentry/students/devices/${ItemID}`)
        .then((response) => {
          if (response.data.length > 0) {
            this.showNotification(
              "Este dispositivo possui estudantes registrados. A exclusão não é permitida.",
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
    // deleteSelectedItems() {
    //   this.$bvModal
    //     .msgBoxConfirm(
    //       `Deseja deletar os seguintes itens? ${this.selectedItems.join(", ")}`,
    //       {
    //         title: "Deletar Selecionados",
    //         size: "sm",
    //         buttonSize: "sm",
    //         okVariant: "danger",
    //         okTitle: "Sim",
    //         cancelTitle: "Não",
    //         footerClass: "p-2",
    //         hideHeaderClose: false,
    //         centered: true,
    //       }
    //     )
    //     .then((value) => {
    //       if (value) {
    //         // Faz a chamada para deletar cada item selecionado
    //         Promise.all(
    //           this.selectedItems.map((id) =>
    //             axios.delete(`/biosentry/deletedevices/${id}`)
    //           )
    //         )
    //           .then(() => {
    //             this.ShowDeleteNotification(
    //               "Dispositivos deletados com sucesso!",
    //               "success",
    //               "Sucesso"
    //             );
    //             this.selectedItems = [];
    //             this.retrieveItems();
    //           })
    //           .catch((error) => {
    //             console.error("Erro ao deletar Dispositivos:", error);
    //             this.ShowDeleteNotification(
    //               "Erro ao Deletar Dispositivos.",
    //               "danger",
    //               "Erro"
    //             );
    //           });
    //       }
    //     })
    //     .catch((err) => {
    //       console.error("Erro ao exibir a caixa de diálogo:", err);
    //     });
    // },
    // deleteItem(ItemID) {
    //   axios
    //     .delete(`/biosentry/deletedevices/${ItemID}`)
    //     .then(() => {
    //       this.ShowDeleteNotification(
    //         "Dispositivo deletado com sucesso!",
    //         "success", "Sucesso"
    //       );
    //       this.retrieveItems();
    //     })
    //     .catch((error) => {
    //       console.error("Erro ao deletar Dispositivo:", error);
    //       this.ShowDeleteNotification(
    //         "Erro ao Deletar Dispositivo.",
    //         "danger","Erro"
    //       );
    //     });
    // },
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
    // checkUIDExists(uid) {
    //     // Verifica se o UID já existe na lista de dispositivos
    //     return this.items.some(item => item.UID_disposit === uid);
    //   },
  },
};
</script>

<style scoped>
.logo-img {
  width: 25px;
  height: auto;
}
</style>
