// ==========================================
// paneles.js - Conectado a clientes-sesiones y equipos-cuentas
// ==========================================

// Helper para leer del localStorage que ya usan clientes-sesiones y equipos-cuentas
function leerDatos(clave) {
    try {
        const guardados = localStorage.getItem(clave);
        return guardados ? JSON.parse(guardados) : [];
    } catch (e) {
        return [];
    }
}

// 1. Formulario de inicio de sesión
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

// 2. Panel del Encargado (conectado a sesiones activas, computadores e historial)
const totalSesionesActivas = document.getElementById("total-sesiones-activas");
const totalEquiposDisponibles = document.getElementById("total-equipos-disponibles");
const totalRecaudado = document.getElementById("total-recaudado");

if (totalSesionesActivas || totalEquiposDisponibles || totalRecaudado) {
    const sesiones = leerDatos("cybernet_sesiones_activas");
    const computadores = leerDatos("cybernet_computadores");
    const historial = leerDatos("cybernet_historial");

    // Sesiones activas reales
    if (totalSesionesActivas) {
        totalSesionesActivas.textContent = sesiones.length;
    }

    // Equipos disponibles reales (computadores con estado === 'disponible')
    if (totalEquiposDisponibles) {
        const disponibles = computadores.filter(function (c) {
            return c.estado === "disponible";
        }).length;
        totalEquiposDisponibles.textContent = disponibles;
    }

    // Total recaudado sumando montos del historial
    if (totalRecaudado) {
        const total = historial.reduce(function (acumulado, s) {
            return acumulado + (Number(s.monto) || 0);
        }, 0);
        totalRecaudado.textContent = "$" + total.toLocaleString("es-CL");
    }
}

// 3. Panel del Administrador (conectado a computadores, cuentas, clientes e historial)
const totalComputadores = document.getElementById("admin-total-computadores");
const totalCuentas = document.getElementById("admin-total-cuentas");
const totalClientes = document.getElementById("admin-total-clientes");
const totalHistorial = document.getElementById("admin-total-historial");

if (totalComputadores) {
    const computadores = leerDatos("cybernet_computadores");
    totalComputadores.textContent = `${computadores.length} equipos registrados`;
}

if (totalCuentas) {
    const cuentas = leerDatos("cybernet_cuentas");
    totalCuentas.textContent = `${cuentas.length} cuentas registradas`;
}

if (totalClientes) {
    const clientes = leerDatos("cybernet_clientes");
    totalClientes.textContent = `${clientes.length} clientes registrados`;
}

if (totalHistorial) {
    const historial = leerDatos("cybernet_historial");
    totalHistorial.textContent = `${historial.length} registros`;
}
