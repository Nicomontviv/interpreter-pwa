let deferredPrompt;
const installBtn = document.getElementById("install-btn");

// Ocultar el botón al principio
installBtn.style.display = "block";

// Esperar el evento de instalación
window.addEventListener("beforeinstallprompt", (e) => {
  // Prevenir que Chrome muestre automáticamente el prompt
  e.preventDefault();
  deferredPrompt = e;

  // Mostrar el botón personalizado
  installBtn.style.display = "inline-block";

  // Cuando el usuario hace clic en el botón de instalar
  installBtn.addEventListener("click", async () => {
    installBtn.style.display = "none"; // Ocultar el botón
    deferredPrompt.prompt(); // Mostrar el prompt de instalación

    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      console.log("Usuario aceptó la instalación");
    } else {
      console.log("Usuario canceló la instalación");
    }

    deferredPrompt = null; // Limpiar el objeto
  });
});
