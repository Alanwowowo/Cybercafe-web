import { listarClientes, registrarCliente } from "../services/clientes.service.js";

function puedeGestionarClientes(usuario) {
    return ["administrador", "encargado"].includes(usuario?.rol);
}

export async function obtenerClientes(req, res) {
    if (!puedeGestionarClientes(req.usuario)) {
        return res.status(403).json({ mensaje: "No tienes permiso para ver clientes." });
    }

    return res.json(await listarClientes());
}

export async function crearCliente(req, res, next) {
    if (!puedeGestionarClientes(req.usuario)) {
        return res.status(403).json({ mensaje: "No tienes permiso para registrar clientes." });
    }

    try {
        const cliente = await registrarCliente(req.body);
        if (!cliente) {
            return res.status(400).json({ mensaje: "Revisa el RUT, el nombre y el correo." });
        }

        return res.status(201).json(cliente);
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(409).json({ mensaje: "Ya existe un cliente con ese RUT o correo." });
        }

        return next(error);
    }
}