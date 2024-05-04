<template>
  <div class="container mt-5">
    <div class="card">
      <div class="card-header">
        <h4>Edit Grupo Utilizadores</h4>
      </div>
      <div class="card-body">
        <div class="mb-3">
          <label for="">Nome</label>
          <input type="text" v-model="model.item.Nome" class="form-control" />
        </div>
        <div class="mb-3">
          <button
            type="button"
            @click="editGrupoUtilizadores"
            class="btn btn-primary float-right"
          >
            Editar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  name: "EditGrupoUtilizadores",
  data() {
    return {
      model: {
        ID: "",
        item: {
          Nome: "",
        },
      },
    };
  },
  mounted() {
    // console.log(this.$router.app._route.params.ID);
    this.model.ID = this.$router.app._route.params.ID;
    this.getGrupoUtilizadores(this.$router.app._route.params.ID);
  },
  methods: {
    getGrupoUtilizadores(ItemID) {
      axios
        .get(`/rs2lab/grupoutilizadores/${ItemID}`)
        .then((resp) => {
          // console.log(resp);
          this.model.item.Nome = resp.data[0].Nome;
          // console.log(this.model.item);
        })
        .catch((errors) => {
          console.error(errors);
        });
    },

    editGrupoUtilizadores() {
      var self = this; //Assign this to a variable
      axios
        .put(`/rs2lab/editgrupoutilizadores/${this.model.ID}`, this.model.item)
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
  },
};
</script>
