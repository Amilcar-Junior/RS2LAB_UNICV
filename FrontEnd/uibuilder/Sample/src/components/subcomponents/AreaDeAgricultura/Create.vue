<template>
  <div class="container-fluid mt-5">
    <router-link to="/areadeagricultura" class="btn btn-secondary mb-3">
      <i class="fa fa-arrow-left" aria-hidden="true"></i> Voltar
    </router-link>
    <div class="card">
      <div class="card-header">
        <h4>Adicionar Área de Agricultura</h4>
      </div>
      <div class="card-body">
        <form @submit.prevent="addAreadeagricultura">
          <div class="mb-3">
            <label for="nome" class="form-label">Nome</label>
            <input
              type="text"
              id="nome"
              v-model="model.item.Nome"
              class="form-control"
              placeholder="Insira o nome da Área"
              required
            />
          </div>
          <div class="mb-3">
            <label for="id_grupo" class="form-label">Grupo</label>
            <select v-model="model.item.ID_Grupo" class="form-control" required>
              <option value="" disabled selected>Selecione o Grupo</option>
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
            <label for="ilhaSelect" class="form-label">Localização</label>
            <div class="mb-3">
              <select
                id="ilhaSelect"
                v-model="selectedIlha"
                @change="zoomToIlha"
                class="form-control"
              >
                <option disabled value="">Selecione um Local</option>
                <option
                  v-for="local in Local"
                  :key="local.ID"
                  :value="local.Nome"
                >
                  {{ local.Nome }}
                </option>
              </select>
            </div>
            <div id="map" style="height: 300px"></div>
            <button
              type="button"
              class="btn btn-danger mt-2"
              @click="removeLastMarker"
            >
              Remover Último Ponto
            </button>
            <button
              type="button"
              class="btn btn-info mt-2"
              @click="forceResize"
            >
              Fix Map Display
            </button>
          </div>

          <div class="mb-3">
            <button type="submit" class="btn btn-primary float-right">
              <i class="fa fa-floppy-o" aria-hidden="true"></i> Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<style>
#map {
  height: 300px; /* Assegure que a altura está definida */
  width: 100%; /* Opcionalmente, defina a largura, se necessário */
}
</style>

<script>
module.exports = {
  name: "CreateAreadeAgricultura",
  data() {
    return {
      model: {
        item: {
          Nome: "",
          Localizacao: "",
          ID_Grupo: "",
        },
      },
      selectedIlha: "",
      GrupoUtilizadores: [],
      Local: [],
      map: null,
      markers: [],
    };
  },
  mounted() {
    if (typeof L === "undefined") {
      console.error("Leaflet is not loaded");
      return;
    }
    this.getGrupos();
    this.getLocal();
    this.$nextTick(() => {
      setTimeout(() => {
        this.initMap();
        if (this.map) {
          this.map.invalidateSize();
        }
      }, 500);
    });
  },
  methods: {
    initMap() {
      this.map = L.map("map").setView([15.120142, -23.6051721], 9);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(this.map);

      this.map.on("click", (e) => {
        this.addMarker(e.latlng);
      });
    },
    addMarker(latlng) {
      const marker = L.marker(latlng, { draggable: true })
        .addTo(this.map)
        .bindPopup("Localização Selecionada: " + latlng.toString())
        .openPopup();

      marker.on("dragend", () => {
        const position = marker.getLatLng();
        this.model.item.Localizacao = `${position.lat}, ${position.lng}`;
      });

      this.markers.push(marker);
      this.model.item.Localizacao = `${latlng.lat}, ${latlng.lng}`;
    },
    forceResize() {
      if (this.map) {
        this.map.invalidateSize();
      }
    },
    zoomToIlha() {
      if (!this.selectedIlha || !this.ilhas[this.selectedIlha]) return;
      const { lat, lng } = this.ilhas[this.selectedIlha];
      this.map.setView([lat, lng], 13); // O número 13 é o nível de zoom, ajuste conforme necessário
    },
    removeLastMarker() {
      const lastMarker = this.markers.pop();
      if (lastMarker) {
        this.map.removeLayer(lastMarker);
      }
    },
    zoomToIlha() {
      const selectedLocal = this.Local.find(
        (loc) => loc.Nome === this.selectedIlha
      );
      if (selectedLocal) {
        this.map.setView([selectedLocal.lat, selectedLocal.lng], 13);
      }
    },
    addAreadeagricultura() {
      axios
        .post("/rs2lab/addareadeagricultura", this.model.item)
        .then((response) => {
          this.showNotification();
          this.cleanForm();
        })
        .catch((error) => {
          console.error("Erro ao adicionar a área de agricultura:", error);
        });
    },
    getGrupos() {
      axios
        .get("/rs2lab/grupoutilizadores")
        .then((response) => {
          this.GrupoUtilizadores = response.data;
        })
        .catch((error) => {
          console.error("Erro ao buscar grupos de utilizadores:", error);
        });
    },
    getLocal() {
      axios
        .get("/rs2lab/local")
        .then((response) => {
          this.Local = response.data;
        })
        .catch((error) => {
          console.error("Erro ao buscar dados locais:", error);
        });
    },
    cleanForm() {
      this.model.item.Nome = "";
      this.model.item.Localizacao = "";
      this.model.item.ID_Grupo = "";
    },
    showNotification() {
      var self = this; // Atribui this a uma variável
      this.boxTwo = "";
      this.$bvModal
        .msgBoxOk("Dados Salvos Com Sucesso!", {
          title: "Confirmação",
          size: "sm",
          buttonSize: "sm",
          okVariant: "success",
          headerClass: "p-2 border-bottom-0",
          footerClass: "p-2 border-top-0",
          centered: true,
        })
        .then((value) => {
        })
        .catch((err) => {});
    },
  },
};
</script>
