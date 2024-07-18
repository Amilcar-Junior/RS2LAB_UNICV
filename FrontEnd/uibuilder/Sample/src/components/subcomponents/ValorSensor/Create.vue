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
          this.showNotification(
            "Topico adicionado com sucesso!",
            "success","Sucesso"
          );
          this.cleanForm();
        })
        .catch((e) => {
          console.log(error);
        });
    },
    //Use to clean form upon succcessful insert
    cleanForm() {
      this.model.item.Topico = "";
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
