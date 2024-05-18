<template>
  <div class="container-fluid mt-5">
    <router-link to="/" class="btn btn-secondary mb-3">
      <i class="fa fa-arrow-left" aria-hidden="true"></i> Voltar
    </router-link>
    <div class="card">
      <div class="card-header">
        <h4>Perfil do Utilizador</h4>
      </div>
      <div class="card-body">
        <form @submit.prevent="editUtilizador">
          <div class="mb-3">
            <label for="nome" class="form-label">Nome:</label>
            <input
              type="text"
              id="nome"
              v-model="model.item.Nome"
              class="form-control"
              required
            />
          </div>

          <div class="mb-3">
            <label for="email" class="form-label">Email:</label>
            <input
              type="email"
              id="email"
              v-model="model.item.Email"
              class="form-control"
              required
            />
          </div>

          <div class="mb-3">
            <label for="tipoUtilizador" class="form-label"
              >Tipo de Utilizador:</label
            >
            <select
              id="tipoUtilizador"
              v-model="model.item.ID_TipoUtilizador"
              class="form-control"
              disabled
            >
              <option
                v-for="tipo in TipoUtilizador"
                :key="tipo.ID"
                :value="tipo.ID"
              >
                {{ tipo.Nome }}
              </option>
            </select>
          </div>

          <div class="mb-3 form-check">
            <input
              type="checkbox"
              id="ativo"
              v-model="model.item.isActive"
              class="form-check-input"
              disabled
            />
            <label for="ativo" class="form-check-label">Ativo</label>
          </div>

          <div class="mb-3">
            <label for="avatar">Avatar:</label>
            <input
              type="file"
              id="avatar"
              @change="onAvatarChange"
              class="form-control-file"
            />
            <img
              v-if="avatarPreview"
              :src="avatarPreview"
              alt="Preview do Avatar"
              class="mt-2"
              style="max-width: 100px; max-height: 100px"
            />
          </div>

          <button type="submit" class="btn btn-primary float-right">
            <i class="fa fa-floppy-o" aria-hidden="true"></i> Salvar
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  name: "PerfilUtilizador",
  data() {
    return {
      model: {
        ID: "",
        item: {
          Nome: "",
          Email: "",
          ID_TipoUtilizador: "",
          isActive: "",
          Avatar: "",
        },
      },
      avatarPreview: "",
      TipoUtilizador: [],
    };
  },
  mounted() {
    this.model.ID = this.$router.app._route.params.ID; // Set ID from URL params
    this.retrieveProfile();
    this.getTipoUtilizador();
  },
  methods: {
    retrieveProfile() {
      axios
        .get(`/rs2lab/utilizador/${this.model.ID}`)
        .then((response) => {
          this.model.item = response.data[0]; // Assuming response.data is an array
          if (response.data[0].Avatar && response.data[0].Avatar.data) {
            const avatarData = response.data[0].Avatar.data;
            const buffer = new Uint8Array(avatarData).buffer;
            const blob = new Blob([buffer], { type: "image/jpeg" });
            this.avatarPreview = URL.createObjectURL(blob);
          }
        })
        .catch((error) => {
          console.error("Erro ao recuperar os dados do perfil", error);
        });
    },

    editUtilizador() {
      

      axios
        .put(`/rs2lab/editutilizador/${this.model.ID}`, this.model.item)
        .then((response) => {
          console.log("Perfil atualizado com sucesso!", response);
          this.showNotification();
        })
        .catch((error) => {
          console.error("Erro ao atualizar o perfil", error);
        });
    },

    onAvatarChange(event) {
      const file = event.target.files[0];
      if (file && file instanceof File) {
        this.model.item.Avatar = file; // Atualiza o avatar no modelo com o arquivo selecionado
        this.avatarPreview = URL.createObjectURL(file); // Cria uma URL para o arquivo para visualização
      } else {
        console.error("O arquivo selecionado não é válido");
        this.model.item.Avatar = null;
        this.avatarPreview = "";
      }
    },

    getTipoUtilizador() {
      axios
        .get("/rs2lab/tipoutilizador")
        .then((resp) => {
          console.log("tipoutilizador: ", resp);
          this.TipoUtilizador = resp.data;
          // console.log(this.TipoUtilizador);
        })
        .catch((errors) => {
          console.error(errors);
        });
    },
    showNotification() {
      var self = this; // Atribui this a uma variável
      this.boxTwo = "";
      this.$bvModal
        .msgBoxOk("Perfil Editado Com Sucesso!", {
          title: "Confirmação",
          size: "sm",
          buttonSize: "sm",
          okVariant: "success",
          headerClass: "p-2 border-bottom-0",
          footerClass: "p-2 border-top-0",
          centered: true,
        })
        .then((value) => {
          // Retorna para a URL anterior
        })
        .catch((err) => {});
    },
  },
};
</script>

<style>
/* Adicione seus estilos específicos aqui */
</style>
