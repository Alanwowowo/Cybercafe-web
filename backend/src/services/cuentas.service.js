import { buscarCuentas } from "../repositories/cuentas.repository.js";

export async function listarCuentas() {
    const cuentas = await buscarCuentas();

    return cuentas.map(cuenta => ({
        id: cuenta._id.toString(),
        nombre: cuenta.nombre,
        correo: cuenta.correo,
        rol: cuenta.rol,
        estado: cuenta.estado
    }));
}