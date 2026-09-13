const rolUsuario = localStorage.getItem("rol-cybernet");

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

const paginaActual = window.location.pathname;

if (
    paginaActual.endsWith("/inicio-admin.html") &&
    rolUsuario !== "administrador"
) {
    window.location.href = "../index.html";
}

if (
    paginaActual.endsWith("/inicio-encargado.html") &&
    rolUsuario !== "encargado"
) {
    window.location.href = "../index.html";
}

const enlaceCerrarSesion = document.querySelector(
    'a[href="../index.html"]'
);

if (enlaceCerrarSesion) {
    enlaceCerrarSesion.addEventListener("click", function () {
        localStorage.removeItem("rol-cybernet");
    });
}