const nombreCache = "cybernet-v4";

const archivosCache = [
    "/",
    "/index.html",
    "/manifest.json",

    "/imagenes/iconos/icono-192.png",
    "/imagenes/iconos/icono-512.png",

    "/css/estilos.css",
    "/css/login.css",
    "/css/paneles.css",
    "/css/equipos-cuentas.css",
    "/css/clientes-sesiones.css",
    "/css/sidebar.css",

    "/js/aplicacion.js",
    "/js/paneles.js",
    "/js/equipos-cuentas.js",
    "/js/clientes-sesiones.js",
    "/js/pwa.js",
    "/js/alpine.min.js",

    "/paginas/gestion-clientes.html",
    "/paginas/gestion-computadores.html",
    "/paginas/gestion-cuentas.html",
    "/paginas/historial.html",
    "/paginas/inicio-admin.html",
    "/paginas/inicio-encargado.html",
    "/paginas/mapa-equipos.html",
    "/paginas/sesion.html",
    "/paginas/offline.html"
];

self.addEventListener("install", function (evento) {
    evento.waitUntil(
        caches.open(nombreCache)
            .then(function (cache) {
                return cache.addAll(archivosCache);
            })
    );

    self.skipWaiting();
});

self.addEventListener("activate", function (evento) {
    evento.waitUntil(
        caches.keys()
            .then(function (nombres) {
                return Promise.all(
                    nombres
                        .filter(function (nombre) {
                            return nombre !== nombreCache;
                        })
                        .map(function (nombre) {
                            return caches.delete(nombre);
                        })
                );
            })
    );

    self.clients.claim();
});

self.addEventListener("fetch", function (evento) {
    if (evento.request.method !== "GET") {
        return;
    }

    evento.respondWith(
        fetch(evento.request)
            .then(function (respuesta) {
                if (respuesta.status !== 200 || respuesta.type !== "basic") {
                    return respuesta;
                }

                const copiaRespuesta = respuesta.clone();

                caches.open(nombreCache)
                    .then(function (cache) {
                        cache.put(evento.request, copiaRespuesta);
                    });

                return respuesta;
            })
            .catch(function () {
                return caches.match(evento.request)
                    .then(function (respuestaGuardada) {
                        if (respuestaGuardada) {
                            return respuestaGuardada;
                        }

                        if (evento.request.mode === "navigate") {
                            return caches.match("/paginas/offline.html");
                        }
                    });
            })
    );
});