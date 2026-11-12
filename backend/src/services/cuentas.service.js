import {
    buscarCuentas,
    insertarCuenta,
    actualizarDatosCuenta,
} from "../repositories/cuentas.repository.js";
import { generarHash } from "../contrasenas.js";

function normalizarNombre(valor) {
    const nombre = typeof valor === "string" ? valor.trim() : "";
    return nombre && nombre.length <= 80 ? nombre : null;
}

function normalizarCorreo(valor) {
    const correo = typeof valor === "string" ? valor.trim().toLowerCase() : "";
    return correo.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)
        ? correo
        : null;
}

function cuentaPublica(cuenta) {
    return {
        id: cuenta._id.toString(),
        nombre: cuenta.nombre,
        correo: cuenta.correo,
        rol: cuenta.rol,
        estado: cuenta.estado,
    };
}

export async function listarCuentas() {
    const cuentas = await buscarCuentas();
    return cuentas.map(cuentaPublica);
}

export async function registrarCuenta(datos) {
    const nombre = normalizarNombre(datos?.nombre);
    const correo = normalizarCorreo(datos?.correo);
    const rol = typeof datos?.rol === "string" ? datos.rol.trim().toLowerCase() : "";
    const estado = datos?.estado;
    const contrasena = datos?.contrasena;

    if (
        !nombre || !correo ||
        !["administrador", "encargado"].includes(rol) ||
        !["activa", "inactiva"].includes(estado) ||
        typeof contrasena !== "string" || !contrasena.trim() ||
        contrasena.length < 12 || contrasena.length > 128
    ) {
        return null;
    }

    const contrasenaHash = await generarHash(contrasena);
    const id = await insertarCuenta({ nombre, correo, rol, estado, contrasenaHash });

    return { id, nombre, correo, rol, estado };
}

export async function editarCuenta(id, datos) {
    if (
        typeof id !== "string" || !/^[a-f0-9]{24}$/i.test(id) ||
        !datos || typeof datos !== "object" || Array.isArray(datos)
    ) {
        return { error: "DATOS_INVALIDOS" };
    }

    const campos = Object.keys(datos);
    if (campos.length === 0) {
        return { error: "DATOS_INVALIDOS" };
    }

    const validadores = { nombre: normalizarNombre, correo: normalizarCorreo };
    const cambios = {};

    for (const campo of campos) {
        if (!Object.hasOwn(validadores, campo)) {
            return { error: "DATOS_INVALIDOS" };
        }

        const valor = validadores[campo](datos[campo]);
        if (valor === null) {
            return { error: "DATOS_INVALIDOS" };
        }

        cambios[campo] = valor;
    }

    const cuenta = await actualizarDatosCuenta(id, cambios);
    if (!cuenta) {
        return { error: "CUENTA_NO_ENCONTRADA" };
    }

    return { cuenta: cuentaPublica(cuenta) };
}