<template>
  <div class="container-fluid mt-5">
    <router-link to="/utilizador" class="btn btn-secondary mb-3">
      <i class="fa fa-arrow-left" aria-hidden="true"></i> Voltar
    </router-link>

    <b-card title="Adicionar Utilizador">
      <b-form @submit.prevent="addUtilizador">
        <b-row>
          <!-- Coluna para os campos de entrada -->
          <b-col md="9">
            <b-form-group label="Nome:" label-for="nome">
              <b-form-input
                id="nome"
                v-model="model.item.Nome"
                required
                placeholder="Insira o nome do utilizador"
              >
              </b-form-input>
            </b-form-group>

            <b-form-group label="Email:" label-for="email">
              <b-form-input
                type="email"
                id="email"
                v-model="model.item.Email"
                required
                placeholder="Insira o email do utilizador"
              >
              </b-form-input>
            </b-form-group>

            <b-form-group label="Senha:" label-for="senha">
              <b-form-input
                type="password"
                id="senha"
                v-model="model.item.Senha"
                required
                placeholder="Insira a senha do utilizador"
              >
              </b-form-input>
            </b-form-group>

            <b-form-group
              label="Tipo Utilizador:"
              label-for="id_tipoUtilizador"
            >
              <b-form-select
                id="id_tipoUtilizador"
                v-model="model.item.ID_TipoUtilizador"
                required
              >
                <b-form-select-option value="" disabled selected>
                  Selecione o tipo de utilizador
                </b-form-select-option>
                <b-form-select-option
                  v-for="tipo in TipoUtilizador"
                  :key="tipo.ID"
                  :value="tipo.ID"
                >
                  {{ tipo.Nome }}
                </b-form-select-option>
              </b-form-select>
            </b-form-group>

            <b-form-group label="Grupos:" label-for="id_grupoutilizadores">
              <b-form-select v-model="gruposSelecionados" multiple required>
                <b-form-select-option disabled value="">
                  Selecione um grupo
                </b-form-select-option>
                <b-form-select-option
                  v-for="grupo in gruposDisponiveis"
                  :key="grupo.Grupo_ID"
                  :value="grupo.Grupo_ID"
                >
                  {{ grupo.Grupo_Nome }}
                </b-form-select-option>
              </b-form-select>
            </b-form-group>

            <b-form-checkbox
              id="isActive"
              v-model="model.item.isActive"
              class="form-check-input custom-checkbox"
              true-value="1"
              false-value="0"
            >
              Ativo
            </b-form-checkbox>
          </b-col>

          <!-- Coluna para a imagem de perfil -->
          <b-col cols="3">
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
          </b-col>
        </b-row>

        <b-button type="submit" variant="primary" class="float-right">
          <i class="fa fa-floppy-o" aria-hidden="true"></i> Salvar
        </b-button>
      </b-form>
    </b-card>
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
    };
  },
  mounted() {
    this.getTipoUtilizador();
    this.getGruposDisponiveis();
  },
  methods: {
    addUtilizador() {
      var self = this;
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
          self.showNotification();
        })
        .catch((e) => {
          console.error(e);
        });
    },

    addUtilizadorGrupo(utilizadorGrupo) {
      axios
        .post("/rs2lab/addutilizadorgrupo", utilizadorGrupo)
        .then((resp) => {
          console.log(resp);
        })
        .catch((e) => {
          console.error(e);
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
      this.model.item.Avatar = null;
      this.imagePreview = "";
      this.gruposSelecionados = [];
    },

    showNotification() {
      var self = this;
      this.$bvModal
        .msgBoxOk("Dados Adicionados com sucesso!!", {
          title: "Confirmação",
          size: "sm",
          buttonSize: "sm",
          okVariant: "success",
          headerClass: "p-2 border-bottom-0",
          footerClass: "p-2 border-top-0",
          centered: true,
        })
        .then((value) => {
          self.cleanForm();
        })
        .catch((err) => {});
    },
  },
};
</script>
