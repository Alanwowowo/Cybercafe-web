import { buscarEquipos, insertarEquipo, actualizarEquipo } from "../repositories/equipos.repository.js";

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

export async function editarEquipo(id, datos) {
    if (typeof id !== "string" || !/^[a-f0-9]{24}$/i.test(id)) {
        return { error: "ID_INVALIDO" };
    }

    if (!datos || typeof datos !== "object" || Array.isArray(datos)) {
        return { error: "DATOS_INVALIDOS" };
    }

    const campos = Object.keys(datos);
    const limites = { nombre: 80, ubicacion: 120 };
    const cambios = {};

    if (campos.length === 0) {
        return { error: "DATOS_INVALIDOS" };
    }

    for (const campo of campos) {
        if (!Object.hasOwn(limites, campo) || typeof datos[campo] !== "string") {
            return { error: "DATOS_INVALIDOS" };
        }

        const valor = datos[campo].trim();
        if (!valor || valor.length > limites[campo]) {
            return { error: "DATOS_INVALIDOS" };
        }

        cambios[campo] = valor;
    }

    const equipo = await actualizarEquipo(id, cambios);
    if (!equipo) return { error: "EQUIPO_NO_ENCONTRADO" };

    return {
        id: equipo._id.toString(),
        nombre: equipo.nombre,
        ubicacion: equipo.ubicacion,
        estado: equipo.estado
    };
}