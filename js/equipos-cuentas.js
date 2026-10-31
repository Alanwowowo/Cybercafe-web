function obtenerComputadoresIniciales() {
    return [
        {
            id: 1,
            nombre: "PC 01",
            estado: "disponible",
            ubicacion: "Sala principal"
        },
        {
            id: 2,
            nombre: "PC 02",
            estado: "ocupado",
            ubicacion: "Sala principal"
        },
        {
            id: 3,
            nombre: "PC 03",
            estado: "disponible",
            ubicacion: "Sala principal"
        },
        {
            id: 4,
            nombre: "PC 04",
            estado: "fuera-servicio",
            ubicacion: "Sala secundaria"
        },
        {
            id: 5,
            nombre: "PC 05",
            estado: "ocupado",
            ubicacion: "Sala secundaria"
        },
        {
            id: 6,
            nombre: "PC 06",
            estado: "disponible",
            ubicacion: "Sala secundaria"
        }
    ];
}

/* Mapa de equipos */
function gestionMapaEquipos() {
    return {
        computadores: [],
        filtroEstado: "todos",

        iniciar() {
            const guardados = localStorage.getItem(
                "cybernet_computadores"
            );

            if (guardados) {
                this.computadores = JSON.parse(guardados);
            } else {
                this.computadores = obtenerComputadoresIniciales();

                localStorage.setItem(
                    "cybernet_computadores",
                    JSON.stringify(this.computadores)
                );
            }
        },

        get computadoresVisibles() {
            const resultado = this.computadores.filter(
                (computador) =>
                    this.filtroEstado === "todos" ||
                    computador.estado === this.filtroEstado
            );

            return resultado.sort((a, b) =>
                a.nombre.localeCompare(
                    b.nombre,
                    "es",
                    { numeric: true }
                )
            );
        },

        textoEstado(estado) {
            if (estado === "ocupado") {
                return "En uso";
            }

            if (estado === "fuera-servicio") {
                return "Fuera de servicio";
            }

            return "Disponible";
        },

        claseEstado(estado) {
            if (estado === "ocupado") {
                return "punto-ocupado";
            }

            if (estado === "fuera-servicio") {
                return "punto-fuera-servicio";
            }

            return "punto-disponible";
        }
    };
}

/* Gestión de computadores */
function gestionComputadores() {
    return {
        computadores: [],
        formularioVisible: false,
        idEdicion: null,

        nombre: "",
        estado: "disponible",
        ubicacion: "Sala principal",
        busqueda: "",
        filtroEstado: "todos",
        orden: "nombre-asc",

        iniciar() {
            const guardados = localStorage.getItem(
                "cybernet_computadores"
            );

            if (guardados) {
                this.computadores = JSON.parse(guardados);
            } else {
                this.computadores = obtenerComputadoresIniciales();
                this.guardarEnStorage();
            }
        },

        guardarEnStorage() {
            localStorage.setItem(
                "cybernet_computadores",
                JSON.stringify(this.computadores)
            );
        },

        abrirFormulario() {
            this.idEdicion = null;
            this.nombre = "";
            this.estado = "disponible";
            this.ubicacion = "Sala principal";
            this.formularioVisible = true;
        },

        cancelarFormulario() {
            this.formularioVisible = false;
            this.idEdicion = null;
            this.nombre = "";
            this.estado = "disponible";
            this.ubicacion = "Sala principal";
        },

        guardarComputador() {
            const nombreLimpio = this.nombre.trim();

            if (nombreLimpio === "") {
                alert("Debes ingresar el nombre del computador.");
                return;
            }

            const nombreRepetido = this.computadores.some(
                (computador) =>
                    computador.nombre.toLowerCase() ===
                        nombreLimpio.toLowerCase() &&
                    computador.id !== this.idEdicion
            );

            if (nombreRepetido) {
                alert("Ya existe un computador con ese nombre.");
                return;
            }

            if (this.idEdicion === null) {
                this.computadores.push({
                    id: Date.now(),
                    nombre: nombreLimpio,
                    estado: this.estado,
                    ubicacion: this.ubicacion
                });
            } else {
                const indice = this.computadores.findIndex(
                    (computador) =>
                        computador.id === this.idEdicion
                );

                this.computadores.splice(indice, 1, {
                    id: this.idEdicion,
                    nombre: nombreLimpio,
                    estado: this.estado,
                    ubicacion: this.ubicacion
                });
            }

            this.guardarEnStorage();
            this.cancelarFormulario();
        },

        editarComputador(id) {
            const computador = this.computadores.find(
                (computador) => computador.id === id
            );

            if (!computador) {
                return;
            }

            this.idEdicion = computador.id;
            this.nombre = computador.nombre;
            this.estado = computador.estado;
            this.ubicacion = computador.ubicacion;
            this.formularioVisible = true;
        },

        eliminarComputador(id) {
            const computador = this.computadores.find(
                (computador) => computador.id === id
            );

            if (!computador) {
                return;
            }

            const confirmar = confirm(
                "¿Deseas eliminar el equipo " +
                    computador.nombre +
                    "?"
            );

            if (!confirmar) {
                return;
            }

            this.computadores = this.computadores.filter(
                (computador) => computador.id !== id
            );

            this.guardarEnStorage();
        },

        get computadoresVisibles() {
            const texto = this.busqueda.trim().toLowerCase();

            const resultado = this.computadores.filter((computador) => {
                const coincideTexto =
                    computador.nombre.toLowerCase().includes(texto) ||
                    computador.ubicacion.toLowerCase().includes(texto);

                const coincideEstado =
                    this.filtroEstado === "todos" ||
                    computador.estado === this.filtroEstado;

                return coincideTexto && coincideEstado;
            });

            return resultado.sort((a, b) => {
                if (this.orden === "nombre-desc") {
                    return b.nombre.localeCompare(
                        a.nombre,
                        "es",
                        { numeric: true }
                    );
                }

                if (this.orden === "ubicacion") {
                    return a.ubicacion.localeCompare(b.ubicacion);
                }

                return a.nombre.localeCompare(
                    b.nombre,
                    "es",
                    { numeric: true }
                );
            });
        },

        textoEstado(estado) {
            if (estado === "ocupado") {
                return "En uso";
            }

            if (estado === "fuera-servicio") {
                return "Fuera de servicio";
            }

            return "Disponible";
        },

        claseEstado(estado) {
            if (estado === "ocupado") {
                return "punto-ocupado";
            }

            if (estado === "fuera-servicio") {
                return "punto-fuera-servicio";
            }

            return "punto-disponible";
        }
    };
}

/* Gestión de cuentas */
const botonAgregarCuenta = document.getElementById(
    "boton-agregar-cuenta"
)

const formularioCuenta = document.getElementById(
    "formulario-cuenta"
)

const botonCancelarCuenta = document.getElementById(
    "boton-cancelar-cuenta"
)

if (botonAgregarCuenta && formularioCuenta && botonCancelarCuenta) {
    botonAgregarCuenta.addEventListener("click", function () {
        formularioCuenta.classList.remove("oculto");
    });

    botonCancelarCuenta.addEventListener("click", function () {
        formularioCuenta.classList.add("oculto");
        formularioCuenta.reset();
    });
}

const nombreCuenta = document.getElementById("nombre-cuenta");
const correoCuenta = document.getElementById("correo-cuenta");
const rolCuenta = document.getElementById("rol-cuenta");
const estadoCuenta = document.getElementById("estado-cuenta");
const listaCuentas = document.getElementById("lista-cuentas");

if (
    formularioCuenta &&
    nombreCuenta &&
    correoCuenta &&
    rolCuenta &&
    estadoCuenta &&
    listaCuentas
) {
    formularioCuenta.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const nombre = nombreCuenta.value.trim();
        const correo = correoCuenta.value.trim();
        const rol = rolCuenta.value;
        const estado = estadoCuenta.value;

        let textoEstado = "Activa";
        let claseEstado = "punto-activa";

        if (estado === "inactiva") {
            textoEstado = "Inactiva";
            claseEstado = "punto-inactiva";
        }

        const nuevaFila = listaCuentas.insertRow();

        const celdaNombre = nuevaFila.insertCell();
        const celdaCorreo = nuevaFila.insertCell();
        const celdaRol = nuevaFila.insertCell();
        const celdaEstado = nuevaFila.insertCell();
        const celdaAcciones = nuevaFila.insertCell();

        celdaNombre.textContent = nombre;
        celdaCorreo.textContent = correo;
        celdaRol.textContent = rol;

        const puntoEstado = document.createElement("span");
        puntoEstado.classList.add("punto-estado", claseEstado);

        celdaEstado.appendChild(puntoEstado);
        celdaEstado.append(" " + textoEstado);
        
        const botonEditar = document.createElement("button");
        botonEditar.type = "button";
        botonEditar.textContent = "Editar";
        botonEditar.classList.add("boton-editar-cuenta");

        const botonEliminar = document.createElement("button");
        botonEliminar.type = "button";
        botonEliminar.textContent = "Eliminar";
        botonEliminar.classList.add("boton-eliminar-cuenta");

        celdaAcciones.appendChild(botonEditar);
        celdaAcciones.append(" ");
        celdaAcciones.appendChild(botonEliminar);

        formularioCuenta.reset();
        formularioCuenta.classList.add("oculto");
    });
}   

if (listaCuentas) {
    listaCuentas.addEventListener("click", function (evento) {
        const elementoPresionado = evento.target;
        const filaCuenta = elementoPresionado.closest("tr");

        if (!filaCuenta) {
            return;
        }

        if (
            elementoPresionado.classList.contains(
                "boton-eliminar-cuenta"
            )
        ) {
            const nombreUsuario = filaCuenta.cells[0].textContent;

            const confirmarEliminacion = confirm(
                "¿Deseas eliminar la cuenta de " + nombreUsuario + "?"
            );

            if (confirmarEliminacion) {
                filaCuenta.remove();
            }
        }

        if (
            elementoPresionado.classList.contains(
                "boton-editar-cuenta"
            )
        ) {
            const nombreActual = filaCuenta.cells[0].textContent;
            const correoActual = filaCuenta.cells[1].textContent;
            const rolActual = filaCuenta.cells[2].textContent;

            const puntoEstado = filaCuenta.querySelector(".punto-estado");

            let estadoActual = "activa";

            if (puntoEstado.classList.contains("punto-inactiva")) {
                estadoActual = "inactiva";
            }

            const nuevoNombre = prompt(
                "Nombre del usuario:",
                nombreActual
            );

            if (nuevoNombre === null || nuevoNombre.trim() === "") {
                return;
            }

            const nuevoCorreo = prompt(
                "Correo electrónico:",
                correoActual
            );

            if (nuevoCorreo === null || nuevoCorreo.trim() === "") {
                return;
            }

            const nuevoRol = prompt(
                "Rol: Administrador o Encargado",
                rolActual
            );

            if (
                nuevoRol !== "Administrador" &&
                nuevoRol !== "Encargado"
            ) {
                alert("El rol ingresado no es válido.");
                return;
            }

            const nuevoEstado = prompt(
                "Estado: activa o inactiva",
                estadoActual
            );

            if (
                nuevoEstado !== "activa" &&
                nuevoEstado !== "inactiva"
            ) {
                alert("El estado ingresado no es válido.");
                return;
            }

            let textoEstado = "Activa";
            let claseEstado = "punto-activa";

            if (nuevoEstado === "inactiva") {
                textoEstado = "Inactiva";
                claseEstado = "punto-inactiva";
            }

            filaCuenta.cells[0].textContent = nuevoNombre.trim();
            filaCuenta.cells[1].textContent = nuevoCorreo.trim();
            filaCuenta.cells[2].textContent = nuevoRol;

            const celdaEstado = filaCuenta.cells[3];

            celdaEstado.textContent = "";
            puntoEstado.className = "punto-estado " + claseEstado;
            celdaEstado.appendChild(puntoEstado);
            celdaEstado.append(" " + textoEstado);
        }
    });
}