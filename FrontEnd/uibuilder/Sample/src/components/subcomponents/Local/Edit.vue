<template>
  <div class="container-fluid mt-5">
    <router-link to="/local" class="btn btn-secondary mb-3">
      <i class="fa fa-arrow-left" aria-hidden="true"></i> Voltar
    </router-link>
    <div class="card">
      <div class="card-header">
        <h4>Editar Local</h4>
      </div>
      <div class="card-body">
        <form @submit.prevent="editLocal">
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
            <div id="editMap" style="height: 500px"></div>
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
#editMap {
  height: 500px; /* Ensure the height is defined */
  width: 100%; /* Optionally set the width if necessary */
}
</style>

<script>
module.exports = {
  name: "EditLocal",
  data() {
    return {
      model: {
        item: {
          Nome: "",
          lat: 0,
          lng: 0,
        },
      },
      map: null,
      marker: null,
      baseMaps: null, // Base map layers
    };
  },
  mounted() {
    this.model.item.ID = this.$route.params.ID;
    this.retrieveLocal();
    this.$nextTick(() => {
      setTimeout(() => {
        this.initMap();
        this.updateMapLocation();
      }, 500);
    });
  },
  methods: {
    retrieveLocal() {
      axios
        .get(`/rs2lab/local/${this.model.item.ID}`)
        .then((response) => {
          this.model.item = response.data[0];
          this.updateMapLocation();
        })
        .catch((error) => {
          console.error("Erro ao recuperar os dados do local:", error);
          this.showNotification(
            "Erro ao recuperar os dados do local.",
            "danger",
            "Erro"
          );
        });
    },
    initMap() {
      // Definir diferentes tipos de camadas de mapa
      const streets = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution: "© OpenStreetMap contributors",
        }
      );

      const satellite = L.tileLayer(
        "https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
        {
          attribution: "Map data ©2023 Google",
          subdomains: ["mt0", "mt1", "mt2", "mt3"],
        }
      );

      const hybrid = L.tileLayer(
        "https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
        {
          attribution: "Map data ©2023 Google",
          subdomains: ["mt0", "mt1", "mt2", "mt3"],
        }
      );

      const terrain = L.tileLayer(
        "https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}",
        {
          attribution: "Map data ©2023 Google",
          subdomains: ["mt0", "mt1", "mt2", "mt3"],
        }
      );


      // Definir as opções de camadas de base
      this.baseMaps = {
        Streets: streets,
        Hybrid: hybrid,
        Satelite: satellite,
        Terrain: terrain,
      };

      // Inicializar o mapa com a camada padrão (streets)
      this.map = L.map("editMap", {
        center: [0, 0],
        zoom: 2,
        layers: [streets],
      });


      // Adicionar controle de camadas ao mapa
      L.control.layers(this.baseMaps).addTo(this.map);

      // Adicionar evento de clique no mapa
      this.map.on("click", this.onMapClick);

      // Atualizar a localização do mapa
      this.updateMapLocation();
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
    updateMapLocation() {
  if (this.map && this.model.item.lat && this.model.item.lng) {
    const latLng = [this.model.item.lat, this.model.item.lng];
    if (this.marker) {
      this.marker.setLatLng(latLng);
    } else {
      this.marker = L.marker(latLng).addTo(this.map);
    }
    this.map.setView(latLng, 13);
  }
},
    editLocal() {
      axios
        .put(`/rs2lab/editlocal/${this.model.item.ID}`, this.model.item)
        .then(() => {
          this.showNotification(
            "Área de Agricultura atualizado com sucesso!",
            "success",
            "Atualização"
          );
        })
        .catch((error) => {
          console.error("Erro ao atualizar o local:", error);
          this.showNotification("Erro ao atualizar o Local.", "danger", "Erro");
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
