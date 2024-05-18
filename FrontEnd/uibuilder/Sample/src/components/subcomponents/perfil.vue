<template>
  <div class="container mt-5">
    <b-button to="/" variant="secondary" class="mb-4">
      <i class="fa fa-arrow-left" aria-hidden="true"></i> Voltar
    </b-button>

    <b-card title="Perfil do Utilizador">
      <b-form @submit.prevent="editUtilizador">
        <b-row>
          <!-- Coluna para os campos de entrada -->
          <b-col cols="8">
            <b-form-group
              label="Nome:"
              label-for="nome"
              class="mb-3">
              <b-form-input
                id="nome"
                v-model="model.item.Nome"
                required
                placeholder="Digite seu nome">
              </b-form-input>
            </b-form-group>
            
            <b-form-group
              label="Email:"
              label-for="email"
              class="mb-3">
              <b-form-input
                type="email"
                id="email"
                v-model="model.item.Email"
                required
                placeholder="Digite seu email">
              </b-form-input>
            </b-form-group>
            
            <b-form-group
              label="Tipo de Utilizador:"
              label-for="tipoUtilizador"
              class="mb-3">
              <b-form-select
                id="tipoUtilizador"
                v-model="model.item.ID_TipoUtilizador"
                :options="TipoUtilizador"
                disabled>
              </b-form-select>
            </b-form-group>
            
            <!-- <b-form-group
              label="Ativo:"
              class="mb-3">
              <b-form-checkbox
                id="ativo"
                v-model="model.item.isActive"
                disabled>
              </b-form-checkbox>
            </b-form-group> -->
          </b-col>

          <!-- Coluna para a imagem de perfil -->
          <b-col cols="4">
            <b-form-group
              label="Foto de Perfil:"
              label-for="image"
              class="mb-3">
              <b-form-file
                id="image"
                @change="previewImage"
                accept="image/*"
                placeholder="Escolha um arquivo...">
              </b-form-file>
              <b-img v-if="imagePreview" :src="imagePreview" fluid class="mt-2" thumbnail></b-img>
            </b-form-group>
          </b-col>
        </b-row>

        <b-button type="submit" variant="primary" class="float-right">
          <i class="fa fa-floppy-o" aria-hidden="true"></i> Salvar
        </b-button>
      </b-form>
    </b-card>
  </div>
</template>



<script>
module.exports = {
  name: "PerfilUtilizador",
  data() {
    return {
      model: {
        ID: "",
        item: {
          Nome: "",
          Email: "",
          ID_TipoUtilizador: "",
          isActive: "",
          image: "",
        },
      },
      imagePreview: "",
      TipoUtilizador: [],
    };
  },
  mounted() {
    this.model.ID = this.$router.app._route.params.ID; // Set ID from URL params
    this.retrieveProfile();
    this.getTipoUtilizador();
  },
  methods: {
    retrieveProfile() {
      axios
        .get(`/rs2lab/utilizador/${this.model.ID}`)
        .then((response) => {
          this.model.item = response.data[0]; // Assuming response.data is an array
          console.log(this.model.item)
          if (this.model.item.image) {
            this.imagePreview = `data:image/jpeg;base64,${this.model.item.image}`;
            console.log("Imagem carregada com sucesso:", this.model.item.image);
          }
        })
        .catch((error) => {
          console.error("Erro ao recuperar os dados do perfil", error);
        });
    },

    editUtilizador() {
      console.log("Enviando dados para atualização:", this.model.item);
      axios
        .put(`/rs2lab/editutilizador/${this.model.ID}`, this.model.item)
        .then((response) => {
          console.log("Perfil atualizado com sucesso!", response);
          this.showNotification();
        })
        .catch((error) => {
          console.error("Erro ao atualizar o perfil", error);
        });
    },

    previewImage(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreview = e.target.result;
          this.model.item.image = e.target.result.split(',')[1]; // Store base64 encoded string without prefix
          console.log("Imagem pré-visualizada e convertida para base64");
        };
        reader.readAsDataURL(file);
        console.log("Arquivo selecionado para upload:", file);
      } else {
        console.log("Nenhum arquivo selecionado");
      }
    },


    getTipoUtilizador() {
      axios
        .get("/rs2lab/tipoutilizador")
        .then((resp) => {
          console.log("tipoutilizador: ", resp);
          this.TipoUtilizador = resp.data;
          // console.log(this.TipoUtilizador);
        })
        .catch((errors) => {
          console.error(errors);
        });
    },
    showNotification() {
      var self = this; // Atribui this a uma variável
      this.boxTwo = "";
      this.$bvModal
        .msgBoxOk("Perfil Editado Com Sucesso!", {
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
        })
        .catch((err) => {});
    },
  },
};
</script>

<style>
/* Adicione seus estilos específicos aqui */
</style>
