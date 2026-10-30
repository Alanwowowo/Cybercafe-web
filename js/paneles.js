// Formulario de inicio de sesión

const formularioLogin = document.getElementById("form-login");

if (formularioLogin) {
    const correo = document.getElementById("correo");
    const contrasena = document.getElementById("password");

    formularioLogin.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const correoIngresado = correo.value.trim().toLowerCase();
        const contrasenaIngresada = contrasena.value.trim();

        if (
            correoIngresado === "admin@cybernet.com" &&
            contrasenaIngresada === "admin123"
        ) {
            sessionStorage.setItem("rol", "administrador");
            window.location.href = "paginas/inicio-admin.html";
        } else if (
            correoIngresado === "elianny.ortega@cybernet.com" &&
            contrasenaIngresada === "encargado123"
        ) {
            sessionStorage.setItem("rol", "encargado");
            window.location.href = "paginas/inicio-encargado.html";
        } else {
            alert("Correo o contraseña incorrectos.");
        }
    });
}


// Datos simulados del panel del encargado

const totalSesionesActivas = document.getElementById(
    "total-sesiones-activas"
);

const totalEquiposDisponibles = document.getElementById(
    "total-equipos-disponibles"
);

const totalRecaudado = document.getElementById("total-recaudado");

if (totalSesionesActivas) {
    totalSesionesActivas.textContent = "2";
}

if (totalEquiposDisponibles) {
    totalEquiposDisponibles.textContent = "3";
}

if (totalRecaudado) {
    totalRecaudado.textContent = "$3.000";
}


// Datos simulados del panel del administrador

const totalComputadores = document.getElementById(
    "admin-total-computadores"
);

const totalCuentas = document.getElementById("admin-total-cuentas");

if (totalComputadores) {
    totalComputadores.textContent = "6 equipos registrados";
}

if (totalCuentas) {
    totalCuentas.textContent = "3 cuentas registradas";
}

// Control de acceso del administrador
if (window.location.pathname.endsWith("/inicio-admin.html")) {
    const rol = sessionStorage.getItem("rol");

    if (rol !== "administrador") {
        window.location.replace("../index.html");
    }
}

// Control de acceso del encargado
if (window.location.pathname.endsWith("/inicio-encargado.html")) {
    const rol = sessionStorage.getItem("rol");

    if (rol !== "encargado") {
        window.location.replace("../index.html");
    }
}

// Cierre de sesión
const botonCerrarSesion = document.getElementById("cerrar-sesion");

if (botonCerrarSesion) {
    botonCerrarSesion.addEventListener("click", function () {
        sessionStorage.removeItem("rol");
    });
}