<template>
  <div class="container-fluid mt-5">
    <router-link to="/grupoutilizadores" class="btn btn-secondary mb-3">
      <i class="fa fa-arrow-left" aria-hidden="true"></i> Voltar
    </router-link>
    <div class="card">
      <div class="card-header">
        <h4>Edit Grupo Utilizadores</h4>
      </div>
      <div class="card-body">
        <div class="mb-3">
          <label for="">Nome</label>
          <input type="text" v-model="model.item.Nome" class="form-control" />
        </div>
        <div class="mb-3">
          <label for="id_utilizador" class="form-label">Utilizadores</label>
          <select
            v-model="utilizadoresSelecionados"
            class="form-control"
            multiple
            required
          >
            <option disabled value="">Selecione utilizadores</option>
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
            @click="editGrupoUtilizadores"
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
  name: "EditGrupoUtilizadores",
  data() {
    return {
      model: {
        ID: "",
        item: {
          Nome: "",
        },
      },
      utilizadoresDisponiveis: [], // Todos os Utilizadores disponíveis
      utilizadoresSelecionados: [], // Utilizadores selecionados pelo utilizador
      UtilizadorGrupo: [],
    };
  },
  mounted() {
    // console.log(this.$router.app._route.params.ID);
    this.model.ID = this.$router.app._route.params.ID;
    this.getGrupoUtilizadores(this.$router.app._route.params.ID);
    this.getUtilizadorGrupo(this.$router.app._route.params.ID);
    this.getUtilizadoresDisponiveis();
  },
  methods: {
    getGrupoUtilizadores(ItemID) {
      axios
        .get(`/rs2lab/grupoutilizadores/${ItemID}`)
        .then((resp) => {
          // console.log(resp);
          this.model.item.Nome = resp.data[0].Nome;
          // console.log(this.model.item);
        })
        .catch((errors) => {
          console.error(errors);
        });
    },

    editGrupoUtilizadores() {
      var self = this; //Assign this to a variable
      this.UtilizadorGrupo.forEach((utilizadorGrupo) => {
        if (
          !this.utilizadoresSelecionados.includes(
            utilizadorGrupo.Utilizador_ID.toString()
          )
        ) {
          console.log(
            `Removendo associação para o utilizador ${utilizadorGrupo.Utilizador_ID}`
          );
          this.deleteUtilizadorGrupo(
            utilizadorGrupo.Utilizador_ID,
            this.model.ID
          );
        }
      });

      console.log(this.utilizadoresSelecionados);
      // Verificar utilizadores adicionados
      this.utilizadoresSelecionados.forEach((utilizadorID) => {
        if (
          !this.UtilizadorGrupo.some(
            (utilizadorGrupo) =>
              utilizadorGrupo.Utilizador_ID.toString() === utilizadorID
          )
        ) {
          // Se o grupo foi adicionado, adicione a associação
          const utilizadorgrupo = {
            ID_Utilizador: utilizadorID,
            ID_Grupo: this.model.ID,
          };
          this.addUtilizadorGrupo(utilizadorgrupo);
        }
      });
      axios
        .put(`/rs2lab/editgrupoutilizadores/${this.model.ID}`, this.model.item)
        .then((resp) => {
          console.log(resp);
          self.showNotification(); //shows notification of successful add
        })
        .catch((e) => {
          console.log(error);
        });
    },
    getUtilizadorGrupo(ItemID) {
      axios
        .get(`/rs2lab/utilizadorgrupo/grupoutilizadores/${ItemID}`)
        .then((resp) => {
          console.log("UtilizadorGrupo: ", resp);
          this.UtilizadorGrupo = resp.data;

          // Preencher os utilizadores selecionados com os IDs dos utilizadores associados ao utilizador
          this.utilizadoresSelecionados = this.UtilizadorGrupo.map(
            (utilizadorGrupo) => utilizadorGrupo.Utilizador_ID.toString()
          );
        })
        .catch((errors) => {
          console.error(errors);
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
    getUtilizadoresDisponiveis() {
      axios
        .get("/rs2lab/utilizador")
        .then((resp) => {
          console.log("utilizador: ", resp);
          this.utilizadoresDisponiveis = resp.data;
          console.log(this.utilizadoresDisponiveis);
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
