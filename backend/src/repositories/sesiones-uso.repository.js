import { baseDatos } from "../db.js";
import { ObjectId } from "mongodb";

const sesionesUso = baseDatos.collection("sesiones_uso");

export function prepararSesionesUso() {
    return sesionesUso.createIndex(
        { equipoId: 1 },
        {
            name: "una_sesion_activa_por_equipo",
            unique: true,
            partialFilterExpression: { estado: "activa" },
        }
    );
}

export async function insertarSesionUso({ clienteId, equipoId }) {
    const sesion = {
        clienteId: new ObjectId(clienteId),
        equipoId: new ObjectId(equipoId),
        estado: "activa",
        inicio: new Date(),
    };

    const resultado = await sesionesUso.insertOne(sesion);
    return { ...sesion, _id: resultado.insertedId };
}

export function buscarSesionUsoActivaPorId(id) {
    return sesionesUso.findOne({
        _id: new ObjectId(id),
        estado: "activa",
    });
}

export function finalizarSesionUso(id, cobro) {
    return sesionesUso.findOneAndUpdate(
        { _id: new ObjectId(id), estado: "activa" },
        { $set: { ...cobro, estado: "cerrada" } },
        { returnDocument: "after" }
    );
}

export async function buscarIdsEquiposOcupados() {
    const activas = await sesionesUso.find(
        { estado: "activa" },
        { projection: { _id: 0, equipoId: 1 } }
    ).toArray();

    return activas.map(sesion => sesion.equipoId.toString());
}

export function buscarSesionesUsoActivas() {
    return sesionesUso.find(
        { estado: "activa" },
        { projection: { clienteId: 1, equipoId: 1, estado: 1, inicio: 1 } }
    ).sort({ inicio: 1, _id: 1 }).toArray();
}