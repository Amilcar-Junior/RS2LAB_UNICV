<template>
  <div class="container-fluid mt-5">
    <router-link to="/valorsensor" class="btn btn-secondary mb-3">
      <i class="fa fa-arrow-left" aria-hidden="true"></i> Voltar
    </router-link>
    <div class="card">
      <div class="card-header">
        <h4>Adicionar Topico do Sensor</h4>
      </div>
      <div class="card-body">
        <form @submit.prevent="addvalorsensor">
          <div class="row">
            <div class="col-md-12">
              <div class="mb-3">
                <label for="Topico" class="form-label">Topico</label>
                <input
                  type="text"
                  id="Topico"
                  v-model="model.item.Topico"
                  class="form-control"
                  placeholder="Digite o Topico do sensor"
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
  name: "Createvalorsensor",
  data() {
    return {
      model: {
        item: {
          Topico: "",
          // Data_Hora: "",
          Valor: 0,
        },
      },
    };
  },
  mounted() {
  },
  methods: {
    addvalorsensor() {
      var self = this; //Assign this to a variable
      axios
        .post("/rs2lab/addvalorsensor", this.model.item)
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
      this.model.item.Topico = "";
      this.movel.item.Valor = 0;
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
