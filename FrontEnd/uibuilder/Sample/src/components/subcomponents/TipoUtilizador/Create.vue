<template>
  <div class="container-fluid mt-5">
    <router-link to="/tipoutilizador" class="btn btn-secondary mb-3">
      <i class="fa fa-arrow-left" aria-hidden="true"></i> Voltar
    </router-link>
    <div class="card">
      <div class="card-header">
        <h4>Adicionar Tipo Utilizador</h4>
      </div>
      <div class="card-body">
        <form @submit.prevent="addTipoUtilizador">
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
          <button
            type="submit"
            class="btn btn-primary float-right"
          >
            <i class="fa fa-floppy-o" aria-hidden="true"></i> Salvar
          </button>
        </form>
      </div>
    </div>
  </div>
</template>


<script>
module.exports = {
  name: "CreateTipoUtilizador",
  data() {
    return {
      model: {
        item: {
          Nome: "",
          Descricao: "",
        },
      },
    };
  },
  mounted() {},
  methods: {
    addTipoUtilizador() {
      var self = this; //Assign this to a variable
      axios
        .post("/rs2lab/addtipoutilizador", this.model.item)
        .then((resp) => {
          console.log(resp);
          self.showNotification(); //shows notification of successful add
        })
        .catch((e) => {
          console.log(error);
        });
    },
    //Use to clean form upon succcessful insert
    cleanForm() {
      this.model.item.Nome = "";
      this.model.item.Descricao = "";
    },
    //Shows a dialog notification

    showNotification() {
      var self = this; //Assign this to a variable
      this.boxTwo = "";
      this.$bvModal
        .msgBoxOk("Dados Adicionados com sucesso!!", {
          title: "Confirmation",
          size: "sm",
          buttonSize: "sm",
          okVariant: "success",
          headerClass: "p-2 border-bottom-0",
          footerClass: "p-2 border-top-0",
          centered: true,
        })
        .then((value) => {
          self.cleanForm(); //clears form upon confirmation of user
        })
        .catch((err) => {});
    },
  },
};
</script>
