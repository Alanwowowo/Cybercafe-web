import { buscarEquipos, insertarEquipo } from "../repositories/equipos.repository.js";

export async function listarEquipos() {
    const equipos = await buscarEquipos();

    return equipos.map((equipo) => ({
        id: equipo._id.toString(),
        nombre: equipo.nombre,
        estado: equipo.estado,
        ubicacion: equipo.ubicacion,
    }));
}

export async function registrarEquipo(datos) {
    const nombre = typeof datos?.nombre === "string" ? datos.nombre.trim() : "";
    const ubicacion = typeof datos?.ubicacion === "string" ? datos.ubicacion.trim() : "";

    if (!nombre || nombre.length > 80 || !ubicacion || ubicacion.length > 120) {
        return null;
    }

    const equipo = { nombre, ubicacion, estado: "disponible" };
    const id = await insertarEquipo(equipo);

    return { id, nombre, ubicacion, estado: equipo.estado };
}