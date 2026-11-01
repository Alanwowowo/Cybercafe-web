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
const totalSesionesActivas = document.getElementById("total-sesiones-activas");
const totalEquiposDisponibles = document.getElementById("total-equipos-disponibles");
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

// Datos del panel del administrador
const totalComputadores = document.getElementById("admin-total-computadores");
const totalCuentas = document.getElementById("admin-total-cuentas");

function contarRegistros(clave) {
    const datos = JSON.parse(localStorage.getItem(clave)) || [];
    return datos.length;
}

if (totalComputadores) {
    const cantidad = contarRegistros("computadores");
    totalComputadores.textContent = `${cantidad} equipos registrados`;
}

if (totalCuentas) {
    const cantidad = contarRegistros("cuentas");
    totalCuentas.textContent = `${cantidad} cuentas registradas`;
}
