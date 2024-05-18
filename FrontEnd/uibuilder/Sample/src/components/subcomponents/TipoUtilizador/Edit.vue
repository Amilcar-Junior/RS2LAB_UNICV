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
        <div class="mb-3">
          <label for="">Nome</label>
          <input type="text" v-model="model.item.Nome" class="form-control" />
        </div>
        <div class="mb-3">
          <label for="">Descrição</label>
          <input
            type="text"
            v-model="model.item.Descricao"
            class="form-control"
          />
        </div>
        <div class="mb-3">
          <button
            type="button"
            @click="editTipoUtilizador"
            class="btn btn-primary float-right"
          >
          <i class="fa fa-floppy-o" aria-hidden="true"></i>
            Salvar
          </button>
        </div>
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
        });
    },

    editTipoUtilizador() {
      var self = this; //Assign this to a variable
      // this.form.type = this.selected;           //Assigns selected to form.type

      axios
        .put(`/rs2lab/edittipoutilizador/${this.model.ID}`, this.model.item)
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
