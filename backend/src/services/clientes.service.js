import {
    buscarClientes,
    insertarCliente,
} from "../repositories/clientes.repository.js";

export async function listarClientes() {
    const clientes = await buscarClientes();

    return clientes.map(cliente => ({
        id: cliente._id.toString(),
        rut: cliente.rut,
        nombre: cliente.nombre,
        correo: cliente.correo,
    }));
}

export async function registrarCliente(datos) {
    const rut = typeof datos?.rut === "string"
        ? datos.rut.trim().toUpperCase()
        : "";
    const nombre = typeof datos?.nombre === "string"
        ? datos.nombre.trim()
        : "";
    const correo = typeof datos?.correo === "string"
        ? datos.correo.trim().toLowerCase()
        : "";

    const formatoRut = /^(?:\d{1,2}\.\d{3}\.\d{3}|\d{7,8})-[0-9K]$/;
    const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
        !formatoRut.test(rut) ||
        !nombre || nombre.length > 80 ||
        correo.length > 254 || !formatoCorreo.test(correo)
    ) {
        return null;
    }

    const cliente = { rut: rut.replace(/\./g, ""), nombre, correo };
    const id = await insertarCliente(cliente);

    return { id, ...cliente };
}