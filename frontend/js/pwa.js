if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
        navigator.serviceWorker.register("/service-worker.js")
            .then(function (registro) {
                console.log("Service Worker registrado:", registro.scope);
            })
            .catch(function (error) {
                console.log("Error al registrar el Service Worker:", error);
            });
    });
}