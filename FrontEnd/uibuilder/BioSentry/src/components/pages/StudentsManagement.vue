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
          margin-bottom: 50px;
        "
      >
        Estudantes
      </h3>
      <!-- <img src="./components/images/impressao-digital2.png" alt="digital" class="custom-img" style="display: block; margin: 0 auto; margin-bottom: 50px;" /> -->

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
                keys.TipoUtilizador_Nome === userTypes.ADMINBIOSENTRY || keys.TipoUtilizador_Nome === userTypes.ADMINISTRATOR
              "
              v-b-tooltip.hover.top="'Adicionar'"
            >
              <i class="fa fa-plus " aria-hidden="true"></i>
            </b-button>

            <b-button
            
              class="btn btn-danger ml-2"
              @click="deleteSelectedItems"
              :disabled="selectedItems.length === 0"
              v-b-tooltip.hover.top="'Deletar selecionados'"
            >
              <i class="fa fa-check-square-o" aria-hidden="true"></i>
              <i class="fa fa-trash" aria-hidden="true"></i> 
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
                  <th scope="col" class="col-1">Codigo de Estudante</th>
                  <th scope="col" class="col-1">Email</th>
                  <th scope="col" class="col-1">Curso</th>
                  <th scope="col" class="col-1">Status</th>
                  <th scope="col" class="col-1">Edificio</th>
                  <th
                    scope="col"
                    class="col-1 text-center"
                    v-show="
                      keys.TipoUtilizador_Nome === userTypes.ADMINBIOSENTRY || keys.TipoUtilizador_Nome === userTypes.ADMINISTRATOR
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
                 <!-- <td>{{ item.codigo }}</td>--> 
                  <td>{{ item.name }}</td>
                  <td>{{ item.codigo }}</td>
                  <td>{{ item.email }}</td>
                  <td>{{ item.curso }}</td>
                  <td>{{ getStatusText(item.status_) }}</td>
                  <td>{{ item.nome_edificio }}</td>
               
                  <td
                    class="text-center"
                    v-show="
                      keys.TipoUtilizador_Nome === userTypes.ADMINBIOSENTRY || keys.TipoUtilizador_Nome === userTypes.ADMINISTRATOR
                    "
                  >
                    <button
                      type="button"
                      @click="editItem(item)"
                      class="btn btn-info mr-2 button"
                      title="Editar estudante"
                    >
                      <i class="fa fa-pencil-square-o" aria-hidden="true"></i> <!-- Icone de Editar-->
                    </button>
                    <button
                      type="button"
                      @click="ShowConfirmDelete(item.codigo)"
                      class="btn btn-danger button"
                      title="Deletar estudante"
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
                        : "Nenhum estudante registada."
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
      <b-modal v-model="showModalAdd" title="Adicionar Estudante" hide-footer>
          <b-form @submit.prevent="saveUser">
            <b-form-group label="Código de Estudante" label-for="codigo_estudante"
            description="Insira o código de estudante para obter os dados do estudante">
              <div class="d-flex">
                <b-form-input
                  id="codigo_estudante"
                  v-model="codigo"
                  @keypress="preventLetters"
                  required
                ></b-form-input>
                <b-button variant="info" @click="pesquisarAluno" class="ml-2" title="Pesquisar estudante pelo código">
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
                <b-form-group label="Status">
                    <b-form-radio-group
                      v-model="model.item.status_"
                      :options="statusOptions"
                      button-variant="light"
                      buttons
                    ></b-form-radio-group>
                  </b-form-group>
              </b-col>

              <b-col class="text-right">
                <b-button
                  variant="outline-info"
                  @click="startBiometriaProcess"
                  :disabled="isSaving"
                >
                <!-- <b-icon icon="person-check" class="mr-2"> </b-icon>
                  Obter Biometria -->
                  Iniciar Leitura Biométrica
                
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


        <!-- Modal para Leitura Biométrica -->
        <b-modal v-model="showBiometriaModal" title="Leitura Biométrica" hide-footer centered>
          <div class="text-center">
            <p :class="biometriaMessageClass">{{ biometriaMessage }}</p>
            <b-spinner v-if="!biometriaRegistrada" variant="primary" small class="mb-3"></b-spinner>
            <b-button
              variant="dark"
              size="sm"
              @click="closeBiometriaModal"
              :disabled="!biometriaRegistrada"
              v-b-tooltip.hover.top="'Fechar modal de leitura biométrica'"
            >
              Fechar
            </b-button>
          </div>
        </b-modal>
    

      <!-- Modal para Editar -->
    <b-modal v-model="showModalEdit" title="Editar Estudante" hide-footer>
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

          <b-form-group label="Email" label-for="email">
            <b-form-input
              id="email"
              v-model="currentUser.email"
              type="email"
              required
              readonly
            ></b-form-input>
          </b-form-group>

          <b-form-group label="Status">
                    <b-form-radio-group
                      v-model="currentUser.status_"
                      :options="statusOptions"
                      buttons
                    ></b-form-radio-group>
                  </b-form-group>

          <b-button type="submit" variant="success" title="Salvar alterações">Salvar</b-button>
          <b-button variant="secondary" @click="showModalEdit = false" title="Cancelar edição"
            >Cancelar</b-button
          >
        </b-form>
      </b-modal>
      <!-- Fim Modal Editar -->
    </div>
  </div>
</template>

<script>

//const mqtt = require('mqtt');

module.exports = {

  props: ["keys"],
  data() {
    return {
      statusOptions: [
      { text: 'Ativo', value: '1' },
      { text: 'Inativo', value: '0' }
    ],
      dispositivos: [],
      model: {
        item: {
          name: "",
          codigo: "",
          email: "",
          curso: "",
          status_:'1',
          id_dispositivo: "", 
          finger_id: null,
          nome_edificio:""
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
        codigo: "",
        name: "",
        email: "",
        id_dispositivo: "", 
        curso: "",
        status_: "",
        finger_id:"",
        nome_edificio:""
      },
      isSaving: false,
      biometriaRegistrada: false,
      notifications: [],
      showBiometriaModal: false,
      biometriaMessage: "Coloque o dedo no sensor",
      biometriaMessageClass: "",
      pollingInterval: null,

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
        id_dispositivo:item.id_dispositivo
      };
      this.showModalEdit = true;
    },
  

    async startBiometriaProcess() {
   
      if (!this.model.item.id_dispositivo) {
        this.showNotification("Selecione um edifício válido!", "warning", "Aviso");
        return;
      }
      const payload = { 
        Cmd: "Register_finger_" + this.model.item.id_dispositivo,
        codigo: this.codigo,
        status_: this.model.item.status_,
      };

      this.showModalAdd = false;
      this.showBiometriaModal = true;
      this.biometriaMessage = "Coloque o dedo no sensor";      
      this.biometriaMessageClass = "text-primary";
      this.biometriaRegistrada = false;

    try {
        // Iniciar o processo de biometria
        const biometriaResponse = await axios.post("/biosentry/biometria", payload);
        console.log("Comando enviado com sucesso:", biometriaResponse.data);

        // Iniciar polling para verificar mensagens do arquivo
        this.pollingInterval = setInterval(async () => {
          try {
            const notificationResponse = await axios.post("/biosentry/notificar");
            let messageFromFile = notificationResponse.data;

            if (messageFromFile && typeof messageFromFile === "string" && messageFromFile.trim()) {
              this.biometriaMessage = messageFromFile.trim();
              this.biometriaMessageClass = "text-primary";

              // Verificar se a mensagem indica conclusão ou erro
              const finalMessages = [
                "Impressão digital já registrada",
                "Registro concluído",
                "Impressão digital registrada",
                "Erro no registo biométrico",
                "Falha no registro",
              ];
              if (finalMessages.some((msg) => messageFromFile.trim().toLowerCase().includes(msg.toLowerCase()))) {
                clearInterval(this.pollingInterval);
                this.pollingInterval = null;
                this.biometriaRegistrada = true;
                this.biometriaMessageClass = messageFromFile.trim().toLowerCase().includes("erro") ||
                                            messageFromFile.trim().toLowerCase().includes("falha")
                                          ? "text-danger"
                                          : "text-success";
              }
            }
          } catch (error) {
            console.error("Erro ao buscar mensagem:", error);
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
            this.biometriaMessage = "Erro ao obter mensagem do dispositivo";
            this.biometriaMessageClass = "text-danger";
            this.biometriaRegistrada = true;
            this.showNotification("Erro ao obter mensagem do dispositivo!", "danger", "Erro");
          }
        }, 1000); // Verificar a cada 1 segundo
      } catch (error) {
        console.error("Erro ao enviar comando:", error);
        clearInterval(this.pollingInterval);
        this.pollingInterval = null;
        this.biometriaMessage = "Erro no registo biométrico";
        this.biometriaMessageClass = "text-danger";
        this.showBiometriaModal = false;
        this.showModalAdd = true;
        this.showNotification("Erro no processo biométrico!", "danger", "Erro");
      }
    },

      closeBiometriaModal() {
      if (this.pollingInterval) {
        clearInterval(this.pollingInterval);
        this.pollingInterval = null;
      }
      this.showBiometriaModal = false;
      this.showModalAdd = true;
    },

//para buscar aluno por codigo
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

        // Recuperar o access_token e a expiração do localStorage
          const access_token = localStorage.getItem("unicv_token") || localStorage.getItem("token");
          const token_expiration = parseInt(localStorage.getItem("unicv_token_expiration"), 10);
          console.log("Token recuperado do localStorage:", access_token);
          console.log("Expiração do token:", token_expiration);
        if(!access_token){
          this.showNotification("Token de autenicação não encontrado.Por favor, faça login para continuar.", "warning", "Atenção");
        }

        // Verificar se o token está expirado
    const currentTime = Math.floor(Date.now() / 1000);
    if (token_expiration && token_expiration < currentTime) {
      this.showNotification("Sessão expirada. Faça login novamente.", "danger", "Erro");
      console.log("Erro: Token expirado. Expiração:", token_expiration, "Atual:", currentTime);
      return;
    }

        // Fazer a requisição com o token no cabeçalho
        const response = await axios.get(`/getstudentbycode?codigo=${codigo}`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }); 
        this.model.item.codigo = codigo; // Garantir que o código esteja no model.item

        if (response.data && response.data.data) {
          const estudante = response.data.data;

          this.model.item.name = estudante.name || "Não disponível";
          this.model.item.email = estudante.email_academico || "Não disponível";
          this.model.item.curso = "Não disponivel"; // Ajustar conforme os dados retornados
        } else {
          this.showNotification("Estudante não encontrado.", "danger", "Erro");
        }
      } catch (error) {
        console.error("Erro ao buscar estudante:", error);
          if (error.response && error.response.status === 401) {
            this.showNotification("Sessão expirada. Faça login novamente.", "danger", "Erro");
          } else {
            this.showNotification(
              "Erro ao buscar estudante. Verifique a conexão ou tente novamente.",
              "danger",
              "Erro"
            );
          }
      }
   
},
   
    async saveUser() {  
      if (this.currentUser.codigo) {
        
        const fingerIdResponse = await axios.get(`/biosentry/fingerid/${this.currentUser.codigo}`, this.currentUser);
        this.currentUser.finger_id = fingerIdResponse.data[0].finger_id;

        axios
          .put(`/biosentry/updatestudents/${this.currentUser.codigo}`, this.currentUser)
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
            Cmd: "Edit_finger_status_" + this.currentUser.id_dispositivo,
            finger_id: Number(this.currentUser.finger_id),
            status_: this.currentUser.status_,
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
       
        name: "",
        codigo: "",
        email: "",
        id_dispositivo: "",
        curso: "",
        status_: "",
        nome_edificio:""
      };
      this.biometriaRegistrada = false;
      this.biometriaMessage = "Coloque o dedo no sensor";
      this.biometriaMessageClass = "";
      this.currentUser = {
      
        name: "",
        codigo: "",
        email: "",
        id_dispositivo: "",
        curso: "",
        status_: 1,
        nome_edificio:""
      };
    },
    getEdificio() {
      axios
        .get("/biosentry/devicesforbuilding")
        .then((resp) => {
          console.log(resp);
          this.dispositivos = resp.data;
          console.log(this.dispositivos);
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
              this.selectedItems.map((codigo) =>
                axios.delete(`/biosentry/deleteStudents/${codigo}`)
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
      const itemToDelete = this.items.find(item => item.codigo === ItemID);
      if (itemToDelete) {
        this.model.item = {
          id_dispositivo: itemToDelete.id_dispositivo,
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
  background-color: #ab162b;
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
  margin: 3px 2px;
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

.text-primary {
  color: #007bff !important;
}

.text-success {
  color: #28a745 !important;
}

.text-danger {
  color: #dc3545 !important;
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
