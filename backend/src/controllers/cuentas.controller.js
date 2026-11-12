import { listarCuentas, registrarCuenta } from "../services/cuentas.service.js";

export async function obtenerCuentas(req, res) {
    if (req.usuario.rol !== "administrador") {
        return res.status(403).json({ mensaje: "No tienes permiso para ver las cuentas." });
    }

    return res.json(await listarCuentas());
}

export async function crearCuenta(req, res, next) {
    if (req.usuario.rol !== "administrador") {
        return res.status(403).json({ mensaje: "No tienes permiso para crear cuentas." });
    }

    try {
        const cuenta = await registrarCuenta(req.body);

        if (!cuenta) {
            return res.status(400).json({
                mensaje: "Revisa los datos. La contraseña debe tener entre 12 y 128 caracteres."
            });
        }

        return res.status(201).json(cuenta);
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(409).json({ mensaje: "Ya existe una cuenta con ese correo." });
        }

        return next(error);
    }
}