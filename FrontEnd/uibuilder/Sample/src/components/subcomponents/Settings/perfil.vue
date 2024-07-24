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
                <label for="id_tipoUtilizador" class="form-label"
                  >Tipo Utilizador</label
                >
                <input
                  type="text"
                  :value="tipoUtilizadorNome"
                  class="form-control"
                  readonly
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Grupos</label>
                <div>
                  <span
                    v-for="grupo in gruposSelecionados"
                    :key="grupo.Grupo_ID"
                    class="badge badge-primary m-1"
                  >
                    {{ grupo.Grupo_Nome }}
                  </span>
                </div>
              </div>
            </div>
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
      tipoUtilizadorNome: "", // Nome do tipo de utilizador
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
          console.log(resp);
          if (this.model.item.image) {
            this.imagePreview = `data:image/jpeg;base64,${this.model.item.image}`;
          }
          this.setTipoUtilizadorNome();
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

          // Atualizar o localStorage com todos os dados do utilizador atualizados
          const updatedUser = {
            ...JSON.parse(localStorage.getItem("user")),
            Utilizador_Nome: this.model.item.Nome,
            Utilizador_Email: this.model.item.Email,
            Utilizador_image: this.model.item.image,
          };

          localStorage.setItem("user", JSON.stringify(updatedUser));

          // Atualizar o estado global
          // this.keys.setUser(updatedUser);

          // Enviar mensagem para o Node-RED para atualizar os detalhes do utilizador
          const sessionID = localStorage.getItem("token");
          uibuilder.send({
            topic: "UpdateUser",
            token: sessionID,
            payload: updatedUser,
          });

          // Verificar o conteúdo do localStorage após a atualização
          this.verifyLocalStorage();

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
          this.setTipoUtilizadorNome();
        })
        .catch((errors) => {
          console.error(errors);
        });
    },
    setTipoUtilizadorNome() {
      if (this.TipoUtilizador.length > 0 && this.model.item.ID_TipoUtilizador) {
        const tipo = this.TipoUtilizador.find(
          (tipo) => tipo.ID === this.model.item.ID_TipoUtilizador
        );
        if (tipo) {
          this.tipoUtilizadorNome = tipo.Nome;
        }
      }
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
        .then(() => {})
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
    verifyLocalStorage() {
      const user = JSON.parse(localStorage.getItem("user"));
      console.log("Dados do utilizador no localStorage: ", user);
    },
  },
};
</script>

<style scoped></style>
