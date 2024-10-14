<template>
  <div class="container-fluid mt-5">
    <router-link to="/local" class="btn btn-secondary mb-3">
      <i class="fa fa-arrow-left" aria-hidden="true"></i> Voltar
    </router-link>
    <div class="card">
      <div class="card-header">
        <h4>Adicionar Local</h4>
      </div>
      <div class="card-body">
        <form @submit.prevent="addLocal">
          <div class="mb-3">
            <label for="nome" class="form-label">Nome</label>
            <input
              type="text"
              id="nome"
              v-model="model.item.Nome"
              class="form-control"
              placeholder="Insira o nome do Local"
              required
            />
          </div>
          <div class="mb-3">
            <label for="map" class="form-label">Localização</label>
            <div id="map" style="height: 500px"></div>
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


<script>
module.exports = {
  name: "CreateLocal",
  data() {
    return {
      model: {
        item: {
          Nome: "",
          lat: 0,  // Adicionado latitude
          lng: 0,  // Adicionado longitude
        },
      },
      map: null,
      marker: null,
      baseMaps: null, // Adicionado baseMaps para camadas de mapa
    };
  },
  mounted() {
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
      // Definir diferentes tipos de camadas de mapa
      const streets = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      });

      const hybrid = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenTopoMap contributors",
      });

      const satellite = L.tileLayer("https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}", {
        attribution: "Map data ©2023 Google",
        subdomains: ["mt0", "mt1", "mt2", "mt3"]
      });

      const terrain = L.tileLayer("https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}", {
        attribution: "Map data ©2023 Google",
        subdomains: ["mt0", "mt1", "mt2", "mt3"]
      });

      // Inicializar o mapa com a camada padrão (streets)
      this.map = L.map("map", {
        center: [0, 0],
        zoom: 2,
        layers: [streets],
      });

      // Definir as opções de camadas de base
      this.baseMaps = {
        "Streets": streets,
        "Satellite": satellite,
        "Híbrido": hybrid,
        "Terreno": terrain,
      };

      // Adicionar controle de camadas ao mapa
      L.control.layers(this.baseMaps).addTo(this.map);

      // Adicionar evento de clique no mapa
      this.map.on("click", this.onMapClick);
    },
    onMapClick(e) {
      const { lat, lng } = e.latlng;

      if (this.marker) {
        this.marker.setLatLng(e.latlng);
      } else {
        this.marker = L.marker(e.latlng).addTo(this.map);
      }

      this.model.item.lat = lat;
      this.model.item.lng = lng;
    },
    addLocal() {
      axios
        .post("/rs2lab/addlocal", this.model.item)
        .then(() => {
          this.showNotification(
            "Local adicionada com sucesso!",
            "success","Sucesso"
          );
          this.cleanForm();
        })
        .catch((error) => {
          console.error("Erro ao adicionar o local:", error);
          this.showNotification("Erro ao adicionar o local.", "danger","Erro");
        });
    },
    cleanForm() {
      this.model.item.Nome = "";
      this.movel.item.lat = 0;
      this.movel.item.lng = 0;
      if (this.map && this.marker) {
        this.map.removeLayer(this.marker);
      }
      
      this.marker = null;
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

