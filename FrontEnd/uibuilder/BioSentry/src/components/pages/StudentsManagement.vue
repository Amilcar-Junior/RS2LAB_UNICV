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
        Estudantes
      </h3>
      <img src="./components/images/impressao-digital2.png" alt="digital" class="custom-img" style="display: block; margin: 0 auto; margin-bottom: 50px;" />

      <div class="card">
        <div
          class="card-header d-flex justify-content-between align-items-center"
        >
          <input
            type="text"
            class="form-control d-inline-block w-auto"
            placeholder="Buscar por Nome, Email..."
            v-model="searchQuery"
          />


          <div>
            <b-button
              class="ml-2 "
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
              <i class="fa fa-plus " aria-hidden="true"></i> Adicionar
            </b-button>

            <b-button
            
              class="btn btn-danger ml-2"
              @click="deleteSelectedItems"
              :disabled="selectedItems.length === 0"
            >
              <i class="fa fa-trash" aria-hidden="true"></i> Deletar
              Selecionados
            </b-button>
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
                  <th scope="col" class="col-2">Codigo de Estudante</th>
                  <th scope="col" class="col-1">Email</th>
                  <th scope="col" class="col-1">Curso</th>
                  <th scope="col" class="col-1">Status</th>
                  <th scope="col" class="col-1">Edificio</th>
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
                      :value="item.id"
                      v-model="selectedItems"
                    />
                  </td>
                 <!-- <td>{{ item.id }}</td>--> 
                  <td>{{ item.name }}</td>
                  <td>{{ item.codigo }}</td>
                  <td>{{ item.email }}</td>
                  <td>{{ item.curso }}</td>
                  <td>{{ item.status_ }}</td>
                  <td>{{ item.edificio }}</td>
               
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
                      @click="ShowConfirmDelete(item.id)"
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

      <b-modal v-model="showModalAdd" title="Adicionar Aluno" hide-footer>
          <b-form @submit.prevent="saveUser">
            <b-form-group label="Código de Estudante" label-for="codigo_estudante"
            description="Insira o código de estudante para adicionar o aluno">
              <div class="d-flex">
                <b-form-input
                  id="codigo_estudante"
                  v-model="codigo"
                  @keypress="preventLetters"
                  required
                ></b-form-input>
                <b-button variant="outline-info" @click="pesquisarAluno" class="ml-2">
                  Pesquisar
                </b-button>
              </div>
            </b-form-group>
            
            <!-- Separador -->
            <hr/>
  
            <b-form-group label="Nome" label-for="name">
              <b-form-input
                id="name"
                v-model="model.item.name"    
                readonly
                required 
              ></b-form-input>
            </b-form-group>
  
  
            <b-form-group label="Curso" label-for="curso">
              <b-form-input
                id="curso"
                v-model="model.item.curso"
  
                readonly
                required
              ></b-form-input>
            </b-form-group>
  
            <div class="mb-3">
              <label for="device_id">Edificio:</label>
              <select
                id="device_id"
                v-model="model.item.device_id"
                @change="atualizarUID" 
                class="form-control"
                required
              >
                <option value="" disabled >Selecione o Edificio</option>
                <option v-for="edi in edificios" :key="edi.id" :value="edi.id">
                  {{ edi.edificio }}
                </option>
              </select>
            </div>
            
            <b-form-group label="Email" label-for="email">
              <b-form-input
                id="email"
                v-model="model.item.email"
                type="email"
                readonly
                required
              ></b-form-input>
            </b-form-group>
  
            <b-row>
              <b-col>
                <b-form-group label="Status" label-for="status">
                  <b-form-checkbox
                    id="status"
                    v-model="model.item.status_"
                    :true-value="1"
                    :false-value="0"
                  >
                    Ativo
                  </b-form-checkbox>
                </b-form-group>
              </b-col>

              <b-col class="text-right">
                <b-button
                  variant="outline-secondary"
                  @click="startBiometriaProcess"
                  :disabled="isSaving"
                  style="background-image: url('./components/images/bi2.png'); background-size: cover; background-position: center; width: 70px; height: 70px;  padding: 0;"
                >
                <!-- <b-icon icon="person-check" class="mr-2"> </b-icon>
                  Obter Biometria -->
                  Clique aqui
                
                </b-button>
              </b-col>
            </b-row>
  
  
              <b-button
                type="submit"
          
                variant="success"
                :disabled="isSaving || !biometriaRegistrada"
              >
              Registar
              </b-button>
  
<!--   
              <b-button variant="secondary" @click="showModalAdd = false"
              >Cancelar</b-button> -->
              
  
          </b-form>
        </b-modal>

    

      <!-- Modal para Editar -->
    <b-modal v-model="showModalEdit" title="Editar Aluno" hide-footer>
        <b-form @submit.prevent="saveUser">
          

          <b-form-group
            label="Codigo de Estudante"
            label-for="codigo_estudante"
          >
            <b-form-input
              id="codigo_estudante"
              v-model="currentUser.codigo"
              @keypress="preventLetters"
              required
              readonly
            ></b-form-input>
          </b-form-group>

        <hr/>

          <b-form-group label="Nome" label-for="name">
            <b-form-input
              id="name"
              v-model="currentUser.name"
              required
              readonly
            ></b-form-input>
          </b-form-group>

          <b-form-group label="Curso" label-for="curso">
            <b-form-input
              id="curso"
              v-model="currentUser.curso"
              required
              readonly
            ></b-form-input>
          </b-form-group>

          <div class="mb-3">
            <label for="device_id">Edificio:</label>
            <select
              id="device_id"
              v-model.number="currentUser.device_id"
              class="form-control"
              required
            >
              <option value="" disabled >Selecione o Edificio</option>
              <option v-for="edi in edificios" :key="edi.id" :value="edi.id">
                {{ edi.edificio }}
              </option>
            </select>
          </div>

          <b-form-group label="Email" label-for="email">
            <b-form-input
              id="email"
              v-model="currentUser.email"
              type="email"
              required
              readonly
            ></b-form-input>
          </b-form-group>

          <b-form-group label="Status" label-for="status">
              <b-form-checkbox
                id="status"
                v-model="currentUser.status_"
                :true-value="1"
                :false-value="0"
              >
              Ativo
            </b-form-checkbox>
            <!-- <div>State: <strong>{{ Boolean(currentUser.status_) }}</strong></div> -->
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

const mqtt = require('mqtt');

module.exports = {

  props: ["keys"],
  data() {
    return {
      edificios: [],
      model: {
        item: {
          name: "",
          codigo: "",
          device_id: "",
          email: "",
          curso: "",
          status_: "",
          UID_disposit: "", 
          finger_id: null,
        },
      },
      items: [],
      name:"",
      codigo: "",
      email: "",
      curso: "",

      showModalEdit: false,
      showModalAdd: false,
      selectedItems: [],
      perPage: 10,
      currentPage: 1,
      searchQuery: "",
      userTypes: window.appConfig.userTypes,
      currentUser: {
        id: null,
        codigo: "",
        name: "",
        email: "",
        device_id: "",
        curso: "",
        status_: "",
        UID_disposit : "",
        finger_id:""
      },
      isSaving: false,
      biometriaRegistrada: false,
      notifications: [],
    

    };
  },

  mounted() {
    this.retrieveItems();
    this.getEdificio();
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
          item.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          item.curso.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
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
    preventLetters(event) {
      const char = String.fromCharCode(event.which);
      if (!/^\d$/.test(char)) {
        event.preventDefault();
        this.showNotification("O código de estudante não pode ter letras.", "danger", "Erro");
      }
    },
    atualizarUID() {
      const deviceAddSelected = this.edificios.find(edi => edi.id === this.model.item.device_id);
      this.model.item.uid_disposit = deviceAddSelected ? deviceAddSelected.UID_disposit : "";
      
      const deviceEditSelected = this.edificios.find(edi => edi.id === this.currentUser.device_id);
      this.currentUser.uid_disposit = deviceEditSelected ? deviceEditSelected.UID_disposit : "";
    },
    retrieveItems() {
      axios
        .get("/biosentry/students")
        .then((response) => {
          this.items = response.data;
        })
        .catch((error) => {
          console.error("Erro ao recuperar estudantes:", error);
        });
    },
    toggleSelectAll(event) {
      if (event.target.checked) {
        this.selectedItems = this.paginatedItems.map((item) => item.id);
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
        device_id: Number(item.device_id)
      };
      this.showModalEdit = true;
      this.atualizarUID();
    },
  

    async startBiometriaProcess() {
   
      if (!this.model.item.uid_disposit) {
        this.showNotification("Selecione um edifício válido!", "warning", "Aviso");
        return;
      }
      const payload = { 
        Cmd: "Register_finger_" + this.model.item.uid_disposit,
        codigo: this.codigo,
        status_: this.model.item.status_ ? "1":"0",
      };
      axios
        .post("/biosentry/biometria", payload)
        .then((response) => {
          console.log("Comando enviado com sucesso:", response.data);

          this.biometriaRegistrada = true;

        })
        .catch((error) => {
          console.error("Erro ao enviar comando:", error);
          this.showNotification("Erro ao enviar comando!", "danger", "Erro");
        });
    },

//para quando for dado a api do STI
    async pesquisarAluno() {
      try {
        const codigo = this.codigo;
        this.model.item.name = "";
        this.model.item.curso = "";
        this.model.item.email = "";

        if (!codigo) {
          this.showNotification("Por favor, insira um código de estudante.", "warning", "Atenção");
          return;
        }

        const response = await axios.get(`/getstudentbycode?codigo=${codigo}`); 
        this.model.item.codigo = codigo; // Ensure codigo is set in model.item

        if (response.data && response.data.data) {
          const estudante = response.data.data;

          this.model.item.name = estudante.name || "Não disponível";
          this.model.item.email = estudante.email_academico || "Não disponível";
          this.model.item.curso = "Não disponivel"; // Set to default or leave empty if not available
        } else {
          this.showNotification("Estudante não encontrado.", "danger", "Erro");
        }
      } catch (error) {
        console.error("Erro ao buscar estudante:", error);
        this.showNotification("Erro ao buscar estudante. Verifique a conexão ou tente novamente.", "danger", "Erro");
      }

   
},
   
    async saveUser() {  
      if (this.currentUser.id) {
        
        const fingerIdResponse = await axios.get(`/biosentry/fingerid/${this.currentUser.id}`, this.currentUser);
        this.currentUser.finger_id = fingerIdResponse.data[0].finger_id;

        axios
          .put(`/biosentry/updatestudents/${this.currentUser.id}`, this.currentUser)
          .then(() => {
            this.showNotification("Estudante atualizado com sucesso!", "success", "Atualização");
            this.retrieveItems();
            this.showModalEdit = false;
            this.resetCurrentUser();
          })
          .catch(() => {
            this.showNotification("Falha ao atualizar o estudante!", "danger", "Erro");
          });

          //inicio comando para enviar para node-red
          const payload = {
            Cmd: "Edit_finger_status_" + this.currentUser.uid_disposit,
            finger_id: Number(this.currentUser.finger_id),
            status_: this.currentUser.status_ ? "1":"0",
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
        const existsEmail = this.items.some((item) => item.email === this.model.item.email);
        if (existsEmail) {
          this.showNotification('Este email já está registado. Tente usar um email diferente.', 'danger', 'O email inserido já existe!');
          return;
        } 

        axios
          .post("/biosentry/addStudents", this.model.item)
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
        id: null,
        name: "",
        codigo: "",
        email: "",
        device_id: "",
        curso: "",
        status_: "",
      };
      this.currentUser = {
        id: null,
        name: "",
        codigo: "",
        email: "",
        device_id: "",
        curso: "",
        status_: 1,
      };
    },
    getEdificio() {
      axios
        .get("/biosentry/devices")
        .then((resp) => {
          console.log(resp);
          this.edificios = resp.data;
          console.log(this.edificios);
        })
        .catch((errors) => {
          console.error(errors);
          this.showNotification("Erro ao buscar dados dos edificios.", "danger", "Erro");
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
              this.selectedItems.map((id) =>
                axios.delete(`/biosentry/deleteStudents/${id}`)
              )
            )
              .then(() => {
                this.ShowDeleteNotification("Estudantes deletados com sucesso!", "success", "Sucesso");
                this.selectedItems = [];
                this.retrieveItems();
              })
              .catch((error) => {
                console.error("Erro ao deletar Estudantes:", error);
                this.ShowDeleteNotification("Erro ao Deletar Estudantes.", "danger", "Erro");
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
        Cmd: "Delete_finger_" + this.model.item.uid_disposit,
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
          uid_disposit: itemToDelete.UID_disposit,
          codigo: itemToDelete.codigo,
          status_: itemToDelete.status_
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
.logo-img {
  width: 25px;
  height: auto;
}

/* Table styling */
.table-responsive {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.table {
  margin-bottom: 0;
}

.table thead th {
  background-color: #2c3e50;
  color: white;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
  border-bottom: none;
  padding: 12px 15px;
}

.table tbody tr {
  transition: all 0.2s ease;
}

.table tbody tr:hover {
  background-color: #f8f9fa;
}

.table tbody tr:nth-child(even) {
  background-color: #f8f9fa;
}

.table tbody td {
  padding: 12px 15px;
  vertical-align: middle;
  border-top: 1px solid #e9ecef;
}

/* Action buttons */
.button {
  min-width: 30px;
  padding: 5px 8px;
  margin: 0 2px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.btn-info {
  background-color: #17a2b8;
  border-color: #17a2b8;
}

.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
}

/* Card styling */
.card {
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 15px 20px;
}

/* Search input */
.form-control {
  border-radius: 4px;
  border: 1px solid #ddd;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: #2c3e50;
  box-shadow: 0 0 0 0.2rem rgba(44, 62, 80, 0.25);
}

/* Pagination */
.custom-pagination .page-item.active .page-link {
  background-color: #2c3e50;
  border-color: #2c3e50;
}

.custom-pagination .page-link {
  color: #2c3e50;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .table-responsive {
    border: 0;
  }
  
  .table thead {
    display: none;
  }
  
  .table tbody tr {
    display: block;
    margin-bottom: 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .table tbody td {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: right;
    padding-left: 50%;
    position: relative;
    border-top: 1px solid #e9ecef;
  }
  
  .table tbody td::before {
    content: attr(data-label);
    position: absolute;
    left: 15px;
    width: 45%;
    padding-right: 15px;
    font-weight: bold;
    text-align: left;
  }
}
</style>
