/* Mapa de equipos */
const filtroEstado = document.getElementById("filtro-estado");
const tarjetasEquipos = document.querySelectorAll(".tarjeta-equipo");

if (filtroEstado) {
    filtroEstado.addEventListener("change", function () {
        const estadoSeleccionado = filtroEstado.value;

        tarjetasEquipos.forEach(function (tarjeta) {
            const estadoEquipo = tarjeta.dataset.estado;

            if (
                estadoSeleccionado === "todos" ||
                estadoSeleccionado === estadoEquipo
            ) {
                tarjeta.style.display = "block";
            } else {
                tarjeta.style.display = "none";
            }
        });
    });
}

/* Gestión de computadores */
const botonAgregarComputador = document.getElementById(
    "boton-agregar-computador"
);

const formularioComputador = document.getElementById(
    "formulario-computador"
);

const botonCancelar = document.getElementById("boton-cancelar");

if (botonAgregarComputador && formularioComputador && botonCancelar) {
    botonAgregarComputador.addEventListener("click", function () {
        formularioComputador.classList.remove("oculto");
    });

    botonCancelar.addEventListener("click", function () {
        formularioComputador.classList.add("oculto");
        formularioComputador.reset();
    });
}

const nombreComputador = document.getElementById("nombre-computador");
const estadoComputador = document.getElementById("estado-computador");
const ubicacionComputador = document.getElementById(
    "ubicacion-computador"
);

const listaComputadores = document.getElementById("lista-computadores");

if (
    formularioComputador &&
    nombreComputador &&
    estadoComputador &&
    ubicacionComputador &&
    listaComputadores
) {
    formularioComputador.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const nombre = nombreComputador.value.trim();
        const estado = estadoComputador.value;
        const ubicacion = ubicacionComputador.value;

        let textoEstado = "Disponible";
        let claseEstado = "punto-disponible";

        if (estado === "ocupado") {
            textoEstado = "En uso";
            claseEstado = "punto-ocupado";
        } else if (estado === "fuera-servicio") {
            textoEstado = "Fuera de servicio";
            claseEstado = "punto-fuera-servicio";
        }

        const nuevaFila = listaComputadores.insertRow();

        const celdaNombre = nuevaFila.insertCell();
        const celdaEstado = nuevaFila.insertCell();
        const celdaUbicacion = nuevaFila.insertCell();
        const celdaAcciones = nuevaFila.insertCell();

        celdaNombre.textContent = nombre;
        celdaUbicacion.textContent = ubicacion;

        const puntoEstado = document.createElement("span");
        puntoEstado.classList.add("punto-estado", claseEstado);

        celdaEstado.appendChild(puntoEstado);
        celdaEstado.append(" " + textoEstado);

        const botonEditar = document.createElement("button");
        botonEditar.type = "button";
        botonEditar.textContent = "Editar";
        botonEditar.classList.add("boton-editar");

        const botonEliminar = document.createElement("button");
        botonEliminar.type = "button";
        botonEliminar.textContent = "Eliminar";
        botonEliminar.classList.add("boton-eliminar");

        celdaAcciones.appendChild(botonEditar);
        celdaAcciones.append(" ");
        celdaAcciones.appendChild(botonEliminar);

        formularioComputador.reset();
        formularioComputador.classList.add("oculto");
    });
}

if (listaComputadores) {
    listaComputadores.addEventListener("click", function (evento) {
        const elementoPresionado = evento.target;
        const filaComputador = elementoPresionado.closest("tr");

        if (!filaComputador) {
            return;
        }

        if (elementoPresionado.classList.contains("boton-eliminar")) {
            const nombreEquipo = filaComputador.cells[0].textContent;

            const confirmarEliminacion = confirm(
                "¿Deseas eliminar el equipo " + nombreEquipo + "?"
            );

            if (confirmarEliminacion) {
                filaComputador.remove();
            }
        }

        if (elementoPresionado.classList.contains("boton-editar")) {
            const nombreActual = filaComputador.cells[0].textContent;
            const ubicacionActual = filaComputador.cells[2].textContent;

            const puntoEstado = filaComputador.querySelector(".punto-estado");

            let estadoActual = "disponible";

            if (puntoEstado.classList.contains("punto-ocupado")) {
                estadoActual = "ocupado";
            } else if (
                puntoEstado.classList.contains("punto-fuera-servicio")
            ) {
                estadoActual = "fuera-servicio";
            }

            const nuevoNombre = prompt(
                "Nombre del equipo:",
                nombreActual
            );

            if (nuevoNombre === null || nuevoNombre.trim() === "") {
                return;
            }

            const nuevoEstado = prompt(
                "Estado: disponible, ocupado o fuera-servicio",
                estadoActual
            );

            if (
                nuevoEstado !== "disponible" &&
                nuevoEstado !== "ocupado" &&
                nuevoEstado !== "fuera-servicio"
            ) {
                alert("El estado ingresado no es válido.");
                return;
            }

            const nuevaUbicacion = prompt(
                "Ubicación del equipo:",
                ubicacionActual
            );

            if (nuevaUbicacion === null || nuevaUbicacion.trim() === "") {
                return;
            }

            let textoEstado = "Disponible";
            let claseEstado = "punto-disponible";

            if (nuevoEstado === "ocupado") {
                textoEstado = "En uso";
                claseEstado = "punto-ocupado";
            } else if (nuevoEstado === "fuera-servicio") {
                textoEstado = "Fuera de servicio";
                claseEstado = "punto-fuera-servicio";
            }

            filaComputador.cells[0].textContent = nuevoNombre.trim();
            filaComputador.cells[2].textContent = nuevaUbicacion.trim();

            const celdaEstado = filaComputador.cells[1];

            celdaEstado.textContent = "";
            puntoEstado.className = "punto-estado " + claseEstado;
            celdaEstado.appendChild(puntoEstado);
            celdaEstado.append(" " + textoEstado);
        }
    });
}