import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const derivarClave = promisify(scrypt);
const opciones = { N: 2 ** 15, r: 8, p: 3, maxmem: 64 * 1024 * 1024 };

export async function generarHash(contrasena) {
    const sal = randomBytes(16);
    const hash = await derivarClave(contrasena, sal, 64, opciones);
    return `scrypt$${sal.toString("hex")}$${hash.toString("hex")}`;
}

export async function verificarContrasena(contrasena, guardado) {
    const partes = /^scrypt\$([0-9a-f]{32})\$([0-9a-f]{128})$/.exec(guardado);
    if (!partes) return false;

    const sal = Buffer.from(partes[1], "hex");
    const esperado = Buffer.from(partes[2], "hex");
    const calculado = await derivarClave(contrasena, sal, 64, opciones);

    return timingSafeEqual(calculado, esperado);
}