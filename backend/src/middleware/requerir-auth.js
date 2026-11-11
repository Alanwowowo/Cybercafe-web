import { verificarTokenAcceso } from "../tokens.js";
import { buscarCuentaActivaPorId } from "../repositories/cuentas.repository.js";

export async function requerirAuth(req, res, next) {
    res.set("Cache-Control", "no-store");

    const encabezado = req.get("Authorization") ?? "";
    const coincidencia = /^Bearer +(\S+)$/i.exec(encabezado);

    let id;
    try {
        if (coincidencia) id = verificarTokenAcceso(coincidencia[1]);
    } catch (error) {
        const codigo = error.name === "TokenExpiredError"
            ? "TOKEN_EXPIRED"
            : "TOKEN_INVALID";
        return res.set("WWW-Authenticate", "Bearer").status(401).json({ codigo });
    }

    const cuenta = id ? await buscarCuentaActivaPorId(id) : null;
    if (!cuenta) {
        return res.set("WWW-Authenticate", "Bearer").status(401)
            .json({ codigo: "NO_AUTORIZADO" });
    }

    req.usuario = { id, nombre: cuenta.nombre, rol: cuenta.rol };
    next();
}