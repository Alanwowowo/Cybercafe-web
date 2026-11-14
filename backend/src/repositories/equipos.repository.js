import { baseDatos } from "../db.js";
import { ObjectId } from "mongodb";

const equipos = baseDatos.collection("equipos");

export function buscarEquipos() {
    return equipos.find({}, { projection: { nombre: 1, estado: 1, ubicacion: 1 } })
        .sort({ nombre: 1, _id: 1 })
        .toArray();
}

export function insertarEquipoSiNoExiste(equipo) {
    return equipos.updateOne(
        { nombre: equipo.nombre },
        { $setOnInsert: equipo },
        { upsert: true },
    );
}

export function prepararEquipos() {
    return equipos.createIndex(
        { nombre: 1 },
        { unique: true, name: "nombre_equipo_unico" },
    );
}

export async function insertarEquipo(equipo) {
    const resultado = await equipos.insertOne(equipo);
    return resultado.insertedId.toString();
}

export function actualizarEquipo(id, cambios) {
    return equipos.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: cambios },
        { returnDocument: "after" }
    );
}

export function buscarEquipoPorId(id) {
    return equipos.findOne(
        { _id: new ObjectId(id) },
        { projection: { estado: 1 } }
    );
}