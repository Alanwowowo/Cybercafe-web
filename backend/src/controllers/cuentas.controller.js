import { listarCuentas, registrarCuenta, editarCuenta } from "../services/cuentas.service.js";

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

export async function modificarCuenta(req, res, next) {
    if (req.usuario.rol !== "administrador") {
        return res.status(403).json({ mensaje: "No tienes permiso para editar cuentas." });
    }

    try {
        const resultado = await editarCuenta(req.params.id, req.body);

        if (resultado.error === "DATOS_INVALIDOS") {
            return res.status(400).json({
                mensaje: "Revisa el identificador, el nombre o el correo. Solo se pueden editar el nombre y el correo."
            });
        }

        if (resultado.error === "CUENTA_NO_ENCONTRADA") {
            return res.status(404).json({ mensaje: "No se encontró la cuenta." });
        }

        return res.json(resultado.cuenta);
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(409).json({ mensaje: "Ya existe una cuenta con ese correo." });
        }

        return next(error);
    }
}