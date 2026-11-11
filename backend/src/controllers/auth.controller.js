import { iniciarSesion, renovarSesion, cerrarSesion } from "../services/auth.service.js";
import { DURACION_REFRESH_MS } from "../tokens.js";

export async function login(req, res) {
    res.set("Cache-Control", "no-store");

    const { correo, contrasena } = req.body ?? {};
    const resultado = await iniciarSesion(correo, contrasena);

    if (!resultado) {
        return res.status(401).json({ mensaje: "Correo o contraseña incorrectos." });
    }

    const { usuario, accessToken, refreshToken } = resultado;

    res.cookie("cybernet_refresh", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        path: "/api/auth",
        maxAge: DURACION_REFRESH_MS,
    });

    return res.json({ usuario, accessToken });
}

export async function refresh(req, res) {
    res.set("Cache-Control", "no-store");

    const origenPermitido = process.env.APP_ORIGIN ?? "http://127.0.0.1:3000";
    if (req.get("Origin") !== origenPermitido) {
        return res.status(403).json({ mensaje: "Origen no permitido" });
    }

    const cookie = req.get("Cookie") ?? "";
    const token = /(?:^|;\s*)cybernet_refresh=([A-Za-z0-9_-]{43})(?=;|$)/
        .exec(cookie)?.[1];

    const resultado = token ? await renovarSesion(token) : null;
    if (!resultado) {
        return res.status(401).json({ mensaje: "Sesión inválida o vencida" });
    }

    res.cookie("cybernet_refresh", resultado.refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        path: "/api/auth",
        expires: resultado.venceEn,
    });

    return res.json({ accessToken: resultado.accessToken });
}

export async function logout(req, res) {
    res.set("Cache-Control", "no-store");

    const origenPermitido = process.env.APP_ORIGIN ?? "http://127.0.0.1:3000";
    if (req.get("Origin") !== origenPermitido) {
        return res.status(403).json({ mensaje: "Origen no permitido" });
    }

    const cookie = req.get("Cookie") ?? "";
    const token = /(?:^|;\s*)cybernet_refresh=([A-Za-z0-9_-]{43})(?=;|$)/
        .exec(cookie)?.[1];

    if (token) await cerrarSesion(token);

    res.clearCookie("cybernet_refresh", {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        path: "/api/auth",
    });

    return res.status(204).end();
}