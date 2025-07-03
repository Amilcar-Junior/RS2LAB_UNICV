<template>
  <footer class="custom-footer">
    <div class="text-center py-2">
      &copy; Todos os direitos reservados - 
      <a 
        href="https://rs2lab.com" 
        target="_blank" 
        rel="noopener noreferrer" 
        class="footer-link"
      >
        RS2LAB 
      </a> 
      e STI
      <!-- | Desenvolvido por  -->
      <a 
        href="https://www.linkedin.com/in/amilcar-junior/" 
        target="_blank" 
        rel="noopener noreferrer" 
        class="footer-link"
      >
        
      </a>
    </div>
  </footer>
</template>

<style scoped>
.custom-footer {
  background-color: #AB162B;
  color: #ffffff;
  font-size: 0.9rem;
  text-align: center;
  padding: 0.5rem 0;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 100;
}

.footer-link {
  color: #ffffff; /* Cor do link */
  text-decoration: underline; /* Sublinha o texto */
}

.footer-link:hover {
  color: #ffcccb; /* Cor ao passar o mouse */
  text-decoration: none; /* Remove o sublinhado no hover */
}
</style>



