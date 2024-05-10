<template>
  <div class="container mt-5">
    <router-link to="/grupoutilizadores" class="btn btn-secondary mb-3">
      <i class="fa fa-arrow-left" aria-hidden="true"></i> Voltar
    </router-link>
    <div class="card">
      <div class="card-header">
        <h4>Adicionar Grupo Utilizadores</h4>
      </div>
      <div class="card-body">
        <div class="mb-3">
          <label for="">Nome</label>
          <input type="text" v-model="model.item.Nome" class="form-control" />
        </div>
        <div class="mb-3">
          <button
            type="button"
            @click="addGrupoUtilizadores"
            class="btn btn-primary float-right"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  name: "CreateGrupoUtilizadores",
  data() {
    return {
      model: {
        item: {
          Nome: "",
        },
      },
    };
  },
  mounted() {},
  methods: {
    addGrupoUtilizadores() {
      var self = this; //Assign this to a variable
      axios
        .post("/rs2lab/addgrupoutilizadores", this.model.item)
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
