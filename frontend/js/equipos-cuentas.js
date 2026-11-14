/* Mapa de equipos */
function gestionMapaEquipos() {
    return {
        computadores: [],
        filtroEstado: "todos",

        async iniciar() {
            try {
                const sesion = await window.sesionCyberNetLista;
                if (!sesion) return;

                this.computadores = await sesion.listarEquipos({ paraMapa: true });
            } catch {
                alert("No se pudo cargar el mapa de equipos.");
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

            if (estado === "reservado") {
                return "Reservado";
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

            if (estado === "reservado") {
                return "punto-reservado";
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
        mensajeComputadores: "Cargando equipos...",
        tarifaHora: "",
        guardandoTarifa: false,
        mensajeTarifa: "",
        formularioVisible: false,
        guardandoComputador: false,
        idEdicion: null,

        nombre: "",
        estado: "disponible",
        ubicacion: "Sala principal",
        busqueda: "",
        filtroEstado: "todos",
        orden: "nombre-asc",

        async iniciar() {
            try {
                const sesion = await window.sesionCyberNetLista;
                if (!sesion) return;

                this.computadores = await sesion.listarEquipos({ paraMapa: true });
                this.mensajeComputadores = "Listado de MongoDB";
            } catch {
                this.mensajeComputadores = "No se pudo cargar el listado de equipos.";
            }

            await this.cargarTarifa();
        },

        async cargarTarifa() {
            try {
                const sesion = await window.sesionCyberNetLista;
                if (!sesion) return;

                const tarifa = await sesion.obtenerTarifa();
                this.tarifaHora = tarifa.tarifaHora;
            } catch {
                this.mensajeTarifa = "No se pudo cargar la tarifa.";
            }
        },

        async guardarTarifa() {
            if (this.guardandoTarifa) return;

            this.guardandoTarifa = true;
            this.mensajeTarifa = "";

            try {
                const sesion = await window.sesionCyberNetLista;
                if (!sesion) throw new Error("Recarga la página para verificar tu sesión.");

                const tarifa = await sesion.actualizarTarifa(Number(this.tarifaHora));
                this.tarifaHora = tarifa.tarifaHora;
                this.mensajeTarifa = "Tarifa guardada.";
            } catch (error) {
                this.mensajeTarifa = error.message || "No se pudo guardar la tarifa.";
            } finally {
                this.guardandoTarifa = false;
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

        async guardarComputador() {
            if (this.guardandoComputador) return;

            const id = this.idEdicion;
            const nombre = this.nombre.trim();
            const ubicacion = this.ubicacion.trim();

            if (!nombre || !ubicacion) {
                alert("Ingresa el nombre y la ubicación del computador.");
                return;
            }

            this.guardandoComputador = true;
            try {
                const sesion = await window.sesionCyberNetLista;
                if (!sesion) throw new Error("Recarga la página para verificar tu sesión.");

                if (id === null) {
                    const equipo = await sesion.crearEquipo({ nombre, ubicacion });
                    this.computadores.push(equipo);
                    this.mensajeComputadores = "Equipo agregado: " + equipo.nombre;
                } else {
                    const cambios = { nombre, ubicacion };
                    const computador = this.computadores.find(actual => actual.id === id);

                    if (computador && this.estado !== computador.estado) {
                        cambios.estado = this.estado;
                    }

                    const equipo = await sesion.editarEquipo(id, cambios);

                    this.computadores = this.computadores.map(
                        actual => actual.id === id ? equipo : actual
                    );

                    this.mensajeComputadores = "Equipo actualizado: " + equipo.nombre;
                }

                this.formularioVisible = false;
                this.idEdicion = null;
            } catch (error) {
                alert(error.message || "No se pudo guardar el equipo.");
            } finally {
                this.guardandoComputador = false;
            }
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
            if (this.guardandoComputador) return;

            const computador = this.computadores.find(equipo => equipo.id === id);
            if (!computador) return;

            if (computador.estado === "ocupado") {
                alert("No puedes editar este computador mientras tenga una sesión activa.");
                return;
            }

            this.idEdicion = computador.id;
            this.nombre = computador.nombre;
            this.ubicacion = computador.ubicacion;
            this.estado = computador.estado;
            this.formularioVisible = true;
        },

        async cambiarEstadoComputador(computador) {
            if (this.guardandoComputador || computador.estado === "ocupado") return;

            const estado = computador.estado === "fuera-servicio"
                ? "disponible"
                : "fuera-servicio";

            this.guardandoComputador = true;

            try {
                const sesion = await window.sesionCyberNetLista;
                if (!sesion) throw new Error("Recarga la página para verificar tu sesión.");

                const equipo = await sesion.editarEquipo(computador.id, { estado });
                this.computadores = this.computadores.map(
                    actual => actual.id === equipo.id ? equipo : actual
                );

                this.mensajeComputadores = equipo.nombre + ": " + this.textoEstado(equipo.estado);
            } catch (error) {
                this.mensajeComputadores = error.message || "No se pudo cambiar el estado.";
            } finally {
                this.guardandoComputador = false;
            }
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

            if (estado === "reservado") {
                return "Reservado";
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

            if (estado === "reservado") {
                return "punto-reservado";
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
        contrasena: "",
        guardandoCuenta: false,

        async iniciar() {
            try {
                const sesion = await window.sesionCyberNetLista;
                if (!sesion) return;

                const cuentas = await sesion.listarCuentas();
                const roles = new Map([
                    ["administrador", "Administrador"],
                    ["encargado", "Encargado"]
                ]);

                this.cuentas = cuentas.map(cuenta => ({
                    ...cuenta,
                    rol: roles.get(cuenta.rol) ?? cuenta.rol
                }));
            } catch (error) {
                alert(error.message);
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
            this.contrasena = "";
        },

        cancelarFormulario() {
            this.formularioVisible = false;
            this.idEdicion = null;
            this.nombre = "";
            this.correo = "";
            this.rol = "Encargado";
            this.estado = "activa";
            this.contrasena = "";
        },

        async guardarCuenta() {
            if (this.guardandoCuenta) return;

            const { idEdicion, nombre, correo, rol, estado, contrasena } = this;
            this.guardandoCuenta = true;

            try {
                const sesion = await window.sesionCyberNetLista;
                if (!sesion) throw new Error("Recarga la página para verificar tu sesión.");

                const cambios = { nombre, correo };

                if (idEdicion !== null && rol === "Encargado" && contrasena !== "") {
                    cambios.contrasena = contrasena;
                }

                const cuenta = idEdicion === null
                    ? await sesion.crearCuenta({ nombre, correo, rol, estado, contrasena })
                    : await sesion.editarCuenta(idEdicion, cambios);

                const cuentaVisible = {
                    ...cuenta,
                    rol: cuenta.rol === "administrador" ? "Administrador" : "Encargado"
                };

                if (idEdicion === null) {
                    this.cuentas.push(cuentaVisible);
                } else {
                    this.cuentas = this.cuentas.map(actual =>
                        actual.id === idEdicion ? cuentaVisible : actual
                    );
                }

                this.cancelarFormulario();
            } catch (error) {
                alert(error.message || "No se pudo guardar la cuenta.");
            } finally {
                this.guardandoCuenta = false;
            }
        },

        async cambiarEstadoCuenta(id) {
            if (this.guardandoCuenta || this.formularioVisible) return;

            const cuenta = this.cuentas.find(actual => actual.id === id);
            if (!cuenta || cuenta.rol !== "Encargado") return;

            const estado = cuenta.estado === "activa" ? "inactiva" : "activa";
            const accion = estado === "inactiva" ? "Desactivar" : "Activar";
            if (!confirm(`¿${accion} la cuenta de ${cuenta.nombre}?`)) return;

            this.guardandoCuenta = true;

            try {
                const sesion = await window.sesionCyberNetLista;
                if (!sesion) throw new Error("Recarga la página para verificar tu sesión.");

                const actualizada = await sesion.cambiarEstadoCuenta(id, estado);
                cuenta.estado = actualizada.estado;
            } catch (error) {
                alert(error.message || "No se pudo cambiar el estado.");
            } finally {
                this.guardandoCuenta = false;
            }
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
            this.contrasena = "";
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