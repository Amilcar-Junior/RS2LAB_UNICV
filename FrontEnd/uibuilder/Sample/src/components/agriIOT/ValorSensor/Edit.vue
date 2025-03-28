<template>
  <div class="container-fluid mt-5">
    <router-link to="/topico" class="btn btn-secondary mb-3">
      <i class="fa fa-arrow-left" aria-hidden="true"></i> Voltar
    </router-link>
    <div class="card">
      <div class="card-header">
        <h4>Editar Tópico do Sensor / Atuador</h4>
      </div>
      <b-card-body>
        <b-form>
          <b-row class="align-items-center">
            <b-col cols="9">
              <b-form-group label="Tópico" label-for="Topico" class="mb-3">
                <b-form-input
                  id="Topico"
                  v-model="model.item.Topico"
                  required
                  placeholder="Digite o Tópico do Sensor / Atuador"
                ></b-form-input>
              </b-form-group>
            </b-col>
            <b-col cols="3">
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
                <label for="is_activatable" class="form-check-label">Atuador</label>
              </div>
            </b-col>
          </b-row>
          <b-button
            variant="primary"
            class="float-right"
            @click="editvalorsensor"
          >
            <i class="fa fa-floppy-o" aria-hidden="true"></i> Salvar
          </b-button>
        </b-form>
      </b-card-body>
    </div>
  </div>
</template>


<script>
module.exports = {
  name: "Editvalorsensor",
  data() {
    return {
      model: {
        ID: "",
        item: {
          Topico: "",
          Valor: "",
          is_activatable: "",
        },
      },
    };
  },
  mounted() {
    // console.log(this.$router.app._route.params.ID);
    this.model.ID = this.$router.app._route.params.ID;
    this.getvalorsensor(this.$router.app._route.params.ID);
  },
  methods: {
    getvalorsensor(ItemID) {
      axios
        .get(`/rs2lab/valorsensor/${ItemID}`)
        .then((resp) => {
          console.log(resp);
          this.model.item.Topico = resp.data[0].Topico;
          this.model.item.Valor = resp.data[0].Valor;
          this.model.item.is_activatable = resp.data[0].is_activatable;
          // console.log(this.model.item);
        })
        .catch((errors) => {
          console.error(errors);
        });
    },

    editvalorsensor() {
      var self = this; //Assign this to a variable
      // this.form.type = this.selected;           //Assigns selected to form.type

      axios
        .put(`/rs2lab/editvalorsensor/${this.model.ID}`, this.model.item)
        .then((resp) => {
          console.log(resp);
          this.showNotification(
            "Tópico atualizado com sucesso!",
            "success",
            "Atualização"
          );
          this.$router.push("/topico");
        })
        .catch((e) => {
          console.log(error);
          this.showNotification(
            "Erro ao atualizar o Tópico.",
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
    previewIcon(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.iconPreview = e.target.result;
          this.model.item.icon = e.target.result.split(",")[1]; // Store base64 encoded string without prefix
          console.log("Icon pré-visualizada e convertida para base64");
        };
        reader.readAsDataURL(file);
        console.log("Arquivo selecionado para upload:", file);
      } else {
        console.log("Nenhum arquivo selecionado");
      }
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
