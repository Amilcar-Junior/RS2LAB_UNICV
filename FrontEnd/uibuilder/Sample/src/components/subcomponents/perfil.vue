<template>
  <div class="container mt-5">
    <router-link to="/" class="btn btn-secondary mb-3">
      <i class="fa fa-arrow-left" aria-hidden="true"></i> Voltar
    </router-link>
    <div class="card">
      <div class="card-header">
        <h4>Perfil do Utilizador</h4>
      </div>
      <div class="card-body">
        <b-form @submit.prevent="editUtilizador">
          <b-form-group id="nome" label="Nome:" label-for="nome-input">
            <b-form-input
              id="nome-input"
              v-model="model.item.Nome"
              required
            ></b-form-input>
          </b-form-group>

          <b-form-group id="email" label="Email:" label-for="email-input">
            <b-form-input
              type="email"
              id="email-input"
              v-model="model.item.Email"
              required
            ></b-form-input>
          </b-form-group>

          <b-form-group
            id="tipo"
            label="Tipo de Utilizador:"
            label-for="tipo-select"
          >
            <b-form-select
              id="tipo-select"
              v-model="model.item.TipoUtilizador_ID"
              required
            >
              <option
                v-for="tipo in TipoUtilizador"
                :key="tipo.ID_TipoUtilizador"
                :value="tipo.ID_TipoUtilizador"
              >
                {{ tipo.Nome }}
              </option>
            </b-form-select>
          </b-form-group>

          <b-form-checkbox id="ativo" v-model="model.item.Utilizador_isActive"
            >Ativo</b-form-checkbox
          >

          <b-form-group id="avatar" label="Avatar:" label-for="avatar-input">
            <b-form-file
              id="avatar-input"
              @change="onAvatarChange"
              accept="image/*"
            ></b-form-file>
            <b-img
              :src="avatarPreview"
              fluid
              thumbnail
              v-if="avatarPreview"
            ></b-img>
          </b-form-group>

          <b-button type="submit" variant="primary">Salvar</b-button>
          <b-button type="button" @click="logout">Sair</b-button>
        </b-form>
      </div>
    </div>
  </div>
</template>

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
          Avatar: "",
        },
      },
      avatarPreview: "",
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
          this.model.item.Senha = resp.data[0].Senha;
          this.model.item.ID_TipoUtilizador = resp.data[0].ID_TipoUtilizador;
          this.model.item.isActive = resp.data[0].isActive;

          // Assume que resp.data[0].Avatar contém um Blob do avatar
          const blob = new Blob([resp.data[0].Avatar], { type: "image/jpeg" });
          const url = URL.createObjectURL(blob);
          this.avatarPreview = url;
        })
        .catch((errors) => {
          console.error(errors);
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
        .then((resp) => {
          console.log("editutilizador: ", resp);
          self.showNotification();
        })
        .catch((e) => {
          console.log(error);
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

    onAvatarChange(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.avatarPreview = e.target.result;
          this.model.item.Avatar = file; // Atualiza o avatar no modelo com o arquivo selecionado
        };
        reader.readAsDataURL(file);
      }
    },
  },
};
</script>


<style>
/* Estilos para o perfil do utilizador */
</style>
