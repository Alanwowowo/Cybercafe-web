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

// Inicializar datos por defecto si no existen en localStorage (sin sobrescribir existentes)
function inicializarDatos() {
    try {
        if (localStorage.getItem("cybernet_computadores") === null) {
            const computadoresIniciales = [
                {
                    id: 1,
                    nombre: "PC 01",
                    estado: "disponible",
                    ubicacion: "Sala principal"
                },
                {
                    id: 2,
                    nombre: "PC 02",
                    estado: "ocupado",
                    ubicacion: "Sala principal"
                },
                {
                    id: 3,
                    nombre: "PC 03",
                    estado: "disponible",
                    ubicacion: "Sala principal"
                },
                {
                    id: 4,
                    nombre: "PC 04",
                    estado: "fuera-servicio",
                    ubicacion: "Sala secundaria"
                },
                {
                    id: 5,
                    nombre: "PC 05",
                    estado: "ocupado",
                    ubicacion: "Sala secundaria"
                },
                {
                    id: 6,
                    nombre: "PC 06",
                    estado: "disponible",
                    ubicacion: "Sala secundaria"
                }
            ];
            localStorage.setItem(
                "cybernet_computadores",
                JSON.stringify(computadoresIniciales)
            );
        }

        if (localStorage.getItem("cybernet_cuentas") === null) {
            const cuentasIniciales = [
                {
                    id: 1,
                    nombre: "Jaimito Rios",
                    correo: "admin@cybernet.com",
                    rol: "Administrador",
                    estado: "activa"
                },
                {
                    id: 2,
                    nombre: "Elianny Ortega",
                    correo: "elianny.ortega@cybernet.com",
                    rol: "Encargado",
                    estado: "activa"
                },
                {
                    id: 3,
                    nombre: "Roberto Carlos",
                    correo: "roberto.carlos@cybernet.com",
                    rol: "Encargado",
                    estado: "inactiva"
                }
            ];
            localStorage.setItem(
                "cybernet_cuentas",
                JSON.stringify(cuentasIniciales)
            );
        }

        if (localStorage.getItem("cybernet_clientes") === null) {
            const clientesIniciales = [
                {
                    id: "12345678-9",
                    nombre: "Jorge Gonzalez",
                    correo: "jorge@ejemplo.com"
                },
                {
                    id: "98765432-1",
                    nombre: "Alvaro Herreros",
                    correo: "alvaro@ejemplo.com"
                },
                {
                    id: "32323345-5",
                    nombre: "Pablo Paez",
                    correo: "pablo@ejemplo.com"
                }
            ];
            localStorage.setItem(
                "cybernet_clientes",
                JSON.stringify(clientesIniciales)
            );
        }

        if (localStorage.getItem("cybernet_historial") === null) {
            const historialInicial = [
                {
                    cliente: "Jorge Gonzalez",
                    computador: "PC 01",
                    fecha: "2024-04-15",
                    duracion: "300 min",
                    monto: 10000
                },
                {
                    cliente: "Pablo Paez",
                    computador: "PC 06",
                    fecha: "2021-08-29",
                    duracion: "67 min",
                    monto: 2500
                }
            ];
            localStorage.setItem(
                "cybernet_historial",
                JSON.stringify(historialInicial)
            );
        }
    } catch (e) {
        // En caso de que localStorage no esté disponible
    }
}

// Asegurar la inicialización de datos antes de calcular los paneles
inicializarDatos();

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

    // Total recaudado del día actual sumando montos del historial
    if (totalRecaudado) {
        const ahora = new Date();
        const anio = ahora.getFullYear();
        const mes = String(ahora.getMonth() + 1).padStart(2, "0");
        const dia = String(ahora.getDate()).padStart(2, "0");
        const fechaHoy = `${anio}-${mes}-${dia}`;

        const registrosHoy = historial.filter(function (s) {
            return s.fecha === fechaHoy;
        });

        const total = registrosHoy.reduce(function (acumulado, s) {
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
