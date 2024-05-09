<template>
  <div class="container mt-5">
    <div class="card">
      <div class="card-header">
        <h4>Adicionar Utilizador</h4>
      </div>
      <div class="card-body">
        <form @submit.prevent="addUtilizador">
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
            <label for="senha" class="form-label">Senha</label>
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
                :key="grupo.ID"
                :value="grupo.ID"
              >
                {{ grupo.Nome }}
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
          <div class="mb-3">
            <label for="avatar" class="form-label">Avatar</label>
            <input
              type="file"
              id="avatar"
              @change="onAvatarChange"
              class="form-control-file"
              accept="image/*"
            />
            <img
              v-if="avatarPreview"
              :src="avatarPreview"
              alt="Preview do Avatar"
              class="mt-2"
              style="max-width: 100px; max-height: 100px"
            />
          </div>
          <div class="mb-3">
            <button type="submit" class="btn btn-primary">Adicionar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

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
          Avatar: null, // Alterado para aceitar um Blob
        },
      },
      TipoUtilizador: [],
      gruposDisponiveis: [], // Todos os grupos disponíveis
      gruposSelecionados: [], // Grupos selecionados pelo utilizador
      UtilizadorGrupo: [],
      avatarPreview: "",
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

    onAvatarChange(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const blob = new Blob([reader.result], { type: file.type });
          this.model.item.Avatar = blob;
          this.avatarPreview = URL.createObjectURL(blob);
          console.log("Avatar Blob:", this.model.item.Avatar);
          console.log("Avatar Blob URL:", this.avatarPreview);
        };
        reader.readAsArrayBuffer(file);
      }
    },

    cleanForm() {
      this.model.item.Nome = "";
      this.model.item.Email = "";
      this.model.item.Senha = "";
      this.model.item.ID_TipoUtilizador = "";
      this.model.item.isActive = "";
      this.model.item.Avatar = null;
      this.avatarPreview = "";
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
