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