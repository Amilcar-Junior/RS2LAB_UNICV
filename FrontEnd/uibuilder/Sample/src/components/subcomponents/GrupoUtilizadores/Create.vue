<template>
  <div class="container mt-5">
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
          <input type="text" v-model="model.item.Nome" class="form-control" placeholder="Insira o nome do Grupo" required/>
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
          console.log(this.utilizadoresSelecionados)
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
          self.showNotification(); //shows notification of successful add
        })
        .catch((e) => {
          console.log(error);
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
        });
    },
    showNotification() {
      var self = this; //Assign this to a variable
      this.boxTwo = "";
      this.$bvModal
        .msgBoxOk("Dados Adicionados com sucesso!!", {
          title: "Confirmation",
          size: "sm",
          buttonSize: "sm",
          okVariant: "success",
          headerClass: "p-2 border-bottom-0",
          footerClass: "p-2 border-top-0",
          centered: true,
        })
        .then((value) => {
          self.cleanForm(); //clears form upon confirmation of user
        })
        .catch((err) => {});
    },
  },
};
</script>
