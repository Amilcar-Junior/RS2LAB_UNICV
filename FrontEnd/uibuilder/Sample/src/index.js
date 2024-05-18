"use strict";

import router from "./router.js";

const app = new Vue({
  el: "#app",
  components: {
    myheader: httpVueLoader("./components/myheader.vue"),
    mylogin: httpVueLoader("./components/login.vue"),
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
        Utilizador_Email: undefined,
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
    },
    setUser(param) {
      this.user.islogged = true;
      this.user.Utilizador_ID = param.Utilizador_ID;
      this.user.Utilizador_Nome = param.Utilizador_Nome;
      this.user.Utilizador_Email = param.Utilizador_Email;
      this.user.TipoUtilizador_ID = param.TipoUtilizador_ID;
      this.user.Grupos = param.Grupos;
      this.user.Utilizador_image = param.Utilizador_image;
      this.user.Utilizador_isActive = param.Utilizador_isActive;
    },
    setToken(user) {
      //Gets the unique session identifier
      var sessionID = user.Utilizador_Senha;
      //Store session identifier to local browser
      localStorage.setItem("token", sessionID);
      localStorage.setItem("user", JSON.stringify(user));
      console.log(localStorage)

      //Notify index.js that a session is created
      uibuilder.send({
        topic: "Login",
        token: sessionID,
        payload: {
          user: {
            Utilizador_ID: user.Utilizador_ID,
            Utilizador_isActive: user.Utilizador_isActive,
            Utilizador_Email: user.Utilizador_Email,
            Utilizador_Nome: user.Utilizador_Nome,
            TipoUtilizador_ID: user.TipoUtilizador_ID,
            Grupos: user.Grupos,
            Utilizador_image: user.Utilizador_image,
          },
          session: {
            uniqueid: sessionID,
            Utilizador_ID: user.Utilizador_ID,
            Utilizador_isActive: user.Utilizador_isActive,
            Utilizador_Email: user.Utilizador_Email,
            Utilizador_Nome: user.Utilizador_Nome,
            TipoUtilizador_ID: user.TipoUtilizador_ID,
            Grupos: user.Grupos,
            Utilizador_image: user.Utilizador_image,
            startTime: undefined,
          },
        },
      });
    },
  },
  mounted: function () {
    //navigates to home page at mount
    // this.$router.push("/");

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
            vueApp.user.Utilizador_Nome = msg.payload.Utilizador_Nome;
            vueApp.user.Utilizador_Email = msg.payload.Utilizador_Email;
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
          vueApp.user.Utilizador_Nome = msg.payload.user.Utilizador_Nome;
          vueApp.user.Utilizador_Email = msg.payload.Utilizador_Email;
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
      }
    });
    // Verificar se há um token no localStorage
    // var token = localStorage.getItem("token");
    // if (token) {
    //   // Enviar mensagem para o servidor para recuperar os dados do usuário
    //   uibuilder.send({
    //     topic: "GetUser",
    //     token: token,
    //   });
    // }
  },
  router: new VueRouter(router),
});
