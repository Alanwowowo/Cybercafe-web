import { cerrarMongo } from "./db.js";
import { validarCredenciales } from "./services/auth.service.js";

const { ADMIN_CORREO: correo, ADMIN_CONTRASENA: contrasena } = process.env;

try {
    const correcta = await validarCredenciales(correo, contrasena);
    const incorrecta = await validarCredenciales(correo, contrasena + "-error");

    console.log("¿Aceptó la clave correcta?", Boolean(correcta));
    console.log("¿Rechazó la clave incorrecta?", incorrecta === null);
} finally {
    await cerrarMongo();
}