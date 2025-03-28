<template>
  <div class="container-fluid mt-5">
    <router-link to="/topico" class="btn btn-secondary mb-3">
      <i class="fa fa-arrow-left" aria-hidden="true"></i> Voltar
    </router-link>
    <div class="card">
      <div class="card-header">
        <h4>Adicionar Tópico do Sensor / Atuador</h4>
      </div>
      <div class="card-body">
        <form @submit.prevent="addvalorsensor">
          <div class="row align-items-center">
            <div class="col-md-8">
              <div class="mb-3">
                <label for="Topico" class="form-label">Tópico</label>
                <input
                  type="text"
                  id="Topico"
                  v-model="model.item.Topico"
                  class="form-control"
                  placeholder="Digite o Tópico do Sensor / Atuador"
                  required
                />
              </div>
            </div>
            <div class="col-md-4">
              <div class="mb-0 form-check text-center">
                <input
                  type="checkbox"
                  id="is_activatable"
                  v-model="model.item.is_activatable"
                  :checked="model.item.is_activatable"
                  class="form-check-input custom-checkbox"
                  true-value="1"
                  false-value="0"
                />
                <label for="is_activatable" class="form-check-label"
                  >Atuador</label
                >
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
          is_activatable: 0,
        },
      },
    };
  },
  mounted() {},
  methods: {
    addvalorsensor() {
      var self = this; //Assign this to a variable
      axios
        .post("/rs2lab/addvalorsensor", this.model.item)
        .then((resp) => {
          console.log(resp);
          this.showNotification(
            "Tópico adicionado com sucesso!",
            "success",
            "Sucesso"
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
      this.model.item.is_activatable = 0;

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

<style>
.custom-checkbox {
  transform: scale(2.5); /* Aumenta o tamanho da checkbox */
  margin-top: 8px; /* Ajuste o alinhamento vertical */
}

.form-check-label {
  margin-left: 10px; /* Adiciona espaçamento entre a checkbox e o label */
  font-weight: bold; /* Torna o texto do label mais visível */
}
</style>
