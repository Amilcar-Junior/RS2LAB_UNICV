<template>
  <div class="container-fluid mt-5">
    <router-link to="/tiposensor" class="btn btn-secondary mb-3">
      <i class="fa fa-arrow-left" aria-hidden="true"></i> Voltar
    </router-link>
    <b-card>
      <b-card-header>
        <h4>Editar Tipo Sensor / Atuador</h4>
      </b-card-header>
      <b-card-body>
        <b-form>
          <b-row>
            <b-col cols="8">
              <b-form-group label="Nome" label-for="nome" class="mb-3">
                <b-form-input
                  id="nome"
                  v-model="model.item.Nome"
                  required
                  placeholder="Digite o nome do Sensor / Atuador"
                ></b-form-input>
              </b-form-group>
            </b-col>
            <b-col cols="4">
              <b-form-group
                label="Icon do Sensor / Atuador:"
                label-for="icon"
                class="mb-4"
              >
                <b-form-file
                  id="icon"
                  @change="previewIcon"
                  accept="image/*"
                  placeholder="Escolha um arquivo..."
                ></b-form-file>
                <b-img
                  v-if="iconPreview"
                  :src="iconPreview"
                  fluid
                  class="mt-4"
                  thumbnail
                ></b-img>
              </b-form-group>
            </b-col>
          </b-row>
          <b-button
            variant="primary"
            class="float-right"
            @click="edittiposensor"
          >
            <i class="fa fa-floppy-o" aria-hidden="true"></i> Salvar
          </b-button>
        </b-form>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
module.exports = {
  name: "Edittiposensor",
  data() {
    return {
      model: {
        ID: "",
        item: {
          Nome: "",
          icon: "",
        },
      },
      iconPreview: "",
    };
  },
  mounted() {
    // console.log(this.$router.app._route.params.ID);
    this.model.ID = this.$router.app._route.params.ID;
    this.retrievetiposensor(this.$router.app._route.params.ID);
  },
  methods: {
    retrievetiposensor(ItemID) {
      axios
        .get(`/rs2lab/tiposensor/${ItemID}`)
        .then((resp) => {
          console.log(resp);
          this.model.item.Nome = resp.data[0].Nome;
          this.model.item.icon = resp.data[0].icon;
          // console.log(this.model.item);
          if (this.model.item.icon) {
            this.iconPreview = `data:image/jpeg;base64,${this.model.item.icon}`;
            console.log("Icon carregada com sucesso:", this.model.item.icon);
          }
        })
        .catch((errors) => {
          console.error(errors);
          this.showNotification(
            "Erro ao recuperar dados do Tipo Sensor / Atuador.",
            "danger",
            "Erro"
          );
        });
    },

    edittiposensor() {
      var self = this; //Assign this to a variable
      // this.form.type = this.selected;           //Assigns selected to form.type

      axios
        .put(`/rs2lab/edittiposensor/${this.model.ID}`, this.model.item)
        .then((resp) => {
          console.log(resp);
          this.showNotification(
            "Tipo Sensor / Atuador atualizado com sucesso!",
            "success",
            "Atualização"
          ); //shows notification of successful add
        })
        .catch((e) => {
          console.log(error);
          this.showNotification(
            "Erro ao atualizar o Tipo Sensor / Atuador.",
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
