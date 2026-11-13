import jwt from "jsonwebtoken";
import { createHash, randomBytes } from "node:crypto";

function claveFirma() {
    const secreto = process.env.JWT_SECRET ?? "";
    if (!/^[0-9a-f]{64}$/i.test(secreto)) {
        throw new Error("Configura JWT_SECRET en backend/.env.");
    }
    return Buffer.from(secreto, "hex");
}

export function crearTokenAcceso(usuarioId, versionAcceso) {
    return jwt.sign({ versionAcceso }, claveFirma(), {
        algorithm: "HS256",
        subject: usuarioId,
        issuer: "cybernet",
        audience: "cybernet-web",
        expiresIn: "10m",
    });
}

export function verificarTokenAcceso(token) {
    const datos = jwt.verify(token, claveFirma(), {
        algorithms: ["HS256"],
        issuer: "cybernet",
        audience: "cybernet-web",
    });

    if (typeof datos.sub !== "string" ||
        !/^[0-9a-f]{24}$/i.test(datos.sub) ||
        !Number.isInteger(datos.exp)) {
        throw new Error("Token inválido.");
    }

    const versionAcceso = datos.versionAcceso ?? 0;
    if (!Number.isSafeInteger(versionAcceso) || versionAcceso < 0) {
        throw new Error("Token inválido.");
    }

    return { id: datos.sub, versionAcceso };
}

export const DURACION_REFRESH_MS = 7 * 24 * 60 * 60 * 1000;

export function crearRefreshToken() {
    return randomBytes(32).toString("base64url");
}

export function hashRefresh(token) {
    return createHash("sha256").update(token).digest("hex");
}