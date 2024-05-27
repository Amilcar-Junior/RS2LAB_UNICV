<template>
  <div class="container-fluid mt-5">
    <router-link to="/utilizador" class="btn btn-secondary mb-3">
      <i class="fa fa-arrow-left" aria-hidden="true"></i> Voltar
    </router-link>
    <div class="card">
      <div class="card-header">
        <h4>Editar Utilizador</h4>
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
                <label for="id_grupoutilizadores" class="form-label">Grupos</label>
                <select
                  v-model="gruposSelecionados"
                  class="form-control"
                  multiple
                  required
                >
                  <option disabled value="">Selecione um grupo</option>
                  <option
                    v-for="grupo in gruposDisponiveis"
                    :key="grupo.Grupo_ID"
                    :value="grupo.Grupo_ID"
                  >
                    {{ grupo.Grupo_Nome }}
                  </option>
                </select>
              </div>
              <div class="mb-3 form-check">
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
              </div>
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

<style>
.custom-checkbox {
  transform: scale(1.5); /* Ajuste conforme necessário */
}
</style>


<script>
module.exports = {
  name: "EditUtilizador",
  data() {
    return {
      model: {
        ID: "",
        item: {
          Nome: "",
          Email: "",
          // Senha: "",
          ID_TipoUtilizador: "",
          isActive: "",
          image: "",
        },
      },
      imagePreview: "",
      TipoUtilizador: [],
      gruposDisponiveis: [], // Todos os grupos disponíveis
      gruposSelecionados: [], // Grupos selecionados pelo utilizador
      UtilizadorGrupo: [],
    };
  },
  mounted() {
    // console.log(this.$router.app._route.params.ID);
    this.model.ID = this.$router.app._route.params.ID;
    this.getUtilizador(this.$router.app._route.params.ID);
    this.getUtilizadorGrupo(this.$router.app._route.params.ID);
    this.getTipoUtilizador();
    this.getGruposDisponiveis();
  },
  methods: {
    getUtilizador(ItemID) {
      axios
        .get(`/rs2lab/utilizador/${ItemID}`)
        .then((resp) => {
          this.model.item.Nome = resp.data[0].Nome;
          this.model.item.Email = resp.data[0].Email;
          // this.model.item.Senha = resp.data[0].Senha;
          this.model.item.ID_TipoUtilizador = resp.data[0].ID_TipoUtilizador;
          this.model.item.isActive = resp.data[0].isActive;
          this.model.item.image = resp.data[0].image;
          if (this.model.item.image) {
            this.imagePreview = `data:image/jpeg;base64,${this.model.item.image}`;
            console.log("Imagem carregada com sucesso:", this.model.item.image);
          }
        })
        .catch((error) => {
          console.error("Erro ao recuperar os dados do Utilizador", error);
        });
    },
    editUtilizador() {
      var self = this;
      // Verificar grupos removidos
      this.UtilizadorGrupo.forEach((utilizadorGrupo) => {
        if (
          !this.gruposSelecionados.includes(utilizadorGrupo.ID_Grupo.toString())
        ) {
          // Se o grupo não está mais selecionado, remova a associação
          this.deleteUtilizadorGrupo(this.model.ID, utilizadorGrupo.ID_Grupo);
        }
      });
      console.log(this.gruposSelecionados);
      // Verificar grupos adicionados
      this.gruposSelecionados.forEach((grupoId) => {
        if (
          !this.UtilizadorGrupo.some(
            (utilizadorGrupo) => utilizadorGrupo.ID_Grupo.toString() === grupoId
          )
        ) {
          // Se o grupo foi adicionado, adicione a associação
          const utilizadorgrupo = {
            ID_Utilizador: this.model.ID,
            ID_Grupo: grupoId,
          };
          this.addUtilizadorGrupo(utilizadorgrupo);
        }
      });

      // Atualizar o usuário
      axios
        .put(`/rs2lab/editutilizador/${this.model.ID}`, this.model.item)
        .then((response) => {
          console.log("Utilizador atualizado com sucesso!", response);
          this.showNotification();
        })
        .catch((error) => {
          console.error("Erro ao atualizar o Utilizador", error);
        });
    },

    deleteUtilizadorGrupo(utilizador, grupo) {
      axios
        .delete(
          `/rs2lab/deleteutilizadorgrupo/utilizador/grupoutilizadores/${utilizador}/${grupo}`
        )
        .then((res) => {
          console.log("utilizadorgrupo Delete: ", res);
        })
        .catch((errors) => {
          console.error(errors);
          self.$bvToast.toast("Ocorreu um erro ao excluir o utilizadorgrupo.", {
            title: "Erro",
            variant: "danger",
          });
        });
    },
    addUtilizadorGrupo(utilizadorgrupo) {
      var self = this; //Assign this to a variable
      axios
        .post("/rs2lab/addutilizadorgrupo", utilizadorgrupo)
        .then((resp) => {
          console.log("ADD utilizadorgrupo: ", resp);
        })
        .catch((e) => {
          console.log(error);
        });
    },
    getGruposDisponiveis() {
      axios
        .get("/rs2lab/grupoutilizadores")
        .then((resp) => {
          console.log("grupoutilizadores: ", resp);
          this.gruposDisponiveis = resp.data;
          // console.log(this.gruposDisponiveis);
        })
        .catch((errors) => {
          console.error(errors);
        });
    },
    getUtilizadorGrupo(ItemID) {
      axios
        .get(`/rs2lab/utilizadorgrupo/utilizador/${ItemID}`)
        .then((resp) => {
          console.log("UtilizadorGrupo: ", resp);
          this.UtilizadorGrupo = resp.data;

          // Preencher os grupos selecionados com os IDs dos grupos associados ao utilizador
          this.gruposSelecionados = this.UtilizadorGrupo.map(
            (utilizadorGrupo) => utilizadorGrupo.ID_Grupo.toString()
          );
        })
        .catch((errors) => {
          console.error(errors);
        });
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

    previewImage(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreview = e.target.result;
          this.model.item.image = e.target.result.split(",")[1]; // Store base64 encoded string without prefix
          console.log("Imagem pré-visualizada e convertida para base64");
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
