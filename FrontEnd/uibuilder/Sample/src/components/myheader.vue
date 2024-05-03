<template>
  <b-navbar toggleable="lg" type="dark"  class="custom-navbar">
     <!-- <b-navbar-brand href="#">RS2LAB</b-navbar-brand> -->
     <b-navbar-brand href="#"> 
      <img src="./images/rs2lab_logo_black.png" alt="RS2LAB" class="logo-img">
    </b-navbar-brand>
 
     <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
 
     <b-collapse id="nav-collapse" is-nav>
       <b-navbar-nav>
         <b-nav-item href="#" to="/home">Home</b-nav-item>
         <b-nav-item href="#" to="/form">Form</b-nav-item>
         <b-nav-item href="#" to="/table">Table</b-nav-item>
         <b-nav-item href="#" to="/chart">Chart</b-nav-item>
         <b-nav-item href="#" to="/tipoutilizador">Tipo Utilizador</b-nav-item>
       </b-navbar-nav>
       <b-navbar-nav class="ml-auto">
         <b-nav-item-dropdown right>
           <template #button-content>
              <em>
               <b-avatar src="./images/cookie.png" size="1.8rem"></b-avatar>&nbsp;System Administrator
             </em>
           </template>
           <b-dropdown-item href="#">Profile</b-dropdown-item>
           <b-dropdown-item href="#">Sign Out</b-dropdown-item>
         </b-nav-item-dropdown>
       </b-navbar-nav>
     </b-collapse>
   </b-navbar>
 </template>
 <style scoped>

.logo-img {
  width: 100px; /* Defina o tamanho desejado para a largura da imagem */
  height: auto; /* Mantenha a proporção da altura */
}
 </style>
 <script>
 module.exports = {
     data() {
         return {};
     },
     mounted(){
     },
     methods: {
     }, 
 }
 </script>
 