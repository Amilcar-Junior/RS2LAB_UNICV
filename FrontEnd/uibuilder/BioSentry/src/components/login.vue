<template>
  <div class="login-page">
    <div class="container">
      <div class="row">
        <div class="col-lg-4 col-md-6 col-sm-8 mx-auto">
          <div class="card login">
            <h3 style="text-align: center" v-if="step === 1">Sign In</h3>
            <h3 style="text-align: center" v-else-if="step === 2">
              Recuperar Credenciais
            </h3>
            <h3 style="text-align: center" v-else>Redefinir Credenciais</h3>

            <!-- Formulário de Login -->
            <form
              v-if="step === 1"
              class="form-group"
              @submit.prevent="login"
              novalidate
            >
              <input
                v-model="postBody.username"
                type="text"
                class="form-control"
                placeholder="Codigo"
                required
              />
              <input
                v-model="postBody.Utilizador_Senha"
                type="password"
                class="form-control"
                placeholder="Palavra-passe"
                maxlength="20"
                required
              />
              <input type="submit" class="btn btn-info eon-btn" />
              <b-alert
                v-show="displayError"
                :variant="errorVariant"
                show
                class="error-Msg"
              >
                {{ errormessage }}
              </b-alert>

              <p
                @click="showRecoveryForm"
                style="cursor: pointer; color: #007bff; text-align: center"
              >
                Esqueceu a Palavra-passe?
              </p>
              <p
                class="mt-4 text-muted"
                style="font-size: 15px; margin-top: 20px; text-align: center"
              >
                BioSentry
              </p>
            </form>

            <!-- Formulário de Solicitação de Recuperação -->
            <form
              v-else-if="step === 2"
              class="form-group"
              @submit.prevent="sendRecoveryCode"
              novalidate
            >
              <input
                v-model="recoveryEmail"
                type="text"
                class="form-control"
                placeholder="Digite seu email"
                required
              />
              <input
                type="submit"
                class="btn btn-info eon-btn"
                value="Enviar Código de Recuperação"
              />
              <b-alert
                v-show="displayError"
                :variant="errorVariant"
                show
                class="error-Msg"
              >
                {{ errormessage }}
              </b-alert>
              <p
                @click="step = 1"
                style="cursor: pointer; color: #007bff; text-align: center"
              >
                Voltar ao login
              </p>
            </form>

            <!-- Formulário de Verificação do Código e Redefinição de Senha -->
            <form
              v-else
              class="form-group"
              @submit.prevent="resetPassword"
              novalidate
            >
              <input
                v-model="recoveryCode"
                type="text"
                class="form-control"
                placeholder="Digite o código de recuperação"
                required
              />
              <input
                v-model="newPassword"
                type="password"
                class="form-control"
                placeholder="Digite sua nova palavra-passe"
                maxlength="20"
                required
              />
              <input
                type="submit"
                class="btn btn-info eon-btn"
                value="Redefinir Credenciais"
              />
              <b-alert
                v-show="displayError"
                :variant="errorVariant"
                show
                class="error-Msg"
              >
                {{ errormessage }}
              </b-alert>
              <p
                @click="step = 1"
                style="cursor: pointer; color: #007bff; text-align: center"
              >
                Voltar ao login
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  props: ["keys"],
  data() {
    return {
      postBody: { username: "", Utilizador_Senha: "" },
      recoveryEmail: "",
      recoveryCode: "",
      recoverySentCode: "",
      newPassword: "",
      step: 1,
      errors: [],
      errormessage: "",
      errorVariant: "danger",
    };
  },
  computed: {
    displayError() {
      return this.errormessage !== "";
    },
  },

  methods: {
    async login() {
      this.errormessage = "";

      // Log das entradas
      console.log("Iniciando login com:", {
          username: this.postBody.username,
          password: this.postBody.Utilizador_Senha,
        });

      if (!this.postBody.username) {
        this.errormessage = "Por favor, insira seu email.";
        this.errorVariant = "danger";
        return;
      }

      if (!this.postBody.Utilizador_Senha) {
        this.errormessage = "Por favor, insira sua Palavra-passe.";
        this.errorVariant = "danger";
        return;
      }

      var Utilizador_Senha = this.postBody.Utilizador_Senha

      try{
          console.log("Chamando API rs2lab/login...");
          const rs2labResponse = await axios.post("/biosentry/login", {
            username: this.postBody.username,
            Utilizador_Senha:this.postBody.Utilizador_Senha,
          });
          console.log("Resposta da API rs2lab/login:", rs2labResponse.data);
          if (rs2labResponse.data.length === 0) {
        this.errormessage = "Código ou palavra-passe inválidos.";
        return;
      }

      const user = rs2labResponse.data[0];
      console.log("Usuário encontrado:", user);
      if (user.Utilizador_isActive !== 1) {
        this.errormessage =
          "Sua conta está inativa. Entre em contato com o administrador.";
        return;
      }

      console.log("Chamando API betaapi.unicv.cv via proxy...");
      // Segunda API: betaapi.unicv.cv
      const unicvResponse = await axios.post(
        "/proxy/login",
        {
          username: this.postBody.username,
          password: this.postBody.Utilizador_Senha, // Assumindo que a API espera senha em texto puro
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Resposta da API betaapi.unicv.cv:", unicvResponse.data);

      // Verifica se a resposta é válida
      if (!unicvResponse.data.status || !unicvResponse.data.data.access_token) {
        this.errormessage = "Falha ao obter o token de autenticação.";
        return;
      }

      // Extrai o token e a data de expiração
      const token = unicvResponse.data.data.access_token;
      const tokenExpiration = unicvResponse.data.data.access_token_expiration_date;
      console.log("Token extraido", token);
      console.log("Data de expiração do token:", tokenExpiration);

      // Verificar se o token está expirado
    const currentTime = Math.floor(Date.now() / 1000); // Tempo atual em segundos
    if (tokenExpiration < currentTime) {
      this.errormessage = "Token de autenticação expirado. Tente novamente.";
      this.errorVariant = "danger";
      console.log("Erro: Token expirado. Expiração:", tokenExpiration, "Atual:", currentTime);
      return;
    }

      // Armazenar o token no localStorage
        localStorage.setItem("unicv_token", token);
        localStorage.setItem("unicv_token_expiration", tokenExpiration);
        console.log("Tokens armazenados no localStorage:", {
          unicv_token: localStorage.getItem("unicv_token"),
          unicv_token_expiration: localStorage.getItem("unicv_token_expiration"),
        });

      // Armazena os dados do usuário
      console.log("Armazenando dados do usuário...");
      this.keys.setUser(user);
      // Passar o access_token e token_expiration explicitamente
      this.keys.setToken({
        ...user,
        access_token: token,
        token_expiration: tokenExpiration,
      });
      // localStorage.setItem("unicv_token", token); // Armazena o token
      // localStorage.setItem("unicv_token_expiration", tokenExpiration);

      console.log("Dados armazenados no localStorage:", {
        unicv_token: localStorage.getItem("unicv_token"),
        unicv_token_expiration: localStorage.getItem("unicv_token_expiration")
      });


      // Limpa os campos
      this.postBody.username = "";
      this.postBody.Utilizador_Senha = "";

      // Redireciona para a página principal
      console.log("Login bem-sucedido, chamando loginSuccess...");
      // Redireciona para a página principal
      this.keys.loginSuccess();

      }
      catch (error) {
        console.error("Erro durante o login:", error);
      if (error.response) {
        console.error("Detalhes do erro:", error.response.data);
        console.error("Status do erro:", error.response.status);
      }
      this.errormessage = "Erro ao tentar fazer login. Tente novamente.";
     } 
       
    },
    showRecoveryForm() {
      this.step = 2;
      this.errormessage = "";
    },
    sendRecoveryCode() {
      this.errormessage = "";

      if (!this.recoveryEmail) {
        this.errormessage = "Por favor, insira seu email.";
        this.errorVariant = "danger";
        return;
      }
      this.recoverySentCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      axios
        .post("/rs2lab/send-recovery-code", {
          Utilizador_Email: this.recoveryEmail,
          recoveryCode: this.recoverySentCode,
        })
        .then((res) => {
          if (res.data.success) {
            this.step = 3;
          } else {
            this.errormessage = "Erro ao enviar o código de recuperação.";
            this.errorVariant = "danger";
          }
        })
        .catch((e) => {
          console.error(e);
          this.errormessage = "Erro ao tentar enviar o código de recuperação.";
          this.errorVariant = "danger";
        });
    },
    resetPassword() {
      this.errormessage = "";

      if (!this.recoveryCode || !this.newPassword) {
        this.errormessage =
          "Por favor, insira o código de recuperação e a nova palavra-passe.";
        this.errorVariant = "info"; // Ajusta a variante para erro
        return;
      }
      if (this.recoveryCode !== this.recoverySentCode) {
        this.errormessage = "Código de recuperação inválido ou expirado.";
        this.errorVariant = "danger"; // Ajusta a variante para erro
        return;
      }
      axios
        .put("/rs2lab/recoversenhautilizador", {
          Utilizador_Email: this.recoveryEmail,
          recoveryCode: this.recoveryCode,
          newPassword: this.newPassword,
        })
        .then((res) => {
          //console.log(res);
          if (res.status == 200) {
            this.errormessage = "Palavra-passe redefinida com sucesso.";
            this.errorVariant = "success"; // Ajusta a variante para sucesso
           // console.log(this.errorVariant)
            this.step = 1;
          } else {
            this.errormessage = "Código de recuperação inválido ou expirado.";
            this.errorVariant = "danger"; // Ajusta a variante para erro
          }
        })
        .catch((e) => {
          console.error(e);
          this.errormessage = "Erro ao tentar redefinir a palavra-passe.";
          this.errorVariant = "danger"; // Ajusta a variante para erro
        });
    },
  },
};
</script>

<style scoped>
input {
  text-align: center;
}

.error-Msg {
  text-align: center;
}

p {
  line-height: 1rem;
}

.card {
  padding: 20px;
  margin-top: 10%;
  margin-bottom: 60px; /* Space for footer */
}

.form-group input {
  margin-top: 10px;
  margin-bottom: 10px;
  width: 100%;
}

.eon-btn {
  background-color: #ab162b;
  margin-top: 5px;
}

.login-page {
  flex: 1;
  display: flex;
  margin-top: 150px;
  z-index: 1;
  padding: 20px;
  min-height: 100vh;
  position: relative;
}

.wallpaper-login {
  background-size: cover;
  height: 100%;
  position: absolute;
  width: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.wallpaper-register {
  background-size: cover;
  height: 100%;
  position: absolute;
  width: 100%;
  z-index: -1;
}

h1 {
  margin-bottom: 1.5rem;
}

.error {
  animation-name: errorShake;
  animation-duration: 0.3s;
}

@keyframes errorShake {
  0% {
    transform: translateX(-25px);
  }
  25% {
    transform: translateX(25px);
  }
  50% {
    transform: translateX(-25px);
  }
  75% {
    transform: translateX(25px);
  }
  100% {
    transform: translateX(0);
  }
}
</style>
