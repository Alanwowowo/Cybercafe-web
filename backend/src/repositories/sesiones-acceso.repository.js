import { baseDatos } from "../db.js";

const sesiones = baseDatos.collection("sesiones_acceso");

export async function prepararSesionesAcceso() {
    await sesiones.createIndex({ refreshHash: 1 }, { unique: true });
    await sesiones.createIndex({ venceEn: 1 }, { expireAfterSeconds: 0 });
}

export async function guardarSesionAcceso(sesion) {
    await sesiones.insertOne(sesion);
}

export function buscarSesionVigente(refreshHash) {
    return sesiones.findOne({
        refreshHash,
        venceEn: { $gt: new Date() },
    });
}

export async function rotarRefreshHash(id, hashActual, hashNuevo) {
    const resultado = await sesiones.updateOne(
        { _id: id, refreshHash: hashActual, venceEn: { $gt: new Date() } },
        { $set: { refreshHash: hashNuevo } },
    );

    return resultado.modifiedCount === 1;
}

export function eliminarSesionPorHash(refreshHash) {
    return sesiones.deleteOne({ refreshHash });
}