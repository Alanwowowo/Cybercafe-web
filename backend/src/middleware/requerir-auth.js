import { verificarTokenAcceso } from "../tokens.js";
import { buscarCuentaActivaPorId } from "../repositories/cuentas.repository.js";

export async function requerirAuth(req, res, next) {
    res.set("Cache-Control", "no-store");

    const encabezado = req.get("Authorization") ?? "";
    const coincidencia = /^Bearer +(\S+)$/i.exec(encabezado);

    let acceso;
    try {
        if (coincidencia) acceso = verificarTokenAcceso(coincidencia[1]);
    } catch (error) {
        const codigo = error.name === "TokenExpiredError"
            ? "TOKEN_EXPIRED"
            : "TOKEN_INVALID";
        return res.set("WWW-Authenticate", "Bearer").status(401).json({ codigo });
    }

    const cuenta = acceso ? await buscarCuentaActivaPorId(acceso.id) : null;
    if (!cuenta || acceso.versionAcceso !== (cuenta.versionAcceso ?? 0)) {
        return res.set("WWW-Authenticate", "Bearer").status(401)
            .json({ codigo: "NO_AUTORIZADO" });
    }

    req.usuario = { id: acceso.id, nombre: cuenta.nombre, rol: cuenta.rol };
    next();
}