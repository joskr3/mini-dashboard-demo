import { doLogin } from "./backend.js";
import { showError, showSuccess, getInputValue } from "./frontend.js";

document.addEventListener("DOMContentLoaded", () => {
  const btnLogin = document.getElementById("btnLogin");
  const loginResult = document.getElementById("loginResult");


  if ( btnLogin ) {
      btnLogin.addEventListener("click", async () => {
        // Quitar la animación de bounce
        btnLogin.classList.remove( "anim-bounce" );
        
        if ( loginResult ) {
              loginResult.textContent = "";
        }
    
        const email = getInputValue("email");
        const pass = getInputValue("password");

        try {
          await doLogin(email, pass);
          showSuccess(loginResult, "¡Login exitoso! Redirigiendo...");
          // Redirigir al dashboard
          setTimeout(() => {
            window.location.href = "dashboard.html";
          }, 1000);
        } catch (e) {
          showError(loginResult, e.message);
        }
      });
  }
});
