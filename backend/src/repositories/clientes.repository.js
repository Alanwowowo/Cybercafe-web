import { baseDatos } from "../db.js";

const clientes = baseDatos.collection("clientes");

export async function prepararClientes() {
    await clientes.createIndex(
        { rut: 1 },
        { unique: true, name: "rut_cliente_unico" }
    );
    await clientes.createIndex(
        { correo: 1 },
        { unique: true, name: "correo_cliente_unico" }
    );
}

export function buscarClientes() {
    return clientes.find({}, {
        projection: { nombre: 1, rut: 1, correo: 1 },
    }).sort({ nombre: 1, _id: 1 }).toArray();
}

export async function insertarCliente(cliente) {
    const resultado = await clientes.insertOne(cliente);
    return resultado.insertedId.toString();
}