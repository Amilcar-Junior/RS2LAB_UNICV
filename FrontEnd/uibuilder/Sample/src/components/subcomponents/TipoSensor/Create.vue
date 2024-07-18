<template>
  <div class="container-fluid mt-5">
    <router-link to="/tiposensor" class="btn btn-secondary mb-3">
      <i class="fa fa-arrow-left" aria-hidden="true"></i> Voltar
    </router-link>
    <div class="card">
      <div class="card-header">
        <h4>Adicionar Tipo Sensor</h4>
      </div>
      <div class="card-body">
        <form @submit.prevent="addtiposensor">
          <div class="row">
            <div class="col-md-8">
              <div class="mb-3">
                <label for="nome" class="form-label">Nome</label>
                <input
                  type="text"
                  id="nome"
                  v-model="model.item.Nome"
                  class="form-control"
                  placeholder="Digite o nome do sensor"
                  required
                />
              </div>
            </div>
            <div class="col-md-3">
              <div class="mb-3">
                <b-form-group
                  label="Icon do Sensor:"
                  label-for="icon"
                  class="mb-3"
                >
                  <b-form-file
                    id="icon"
                    @change="previewIcon"
                    accept="image/*"
                    placeholder="Escolha um arquivo..."
                  >
                  </b-form-file>
                  <b-img
                    v-if="iconPreview"
                    :src="iconPreview"
                    fluid
                    class="mt-2"
                    thumbnail
                  ></b-img>
                </b-form-group>
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
  name: "Createtiposensor",
  data() {
    return {
      model: {
        item: {
          Nome: "",
          icon: "",
        },
      },
      iconPreview: "",
    };
  },
  mounted() {},
  methods: {
    addtiposensor() {
      var self = this; //Assign this to a variable
      axios
        .post("/rs2lab/addtiposensor", this.model.item)
        .then((resp) => {
          console.log(resp);
          this.showNotification(
            "Tipo de Sensor adicionada com sucesso!",
            "success","Sucesso"
          ); //shows notification of successful add
          this.cleanForm();
        })
        .catch((e) => {
          console.log(error);
          this.showNotification(
            "Erro ao adicionar a Tipo de Sensor.",
            "danger","Erro"
          );
        });
    },
    //Use to clean form upon succcessful insert
    cleanForm() {
      this.model.item.Nome = "";
      this.model.item.icon = "";
      this.iconPreview = "";
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
