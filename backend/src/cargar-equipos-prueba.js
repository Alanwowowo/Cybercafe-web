import { cerrarMongo } from "./db.js";
import { insertarEquipoSiNoExiste } from "./repositories/equipos.repository.js";

const uri = process.env.MONGO_URI ?? "mongodb://127.0.0.1:27017";
const mongoLocal = /^mongodb:\/\/(?:127\.0\.0\.1|localhost):27017\/?$/.test(uri);

if (!mongoLocal || process.env.NODE_ENV === "production") {
    throw new Error("Este script solo se ejecuta con MongoDB local.");
}

try {
    for (const nombre of ["PC 01", "PC 02", "PC 03"]) {
        const resultado = await insertarEquipoSiNoExiste({
            nombre,
            estado: "disponible",
            ubicacion: "Sala principal",
        });

        console.log(nombre + ": " + (resultado.upsertedCount ? "creado" : "ya existía"));
    }
} finally {
    await cerrarMongo();
}