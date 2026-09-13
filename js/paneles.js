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
            window.location.href = "paginas/inicio-admin.html";
        } else if (
            correoIngresado === "elianny.ortega@cybernet.com" &&
            contrasenaIngresada === "encargado123"
        ) {
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

const totalClientes = document.getElementById(
    "admin-total-clientes"
);

const totalHistorial = document.getElementById(
    "admin-total-historial"
);

if (totalClientes) {
    totalClientes.textContent = "3 clientes registrados";
}

if (totalHistorial) {
    totalHistorial.textContent = "2 registros";
}
