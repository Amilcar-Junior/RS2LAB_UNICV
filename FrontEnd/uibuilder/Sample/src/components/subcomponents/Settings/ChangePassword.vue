<template>
  <div class="container-fluid mt-5">
    <router-link to="/" class="btn btn-secondary mb-3">
      <i class="fa fa-arrow-left" aria-hidden="true"></i> Voltar
    </router-link>
    <div class="card">
      <div class="card-header">
        <h4>Alterar Palavra-passe</h4>
      </div>
      <div class="card-body">
        <form @submit.prevent="editUtilizador">
          <div class="row">
            <!-- Coluna principal -->
            <div class="col-md-9">
              <div class="mb-3">
                <label for="currentPassword" class="form-label">Palavra-passe Atual</label>
                <input
                  type="password"
                  id="currentPassword"
                  v-model="currentPassword"
                  class="form-control"
                  placeholder="Insira a Palavra-passe Atual"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="newPassword" class="form-label">Nova Palavra-passe</label>
                <input
                  type="password"
                  id="newPassword"
                  v-model="newPassword"
                  class="form-control"
                  placeholder="Insira a nova Palavra-passe"
                  required
                />
              </div>
            </div>
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
  name: "ChangePassword",
  data() {
    return {
      model: {
        ID: "",
        item: {},
      },
      currentPassword: "",
      newPassword: "",
    };
  },
  mounted() {
    this.model.ID = this.$route.params.ID;
    this.getUtilizador(this.model.ID);
  },
  methods: {
    getUtilizador(ItemID) {
      axios
        .get(`/rs2lab/utilizador/${ItemID}`)
        .then((resp) => {
          this.model.item = resp.data[0];
          // console.log(resp);
        })
        .catch((error) => {
          console.error("Erro ao recuperar os dados do Utilizador", error);
        });
    },
    editUtilizador() {
      const hashedCurrentPassword = CryptoJS.SHA256(this.currentPassword).toString();

      console.log(hashedCurrentPassword)
      // Verifica se a senha atual está correta
      if (hashedCurrentPassword === this.model.item.Senha) {
        // Senha correta, executa a API para alterar a senha
        const payload = {
          newPassword: this.newPassword,
        };
        
        axios
          .put(`/rs2lab/editsenhautilizador/${this.model.ID}`, payload)
          .then((response) => {
            // console.log("Utilizador atualizado com sucesso!", response);
            this.model.item.Senha = hashedCurrentPassword;
            this.cleanForm();
            this.showToast("Palavra-passe alterada com sucesso!", "success", "Sucesso");
          })
          .catch((error) => {
            this.showToast("Erro ao alterar palavra-passe", "danger", "Erro");
          });
      } else {
        // Senha atual incorreta
        this.showToast("Palavra-passe inserida não é igual a palavra-passe atual", "danger", "Erro");
      }
    },
    showToast(message, variant, title) {
      this.$bvToast.toast(message, {
        title: title,
        variant: variant,
        solid: true,
      });
    },
    cleanForm() {
      this.newPassword = "";
      this.currentPassword = "";    
    },
  },
};
</script>

<style scoped></style>
