import { buscarEquipos } from "../repositories/equipos.repository.js";

export async function listarEquipos() {
    const equipos = await buscarEquipos();

    return equipos.map((equipo) => ({
        id: equipo._id.toString(),
        nombre: equipo.nombre,
        estado: equipo.estado,
        ubicacion: equipo.ubicacion,
    }));
}