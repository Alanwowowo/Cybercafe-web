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
        { projection: { nombre: 1, rol: 1, versionAcceso: 1 } }
    );
}

export function buscarCuentas() {
    return baseDatos.collection("cuentas")
        .find({}, { projection: { _id: 1, nombre: 1, correo: 1, rol: 1, estado: 1 } })
        .sort({ nombre: 1, _id: 1 })
        .toArray();
}

export async function insertarCuenta(cuenta) {
    const resultado = await baseDatos.collection("cuentas").insertOne(cuenta);
    return resultado.insertedId.toString();
}

export function actualizarDatosCuenta(id, cambios) {
    const filtro = { _id: new ObjectId(id) };
    const actualizacion = { $set: cambios };

    if (Object.hasOwn(cambios, "contrasenaHash")) {
        filtro.rol = "encargado";
        actualizacion.$inc = { versionAcceso: 1 };
    }

    return baseDatos.collection("cuentas").findOneAndUpdate(
        filtro,
        actualizacion,
        {
            returnDocument: "after",
            projection: { _id: 1, nombre: 1, correo: 1, rol: 1, estado: 1 },
        }
    );
}

export function actualizarEstadoEncargado(id, estado) {
    const cambios = { $set: { estado } };

    if (estado === "inactiva") {
        cambios.$inc = { versionAcceso: 1 };
    }

    return baseDatos.collection("cuentas").findOneAndUpdate(
        { _id: new ObjectId(id), rol: "encargado" },
        cambios,
        {
            returnDocument: "after",
            projection: { _id: 1, nombre: 1, correo: 1, rol: 1, estado: 1 },
        }
    );
}