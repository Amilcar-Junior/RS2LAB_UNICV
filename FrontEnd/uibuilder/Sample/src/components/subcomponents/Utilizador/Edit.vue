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
              <div class="mb-3" v-if="filteredTipoUtilizador.length > 0">
                <label for="id_tipoUtilizador" class="form-label"
                  >Tipo Utilizador</label
                >
                <select
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
                <label for="id_grupoutilizadores" class="form-label"
                  >Grupos</label
                >
                <select
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
          <!-- <button @click="sendConvite" class="btn btn-primary float-right">
            <i class="fa fa-paper-plane-o" aria-hidden="true"></i> Convidar
          </button> -->
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
  transform: scale(1.5); /* Ajuste conforme necessário */
}
</style>

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
      userTypes: window.appConfig.userTypes,
    };
  },
  computed: {
    filteredTipoUtilizador() {
      if (!this.keys || !this.userTypes) {
        return [];
      }
      if (this.keys.TipoUtilizador_Nome === this.userTypes.ADMINISTRATOR) {
        return this.TipoUtilizador;
      }
      return this.TipoUtilizador.filter(
        (tipo) => tipo.Nome !== "Administrador"
      );
    },
    filteredGruposDisponiveis() {
      if (!this.keys || !this.keys.Grupos) {
        return [];
      }
      if (this.keys.TipoUtilizador_Nome === this.userTypes.ADMINISTRATOR) {
        return this.gruposDisponiveis;
      }
      const userGroupIds = this.keys.Grupos
        ? this.keys.Grupos.map((group) => group.ID)
        : [];
      return this.gruposDisponiveis.filter((grupo) =>
        userGroupIds.includes(grupo.Grupo_ID)
      );
    },
  },
  mounted() {
    this.model.ID = this.$router.app._route.params.ID;
    this.getUtilizador(this.model.ID);
    this.getUtilizadorGrupo(this.model.ID);
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
            // console.log("Imagem carregada com sucesso:", this.model.item.image);
          }
        })
        .catch((error) => {
          console.error("Erro ao recuperar os dados do Utilizador", error);
          this.showNotification(
            "Erro ao recuperar dados do Utilizador.",
            "danger",
            "Erro"
          );
        });
    },
    editUtilizador() {
      var self = this;
      // Verificar grupos removidos
      this.UtilizadorGrupo.forEach((utilizadorGrupo) => {
        if (
          !this.gruposSelecionados.includes(utilizadorGrupo.Grupo_ID.toString())
        ) {
          // Se o grupo não está mais selecionado, remova a associação
          this.deleteUtilizadorGrupo(this.model.ID, utilizadorGrupo.Grupo_ID);
        }
      });
      console.log(this.gruposSelecionados);
      // Verificar grupos adicionados
      this.gruposSelecionados.forEach((grupoId) => {
        if (
          !this.UtilizadorGrupo.some(
            (utilizadorGrupo) => utilizadorGrupo.Grupo_ID.toString() === grupoId
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

          // Verificar se o ID do utilizador é o mesmo do localStorage
          if (this.keys.Utilizador_ID.toString() === this.model.ID.toString()) {
            // Atualizar os dados no localStorage
            localStorage.setItem("user", JSON.stringify(this.model.item));
            this.keys.Utilizador_Nome = this.model.item.Nome;
            this.keys.Utilizador_Email = this.model.item.Email;
            this.keys.Utilizador_image = this.model.item.image;
            this.keys.Utilizador_isActive = this.model.item.isActive;
            this.keys.TipoUtilizador_ID = this.model.item.ID_TipoUtilizador;
            this.keys.Grupos = this.gruposSelecionados;
            console.log("local storage atualizado: ", localStorage);
            const updatedUser = {
              ...JSON.parse(localStorage.getItem("user")),
              Utilizador_Nome: this.model.item.Nome,
              Utilizador_Email: this.model.item.Email,
              Utilizador_image: this.model.item.image,
            };
            const sessionID = localStorage.getItem("token");
            uibuilder.send({
              topic: "UpdateUser",
              token: sessionID,
              payload: updatedUser,
            });

            localStorage.setItem("user", JSON.stringify(updatedUser));
          }

          this.showNotification(
            "Utilizador atualizado com sucesso!",
            "success",
            "Atualização"
          );
          this.$router.push("/utilizador");
        })
        .catch((error) => {
          console.error("Erro ao atualizar o Utilizador", error);
          this.showNotification(
            "Erro ao atualizar o Utilizador.",
            "danger",
            "Erro"
          );
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
          this.ShowNotification(
            "Erro ao Deletar Utilizador ao Grupo.",
            "danger",
            "Erro"
          );
        });
    },
    addUtilizadorGrupo(utilizadorgrupo) {
      axios
        .post("/rs2lab/addutilizadorgrupo", utilizadorgrupo)
        .then((resp) => {
          console.log("ADD utilizadorgrupo: ", resp);
        })
        .catch((e) => {
          console.log(e);
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

          this.showNotification(
            "Erro ao buscar dados dos Grupos.",
            "danger",
            "Erro"
          );
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
            (utilizadorGrupo) => utilizadorGrupo.Grupo_ID.toString()
          );
        })
        .catch((errors) => {
          console.error(errors);

          this.showNotification("Erro ao buscar dados.", "danger", "Erro");
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

          this.showNotification(
            "Erro ao buscar dados dos Tipos de Utilizadores.",
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
