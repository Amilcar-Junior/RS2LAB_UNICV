<template>
    <div class="login-page">
       <div class="container">
          <div class="row">
             <div class="col-lg-4 col-md-6 col-sm-8 mx-auto">
                <div class="card login">
                   <h3 style="text-align:center;">Sign In</h3>
                   <!-- <p class="text-muted" style="font-size:18px;text-align:center;">Code Mechanic</p> -->
                   <form class="form-group" novalidate>
                      <input v-model="postBody.Utilizador_Email" type="text" class="form-control" placeholder="Email" required>
                      <input v-model="postBody.Utilizador_Senha" type="password" class="form-control" placeholder="Senha"   maxlength="16" required>
                      <input type="submit" class="btn btn-info eon-btn" @click="login()">
                         <b-alert v-show="displayError" variant="danger" show class="error-Msg">
                            {{errormessage}}
                         </b-alert>
                      <p class="mt-4 text-muted" style="font-size:15px; margin-top:20px;text-align:center;">Rs2lab</p>
                   </form>
                </div>
             </div>
          </div>
       </div>
    </div>
</template>
<style scoped>

</style>
<script>
 module.exports = {
     props:['keys'],
     data() {
         return {
             postBody: { Utilizador_Email:'', Utilizador_Senha:''},
             errors: [],
             errormessage: ''
         };
     },
     computed:{
        displayError(){
            if(this.errormessage!=''){ return true; }
            else { return false; }
        }
     },
     methods: {
         login(){
            var self = this;
            var Utilizador_Senha = MD5(this.postBody.Utilizador_Senha).toString();
            console.log(Utilizador_Senha)
            console.log(this.postBody.Utilizador_Email)
            this.errormessage = '';
            if(this.postBody.Utilizador_Email != '' && this.postBody.Utilizador_Senha!=''){
               axios.post('/rs2lab/login',{ Utilizador_Email: this.postBody.Utilizador_Email, Utilizador_Senha: Utilizador_Senha })
               .then(res=>{
                   if(res.data.length>0){
                    if(res.data[0].user_id != ''){
                        this.postBody.Utilizador_Email = ''; 
                        this.postBody.Utilizador_Senha = '';
                        this.keys.setToken(res.data[0]);
                        this.keys.loginSuccess();
                        this.keys.user.setUser(res.data[0]);
                     } else { this.errormessage = 'Email ou Senha Invalidos.'; }
                   } { this.errormessage = 'Email ou Senha Invalidos.'; }
               }).catch(e=>{  });
            }   
         }
     }
 }
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
       background-color: #0C738D;
       margin-top: 5px;
    }
 
    .login-page {
       align-items: center;
       display: flex;
       height: 100% ;
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
    transition: opacity .5s;
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