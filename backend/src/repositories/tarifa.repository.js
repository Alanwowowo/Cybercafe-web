import { baseDatos } from "../db.js";

const configuracion = baseDatos.collection("configuracion");

export async function buscarTarifa() {
    const documento = await configuracion.findOne({ _id: "tarifa" });
    return documento?.tarifaHora ?? null;
}

export async function guardarTarifa(tarifaHora) {
    await configuracion.updateOne(
        { _id: "tarifa" },
        { $set: { tarifaHora } },
        { upsert: true }
    );
}