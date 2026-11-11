import { buscarCuentaPorCorreo } from "../repositories/cuentas.repository.js";
import { verificarContrasena } from "../contrasenas.js";

const hashFicticio = `scrypt$${"0".repeat(32)}$${"0".repeat(128)}`;

export async function validarCredenciales(correo, contrasena) {
    if (typeof correo !== "string" || typeof contrasena !== "string") {
        return null;
    }

    const correoNormalizado = correo.trim().toLowerCase();
    if (!correoNormalizado || correoNormalizado.length > 254 ||
        !contrasena || contrasena.length > 128) {
        return null;
    }

    const cuenta = await buscarCuentaPorCorreo(correoNormalizado);
    const coincide = await verificarContrasena(
        contrasena,
        cuenta?.contrasenaHash ?? hashFicticio
    );

    if (!coincide || !cuenta || cuenta.estado !== "activa") return null;

    return { id: cuenta._id.toString(), nombre: cuenta.nombre, rol: cuenta.rol };
}