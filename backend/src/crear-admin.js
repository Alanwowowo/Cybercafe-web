import { cerrarMongo } from "./db.js";
import { generarHash } from "./contrasenas.js";
import {
    prepararCuentas,
    insertarCuentaSiNoExiste,
} from "./repositories/cuentas.repository.js";

const correo = process.env.ADMIN_CORREO?.trim().toLowerCase();
const contrasena = process.env.ADMIN_CONTRASENA;

if (!correo || !contrasena || contrasena.length < 12) {
    throw new Error("Completa ADMIN_CORREO y ADMIN_CONTRASENA en backend/.env.");
}

try {
    await prepararCuentas();

    const resultado = await insertarCuentaSiNoExiste({
        correo,
        nombre: "Admin de prueba",
        rol: "administrador",
        estado: "activa",
        contrasenaHash: await generarHash(contrasena),
    });

    console.log(resultado.upsertedCount === 1
        ? "Cuenta de prueba creada."
        : "La cuenta ya existía. No se cambió nada.");
} finally {
    await cerrarMongo();
}