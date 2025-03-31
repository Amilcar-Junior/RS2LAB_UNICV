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
        <img src="./images/rfid1.png" alt="digital" class="custom-img" style="display: block; margin: 0 auto; width: 70px; margin-bottom: 50px;"   />

  
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
                    <th scope="col" class="col-2">Codigo</th>
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
                        :value="item.id"
                        v-model="selectedItems"
                      />
                    </td>
             
                    <td>{{ item.name }}</td>
                    <td>{{ item.codigo }}</td>
                    <td>{{ item.status_ }}</td>
                    <td>{{ item.edificio }}</td>
                    <td>{{ item.nivel }}</td>
              
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
  
        <!-- Modal para Adição -->
        <b-modal v-model="showModalAdd" title="Adicionar Visitantes" hide-footer>
          <b-form @submit.prevent="saveUser">
            <b-form-group label="Nome" label-for="name">
              <b-form-input
                id="name"
                v-model="model.item.name"
                required
              ></b-form-input>
            </b-form-group>
  
            <b-form-group
              label="Codigo"
              label-for="codigo_estudante"
              description="Codigo deve ter apenas 6 digitos."
            >
              <b-form-input
                id="codigo_estudante"
                v-model="model.item.codigo"
                @keypress="preventLetters"
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
              
              <div>
                <label for="nivel">Função:</label>
                <select id="nivel" v-model="model.item.nivel" class="form-control">
                  <option value="" disabled >Selecione a função</option>
                  <option value="Estudante">Estudante</option>
                  <option value="Docente">Docente</option>
                  <option value="Funcionário">Funcionário</option>
              </select>
              </div>
     

  
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
  
              <b-button
                type="submit"
                variant="success"
              
              >
              Registar
              </b-button>
  
  
              <b-button variant="secondary" @click="showModalAdd = false"
              >Cancelar</b-button
              >
  
          </b-form>
        </b-modal> 
  

  
  
        <!-- Modal para Editar -->
      <b-modal v-model="showModalEdit" title="Editar Aluno" hide-footer>
          <b-form @submit.prevent="saveUser">
            <b-form-group label="Nome" label-for="name">
              <b-form-input
                id="name"
                v-model="currentUser.name"
                required
              ></b-form-input>
            </b-form-group>
  
            <b-form-group
              label="Codigo"
              label-for="codigo_estudante"
            >
              <b-form-input
                id="codigo_estudante"
                v-model="currentUser.codigo"
                @keypress="preventLetters"
                required
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
  
            <b-form-group label="Status" label-for="status">
              <b-form-checkbox
                id="status"
                v-model.number="currentUser.status_"
                :true-value="1"
                :false-value="0"
              >
                Ativo
              </b-form-checkbox>
              <div>State: <strong>{{ Boolean(currentUser.status_) }}</strong></div>
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
        edificios: [],
        model: {
          item: {
            name: "",
            codigo: "",
            device_id: "",
            status_: "",
            UID_disposit: "", 
            nivel:"",
            finger_id: null,
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
          id: null,
          codigo: "",
          name: "",
          device_id: "",
          status_: "",
          nivel:"",
          UID_disposit : "",
          finger_id:null,
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
     
      async saveUser() {
  
        if (this.currentUser.id) {
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
          // const payload = {
          //   Cmd: "Edit_finger_status_" + this.currentUser.uid_disposit,
          //   finger_id: Number(this.currentUser.finger_id), 
          //   status_: this.model.item.status_ ? "1":"0",
          // };
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
          device_id: "",
          nivel:"",
          status_: "",
        };
        this.currentUser = {
          id: null,
          name: "",
          codigo: "",
          device_id: "",
          nivel:"",
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
          status_: Number(this.model.item.status_)
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
.custom-dropdown {
    border: 2px solid #007bff; /* Custom border color */
    border-radius: 5px; /* Rounded corners */
    padding: 5px; /* Padding for better spacing */
    background-color: #f8f9fa; /* Light background color */
    font-size: 16px; /* Font size */
}
.logo-img {
    width: 25px;
    height: auto;
}
.custom-img {
    width: 100px;
    height: auto;
}
</style>
