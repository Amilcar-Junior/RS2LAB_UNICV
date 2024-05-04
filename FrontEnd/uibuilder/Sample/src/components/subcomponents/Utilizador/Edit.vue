<template>
  <div class="container mt-5">
    <div class="card">
      <div class="card-header">
        <h4>Edit Utilizador</h4>
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
            type="checkbox"
            id="ativo"
            v-model="model.item.Ativo"
            class="form-control custom-checkbox"
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
            @click="editUtilizador"
            class="btn btn-primary float-right"
          >
            Editar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<style>
.custom-checkbox {
  transform: scale(0.8); /* Reduz o tamanho do checkbox */
}
</style>

<script>
module.exports = {
  name: "EditUtilizador",
  data() {
    return {
      model: {
        ID: "",
        item: {
          Nome: "",
          Email: "",
          Senha: "",
          ID_TipoUtilizador: "",
          isActive: "",
          Avatar: "",
        },
      },
      avatarPreview: "",
    };
  },
  mounted() {
    // console.log(this.$router.app._route.params.ID);
    this.model.ID = this.$router.app._route.params.ID;
    this.getUtilizador(this.$router.app._route.params.ID);
  },
  methods: {
    getUtilizador(ItemID) {
      axios
        .get(`/rs2lab/utilizador/${ItemID}`)
        .then((resp) => {
          this.model.item.Nome = resp.data[0].Nome;
          this.model.item.Email = resp.data[0].Email;
          this.model.item.Senha = resp.data[0].Senha;
          this.model.item.ID_TipoUtilizador = resp.data[0].ID_TipoUtilizador;
          this.model.item.isActive = resp.data[0].isActive;

          // Assume que resp.data[0].Avatar contém um Blob do avatar
          const blob = new Blob([resp.data[0].Avatar], { type: "image/jpeg" });
          const url = URL.createObjectURL(blob);
          this.avatarPreview = url;
        })
        .catch((errors) => {
          console.error(errors);
        });
    },

    editUtilizador() {
      var self = this; //Assign this to a variable
      // this.form.type = this.selected;           //Assigns selected to form.type

      axios
        .put(`/rs2lab/editutilizador/${this.model.ID}`, this.model.item)
        .then((resp) => {
          console.log(resp);
          self.showNotification(); //shows notification of successful add
        })
        .catch((e) => {
          console.log(error);
        });
    },
    //Shows a dialog notification

    showNotification() {
      var self = this; // Atribui this a uma variável
      this.boxTwo = "";
      this.$bvModal
        .msgBoxOk("Dados Editados Com Sucesso!", {
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
          this.$router.go(-1);
        })
        .catch((err) => {});
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
  },
};
</script>
