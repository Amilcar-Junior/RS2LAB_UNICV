<template>
  <div class="container-fluid mt-5">
    <router-link to="/areadeagricultura" class="btn btn-secondary mb-3">
      <i class="fa fa-arrow-left" aria-hidden="true"></i> Voltar
    </router-link>
    <div class="card">
      <div class="card-header">
        <h4>Editar Área de Agricultura</h4>
      </div>
      <div class="card-body">
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
            <label for="localizacao" class="form-label">Localizacao</label>
            <input
              type="text"
              id="localizacao"
              v-model="model.item.Localizacao"
              class="form-control"
              placeholder="Insira a Coordenada do local"
              required
            />
          </div>
          <div class="mb-3">
            <label for="id_Grupo" class="form-label"
              >Grupo</label
            >
            <select
              v-model="model.item.ID_Grupo"
              class="form-control"
              required
            >
              <option value="" disabled selected>
                Selecione o Grupo
              </option>
              <option
                v-for="grupo in GrupoUtilizadores"
                :key="grupo.Grupo_ID"
                :value="grupo.Grupo_ID"
              >
                {{ grupo.Grupo_Nome }}
              </option>
            </select>
          </div>
        
        <div class="mb-3">
          <button
            type="button"
            @click="editAreaagricultura"
            class="btn btn-primary float-right"
          >
          <i class="fa fa-floppy-o" aria-hidden="true"></i>
            Salvar
          </button>
        </div>
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
  name: "editAreaagricultura",
  data() {
    return {
      model: {
        ID: "",
        item: {
          Nome: "",
          Localizacao: "",
          ID_Grupo: "",
        },
      },
      avatarPreview: "",
      GrupoUtilizadores: [],
      
    };
  },
  mounted() {
    // console.log(this.$router.app._route.params.ID);
    this.model.ID = this.$router.app._route.params.ID;
    this.getAreadeAgricultura(this.$router.app._route.params.ID);
    this.getGrupo();
  },
  methods: {
    getAreadeAgricultura(ItemID) {
      axios
        .get(`/rs2lab/areadeagricultura/${ItemID}`)
        .then((resp) => {
          this.model.item.Nome = resp.data[0].Nome;
          this.model.item.Localizacao = resp.data[0].Localizacao;
          this.model.item.ID_Grupo = resp.data[0].ID_Grupo;
        })
        .catch((errors) => {
          console.error(errors);
        });
    },
    editAreaagricultura() {
      var self = this;
    
      // Atualizar o usuário
      axios
        .put(`/rs2lab/editareadeagricultura/${this.model.ID}`, this.model.item)
        .then((resp) => {
          console.log("editareadeagricultura: ", resp);
          self.showNotification();
        })
        .catch((e) => {
          console.log(error);
        });
    },
    getGrupo() {
      axios
        .get("/rs2lab/grupoutilizadores")
        .then((resp) => {
          console.log("grupoutilizadores: ", resp);
          this.GrupoUtilizadores = resp.data;
          // console.log(this.Grupo);
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
  },
};
</script>
