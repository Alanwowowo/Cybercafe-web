import { baseDatos } from "../db.js";
import { ObjectId } from "mongodb";

export async function prepararCuentas() {
    return baseDatos.collection("cuentas").createIndex(
        { correo: 1 },
        { unique: true, name: "correo_unico" }
    );
}

export function insertarCuentaSiNoExiste(cuenta) {
    return baseDatos.collection("cuentas").updateOne(
        { correo: cuenta.correo },
        { $setOnInsert: cuenta },
        { upsert: true }
    );
}

export function buscarCuentaPorCorreo(correo) {
    return baseDatos.collection("cuentas").findOne({ correo });
}

export function buscarCuentaActivaPorId(id) {
    return baseDatos.collection("cuentas").findOne(
        { _id: new ObjectId(id), estado: "activa" },
        { projection: { nombre: 1, rol: 1 } }
    );
}