import { buscarCuentas, insertarCuenta } from "../repositories/cuentas.repository.js";
import { generarHash } from "../contrasenas.js";

export async function listarCuentas() {
    const cuentas = await buscarCuentas();

    return cuentas.map(cuenta => ({
        id: cuenta._id.toString(),
        nombre: cuenta.nombre,
        correo: cuenta.correo,
        rol: cuenta.rol,
        estado: cuenta.estado
    }));
}

export async function registrarCuenta(datos) {
    const nombre = typeof datos?.nombre === "string" ? datos.nombre.trim() : "";
    const correo = typeof datos?.correo === "string"
        ? datos.correo.trim().toLowerCase()
        : "";
    const rol = typeof datos?.rol === "string" ? datos.rol.trim().toLowerCase() : "";
    const estado = datos?.estado;
    const contrasena = datos?.contrasena;

    if (
        !nombre || nombre.length > 80 ||
        correo.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo) ||
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