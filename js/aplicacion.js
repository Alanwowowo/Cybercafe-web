(function () {
    const rolUsuario = sessionStorage.getItem("rol");
    const paginaActual = window.location.pathname;

    // 1. Si no hay sesión iniciada, redirigir al login y detener la ejecución
    if (!rolUsuario) {
        window.location.replace("../index.html");
        return;
    }

    // 2. Ocultar enlaces del menú según el rol
    const enlaceAdministrador = document.querySelector(
        'a[href="inicio-admin.html"]'
    );

    const enlaceEncargado = document.querySelector(
        'a[href="inicio-encargado.html"]'
    );

    if (rolUsuario === "administrador" && enlaceEncargado) {
        enlaceEncargado.parentElement.style.display = "none";
    }

    if (rolUsuario === "encargado" && enlaceAdministrador) {
        enlaceAdministrador.parentElement.style.display = "none";
    }

    // 3. Restricción por rol (solo se evalúa si YA hay una sesión activa)
    if (
        paginaActual.endsWith("/inicio-admin.html") &&
        rolUsuario !== "administrador"
    ) {
        window.location.replace("inicio-encargado.html");
        return;
    }

    if (
        paginaActual.endsWith("/inicio-encargado.html") &&
        rolUsuario !== "encargado"
    ) {
        window.location.replace("inicio-admin.html");
        return;
    }

    // 4. Cierre de sesión para cualquier página interna
    const enlaceCerrarSesion = document.querySelector(
        'a[href="../index.html"]'
    );

    if (enlaceCerrarSesion) {
        enlaceCerrarSesion.addEventListener("click", function () {
            sessionStorage.removeItem("rol");
        });
    }
})();
