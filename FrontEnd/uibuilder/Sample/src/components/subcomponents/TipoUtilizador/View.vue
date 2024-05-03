<template>
  <div>
    <div class="card">
      <div class="card-header">
        <h4>
          Tipo Utilizador
          <router-link
            to="/tipoutilizador/create"
            class="btn btn-primary float-right"
          >
            Add Tipo Utilizador
          </router-link>
        </h4>
      </div>
      <div class="card-body">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody v-if="this.items.length > 0">
            <tr v-for="(item, index) in this.items" :key="index">
              <td>{{ item.ID }}</td>
              <td>{{ item.Nome }}</td>
              <td>{{ item.Descricao }}</td>
              <td>
                <router-link to="/tipoutilizador/edit" class="btn btn-success">
                  Edit
                </router-link>
                <button type="button" class="btn btn-danger">Delete</button>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <td colspan="4">Carregando...</td>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  name: "tipoutilizador",
  data() {
    return {
      perPage: 10,
      currentPage: 1,
      items: [],
    };
  },
  mounted() {
    this.retrieveData();
  },
  computed: {
    rows() {
      return this.items.length
    }
  },
  methods: {
    retrieveData() {
      axios
        .get("/tuts/tipoutilizador")
        .then((resp) => {
          console.log(resp);
          this.items = resp.data;
          console.log(this.items);
        })
        .catch((errors) => {
          console.error(errors);
        });
    },
  },
};
</script>
