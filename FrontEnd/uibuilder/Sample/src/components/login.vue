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
                v-model="postBody.Utilizador_Email"
                type="text"
                class="form-control"
                placeholder="Email"
                required
              />
              <input
                v-model="postBody.Utilizador_Senha"
                type="password"
                class="form-control"
                placeholder="Palavra-passe"
                maxlength="16"
                required
              />
              <input type="submit" class="btn btn-info eon-btn" />
              <b-alert
                v-show="displayError"
                variant="danger"
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
                Rs2lab
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
                variant="danger"
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
                maxlength="16"
                required
              />
              <input
                type="submit"
                class="btn btn-info eon-btn"
                value="Redefinir Credenciais"
              />
              <b-alert
                v-show="displayError"
                variant="success"
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
      postBody: { Utilizador_Email: "", Utilizador_Senha: "" },
      recoveryEmail: "",
      recoveryCode: "",
      recoverySentCode: "",
      newPassword: "",
      step: 1,
      errors: [],
      errormessage: "",
    };
  },
  computed: {
    displayError() {
      return this.errormessage !== "";
    },
  },

  methods: {
    login() {
      this.errormessage = "";

      if (!this.postBody.Utilizador_Email) {
        this.errormessage = "Por favor, insira seu email.";
        return;
      }

      if (!this.postBody.Utilizador_Senha) {
        this.errormessage = "Por favor, insira sua Palavra-passe.";
        return;
      }

      var Utilizador_Senha = MD5(this.postBody.Utilizador_Senha).toString();
      axios
        .post("/rs2lab/login", {
          Utilizador_Email: this.postBody.Utilizador_Email,
          Utilizador_Senha: Utilizador_Senha,
        })
        .then((res) => {
          if (res.data.length > 0) {
            const user = res.data[0];
            if (user.Utilizador_isActive === 1) {
              this.postBody.Utilizador_Email = "";
              this.postBody.Utilizador_Senha = "";
              this.keys.setToken(user);
              this.keys.loginSuccess();
              this.keys.setUser(user);
            } else {
              this.errormessage =
                "Sua conta está inativa. Entre em contato com o administrador.";
            }
          } else {
            this.errormessage = "Email ou Palavra-passe Invalidos.";
          }
        })
        .catch((e) => {
          console.error(e);
          this.errormessage = "Erro ao tentar fazer login.";
        });
    },
    showRecoveryForm() {
      this.step = 2;
    },
    sendRecoveryCode() {
      this.errormessage = "";

      if (!this.recoveryEmail) {
        this.errormessage = "Por favor, insira seu email.";
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
          }
        })
        .catch((e) => {
          console.error(e);
          this.errormessage = "Erro ao tentar enviar o código de recuperação.";
        });
    },
    resetPassword() {
      this.errormessage = "";

      if (!this.recoveryCode || !this.newPassword) {
        this.errormessage =
          "Por favor, insira o código de recuperação e a nova palavra-passe.";
        this.errorVariant = "danger"; // Ajusta a variante para erro
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
          console.log(res);
          if (res.status == 200) {
            this.errormessage = "Palavra-passe redefinida com sucesso.";
            this.errorVariant = "success"; // Ajusta a variante para sucesso
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
  margin-top: 25%;
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
  align-items: center;
  display: flex;
  height: 100%;
  z-index: 1;
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
