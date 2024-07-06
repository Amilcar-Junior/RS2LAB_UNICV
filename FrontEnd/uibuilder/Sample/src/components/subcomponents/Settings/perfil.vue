<template>
  <div class="container-fluid mt-5">
    <router-link to="/" class="btn btn-secondary mb-3">
      <i class="fa fa-arrow-left" aria-hidden="true"></i> Voltar
    </router-link>
    <div class="card">
      <div class="card-header">
        <h4>Perfil</h4>
      </div>
      <div class="card-body">
        <form @submit.prevent="editUtilizador">
          <div class="row">
            <!-- Coluna principal -->
            <div class="col-md-9">
              <div class="mb-3">
                <label for="nome" class="form-label">Nome</label>
                <input
                  type="text"
                  id="nome"
                  v-model="model.item.Nome"
                  class="form-control"
                  placeholder="Insira o nome do utilizador"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  v-model="model.item.Email"
                  class="form-control"
                  placeholder="Insira o email do utilizador"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="id_tipoUtilizador" class="form-label">Tipo Utilizador</label>
                <select
                  v-model="model.item.ID_TipoUtilizador"
                  class="form-control"
                  required
                >
                  <option value="" disabled selected>Selecione o tipo de utilizador</option>
                  <option
                    v-for="tipo in TipoUtilizador"
                    :key="tipo.ID"
                    :value="tipo.ID"
                  >
                    {{ tipo.Nome }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Grupos</label>
                <ul class="list-group">
                  <li 
                    v-for="grupo in gruposSelecionados" 
                    :key="grupo.Grupo_ID" 
                    class="list-group-item">
                    {{ grupo.Grupo_Nome }}
                  </li>
                </ul>
              </div>
              <!-- <div class="mb-3 form-check">
                <input
                  type="checkbox"
                  id="isActive"
                  v-model="model.item.isActive"
                  :checked="model.item.isActive"
                  class="form-check-input"
                  true-value="1"
                  false-value="0"
                />
                <label for="isActive" class="form-check-label">Ativo</label>
              </div> -->
            </div>
            <!-- Coluna para a imagem de perfil -->
            <div class="col-md-3">
              <div class="mb-3">
                <b-form-group
                  label="Foto de Perfil:"
                  label-for="image"
                  class="mb-3"
                >
                  <b-form-file
                    id="image"
                    @change="previewImage"
                    accept="image/*"
                    placeholder="Escolha um arquivo..."
                  >
                  </b-form-file>
                  <b-img
                    v-if="imagePreview"
                    :src="imagePreview"
                    fluid
                    class="mt-2"
                    thumbnail
                  ></b-img>
                </b-form-group>
              </div>
            </div>
          </div>
          <button
            type="submit"
            class="btn btn-primary float-right"
          >
            <i class="fa fa-floppy-o" aria-hidden="true"></i> Salvar
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  props: ["keys"],
  name: "EditUtilizador",
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
      gruposSelecionados: [], // Grupos selecionados pelo utilizador com nomes
    };
  },
  mounted() {
    this.model.ID = this.$router.app._route.params.ID;
    this.getUtilizador(this.model.ID);
    this.getUtilizadorGrupo(this.model.ID);
    this.getTipoUtilizador();
  },
  methods: {
    getUtilizador(ItemID) {
      axios
        .get(`/rs2lab/utilizador/${ItemID}`)
        .then((resp) => {
          this.model.item = resp.data[0];
          if (this.model.item.image) {
            this.imagePreview = `data:image/jpeg;base64,${this.model.item.image}`;
          }
        })
        .catch((error) => {
          console.error("Erro ao recuperar os dados do Utilizador", error);
        });
    },
    editUtilizador() {
      axios
        .put(`/rs2lab/editutilizador/${this.model.ID}`, this.model.item)
        .then((response) => {
          console.log("Utilizador atualizado com sucesso!", response);
          localStorage.setItem('user', JSON.stringify(this.model.item));
          console.log(localStorage)
          console.log(this.keys)
          this.keys.Utilizador_Nome = this.model.item.Nome;
          this.keys.Utilizador_Email = this.model.item.Email;
          this.keys.Utilizador_image = this.model.item.image;

          
        
          this.showNotification();
        })
        .catch((error) => {
          console.error("Erro ao atualizar o Utilizador", error);
        });
    },
    getUtilizadorGrupo(ItemID) {
      axios
        .get(`/rs2lab/utilizadorgrupo/utilizador/${ItemID}`)
        .then((resp) => {
          console.log("UtilizadorGrupo: ", resp);
          this.gruposSelecionados = resp.data;
        })
        .catch((errors) => {
          console.error(errors);
        });
    },
    getTipoUtilizador() {
      axios
        .get("/rs2lab/tipoutilizador")
        .then((resp) => {
          this.TipoUtilizador = resp.data;
        })
        .catch((errors) => {
          console.error(errors);
        });
    },
    showNotification() {
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
        .then(() => {
          
        })
        .catch((err) => {});
    },
    previewImage(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreview = e.target.result;
          this.model.item.image = e.target.result.split(",")[1];
        };
        reader.readAsDataURL(file);
      }
    },
  },
};
</script>


<style scoped>
/* Adicione seus estilos específicos aqui */
</style>
