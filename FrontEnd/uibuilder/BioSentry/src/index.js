import router from './router.js';

const app = new Vue({
  el: "#app",
  components: {
    myheader: httpVueLoader("./components/myheader.vue"),
    mylogin: httpVueLoader("./components/login.vue"),
    myfooter: httpVueLoader("./components/myfooter.vue"),
    sidebar: httpVueLoader("./components/Sidebar.vue"),
  },
  data() {
    return {
      freshlogin: undefined,
      user: {
        islogged: false,
        Utilizador_ID: undefined,
        Utilizador_Nome: undefined,
        Utilizador_isActive: undefined,
        TipoUtilizador_ID: undefined,
        TipoUtilizador_Nome: undefined,
        Utilizador_Email: undefined,
        username:undefined,
        Utilizador_image: "",
        Grupos: undefined,

        loginSuccess: this.succesfulLogin,
        performLogout: this.logoutUser,
        setUser: this.setUser,
        setToken: this.setToken,
      },
    };
  },
  computed: {},
  methods: {
    succesfulLogin() {
      this.user.islogged = true;
    },
    logoutUser() {
      var id = localStorage.getItem("token");
      this.user.islogged = false;
      if (id != null) {
        uibuilder.send({ topic: "Logout", token: id, payload: {} });
      }
      // Always redirect to dashboard after logout
      this.$router.push('/');
    },
    setUser(param) {
      this.user.islogged = true;
      this.user.Utilizador_ID = param.Utilizador_ID;
      this.user.Utilizador_Nome = param.Utilizador_Nome;
      this.user.Utilizador_Email = param.Utilizador_Email;
      this.user.username = param.username;
      this.user.TipoUtilizador_ID = param.TipoUtilizador_ID;
      this.user.TipoUtilizador_Nome = param.TipoUtilizador_Nome;
      this.user.Grupos = param.Grupos;
      this.user.Utilizador_image = param.Utilizador_image;
      this.user.Utilizador_isActive = param.Utilizador_isActive;

      // Atualizar o localStorage com o objeto completo
      localStorage.setItem("user", JSON.stringify(this.user));
    },
    setToken(user) {
       // Verificar se access_token existe
       if (!user.access_token) {
        console.error("Erro: access_token não encontrado no objeto user:", user);
        return;
      }
      // Gets the unique session identifier
      var sessionID = user.access_token;
      console.log("setToken chamado com sessionID:", sessionID);
      // Store session identifier to local browser
      localStorage.setItem("token", sessionID);
      localStorage.setItem("user", JSON.stringify(user));
      console.log(localStorage);
      console.log("Token armazenado:", sessionID);
      console.log("Dados do usuário armazenados:", user);

      // Notify index.js that a session is created
      uibuilder.send({
        topic: "Login",
        token: sessionID,
        payload: {
          user: {
            Utilizador_ID: user.Utilizador_ID,
            Utilizador_isActive: user.Utilizador_isActive,
            Utilizador_Email: user.Utilizador_Email,
            username: user.username,
            Utilizador_Nome: user.Utilizador_Nome,
            TipoUtilizador_ID: user.TipoUtilizador_ID,
            TipoUtilizador_Nome: user.TipoUtilizador_Nome,
            Grupos: user.Grupos,
            Utilizador_image: user.Utilizador_image,
            access_token: user.access_token, // Inclui o access_token
            token_expiration: user.token_expiration, // Inclui a expiração
          },
          session: {
            uniqueid: sessionID,
            Utilizador_ID: user.Utilizador_ID,
            Utilizador_isActive: user.Utilizador_isActive,
            Utilizador_Email: user.Utilizador_Email,
            username: user.username,
            Utilizador_Nome: user.Utilizador_Nome,
            TipoUtilizador_ID: user.TipoUtilizador_ID,
            TipoUtilizador_Nome: user.TipoUtilizador_Nome,
            Grupos: user.Grupos,
            Utilizador_image: user.Utilizador_image,
            access_token: user.access_token, // Inclui o access_token
            token_expiration: user.token_expiration, // Inclui a expiração
            startTime: undefined,
          },
        },
      });
      console.log("Mensagem Login enviada ao uibuilder com token:", sessionID);
    },
  },
  mounted: function () {

    uibuilder.start();
    var vueApp = this;
    uibuilder.onChange("msg", function (msg) {
      switch (msg.topic) {
        case "Startup":
          if (msg.session == undefined) {
            vueApp.user.islogged = false;
          } else {
            vueApp.user.Utilizador_ID = msg.payload.Utilizador_ID;
            vueApp.user.Utilizador_isActive = msg.payload.Utilizador_isActive;
            vueApp.user.TipoUtilizador_ID = msg.payload.TipoUtilizador_ID;
            vueApp.user.TipoUtilizador_Nome = msg.payload.TipoUtilizador_Nome;
            vueApp.user.Utilizador_Nome = msg.payload.Utilizador_Nome;
            vueApp.user.Utilizador_Email = msg.payload.Utilizador_Email;
            vueApp.user.username = msg.payload.username;
            vueApp.user.Utilizador_image = msg.payload.Utilizador_image;
            vueApp.user.Grupos = msg.payload.Grupos;
            vueApp.user.islogged = true;
            localStorage.setItem("user", JSON.stringify(vueApp.user));
          }
          break;

        case "Login":
          vueApp.user.Utilizador_ID = msg.payload.user.Utilizador_ID;
          vueApp.user.Utilizador_isActive =
            msg.payload.user.Utilizador_isActive;
          vueApp.user.TipoUtilizador_ID = msg.payload.user.TipoUtilizador_ID;
          vueApp.user.TipoUtilizador_Nome =
            msg.payload.user.TipoUtilizador_Nome;
          vueApp.user.Utilizador_Nome = msg.payload.user.Utilizador_Nome;
          vueApp.user.Utilizador_Email = msg.payload.user.Utilizador_Email;
          vueApp.user.username = msg.payload.username;
          vueApp.user.Utilizador_image = msg.payload.user.Utilizador_image;
          vueApp.user.Grupos = msg.payload.Grupos;
          vueApp.user.islogged = true;
          vueApp.freshlogin = true;
          localStorage.setItem("user", JSON.stringify(vueApp.user));
          break;

        case "Logout":
          vueApp.user.islogged = false;
          vueApp.freshlogin = false;
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          break;

        case "UpdateUser":
          // Atualizar os dados do usuário globalmente
          vueApp.user.Utilizador_Nome = msg.payload.Utilizador_Nome;
          vueApp.user.Utilizador_Email = msg.payload.Utilizador_Email;
          vueApp.user.Utilizador_image = msg.payload.Utilizador_image;
          // Atualizar o localStorage
          localStorage.setItem("user", JSON.stringify(vueApp.user));
          break;
      }
    });
    // Verificar se há um token no localStorage
    var token = localStorage.getItem("token");
    if (token) {
      // Enviar mensagem para o servidor para recuperar os dados do usuário
      uibuilder.send({
        topic: "GetUser",
        token: token,
      });
    }
  },
  router,
});
