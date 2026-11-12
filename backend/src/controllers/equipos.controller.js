import { listarEquipos, registrarEquipo, editarEquipo } from "../services/equipos.service.js";

export async function obtenerEquipos(req, res) {
    if (req.usuario.rol !== "administrador") {
        return res.status(403).json({ mensaje: "No tienes permiso para ver los equipos" });
    }

    return res.json(await listarEquipos());
}

export async function obtenerEquiposParaMapa(req, res) {
    const { rol } = req.usuario;

    if (rol !== "administrador" && rol !== "encargado") {
        return res.status(403).json({ mensaje: "No tienes permiso para ver el mapa." });
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

export async function modificarEquipo(req, res, next) {
    if (req.usuario.rol !== "administrador") {
        return res.status(403).json({ mensaje: "No tienes permiso para editar equipos." });
    }

    try {
        const resultado = await editarEquipo(req.params.id, req.body);

        if (resultado.error === "ID_INVALIDO") {
            return res.status(400).json({ mensaje: "El ID del equipo no es válido." });
        }

        if (resultado.error === "DATOS_INVALIDOS") {
            return res.status(400).json({ mensaje: "Revisa el nombre y la ubicación." });
        }

        if (resultado.error === "EQUIPO_NO_ENCONTRADO") {
            return res.status(404).json({ mensaje: "No se encontró el equipo." });
        }

        return res.status(200).json(resultado);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ mensaje: "Ya existe un equipo con ese nombre." });
        }

        return next(error);
    }
}