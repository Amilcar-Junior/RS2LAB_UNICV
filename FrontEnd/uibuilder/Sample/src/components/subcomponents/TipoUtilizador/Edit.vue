<template>
  <div class="container-fluid mt-5">
    <router-link to="/tipoutilizador" class="btn btn-secondary mb-3">
      <i class="fa fa-arrow-left" aria-hidden="true"></i> Voltar
    </router-link>
    <div class="card">
      <div class="card-header">
        <h4>Editar Tipo Utilizador</h4>
      </div>
      <div class="card-body">
        <form @submit.prevent="editTipoUtilizador">
          <div class="mb-3">
            <label for="nome" class="form-label">Nome</label>
            <input
              type="text"
              id="nome"
              v-model="model.item.Nome"
              class="form-control"
              placeholder="Insira o nome do tipo de utilizador"
              required
            />
          </div>
          <div class="mb-3">
            <label for="descricao" class="form-label">Descrição</label>
            <input
              type="text"
              id="descricao"
              v-model="model.item.Descricao"
              class="form-control"
              placeholder="Insira a descrição do tipo de utilizador"
              required
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
  name: "EditTipoUtilizador",
  data() {
    return {
      model: {
        ID: "",
        item: {
          Nome: "",
          Descricao: "",
        },
      },
    };
  },
  mounted() {
    // console.log(this.$router.app._route.params.ID);
    this.model.ID = this.$router.app._route.params.ID;
    this.getTipoUtilizador(this.$router.app._route.params.ID);
  },
  methods: {
    getTipoUtilizador(ItemID) {
      axios
        .get(`/rs2lab/tipoutilizador/${ItemID}`)
        .then((resp) => {
          // console.log(resp);
          this.model.item.Nome = resp.data[0].Nome;
          this.model.item.Descricao = resp.data[0].Descricao;
          // console.log(this.model.item);
        })
        .catch((errors) => {
          console.error(errors);
          this.showNotification(
            "Erro ao recuperar dados do Tipo Utilizador.",
            "danger",
            "Erro"
          );
        });
    },

    editTipoUtilizador() {
      var self = this; //Assign this to a variable
      // this.form.type = this.selected;           //Assigns selected to form.type

      axios
        .put(`/rs2lab/edittipoutilizador/${this.model.ID}`, this.model.item)
        .then((resp) => {
          console.log(resp);
          this.showNotification(
            "Tipo Utilizador atualizado com sucesso!",
            "success",
            "Atualização"
          ); //shows notification of successful add
          this.$router.push("/tipoutilizador");
        })
        .catch((e) => {
          console.log(error);
          this.showNotification(
            "Erro ao atualizar o Tipo Utilizador.",
            "danger",
            "Erro"
          );
        });
    },
    //Shows a dialog notification

    showNotification(message, variant, title) {
      this.$bvToast.toast(message, {
        title: title,
        variant: variant,
        solid: true,
      });
    },
  },
};
</script>
