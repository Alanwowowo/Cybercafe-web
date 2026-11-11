import express from "express";

const app = express();

app.get("/api/health", (req, res) => {
    res.json({ ok: true });
});

app.listen(3000, "127.0.0.1", () => {
    console.log("API de CyberNet en http://127.0.0.1:3000");
});