import { listarCuentas } from "../services/cuentas.service.js";

export async function obtenerCuentas(req, res) {
    if (req.usuario.rol !== "administrador") {
        return res.status(403).json({ mensaje: "No tienes permiso para ver las cuentas." });
    }

    return res.json(await listarCuentas());
}