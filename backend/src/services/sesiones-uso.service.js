import { buscarClientePorId } from "../repositories/clientes.repository.js";
import { buscarEquipoPorId } from "../repositories/equipos.repository.js";
import { insertarSesionUso, finalizarSesionUso, buscarSesionesUsoActivas, buscarSesionUsoActivaPorId } from "../repositories/sesiones-uso.repository.js";

function idValido(id) {
    return typeof id === "string" && /^[a-f0-9]{24}$/i.test(id);
}

export async function abrirSesionUso(datos) {
    const { clienteId, equipoId } = datos ?? {};

    if (!idValido(clienteId) || !idValido(equipoId)) {
        return { error: "DATOS_INVALIDOS" };
    }

    const cliente = await buscarClientePorId(clienteId);
    if (!cliente) return { error: "CLIENTE_NO_ENCONTRADO" };

    const equipo = await buscarEquipoPorId(equipoId);
    if (!equipo) return { error: "EQUIPO_NO_ENCONTRADO" };
    if (equipo.estado !== "disponible") {
        return { error: "EQUIPO_NO_DISPONIBLE" };
    }

    try {
        const sesion = await insertarSesionUso({ clienteId, equipoId });

        return {
            sesion: {
                id: sesion._id.toString(),
                clienteId: sesion.clienteId.toString(),
                equipoId: sesion.equipoId.toString(),
                estado: sesion.estado,
                inicio: sesion.inicio,
            },
        };
    } catch (error) {
        if (error?.code === 11000) {
            return { error: "EQUIPO_OCUPADO" };
        }

        throw error;
    }
}

export async function cerrarSesionUso(id, costosAdicionales = 0) {
    if (!idValido(id)) return { error: "ID_INVALIDO" };

    if (!Number.isSafeInteger(costosAdicionales) || costosAdicionales < 0) {
        return { error: "EXTRAS_INVALIDOS" };
    }

    const activa = await buscarSesionUsoActivaPorId(id);
    if (!activa) return { error: "SESION_ACTIVA_NO_ENCONTRADA" };

    const fin = new Date();
    const tarifaHora = 1500;
    const duracionMinutos = Math.max(1, Math.ceil((fin - activa.inicio) / 60000));
    const costoTiempo = Math.round(duracionMinutos * (tarifaHora / 60));
    const monto = costoTiempo + costosAdicionales;

    if (!Number.isSafeInteger(monto)) {
        return { error: "EXTRAS_INVALIDOS" };
    }

    const sesion = await finalizarSesionUso(id, {
        fin,
        tarifaHora,
        duracionMinutos,
        costoTiempo,
        costosAdicionales,
        monto,
    });

    if (!sesion) return { error: "SESION_ACTIVA_NO_ENCONTRADA" };

    return {
        sesion: {
            id: sesion._id.toString(),
            clienteId: sesion.clienteId.toString(),
            equipoId: sesion.equipoId.toString(),
            estado: sesion.estado,
            inicio: sesion.inicio,
            fin: sesion.fin,
            tarifaHora: sesion.tarifaHora,
            duracionMinutos: sesion.duracionMinutos,
            costoTiempo: sesion.costoTiempo,
            costosAdicionales: sesion.costosAdicionales,
            monto: sesion.monto,
        },
    };
}

export async function listarSesionesUsoActivas() {
    const sesiones = await buscarSesionesUsoActivas();

    return sesiones.map(sesion => ({
        id: sesion._id.toString(),
        clienteId: sesion.clienteId.toString(),
        equipoId: sesion.equipoId.toString(),
        estado: sesion.estado,
        inicio: sesion.inicio,
    }));
}