<template>
    <div class="container mt-5">
      <div class="card">
        <div class="card-header">
          <h4>Adicionar Utilizador</h4>
        </div>
        <div class="card-body">
          <div class="mb-3">
            <label for="nome">Nome</label>
            <input
              type="text"
              id="nome"
              v-model="model.item.Nome"
              class="form-control"
            />
          </div>
          <div class="mb-3">
            <label for="email">Email</label>
            <input
              type="text"
              id="email"
              v-model="model.item.Email"
              class="form-control"
            />
          </div>
          <div class="mb-3">
            <label for="senha">Senha</label>
            <input
              type="password"
              id="senha"
              v-model="model.item.Senha"
              class="form-control"
            />
          </div>
          <div class="mb-3">
            <label for="id_tipoUtilizador">ID_TipoUtilizador</label>
            <input
              type="text"
              id="id_tipoUtilizador"
              v-model="model.item.ID_TipoUtilizador"
              class="form-control"
            />
          </div>
          <div class="mb-3">
            <label for="ativo">Ativo</label>
            <input
              type="text"
              id="ativo"
              v-model="model.item.Ativo"
              class="form-control"
            />
          </div>
          <div class="mb-3">
            <label for="avatar">Avatar</label>
            <input
              type="file"
              id="avatar"
              @change="onAvatarChange"
              class="form-control-file"
            />
            <!-- Preview do Avatar -->
            <img
              v-if="avatarPreview"
              :src="avatarPreview"
              alt="Preview do Avatar"
              class="mt-2"
              style="max-width: 100px; max-height: 100px"
            />
          </div>
          <div class="mb-3">
            <button
              type="button"
              @click="addUtilizador"
              class="btn btn-primary float-right"
            >
              Adicionar
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  module.exports = {
    name: "CreateUtilizador",
    data() {
      return {
        model: {
          item: {
            Nome: "",
            Email: "",
            Senha: "",
            ID_TipoUtilizador: "",
            Ativo: "",
            Avatar: null, // Alterado para aceitar um Blob
          },
        },
        avatarPreview: "",
      };
    },
    methods: {
      addUtilizador() {
        var self = this;
        axios
          .post("/rs2lab/addutilizador", this.model.item)
          .then((resp) => {
            console.log(resp);
            self.showNotification();
          })
          .catch((e) => {
            console.error(e);
          });
      },
  
      onAvatarChange(e) {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.avatarPreview = e.target.result;
            this.model.item.Avatar = file; // Atualiza o avatar no modelo com o arquivo selecionado
          };
          reader.readAsDataURL(file);
        }
      },
  
      cleanForm() {
        this.model.item.Nome = "";
        this.model.item.Email = "";
        this.model.item.Senha = "";
        this.model.item.ID_TipoUtilizador = "";
        this.model.item.Ativo = "";
        this.model.item.Avatar = null;
      },
  
      showNotification() {
        var self = this;
        this.$bvModal
          .msgBoxOk("Dados Adicionados com sucesso!!", {
            title: "Confirmação",
            size: "sm",
            buttonSize: "sm",
            okVariant: "success",
            headerClass: "p-2 border-bottom-0",
            footerClass: "p-2 border-top-0",
            centered: true,
          })
          .then((value) => {
            self.cleanForm();
          })
          .catch((err) => {});
      },
    },
  };
  </script>
  