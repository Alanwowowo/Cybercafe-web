import { buscarTarifa, guardarTarifa } from "../repositories/tarifa.repository.js";

const TARIFA_DEFAULT = 1500;

export async function obtenerTarifaHora() {
    const tarifaHora = await buscarTarifa();
    return tarifaHora ?? TARIFA_DEFAULT;
}

export async function cambiarTarifaHora(tarifaHora) {
    if (!Number.isSafeInteger(tarifaHora) || tarifaHora <= 0) {
        return { error: "TARIFA_INVALIDA" };
    }

    await guardarTarifa(tarifaHora);
    return { tarifaHora };
}