import { buscarCuentaPorCorreo, buscarCuentaActivaPorId } from "../repositories/cuentas.repository.js";
import { verificarContrasena } from "../contrasenas.js";
import {
    crearTokenAcceso,
    crearRefreshToken,
    hashRefresh,
    DURACION_REFRESH_MS,
} from "../tokens.js";
import {
    guardarSesionAcceso,
    buscarSesionVigente,
    rotarRefreshHash,
    eliminarSesionPorHash,
} from "../repositories/sesiones-acceso.repository.js";

export async function iniciarSesion(correo, contrasena) {
    const credenciales = await validarCredenciales(correo, contrasena);
    if (!credenciales) return null;

    const { versionAcceso, ...usuario } = credenciales;
    const accessToken = crearTokenAcceso(usuario.id, versionAcceso);
    const refreshToken = crearRefreshToken();

    await guardarSesionAcceso({
        cuentaId: usuario.id,
        versionAcceso,
        refreshHash: hashRefresh(refreshToken),
        venceEn: new Date(Date.now() + DURACION_REFRESH_MS),
    });

    return { usuario, accessToken, refreshToken };
}

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

    return {
        id: cuenta._id.toString(),
        nombre: cuenta.nombre,
        rol: cuenta.rol,
        versionAcceso: cuenta.versionAcceso ?? 0,
    };
}

export async function renovarSesion(tokenActual) {
    const hashActual = hashRefresh(tokenActual);
    const sesion = await buscarSesionVigente(hashActual);
    if (!sesion) return null;
    const cuenta = await buscarCuentaActivaPorId(sesion.cuentaId);
    if (!cuenta) return null;

    const versionAcceso = sesion.versionAcceso ?? 0;
    if (versionAcceso !== (cuenta.versionAcceso ?? 0)) return null;

    const accessToken = crearTokenAcceso(sesion.cuentaId, versionAcceso);
    const refreshToken = crearRefreshToken();
    const rotado = await rotarRefreshHash(
        sesion._id, hashActual, hashRefresh(refreshToken),
    );

    if (!rotado) return null;

    return { accessToken, refreshToken, venceEn: sesion.venceEn };
}

export async function cerrarSesion(tokenActual) {
    await eliminarSesionPorHash(hashRefresh(tokenActual));
}