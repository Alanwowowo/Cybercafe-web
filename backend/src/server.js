import express from "express";
import { verificarMongo } from "./db.js";
import { prepararCuentas } from "./repositories/cuentas.repository.js";
import { login, refresh, logout } from "./controllers/auth.controller.js";
import { requerirAuth } from "./middleware/requerir-auth.js";
import { prepararSesionesAcceso } from "./repositories/sesiones-acceso.repository.js";
import { fileURLToPath } from "node:url";
import { obtenerEquipos, crearEquipo, modificarEquipo, obtenerEquiposParaMapa  } from "./controllers/equipos.controller.js";
import { prepararEquipos } from "./repositories/equipos.repository.js";
import { obtenerCuentas, crearCuenta, modificarCuenta } from "./controllers/cuentas.controller.js";

const app = express();

app.get("/api/equipos", requerirAuth, obtenerEquipos);
app.get("/api/mapa-equipos", requerirAuth, obtenerEquiposParaMapa);
app.get("/api/cuentas", requerirAuth, obtenerCuentas);
app.post("/api/cuentas", requerirAuth, express.json({ limit: "4kb" }), crearCuenta);
app.patch("/api/cuentas/:id", requerirAuth, express.json({ limit: "4kb" }), modificarCuenta);
app.post("/api/equipos", requerirAuth, express.json({ limit: "4kb" }), crearEquipo);
app.patch("/api/equipos/:id", requerirAuth, express.json({ limit: "4kb" }), modificarEquipo);
app.post("/api/auth/login", express.json({ limit: "4kb" }), login);

app.get("/api/auth/me", requerirAuth, (req, res) => {
    res.json({ usuario: req.usuario });
});

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

await prepararSesionesAcceso();
await prepararEquipos();

app.post("/api/auth/refresh", refresh);
app.post("/api/auth/logout", logout);

const rutaFrontend = fileURLToPath(new URL("../../frontend/", import.meta.url));
app.use(express.static(rutaFrontend));

app.listen(3000, "127.0.0.1", () => {
    console.log("API de CyberNet en http://127.0.0.1:3000");
});