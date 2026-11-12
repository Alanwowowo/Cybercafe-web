import { listarEquipos } from "../services/equipos.service.js";

export async function obtenerEquipos(req, res) {
    if (req.usuario.rol !== "administrador") {
        return res.status(403).json({ mensaje: "No tienes permiso para ver los equipos" });
    }

    return res.json(await listarEquipos());
}