<template>
  <div class="container-fluid mt-5">
    <router-link to="/valorsensor" class="btn btn-secondary mb-3">
      <i class="fa fa-arrow-left" aria-hidden="true"></i> Voltar
    </router-link>
    <b-card>
      <b-card-header>
        <h4>Editar Topico Sensor</h4>
      </b-card-header>
      <b-card-body>
        <b-form>
          <b-row>
            <b-col cols="12">
              <b-form-group label="Topico" label-for="Topico" class="mb-3">
                <b-form-input
                  id="Topico"
                  v-model="model.item.Topico"
                  required
                  placeholder="Digite o Topico do sensor"
                ></b-form-input>
              </b-form-group>
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
    </b-card>
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
