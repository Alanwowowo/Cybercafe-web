import { baseDatos } from "../db.js";

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