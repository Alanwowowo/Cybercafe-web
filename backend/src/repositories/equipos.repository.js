import { baseDatos } from "../db.js";

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