window.sesionCyberNetLista = (async function () {
    const paginaActual = window.location.pathname;
    document.body.style.visibility = "hidden";

    function volverAlLogin() {
        sessionStorage.removeItem("rol");
        sessionStorage.removeItem("cuentaId");
        window.location.replace("/");
    }

    window.addEventListener("pageshow", function (evento) {
        if (evento.persisted) window.location.reload();
    });

    let usuario;
    let accessToken;

    try {
        const renovacion = await fetch("/api/auth/refresh", {
            method: "POST",
            credentials: "same-origin",
        });

        if (renovacion.status === 401) return volverAlLogin();
        if (!renovacion.ok) throw new Error("No se pudo renovar la sesión");

        ({ accessToken } = await renovacion.json());
        if (typeof accessToken !== "string") throw new Error("JWT no recibido");

        const perfil = await fetch("/api/auth/me", {
            headers: { Authorization: "Bearer " + accessToken },
        });

        if (perfil.status === 401) return volverAlLogin();
        if (!perfil.ok) throw new Error("No se pudo consultar el perfil");

        ({ usuario } = await perfil.json());
    } catch {
        alert("No se pudo comprobar la sesión. Intenta iniciar sesión de nuevo.");
        return volverAlLogin();
    }

    if (!usuario?.id || !["administrador", "encargado"].includes(usuario.rol)) {
        return volverAlLogin();
    }

    const rolUsuario = usuario.rol;
    sessionStorage.setItem("rol", rolUsuario);
    sessionStorage.setItem("cuentaId", usuario.id);
    document.body.style.visibility = "";

    // 2. Ocultar enlaces del menú según el rol
    const enlaceAdministrador = document.querySelector(
        'a[href="inicio-admin.html"]'
    );

    const enlaceEncargado = document.querySelector(
        'a[href="inicio-encargado.html"]'
    );

    if (rolUsuario === "administrador" && enlaceEncargado) {
        enlaceEncargado.parentElement.style.display = "none";
    }

    if (rolUsuario === "encargado" && enlaceAdministrador) {
        enlaceAdministrador.parentElement.style.display = "none";
    }

    // Ocultar las funciones exclusivas del administrador
    if (rolUsuario === "encargado") {
        const enlacesGestionCuentas = document.querySelectorAll(
            'a[href="gestion-cuentas.html"]'
        );

        enlacesGestionCuentas.forEach(function (enlace) {
            const elementoMenu = enlace.closest("li");

            if (elementoMenu) {
                elementoMenu.style.display = "none";
            }
        });
    }

    // 3. Restricción por rol (solo se evalúa si YA hay una sesión activa)
    if (
        paginaActual.endsWith("/inicio-admin.html") &&
        rolUsuario !== "administrador"
    ) {
        window.location.replace("inicio-encargado.html");
        return;
    }

    if (
        paginaActual.endsWith("/inicio-encargado.html") &&
        rolUsuario !== "encargado"
    ) {
        window.location.replace("inicio-admin.html");
        return;
    }

    // Impedir que el encargado entre escribiendo directamente la dirección
    if (
        paginaActual.endsWith("/gestion-cuentas.html") &&
        rolUsuario !== "administrador"
    ) {
        window.location.replace("inicio-encargado.html");
        return;
    }

    // 4. Cierre de sesión para cualquier página interna
    const enlaceCerrarSesion = document.querySelector(
        'a[href="../index.html"]'
    );

    if (enlaceCerrarSesion) {
        let cerrando = false;

        enlaceCerrarSesion.addEventListener("click", async function (evento) {
            evento.preventDefault();
            if (cerrando) return;
            cerrando = true;

            try {
                const respuesta = await fetch("/api/auth/logout", {
                    method: "POST",
                    credentials: "same-origin",
                });

                if (respuesta.status !== 204) throw new Error("Logout falló");
                volverAlLogin();
            } catch {
                alert("No se pudo cerrar la sesión. Intenta de nuevo.");
            } finally {
                cerrando = false;
            }
        });
    };

    return {
        async listarEquipos({ paraMapa = false } = {}) {
            const ruta = paraMapa ? "/api/mapa-equipos" : "/api/equipos";
            const respuesta = await fetch(ruta, {
                headers: { Authorization: "Bearer " + accessToken },
                cache: "no-store",
            });

            if (!respuesta.ok) {
                throw new Error("Error al listar equipos: " + respuesta.status);
            }

            return respuesta.json();
        },

        async crearEquipo({ nombre, ubicacion }) {
            const respuesta = await fetch("/api/equipos", {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + accessToken,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ nombre, ubicacion }),
            });

            if (respuesta.status === 401) {
                throw new Error("Tu acceso venció. Recarga la página e intenta de nuevo.");
            }

            if (respuesta.status === 409) {
                throw new Error("Ya existe un equipo con ese nombre.");
            }

            if (respuesta.status === 400) {
                throw new Error("Revisa el nombre y la ubicación del equipo.");
            }

            if (!respuesta.ok) throw new Error("No se pudo crear el equipo.");

            return respuesta.json();
        },

        async editarEquipo(id, { nombre, ubicacion }) {
            const respuesta = await fetch("/api/equipos/" + encodeURIComponent(id), {
                method: "PATCH",
                headers: {
                    Authorization: "Bearer " + accessToken,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ nombre, ubicacion })
            });

            if (respuesta.status === 401) {
                throw new Error("Tu acceso venció. Recarga la página e intenta de nuevo.");
            }

            if (!respuesta.ok) {
                const error = await respuesta.json().catch(() => null);
                throw new Error(error?.mensaje || "No se pudo editar el equipo.");
            }

            return respuesta.json();
        },        
    };    
})();