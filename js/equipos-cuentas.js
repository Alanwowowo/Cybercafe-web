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
            estado: "disponible",
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
            estado: "disponible",
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

        tieneSesionActiva(computador) {
            const guardadas = localStorage.getItem(
                "cybernet_sesiones_activas"
            );

            const sesiones = guardadas
                ? JSON.parse(guardadas)
                : [];

            return sesiones.some((sesion) => {
                const coincideId =
                    sesion.computadorId !== undefined &&
                    String(sesion.computadorId) ===
                        String(computador.id);

                const coincideNombre =
                    sesion.computador === computador.nombre;

                return coincideId || coincideNombre;
            });
        },

        editarComputador(id) {
            const computador = this.computadores.find(
                (computador) => computador.id === id
            );

            if (!computador) {
                return;
            }

            if (this.tieneSesionActiva(computador)) {
                alert(
                    "No puedes editar este computador " +
                    "mientras tenga una sesión activa."
                );
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

            if (this.tieneSesionActiva(computador)) {
                alert(
                    "No puedes eliminar este computador " +
                    "mientras tenga una sesión activa."
                );
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
function obtenerCuentasIniciales() {
    return [
        {
            id: 1,
            nombre: "Jaimito Rios",
            correo: "admin@cybernet.com",
            rol: "Administrador",
            estado: "activa"
        },
        {
            id: 2,
            nombre: "Elianny Ortega",
            correo: "elianny.ortega@cybernet.com",
            rol: "Encargado",
            estado: "activa"
        },
        {
            id: 3,
            nombre: "Roberto Carlos",
            correo: "roberto.carlos@cybernet.com",
            rol: "Encargado",
            estado: "inactiva"
        }
    ];
}

function gestionCuentas() {
    return {
        cuentas: [],
        formularioVisible: false,
        idEdicion: null,

        nombre: "",
        correo: "",
        rol: "Encargado",
        estado: "activa",
        busqueda: "",
        filtroRol: "todos",
        filtroEstado: "todos",
        orden: "nombre-asc",

        iniciar() {
            const guardadas = localStorage.getItem("cybernet_cuentas");

            if (guardadas) {
                this.cuentas = JSON.parse(guardadas);
            } else {
                this.cuentas = obtenerCuentasIniciales();
                this.guardarEnStorage();
            }
        },

        guardarEnStorage() {
            localStorage.setItem(
                "cybernet_cuentas",
                JSON.stringify(this.cuentas)
            );
        },

        abrirFormulario() {
            this.idEdicion = null;
            this.nombre = "";
            this.correo = "";
            this.rol = "Encargado";
            this.estado = "activa";
            this.formularioVisible = true;
        },

        cancelarFormulario() {
            this.formularioVisible = false;
            this.idEdicion = null;
            this.nombre = "";
            this.correo = "";
            this.rol = "Encargado";
            this.estado = "activa";
        },

        guardarCuenta() {
            const nombreLimpio = this.nombre.trim();
            const correoLimpio = this.correo.trim().toLowerCase();

            if (nombreLimpio === "" || correoLimpio === "") {
                alert("Debes completar el nombre y el correo.");
                return;
            }

            const correoRepetido = this.cuentas.some((cuenta) =>
                cuenta.correo.toLowerCase() === correoLimpio &&
                cuenta.id !== this.idEdicion
            );

            if (correoRepetido) {
                alert("Ya existe una cuenta con ese correo.");
                return;
            }

            if (this.idEdicion === null) {
                this.cuentas.push({
                    id: Date.now(),
                    nombre: nombreLimpio,
                    correo: correoLimpio,
                    rol: this.rol,
                    estado: this.estado
                });
            } else {
                const indice = this.cuentas.findIndex(
                    (cuenta) => cuenta.id === this.idEdicion
                );

                this.cuentas.splice(indice, 1, {
                    id: this.idEdicion,
                    nombre: nombreLimpio,
                    correo: correoLimpio,
                    rol: this.rol,
                    estado: this.estado
                });
            }

            this.guardarEnStorage();
            this.cancelarFormulario();
        },

        editarCuenta(id) {
            const cuenta = this.cuentas.find((cuenta) => cuenta.id === id);

            if (!cuenta) {
                return;
            }

            this.idEdicion = cuenta.id;
            this.nombre = cuenta.nombre;
            this.correo = cuenta.correo;
            this.rol = cuenta.rol;
            this.estado = cuenta.estado;
            this.formularioVisible = true;
        },

        eliminarCuenta(id) {
            const cuenta = this.cuentas.find((cuenta) => cuenta.id === id);

            if (!cuenta) {
                return;
            }

            const cuentaIdActiva = sessionStorage.getItem("cuentaId");

            if (
                cuentaIdActiva !== null &&
                String(cuenta.id) === String(cuentaIdActiva)
            ) {
                alert(
                    "No puedes eliminar tu propia cuenta " +
                    "mientras tienes una sesión activa."
                );
                return;
            }

            const confirmar = confirm(
                "¿Deseas eliminar la cuenta de " + cuenta.nombre + "?"
            );

            if (!confirmar) {
                return;
            }

            this.cuentas = this.cuentas.filter(
                (cuenta) => cuenta.id !== id
            );

            this.guardarEnStorage();
        },

        get cuentasVisibles() {
            const texto = this.busqueda.trim().toLowerCase();

            const resultado = this.cuentas.filter((cuenta) => {
                const coincideTexto =
                    cuenta.nombre.toLowerCase().includes(texto) ||
                    cuenta.correo.toLowerCase().includes(texto);

                const coincideRol =
                    this.filtroRol === "todos" ||
                    cuenta.rol === this.filtroRol;

                const coincideEstado =
                    this.filtroEstado === "todos" ||
                    cuenta.estado === this.filtroEstado;

                return coincideTexto && coincideRol && coincideEstado;
            });

            return resultado.sort((a, b) => {
                if (this.orden === "nombre-desc") {
                    return b.nombre.localeCompare(a.nombre);
                }

                if (this.orden === "correo") {
                    return a.correo.localeCompare(b.correo);
                }

                return a.nombre.localeCompare(b.nombre);
            });
        },

        textoEstado(estado) {
            return estado === "activa" ? "Activa" : "Inactiva";
        },

        claseEstado(estado) {
            return estado === "activa"
                ? "punto-activa"
                : "punto-inactiva";
        }
    };
}