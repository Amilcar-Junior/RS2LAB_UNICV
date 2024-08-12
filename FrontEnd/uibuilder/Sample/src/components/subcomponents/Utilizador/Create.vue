<template>
  <div class="container-fluid mt-5">
    <router-link to="/utilizador" class="btn btn-secondary mb-3">
      <i class="fa fa-arrow-left" aria-hidden="true"></i> Voltar
    </router-link>
    <div class="card">
      <div class="card-header">
        <h4>Adicionar Utilizador</h4>
      </div>
      <div class="card-body">
        <form @submit.prevent="addUtilizador">
          <div class="row">
            <!-- Coluna principal -->
            <div class="col-md-9">
              <div class="mb-3">
                <label for="nome">Nome:</label>
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
                <label for="email">Email:</label>
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
                <label for="senha">Senha:</label>
                <input
                  type="password"
                  id="senha"
                  v-model="model.item.Senha"
                  class="form-control"
                  placeholder="Insira a senha do utilizador"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="id_tipoUtilizador">Tipo Utilizador:</label>
                <select
                  id="id_tipoUtilizador"
                  v-model="model.item.ID_TipoUtilizador"
                  class="form-control"
                  required
                >
                  <option value="" disabled selected>
                    Selecione o tipo de utilizador
                  </option>
                  <option
                    v-for="tipo in filteredTipoUtilizador"
                    :key="tipo.ID"
                    :value="tipo.ID"
                  >
                    {{ tipo.Nome }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label for="id_grupoutilizadores">Grupos:</label>
                <select
                  id="id_grupoutilizadores"
                  v-model="gruposSelecionados"
                  class="form-control"
                  multiple
                  required
                >
                  <option disabled value="">Selecione um grupo</option>
                  <option
                    v-for="grupo in filteredGruposDisponiveis"
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
          <button type="submit" class="btn btn-primary float-right">
            <i class="fa fa-floppy-o" aria-hidden="true"></i> Salvar
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style>
.custom-checkbox {
  transform: scale(1.5); /* Reduz o tamanho do checkbox */
}
</style>

<script>
module.exports = {
  name: "CreateUtilizador",
  props: ["keys"],
  data() {
    return {
      model: {
        item: {
          Nome: "",
          Email: "",
          Senha: "",
          ID_TipoUtilizador: "",
          isActive: "0",
          image: "",
        },
      },
      TipoUtilizador: [],
      gruposDisponiveis: [], // Todos os grupos disponíveis
      gruposSelecionados: [], // Grupos selecionados pelo utilizador
      UtilizadorGrupo: [],
      imagePreview: "",
      userTypes: window.appConfig.userTypes,
    };
  },
  mounted() {
    this.getTipoUtilizador();
    this.getGruposDisponiveis();
  },
  computed: {
    filteredTipoUtilizador() {
      return this.keys.TipoUtilizador_Nome === this.userTypes.ADMINISTRATOR
        ? this.TipoUtilizador
        : this.TipoUtilizador.filter((tipo) => tipo.Nome !== "Administrador");
    },
    filteredGruposDisponiveis() {
      if (this.keys.TipoUtilizador_Nome === this.userTypes.ADMINISTRATOR) {
        return this.gruposDisponiveis;
      } else {
        const userGroupIds = this.keys.Grupos
          ? this.keys.Grupos.map((group) => group.ID)
          : [];
        return this.gruposDisponiveis.filter((grupo) =>
          userGroupIds.includes(grupo.Grupo_ID)
        );
      }
    },
  },
  methods: {
    addUtilizador() {
      var self = this;

      axios
        .post("/rs2lab/checkutilizador", self.model.item)
        .then((resp) => {
          if ((resp.data[0].count === 0)) {
          axios
            .post("/rs2lab/addutilizador", this.model.item)
            .then((resp) => {
              console.log(resp);
              // Adiciona o utilizador a cada grupo selecionado, apenas se houver grupos selecionados
              if (this.gruposSelecionados.length > 0) {
                this.gruposSelecionados.forEach((grupoId) => {
                  const utilizadorGrupo = {
                    ID_Utilizador: resp.data.insertId, // ID do utilizador criado
                    ID_Grupo: grupoId, // ID do grupo selecionado
                  };
                  // console.log(utilizadorGrupo);
                  self.addUtilizadorGrupo(utilizadorGrupo);
                });
              }
              this.showNotification(
                "Utilizador adicionada com sucesso!",
                "success",
                "Sucesso"
              );
              this.cleanForm();
            })
            .catch((e) => {
              console.error(e);
            });
          }else{
            this.showNotification(
                "Email já Existente!",
                "warning",
                "Erro"
              );
          }
        })
        .catch((e) => {
          console.error(e);
        });
    },

    addUtilizadorGrupo(utilizadorGrupo) {
      axios
        .post("/rs2lab/addutilizadorgrupo", utilizadorGrupo)
        .then((resp) => {})
        .catch((e) => {
          console.error("Erro ao adicionar a Utilizador:", error);
          this.showNotification(
            "Erro ao adicionar a Utilizador ao Grupo.",
            "danger",
            "Erro"
          );
        });
    },

    getGruposDisponiveis() {
      axios
        .get("/rs2lab/grupoutilizadores")
        .then((resp) => {
          console.log(resp);
          this.gruposDisponiveis = resp.data;
          console.log(this.gruposDisponiveis);
        })
        .catch((errors) => {
          console.error(errors);
          this.showNotification(
            "Erro ao buscar dados dos grupos.",
            "danger",
            "Erro"
          );
        });
    },
    getTipoUtilizador() {
      axios
        .get("/rs2lab/tipoutilizador")
        .then((resp) => {
          console.log(resp);
          this.TipoUtilizador = resp.data;
          console.log(this.TipoUtilizador);
        })
        .catch((errors) => {
          console.error(errors);
          this.showNotification(
            "Erro ao buscar dados dos Tipo Utilizador.",
            "danger",
            "Erro"
          );
        });
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

    cleanForm() {
      this.model.item.Nome = "";
      this.model.item.Email = "";
      this.model.item.Senha = "";
      this.model.item.ID_TipoUtilizador = "";
      this.model.item.isActive = "";
      this.model.item.image = null;
      this.imagePreview = "";
      this.gruposSelecionados = [];
    },

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
