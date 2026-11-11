import express from "express";
import { verificarMongo } from "./db.js";
import { prepararCuentas } from "./repositories/cuentas.repository.js";

const app = express();

app.get("/api/health", async (req, res) => {
    try {
        await verificarMongo();
        res.json({ ok: true, mongo: "conectado" });
    } catch {
        res.status(503).json({ ok: false, mongo: "no disponible" });
    }
});

const indice = await prepararCuentas();
console.log("Índice de cuentas listo:", indice);

app.listen(3000, "127.0.0.1", () => {
    console.log("API de CyberNet en http://127.0.0.1:3000");
});