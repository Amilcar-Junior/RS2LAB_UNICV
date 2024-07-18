<template>
  <div class="container-fluid mt-5">
    <router-link to="/grupoutilizadores" class="btn btn-secondary mb-3">
      <i class="fa fa-arrow-left" aria-hidden="true"></i> Voltar
    </router-link>
    <div class="card">
      <div class="card-header">
        <h4>Adicionar Grupo Utilizadores</h4>
      </div>
      <div class="card-body">
        <div class="mb-3">
          <label for="">Nome</label>
          <input
            type="text"
            v-model="model.item.Nome"
            class="form-control"
            placeholder="Insira o nome do Grupo"
            required
          />
        </div>
        <div class="mb-3">
          <label for="id_utilizador" class="form-label">Utilizadores</label>
          <select
            v-model="utilizadoresSelecionados"
            class="form-control"
            multiple
            required
          >
            <option disabled value="">Selecione Utilizadores</option>
            <option
              v-for="utilizador in utilizadoresDisponiveis"
              :key="utilizador.Utilizador_ID"
              :value="utilizador.Utilizador_ID"
            >
              {{ utilizador.Utilizador_Nome }}
            </option>
          </select>
        </div>
        <div class="mb-3">
          <button
            type="button"
            @click="addGrupoUtilizadores"
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

<script>
module.exports = {
  name: "CreateGrupoUtilizadores",
  data() {
    return {
      model: {
        item: {
          Nome: "",
        },
      },
      utilizadoresDisponiveis: [], // Todos os utilizadores disponíveis
      utilizadoresSelecionados: [], // utilizadores selecionados pelo utilizador
    };
  },
  mounted() {
    this.getUtilizadoresDisponiveis();
  },
  methods: {
    addGrupoUtilizadores() {
      var self = this; //Assign this to a variable
      axios
        .post("/rs2lab/addgrupoutilizadores", this.model.item)
        .then((resp) => {
          console.log(resp);
          console.log(this.utilizadoresSelecionados);
          if (this.utilizadoresSelecionados.length > 0) {
            this.utilizadoresSelecionados.forEach((userId) => {
              const utilizadorGrupo = {
                ID_Utilizador: userId, // ID do utilizador criado
                ID_Grupo: resp.data.insertId, // ID do grupo selecionado
              };
              console.log(utilizadorGrupo);
              self.addUtilizadorGrupo(utilizadorGrupo);
            });
          }
          this.showNotification(
            "Grupo adicionada com sucesso!",
            "success","Sucesso"
          ); //shows notification of successful add
        })
        .catch((e) => {
          console.log(error);
          this.showNotification(
            "Erro ao adicionar Grupo.",
            "danger","Erro"
          );
        });
    },

    addUtilizadorGrupo(utilizadorGrupo) {
      axios
        .post("/rs2lab/addutilizadorgrupo", utilizadorGrupo)
        .then((resp) => {
          this.showNotification(
            "Utilizador adicionada ao Grupo com sucesso!",
            "success","Sucesso"
          );
          this.cleanForm();
        })
        .catch((e) => {
          console.error("Erro ao adicionar Utilizidador ao Grupo:", error);
          this.showNotification(
            "Erro ao adicionar Utilizidador ao Grupo.",
            "danger","Erro"
          );
        });
    },

    //Use to clean form upon succcessful insert
    cleanForm() {
      this.model.item.Nome = "";
      this.utilizadoresSelecionados = [];
    },
    //Shows a dialog notification
    getUtilizadoresDisponiveis() {
      axios
        .get("/rs2lab/utilizador")
        .then((resp) => {
          console.log(resp);
          this.utilizadoresDisponiveis = resp.data;
          console.log(this.utilizadoresDisponiveis);
        })
        .catch((errors) => {
          console.error(errors);
          this.showNotification(
            "Erro ao buscar dados dos utilizadores.",
            "danger","Erro"
          );
        });
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
