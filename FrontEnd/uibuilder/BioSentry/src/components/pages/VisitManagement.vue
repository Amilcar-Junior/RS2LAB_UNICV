<template>
    <div>
      <div class="container-fluid mt-5">
        <!-- <router-link to="/biosentry/dashboard" class="btn btn-secondary mb-3 rounded-buttonback">
          <i class="fa fa-arrow-left" aria-hidden="true"></i> 
        </router-link> -->
        <!-- Título da Página -->
        <h3
          class="text-center"
          style="
            font-family: 'Roboto', sans-serif;
            font-weight: 700;
            margin-bottom: 20px;
          "
        >
         Visitantes 
        </h3>
        <!-- <img src="./components/images/rfid1.png" alt="digital" class="custom-img" style="display: block; margin: 0 auto; width: 70px; margin-bottom: 50px;"   /> -->
  
        <div class="card">
          <div
            class="card-header d-flex justify-content-between align-items-center"
          >
            <input
              type="text"
              class="form-control d-inline-block w-auto"
              placeholder="Buscar por Nome, ..."
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
  
              <button
                class="btn btn-danger ml-2"
                @click="deleteSelectedItems"
                :disabled="selectedItems.length === 0"
              >
                <i class="fa fa-trash" aria-hidden="true"></i> Deletar
                Selecionados
              </button>
            </div>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th scope="col" class="col-1">
                      <input type="checkbox" @change="toggleSelectAll($event)" />
                    </th>
                  <!--  <th scope="col" class="col-1">ID</th>-->
                    <th scope="col" class="col-2">Nome</th>
                    <th scope="col" class="col-1">Codigo</th>
                    <th scope="col" class="col-1">Status</th>
                    <th scope="col" class="col-1">Edificio</th>
                    <th scope="col" class="col-1">Função</th>
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
                    <td>
                      <input
                        type="checkbox"
                        :value="item.codigo"
                        v-model="selectedItems"
                      />
                    </td>
             
                    <td>{{ item.name }}</td>
                    <td>{{ item.codigo }}</td>
                    <td>{{ getStatusText(item.status_ )}}</td>
                    <td>{{ item.nome_edificio }}</td>
                    <td>{{ item.nome_perfil }}</td>
              
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
                        <i class="fa fa-pencil-square-o" aria-hidden="true"></i> <!-- Icone de Editar-->
                      </button>
                      <button
                        type="button"
                        @click="ShowConfirmDelete(item.codigo)"
                        class="btn btn-danger button"
                      >
                        <i class="fa fa-trash" aria-hidden="true"></i> <!-- Icone de eliminar-->
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
                          : "Nenhuma pessoa registada."
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
  
        <!-- Modal para Adição -->
        <b-modal v-model="showModalAdd" title="Adicionar" hide-footer>
          <b-form @submit.prevent="saveUser">
            <div class="mb-3">
              <label for="id_dispositivo">Edificio:</label>
              <select
                id="id_dispositivo"
                v-model="model.item.id_dispositivo"
                class="form-control"
                required
              >
                <option value="" disabled >Selecione o Edificio</option>
                <option v-for="dispositivo in dispositivos" 
                        :key="dispositivo.id_dispositivo" 
                        :value="dispositivo.id_dispositivo">
                  {{ dispositivo.nome_edificio }}
                </option>
              </select>
              </div>
            <hr/>
            
            <b-form-group label="Nome" label-for="name">
              <b-form-input
                id="name"
                v-model="model.item.name"
                required
              ></b-form-input>
            </b-form-group>
  
            <b-form-group
              label="Codigo"
              label-for="codigo"
              description="Codigo deve ter apenas 6 digitos."
            >
              <b-form-input
                id="codigo"
                v-model="model.item.codigo"
                @keypress="preventLetters"
                required
              ></b-form-input>
            </b-form-group>
              
              <div>
                <label for="id_perfil">Função:</label>
                <select 
                id="id_perfil" 
                v-model.number="model.item.id_perfil" 
                class="form-control">
                  <option value="" disabled >Selecione a função da pessoa a ser registada</option>
                  <option v-for="perfil in perfis" 
                        :key="perfil.id_perfil"
                        :value="perfil.id_perfil"> 
                        {{ perfil.nome_perfil }}
                  </option>
              </select>
              </div>
  
              <b-col>
                <b-form-group label="Status">
                    <b-form-radio-group
                      v-model="model.item.status_"
                      :options="statusOptions"
                      buttons
                    ></b-form-radio-group>
                  </b-form-group>
              </b-col>
  
              <b-button
                type="submit"
                variant="success"
              
              >
              Registar
              </b-button>
  
              <!-- New button to start RFID reading -->
              <b-button
                type="button"
                variant="primary"
                class="ml-2"
                @click="startCardProcess"
              >
                Iniciar Leitura RFID
              </b-button>
  
              <b-button variant="secondary" @click="showModalAdd = false"
              >Cancelar</b-button
              >
  
          </b-form>
        </b-modal> 

  
        <!-- Modal para Editar -->
      <b-modal v-model="showModalEdit" title="Editar " hide-footer>
          <b-form @submit.prevent="saveUser">
            <div class="mb-3">
              <label for="id_dispositivo">Edificio:</label>
              <select
                id="id_dispositivo"
                v-model.number="currentUser.id_dispositivo"
                class="form-control"
                required
              >
                <!-- <option value="" disabled >Selecione o Edificio</option> -->
                <option v-for="dispositivo in dispositivos" 
                      :key="dispositivo.id_dispositivo" 
                      :value="dispositivo.id_dispositivo">
                {{ dispositivo.nome_edificio }}
                </option>
              </select>
            </div>
            <hr/>
            <b-form-group label="Nome" label-for="name">
              <b-form-input
                id="name"
                v-model="currentUser.name"
                required
              ></b-form-input>
            </b-form-group>
  
            <b-form-group
              label="Codigo"
              label-for="codigo"
            >
              <b-form-input
                id="codigo"
                v-model="currentUser.codigo"
                @keypress="preventLetters"
                required
                readonly
              ></b-form-input>
            </b-form-group>
  
            <div>
                <label for="id_perfil">Função:</label>
                <select 
                id="id_perfil" 
                v-model.number="currentUser.id_perfil" 
                class="form-control"
                required>
                  <!-- <option value="" disabled >Selecione a função da pessoa a ser registada</option> -->
                  <option v-for="perfil in perfis" 
                        :key="perfil.id_perfil"
                        :value="perfil.id_perfil"> 
                        {{ perfil.nome_perfil }}
                  </option>
              </select>
              </div>
     
  
            <b-form-group label="Status">
                    <b-form-radio-group
                      v-model="currentUser.status_"
                      :options="statusOptions"
                      buttons
                    ></b-form-radio-group>
                  </b-form-group>
  
            <b-button type="submit" variant="success">Salvar</b-button>
            <b-button variant="secondary" @click="showModalEdit = false"
              >Cancelar</b-button
            >
          </b-form>
        </b-modal>
        <!-- Fim Modal Editar -->
      </div>
    </div>
  </template>
  
  <script>
  module.exports = {
    props: ["keys"],
    data() {
      return {
        statusOptions: [
          { text: 'Ativo', value: '1' },
          { text: 'Inativo', value: '0' }
        ],
        dispositivos: [],
        perfis: [],
        model: {
          item: {
            name: "",
            codigo: "",
            id_dispositivo: "",
            id_perfil: "",
            status_: "",
            tagId: null,
          },
        },
        items: [],
        codigo: "",
        showModalEdit: false,
        showModalAdd: false,
        selectedItems: [],
        perPage: 10,
        currentPage: 1,
        searchQuery: "",
        userTypes: window.appConfig.userTypes,
        currentUser: {
          codigo: "",
          name: "",
          id_dispositivo: "",
          id_perfil: "",
          status_: "",
          tagId:null,
        },
        isSaving: false,
        cardRegisted: false,
        notifications: [],
      
  
      };
    },
  
    mounted() {
      this.retrieveItems();
      this.getEdificio();
      this.getPerfil();
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
            item.status_.toString().includes(this.searchQuery)
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
      getStatusText(status_) {
        return {
          0: 'Inativo',
          1: 'Ativo'
        }[status_] || 'Desconhecido';
    },
      preventLetters(event) {
        const char = String.fromCharCode(event.which);
        if (!/^\d$/.test(char)) {
          event.preventDefault();
          this.showNotification("O código de estudante não pode ter letras.", "danger", "Erro");
        }
      },
     
      retrieveItems() {
        axios
          .get("/biosentry/visitants")
          .then((response) => {
            this.items = response.data;
          })
          .catch((error) => {
            console.error("Erro ao recuperar estudantes:", error);
          });
      },
      toggleSelectAll(event) {
        if (event.target.checked) {
          this.selectedItems = this.paginatedItems.map((item) => item.codigo);
        } else {
          this.selectedItems = [];
        }
      },
      showNotification(message, variant, title) {
        this.$bvToast.toast(message, {
          title: title,
          variant: variant,
          solid: true,
        });
      },
      editItem(item) {
        this.currentUser = {
          ...item,
          id_dispositivo: item.id_dispositivo,
          id_perfil: Number(item.id_perfil)
        };
        this.showModalEdit = true;
      
      },

       async startCardProcess() {
   
      if (!this.model.item.id_dispositivo) {
        this.showNotification("Selecione um edifício válido!", "warning", "Aviso");
        return;
      }
      const payload = { 
        Cmd: "RegisterRFID_BSRSTI",
      };
      axios
        .post("/biosentry/registerCard", payload)
        .then((response) => {
          console.log("Comando enviado com sucesso:", response.data);

          this.cardRegisted = true;

        })
        .catch((error) => {
          console.error("Erro ao enviar comando:", error);
          this.showNotification("Erro ao enviar comando!", "danger", "Erro");
        });
      },
     
      async saveUser() {
  
        if (this.currentUser.codigo) {
          const tagIdResponse = await axios.get(`/biosentry/tagid/${this.currentUser.codigo}`, this.currentUser);
          this.currentUser.tagId = tagIdResponse.data[0].tagId;
          axios
            .put(`/biosentry/update/${this.currentUser.codigo}`, this.currentUser)
            .then(() => {
              this.showNotification("Pessoa atualizado com sucesso!", "success", "Atualização");
              this.retrieveItems();
              this.showModalEdit = false;
              this.resetCurrentUser();
            })
            .catch(() => {
              this.showNotification("Falha ao atualizar o pessoa!", "danger", "Erro");
            });
            //  inicio comando para enviar para node-red
          const payload = {
            Cmd: "Edit_finger_status_" + this.currentUser.id_dispositivo,
            tag_id: Number(this.currentUser.tagId), 
            status_: this.currentUser.status_ ,
          };
          axios
            .post("/biosentry/editbiometria", payload)
            .then((response) => {
              console.log("Comando de editar enviado com sucesso:", response.data);
            })
            .catch((error) => {
              console.error("Erro ao enviar comando de editar:", error);
            });
            //fim comando para enviar para node-red

        } else {
          const existsCE = this.items.some((item) => item.codigo === this.model.item.codigo);
          if (existsCE) {          
            this.showNotification('O codigo de estudante deve ser único para cada estudante!', 'danger', 'O codigo inserido já existe!');
            return;
          }
          
  
          axios
            .post("/biosentry/addVisits", this.model.item)
            .then(() => { 
              this.showNotification("Estudante adicionado com sucesso!", "success", "Sucesso");
              this.retrieveItems();
              this.resetCurrentUser();
            })
            .catch(() => {
              this.showNotification("Falha ao adicionar o estudante!", "danger", "Erro");
            });
        }
        this.showModalAdd = false;
      },
      resetCurrentUser() {
        this.model.item = {
         
          name: "",
          codigo: "",
          id_dispositivo: "",
          nome_perfil:"",
          status_: "",
        };
        this.currentUser = {
        
          name: "",
          codigo: "",
          id_dispositivo: "",
          nome_perfil:"",
          status_: 1,
        };
      },
      getEdificio() {
        axios
          .get("/biosentry/buildingfordevicesRfid")
          .then((resp) => {
            console.log(resp);
            this.dispositivos = resp.data;
            console.log(this.dispositivos);
          })
          .catch((errors) => {
            console.error(errors);
            this.showNotification("Erro ao buscar dados dos dispositivos.", "danger", "Erro");
          });
      },

      getPerfil() {
        axios
          .get("/biosentry/perfil")
          .then((resp) => {
            console.log(resp);
            this.perfis = resp.data;
            console.log(this.perfis);
          })
          .catch((errors) => {
            console.error(errors);
            this.showNotification("Erro ao buscar dados dos perfis.", "danger", "Erro");
          });
      },


      deleteSelectedItems() {
        this.$bvModal
          .msgBoxConfirm(`Deseja deletar os seguintes itens? ${this.selectedItems.join(", ")}`, {
            title: "Deletar Selecionados",
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
              Promise.all(
                this.selectedItems.map((codigo) =>
                  axios.delete(`/biosentry/deleteStudents/${codigo}`)
                )
              )
                .then(() => {
                  this.ShowDeleteNotification("Pessoa deletada com sucesso!", "success", "Sucesso");
                  this.selectedItems = [];
                  this.retrieveItems();
                })
                .catch((error) => {
                  console.error("Erro ao deletar Estudantes:", error);
                  this.ShowDeleteNotification("Erro ao Deletar Pessoa.", "danger", "Erro");
                });
            }
          })
          .catch((err) => {
            console.error("Erro ao exibir a caixa de diálogo:", err);
          });
      },
      deleteItem(ItemID) {
        console.log("Deleting item with ID:", ItemID);
        axios
          .delete(`/biosentry/deleteStudents/${ItemID}`)
          .then(() => {
            this.ShowDeleteNotification("Estudante deletado com sucesso!", "success", "Sucesso");
            this.retrieveItems();
          })
          .catch((error) => {
            console.error("Erro ao deletar Estudante:", error);
            this.ShowDeleteNotification("Erro ao Deletar Estudante.", "danger", "Erro");
          });
        const payload2 = {
          Cmd: "Delete_finger_" + this.model.item.id_dispositivo,
          codigo: this.model.item.codigo, 
        };
        console.log("Payload being sent to Node-RED:", payload2);
        axios
          .post("/biosentry/deletebiometria ", payload2)
          .then((response) => {
            console.log("Comando de deletar enviado com sucesso:", response.data);
          })
          .catch((error) => {
            console.error("Erro ao enviar comando de deletar:", error);
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
        const itemToDelete = this.items.find(item => item.id === ItemID);
        if (itemToDelete) {
          this.model.item = {
            uid_disposit: itemToDelete.id_dispositivo,
            codigo: itemToDelete.codigo,
          };
        }
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
  background-color: #ab162a;
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

.custom-img {
  width: 100px;
  height: auto;
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
