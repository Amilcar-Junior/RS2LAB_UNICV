<template>
  <div class="container-fluid mt-5">
    <router-link to="/biosentry/utilizador" class="btn btn-secondary mb-3">
      <i class="fa fa-arrow-left" aria-hidden="true"></i> Voltar
    </router-link>
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h4>Adicionar Utilizador</h4>
        <!-- <button @click="sendConvite" class="form-control d-inline-block w-auto btn btn-primary float-right">
            <i class="fa fa-paper-plane-o" aria-hidden="true"></i> Convidar
          </button> -->
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
                <label for="codigo">Código:</label>
                <input
                  type="text"
                  id="codigo"
                  v-model="model.item.Codigo"
                  class="form-control"
                  placeholder="Insira o código do utilizador"
                  required
                />
              </div>
              <!-- <div class="mb-3">
                <label for="senha">Senha:</label>
                <input
                  type="password"
                  id="senha"
                  v-model="model.item.Senha"
                  class="form-control"
                  placeholder="Insira a palavra-passe do utilizador"
                />
              </div> -->
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
          Codigo: "",
          Nome: "",
          Email: "",
          Senha: "", // A senha será gerada automaticamente
          ID_TipoUtilizador: "",
          isActive: "1",
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
       // Verifica se o utilizador atual é Administrador ou Gestor
  if (
    this.keys.TipoUtilizador_Nome === this.userTypes.ADMINISTRATOR ||
    this.keys.TipoUtilizador_Nome === this.userTypes.GESTOR ||
    this.keys.TipoUtilizador_Nome === this.userTypes.ADMINBIOSENTRY
  ) {
    // Retorna apenas os tipos permitidos: Administrador, Gestor e Guarda
    return this.TipoUtilizador.filter((tipo) =>
      ["Administrador", "Gestor", "Guarda", "AdminBiosEntry"].includes(tipo.Nome)
    );
  } else {
    // Para outros utilizadores, pode retornar uma lista vazia ou uma filtrada diferente, se quiser
    return [];
  }
    },
    filteredGruposDisponiveis() {

      if (this.keys.TipoUtilizador_Nome === this.userTypes.ADMINISTRATOR || this.keys.TipoUtilizador_Nome === this.userTypes.ADMINBIOSENTRY) {
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

      // Gera a senha automaticamente antes de enviar o formulário
      this.model.item.Senha = this.gerarSenhaSegura();

      axios
        .post("/biosentry/checkutilizador", self.model.item)
        .then((resp) => {
          if (resp.data[0].count === 0) {
            axios
              .post("/biosentry/addutilizador", this.model.item)
              .then((resp) => {
                // console.log(resp);
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
                this.sendConvite();
                this.cleanForm();
              })
              .catch((e) => {
                console.error(e);
              });
          } else {
            this.showNotification("Email já Existente!", "warning", "Erro");
          }
        })
        .catch((e) => {
          console.error(e);
        });
    },
    sendConvite() {
      axios
        .post("/biosentry/send-account", {
          Utilizador_Email: this.model.item.Email,
          Utilizador_Senha: this.model.item.Senha,
          Utilizador_Nome: this.model.item.Nome,
        })
        .then((res) => {
          console.log(res);
          this.showNotification(
            "Convite de acesso enviado ao utilizador!",
            "success",
            "Sucesso"
          );
        })
        .catch((e) => {
          console.error(e);
          this.showNotification(
            "Erro ao enviar Email ao utilizador!",
            "warning",
            "Erro"
          );
        });
    },
    addUtilizadorGrupo(utilizadorGrupo) {
      axios
        .post("/biosentry/addutilizadorgrupo", utilizadorGrupo)
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
        .get("/biosentry/grupoutilizadores")
        .then((resp) => {
          console.log("Resposta do endpoint:", resp.data);
          this.gruposDisponiveis = resp.data;
          console.log("gruposDisponiveis:", this.gruposDisponiveis);
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
        .get("/biosentry/tipoutilizador")
        .then((resp) => {
          // console.log(resp);
          this.TipoUtilizador = resp.data;
          // console.log(this.TipoUtilizador);
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

    // Função para gerar senha segura
    gerarSenhaSegura() {
      const caracteres =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?";
      let senha = "";
      for (let i = 0; i < 16; i++) {
        senha += caracteres.charAt(
          Math.floor(Math.random() * caracteres.length)
        );
      }
      return senha;
    },

    previewImage(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreview = e.target.result;
          this.model.item.image = e.target.result.split(",")[1]; // Armazena a string codificada em base64 sem o prefixo
          // console.log("Imagem pré-visualizada e convertida para base64");
        };
        reader.readAsDataURL(file);
        console.log("Arquivo selecionado para upload:", file);
      } else {
        console.log("Nenhum arquivo selecionado");
      }
    },

    cleanForm() {
      this.model.item.Nome = "";
      this.model.item.Codigo = "";
      this.model.item.Email = "";
      this.model.item.Senha = ""; // Limpa a senha gerada
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
