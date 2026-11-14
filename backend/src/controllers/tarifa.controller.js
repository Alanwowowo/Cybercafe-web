import {
    obtenerTarifaHora,
    cambiarTarifaHora
} from "../services/tarifa.service.js";

export async function obtenerTarifa(req, res) {
    const tarifaHora = await obtenerTarifaHora();
    return res.json({ tarifaHora });
}

export async function modificarTarifa(req, res) {
    if (req.usuario.rol !== "administrador") {
        return res.status(403).json({
            mensaje: "No tienes permiso para cambiar la tarifa."
        });
    }

    const resultado = await cambiarTarifaHora(req.body?.tarifaHora);

    if (resultado.error === "TARIFA_INVALIDA") {
        return res.status(400).json({
            mensaje: "Ingresa una tarifa en pesos mayor que cero, sin decimales."
        });
    }

    return res.json(resultado);
}