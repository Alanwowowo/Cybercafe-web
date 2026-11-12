import { listarEquipos, registrarEquipo } from "../services/equipos.service.js";

export async function obtenerEquipos(req, res) {
    if (req.usuario.rol !== "administrador") {
        return res.status(403).json({ mensaje: "No tienes permiso para ver los equipos" });
    }

    return res.json(await listarEquipos());
}

export async function crearEquipo(req, res) {
    if (req.usuario.rol !== "administrador") {
        return res.status(403).json({ mensaje: "No tienes permiso para crear equipos" });
    }

    try {
        const equipo = await registrarEquipo(req.body);

        if (!equipo) {
            return res.status(400).json({
                mensaje: "Indica un nombre de hasta 80 caracteres y una ubicación de hasta 120",
            });
        }

        return res.status(201).json(equipo);
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(409).json({ mensaje: "Ya existe un equipo con ese nombre" });
        }

        throw error;
    }
}