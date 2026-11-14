import { abrirSesionUso, cerrarSesionUso, listarSesionesUsoActivas } from "../services/sesiones-uso.service.js";

export async function crearSesionUso(req, res) {
    if (!["administrador", "encargado"].includes(req.usuario?.rol)) {
        return res.status(403).json({ mensaje: "No tienes permiso para abrir sesiones." });
    }

    const resultado = await abrirSesionUso(req.body);

    switch (resultado.error) {
        case "DATOS_INVALIDOS":
            return res.status(400).json({ mensaje: "Envía un ID de cliente y un ID de equipo válidos." });
        case "CLIENTE_NO_ENCONTRADO":
            return res.status(404).json({ mensaje: "No se encontró el cliente." });
        case "EQUIPO_NO_ENCONTRADO":
            return res.status(404).json({ mensaje: "No se encontró el equipo." });
        case "EQUIPO_NO_DISPONIBLE":
            return res.status(409).json({ mensaje: "El equipo no está disponible." });
        case "EQUIPO_OCUPADO":
            return res.status(409).json({ mensaje: "El equipo ya tiene una sesión activa." });
        default:
            return res.status(201).json(resultado.sesion);
    }
}

export async function cerrarSesionUsoHttp(req, res) {
    if (!["administrador", "encargado"].includes(req.usuario?.rol)) {
        return res.status(403).json({ mensaje: "No tienes permiso para cerrar sesiones." });
    }

    const { costosAdicionales = 0 } = req.body ?? {};
    const resultado = await cerrarSesionUso(req.params.id, costosAdicionales);

    if (resultado.error === "ID_INVALIDO") {
        return res.status(400).json({ mensaje: "El ID de la sesión no es válido." });
    }

    if (resultado.error === "SESION_ACTIVA_NO_ENCONTRADA") {
        return res.status(404).json({ mensaje: "No se encontró una sesión activa con ese ID." });
    }

    if (resultado.error === "EXTRAS_INVALIDOS") {
        return res.status(400).json({
            mensaje: "Los costos extras deben ser un monto válido en pesos enteros, sin negativos.",
        });
    }

    return res.json(resultado.sesion);
}

export async function obtenerSesionesUsoActivas(req, res) {
    if (!["administrador", "encargado"].includes(req.usuario?.rol)) {
        return res.status(403).json({ mensaje: "No tienes permiso para ver las sesiones." });
    }

    return res.json(await listarSesionesUsoActivas());
}