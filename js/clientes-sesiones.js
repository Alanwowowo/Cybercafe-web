let clientes = JSON.parse(localStorage.getItem("cybernet_clientes")) || [
    {id: "12345678-9", nombre: "Jorge Gonzalez", correo: "Jorge@ejemplo.com"},
    {id: "98765432-1", nombre: "Alvaro Herreros", correo: "Alvaro@ejemplo.com"},
    {id: "32323345-5", nombre: "Pablo Paez", correo: "Gavi@ejemplo.com"}
];

let computadores = ["PC 01", "PC 02", "PC 03", "PC 04", "PC 05", "PC 06"];

let historial = JSON.parse(localStorage.getItem("cybernet_historial")) || [
    {cliente: "Jorge Gonzalez", computador: "PC 01", fecha: "2024-04-15", duracion: "300 min", monto: 10000},
    {cliente: "Pablo Paez", computador: "PC 06", fecha: "2021-08-29", duracion: "67 min", monto: 2500}
];

let sesionActiva = JSON.parse(localStorage.getItem("cybernet_sesion_activa")) || null;
let posicionEdicion = -1;

function guardarClientes(){
    localStorage.setItem("cybernet_clientes", JSON.stringify(clientes));
}

function guardarHistorial(){
    localStorage.setItem("cybernet_historial", JSON.stringify(historial));
}

const selectCliente = document.getElementById("select-cliente");
const selectPC = document.getElementById("select-computador");

function cargarSelectClientes(){
    if (selectCliente){
        selectCliente.innerHTML = '<option value="">Selecciona un cliente</option>';
        for (let i = 0; i < clientes.length; i++){
            selectCliente.innerHTML += `<option value="${clientes[i].nombre}">${clientes[i].nombre}</option>`;
        }
    }
}

const formCliente = document.getElementById("form-cliente");
const tablaClientes = document.getElementById("tabla-clientes");

if (formCliente && tablaClientes){
    const tbody = tablaClientes.querySelector("tbody");

    function cargarTablaClientes(lista){
        if (!lista){
            lista = clientes;
        }
        tbody.innerHTML = "";
        for (let i = 0; i < lista.length; i++){
            let c = lista[i];
            tbody.innerHTML += `
                <tr>
                    <td>${c.id}</td>
                    <td>${c.nombre}</td>
                    <td>${c.correo}</td>
                    <td>
                        <button class="btn-accion-editar" onclick="editarCliente('${c.id}')">Editar</button>
                    </td>
                </tr>
            `;
        }
    }

    cargarTablaClientes();

    formCliente.addEventListener("submit", function(e){
        e.preventDefault();
        let idVal = document.getElementById("id-cliente").value;
        let nomVal = document.getElementById("nombre-cliente").value;
        let correoVal = document.getElementById("correo-cliente").value;

        if (posicionEdicion === -1){
            clientes.push({id: idVal, nombre: nomVal, correo: correoVal});
            alert("Cliente registrado correctamente.");
        }else{
            clientes[posicionEdicion] = {id: idVal, nombre: nomVal, correo: correoVal};
            posicionEdicion = -1;
            alert("Cliente actualizado correctamente.");
        }
        
        guardarClientes();
        cargarTablaClientes();
        cargarSelectClientes();
        formCliente.reset();
    });

    window.editarCliente = function(clienteId){
        for (let i = 0; i < clientes.length; i++){
            if (clientes[i].id === clienteId){
                let c = clientes[i];
                document.getElementById("id-cliente").value = c.id;
                document.getElementById("nombre-cliente").value = c.nombre;
                document.getElementById("correo-cliente").value = c.correo;
                posicionEdicion = i;
                break;
            }
        }
    };

    const buscarInput = document.getElementById("buscar-cliente");
    if (buscarInput){
        buscarInput.addEventListener("keyup", function(){
            let texto = buscarInput.value.toLowerCase();
            let filtrados = [];
            for (let i = 0; i < clientes.length; i++){
                let c = clientes[i];
                if (c.id.toLowerCase().includes(texto) || c.nombre.toLowerCase().includes(texto) || c.correo.toLowerCase().includes(texto)){
                    filtrados.push(c);
                }
            }
            cargarTablaClientes(filtrados);
        });
    }
}

const formInicio = document.getElementById("inicio-sesion");
if (formInicio){
    cargarSelectClientes();

    if (selectPC){
        selectPC.innerHTML = '<option value="">Selecciona un computador</option>';
        for (let i = 0; i < computadores.length; i++){
            selectPC.innerHTML += `<option value="${computadores[i]}">${computadores[i]}</option>`;
        }
    }

    function actualizarEstadoSesionUI(){
        if (sesionActiva){
            let horaInicio = new Date(sesionActiva.inicioTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            let resCliente = document.getElementById("resumen-cliente");
            if (resCliente){
                resCliente.innerText = sesionActiva.cliente;
                document.getElementById("resumen-computador").innerText = sesionActiva.computador;
                document.getElementById("resumen-inicio").innerText = horaInicio;
                document.getElementById("resumen-termino").innerText = "En curso...";
                document.getElementById("resumen-duracion").innerText = "En curso...";
                document.getElementById("resumen-costo-tiempo").innerText = "$0";
                document.getElementById("resumen-costo-extra").innerText = "$0";
                document.getElementById("resumen-monto-final").innerText = "$0";
            }
        }
    }

    actualizarEstadoSesionUI();

    formInicio.addEventListener("submit", function(e){
        e.preventDefault();
        if (sesionActiva){
            alert("Ya existe una sesión activa con " + sesionActiva.cliente + " en " + sesionActiva.computador + ". Debes finalizarla primero.");
            return;
        }
        if (selectCliente && selectPC){
            let ahora = new Date();
            sesionActiva = {
                cliente: selectCliente.value,
                computador: selectPC.value,
                inicioTime: ahora.getTime(),
                fechaStr: ahora.toISOString().split("T")[0]
            };
            localStorage.setItem("cybernet_sesion_activa", JSON.stringify(sesionActiva));
            actualizarEstadoSesionUI();
            alert("Sesión iniciada para " + sesionActiva.cliente + " en " + sesionActiva.computador);
        }
    });

    const btnFinalizar = document.getElementById("btn-finalizar");
    if (btnFinalizar){
        btnFinalizar.addEventListener("click", function(){
            if (!sesionActiva){
                alert("Primero debes seleccionar un cliente e iniciar sesión.");
                return;
            }

            let confirmar = confirm("¿Deseas finalizar la sesión de " + sesionActiva.cliente + "?");
            if (confirmar){
                let extrasInput = document.getElementById("costos-adicionales");
                let extras = 0;
                if (extrasInput && extrasInput.value){
                    extras = parseInt(extrasInput.value);
                }

                let finTime = new Date().getTime();
                let diffMin = Math.round((finTime - sesionActiva.inicioTime) / 60000);
                if (diffMin < 1){
                    diffMin = 1;
                }

                let tarifaPorMinuto = 25;
                let costoTiempo = diffMin * tarifaPorMinuto;
                let total = costoTiempo + extras;

                let horaInicioFormato = new Date(sesionActiva.inicioTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                let horaFinFormato = new Date(finTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

                document.getElementById("resumen-cliente").innerText = sesionActiva.cliente;
                document.getElementById("resumen-computador").innerText = sesionActiva.computador;
                document.getElementById("resumen-inicio").innerText = horaInicioFormato;
                document.getElementById("resumen-termino").innerText = horaFinFormato;
                document.getElementById("resumen-duracion").innerText = diffMin + " min";
                document.getElementById("resumen-costo-tiempo").innerText = "$" + costoTiempo;
                document.getElementById("resumen-costo-extra").innerText = "$" + extras;
                document.getElementById("resumen-monto-final").innerText = "$" + total;

                historial.push({
                    cliente: sesionActiva.cliente,
                    computador: sesionActiva.computador,
                    fecha: sesionActiva.fechaStr,
                    duracion: diffMin + " min",
                    monto: total
                });

                guardarHistorial();
                localStorage.removeItem("cybernet_sesion_activa");
                sesionActiva = null;

                if (extrasInput){
                    extrasInput.value = "0";
                }
            }
        });
    }
}

const tbodyHistorial = document.getElementById("tabla-body-historial");

function renderHistorial(lista){
    if (!lista){
        lista = historial;
    }
    if (tbodyHistorial){
        tbodyHistorial.innerHTML = "";
        for (let i = 0; i < lista.length; i++){
            let h = lista[i];
            tbodyHistorial.innerHTML += `
                <tr>
                    <td>${h.cliente}</td>
                    <td>${h.computador}</td>
                    <td>${h.fecha}</td>
                    <td>${h.duracion}</td>
                    <td>$${h.monto}</td>
                </tr>
            `;
        }
    }
}

if (tbodyHistorial){
    renderHistorial();

    const filtroCliente = document.getElementById("filtro-cliente");
    const filtroEquipo = document.getElementById("filtro-equipo");
    const filtroFecha = document.getElementById("filtro-fecha");

    function aplicarFiltros(){
        let valCliente = filtroCliente ? filtroCliente.value.toLowerCase() : "";
        let valEquipo = filtroEquipo ? filtroEquipo.value.toLowerCase() : "";
        let valFecha = filtroFecha ? filtroFecha.value : "";

        let filtrados = [];
        for (let i = 0; i < historial.length; i++){
            let h = historial[i];
            let coincideCliente = h.cliente.toLowerCase().includes(valCliente);
            let coincideEquipo = h.computador.toLowerCase().includes(valEquipo);
            let coincideFecha = (valFecha === "") || (h.fecha === valFecha);

            if (coincideCliente && coincideEquipo && coincideFecha){
                filtrados.push(h);
            }
        }

        renderHistorial(filtrados);
    }

    if (filtroCliente){
        filtroCliente.addEventListener("keyup", aplicarFiltros);
    }
    if (filtroEquipo){
        filtroEquipo.addEventListener("keyup", aplicarFiltros);
    }
    if (filtroFecha){
        filtroFecha.addEventListener("change", aplicarFiltros);
    }
}