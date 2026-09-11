    document.addEventListener("DOMContentLoaded", () => {
        // 1. Buscamos el formulario de login en la página actual
        const formLogin = document.getElementById("form-login");

        // Si la página en la que estamos no tiene el formulario, no hace nada
        // (esto evita errores en las otras páginas que también cargan aplicacion.js)
        if (!formLogin) return;

        // 2. Elementos del formulario
        const inputCorreo = document.getElementById("correo");
        const inputPassword = document.getElementById("password");
        const mensajeError = document.getElementById("mensaje-error");

        // 3. Escuchamos cuando el usuario envía el formulario
        formLogin.addEventListener("submit", (evento) => {
            // Evitamos que el formulario recargue la página por defecto
            evento.preventDefault();

            // Obtenemos los valores ingresados (limpiando espacios en blanco)
            const correo = inputCorreo.value.trim().toLowerCase();
            const password = inputPassword.value.trim();

            // 4. Verificación y derivación según el correo
            if (correo === "admin@cybernet.cl" && password === "admin123") {
                // Deriva a la vista del Administrador
                window.location.href = "paginas/inicio-admin.html";

            } else if (correo === "encargado@cybernet.cl" && password === "encargado123")
  {
                // Deriva a la vista del Encargado
                window.location.href = "paginas/inicio-encargado.html";

            } else {
                // Mostrar mensaje de error en pantalla
                mostrarError("Correo o contraseña incorrectos");
            }
        });

        // Función auxiliar para mostrar mensaje de error
        function mostrarError(texto) {
            if (mensajeError) {
                mensajeError.textContent = texto;
                mensajeError.style.display = "block";
            } else {
                alert(texto);
            }
        }
    });