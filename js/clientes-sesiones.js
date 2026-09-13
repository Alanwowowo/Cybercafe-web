let clientes =[
    {id: "12345678-9", nombre: "Jorge Gonzalez", correo: "jorge@ejemplo.com"},
    {id: "98765432-1", nombre: "Alvaro Herreros", correo: "alvaro@ejemplo.com"},
    {id: "32323345-5", nombre: "Pablo Paez", correo: "pablo@ejemplo.com"}
];

let computadores =["PC 01", "PC 02", "PC 03", "PC 04", "PC 05", "PC 06"];

let historial =[
    {cliente: "Jorge Gonzalez", computador: "PC 01", fecha: "2024-04-15", duracion: "300 min", monto: 10000},
    {cliente: "Pablo Paez", computador: "PC 06", fecha: "2021-08-29", duracion: "67 min", monto: 2500}
];

let sesionActiva = null;
let posicionEdicion = -1;

const clientesGuardados = localStorage.getItem("cybernet_clientes");
const historialGuardado = localStorage.getItem("cybernet_historial");
const sesionGuardada = localStorage.getItem("cybernet_sesion_activa");

if (clientesGuardados){
    clientes = JSON.parse(clientesGuardados);
}

if (historialGuardado){
    historial = JSON.parse(historialGuardado);
}

if (sesionGuardada){
    sesionActiva = JSON.parse(sesionGuardada);
}

function guardarClientes(){
    localStorage.setItem("cybernet_clientes", JSON.stringify(clientes));
}

function guardarHistorial(){
    localStorage.setItem("cybernet_historial", JSON.stringify(historial));
}

const formularioCliente = document.getElementById("form-cliente");
const tablaClientes = document.getElementById("tabla-clientes");
const buscadorClientes = document.getElementById("buscar-cliente");

function mostrarClientes(lista){
    if (!tablaClientes){
        return;
    }

    const cuerpoTabla = tablaClientes.querySelector("tbody");
    cuerpoTabla.textContent = "";

    for (let i = 0; i < lista.length; i++){
        const cliente = lista[i];
        const fila = cuerpoTabla.insertRow();

        const celdaId = fila.insertCell();
        const celdaNombre = fila.insertCell();
        const celdaCorreo = fila.insertCell();
        const celdaAcciones = fila.insertCell();

        celdaId.textContent = cliente.id;
        celdaNombre.textContent = cliente.nombre;
        celdaCorreo.textContent = cliente.correo;

        const botonEditar = document.createElement("button");
        botonEditar.type = "button";
        botonEditar.textContent = "Editar";
        botonEditar.classList.add("btn-accion-editar");
        botonEditar.dataset.idCliente = cliente.id;

        celdaAcciones.appendChild(botonEditar);
    }
}

if (tablaClientes){
    mostrarClientes(clientes);

    tablaClientes.addEventListener("click", function (evento){
        const elementoPresionado = evento.target;

        if (elementoPresionado.classList.contains("btn-accion-editar")){
            const idCliente = elementoPresionado.dataset.idCliente;

            for (let i = 0; i < clientes.length; i++){
                if (clientes[i].id === idCliente) {
                    document.getElementById("id-cliente").value = clientes[i].id;
                    document.getElementById("nombre-cliente").value = clientes[i].nombre;
                    document.getElementById("correo-cliente").value = clientes[i].correo;

                    posicionEdicion = i;
                    break;
                }
            }
        }
    });
}

if (formularioCliente){
    formularioCliente.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const id = document.getElementById("id-cliente").value.trim();
        const nombre = document.getElementById("nombre-cliente").value.trim();
        const correo = document.getElementById("correo-cliente").value.trim();

        const datosCliente ={
            id: id,
            nombre: nombre,
            correo: correo
        };

        if (posicionEdicion === -1){
            clientes.push(datosCliente);
            alert("Cliente registrado correctamente.");
        } else{
            clientes[posicionEdicion] = datosCliente;
            posicionEdicion = -1;
            alert("Cliente actualizado correctamente.");
        }

        guardarClientes();
        mostrarClientes(clientes);
        formularioCliente.reset();
    });
}

if (buscadorClientes){
    buscadorClientes.addEventListener("input", function (){
        const texto = buscadorClientes.value.toLowerCase();
        const clientesFiltrados =[];

        for (let i = 0; i < clientes.length; i++){
            const cliente = clientes[i];

            const coincideId = cliente.id.toLowerCase().includes(texto);
            const coincideNombre = cliente.nombre.toLowerCase().includes(texto);
            const coincideCorreo = cliente.correo.toLowerCase().includes(texto);

            if (coincideId || coincideNombre || coincideCorreo){
                clientesFiltrados.push(cliente);
            }
        }

        mostrarClientes(clientesFiltrados);
    });
}

const selectorCliente = document.getElementById("select-cliente");
const selectorComputador = document.getElementById("select-computador");

function cargarClientesEnSelect(){
    if (!selectorCliente){
        return;
    }

    selectorCliente.textContent = "";

    const opcionInicial = document.createElement("option");
    opcionInicial.value = "";
    opcionInicial.textContent = "Selecciona un cliente";
    selectorCliente.appendChild(opcionInicial);

    for (let i = 0; i < clientes.length; i++){
        const opcion = document.createElement("option");
        opcion.value = clientes[i].nombre;
        opcion.textContent = clientes[i].nombre;
        selectorCliente.appendChild(opcion);
    }
}

function cargarComputadoresEnSelect(){
    if (!selectorComputador){
        return;
    }

    selectorComputador.textContent = "";

    const opcionInicial = document.createElement("option");
    opcionInicial.value = "";
    opcionInicial.textContent = "Selecciona un computador";
    selectorComputador.appendChild(opcionInicial);

    for (let i = 0; i < computadores.length; i++){
        const opcion = document.createElement("option");
        opcion.value = computadores[i];
        opcion.textContent = computadores[i];
        selectorComputador.appendChild(opcion);
    }
}

function obtenerFecha(fecha){
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");

    return anio + "-" + mes + "-" + dia;
}

function obtenerHora(milisegundos){
    const fecha = new Date(milisegundos);
    const hora = String(fecha.getHours()).padStart(2, "0");
    const minutos = String(fecha.getMinutes()).padStart(2, "0");

    return hora + ":" + minutos;
}

const formularioInicio = document.getElementById("inicio-sesion");
const botonFinalizar = document.getElementById("btn-finalizar");

function mostrarSesionActiva(){
    if (!sesionActiva){
        return;
    }

    const resumenCliente = document.getElementById("resumen-cliente");

    if (resumenCliente){
        resumenCliente.textContent = sesionActiva.cliente;
        document.getElementById("resumen-computador").textContent = sesionActiva.computador;
        document.getElementById("resumen-inicio").textContent = obtenerHora(sesionActiva.horaInicio);
        document.getElementById("resumen-termino").textContent = "En curso";
        document.getElementById("resumen-duracion").textContent = "En curso";
        document.getElementById("resumen-costo-tiempo").textContent = "$0";
        document.getElementById("resumen-costo-extra").textContent = "$0";
        document.getElementById("resumen-monto-final").textContent = "$0";
    }
}

if (formularioInicio){
    cargarClientesEnSelect();
    cargarComputadoresEnSelect();
    mostrarSesionActiva();

    formularioInicio.addEventListener("submit", function (evento) {
        evento.preventDefault();

        if (sesionActiva){
            alert("Ya existe una sesión activa. Debes finalizarla primero.");
            return;
        }

        const ahora = new Date();

        sesionActiva ={
            cliente: selectorCliente.value,
            computador: selectorComputador.value,
            horaInicio: ahora.getTime(),
            fecha: obtenerFecha(ahora)
        };

        localStorage.setItem(
            "cybernet_sesion_activa",
            JSON.stringify(sesionActiva)
        );

        mostrarSesionActiva();

        alert(
            "Sesión iniciada para " +
            sesionActiva.cliente +
            " en " +
            sesionActiva.computador
        );
    });
}

if (botonFinalizar){
    botonFinalizar.addEventListener("click", function () {
        if (!sesionActiva){
            alert("Primero debes iniciar una sesión.");
            return;
        }

        const confirmarFinalizacion = confirm(
            "¿Deseas finalizar la sesión de " + sesionActiva.cliente + "?"
        );

        if (!confirmarFinalizacion){
            return;
        }

        const campoExtras = document.getElementById("costos-adicionales");
        let costosExtras = parseInt(campoExtras.value);

        if (isNaN(costosExtras)){
            costosExtras = 0;
        }

        const horaTermino = new Date().getTime();
        let duracion = Math.ceil(
            (horaTermino - sesionActiva.horaInicio) / 60000
        );

        if (duracion < 1){
            duracion = 1;
        }

        const tarifaPorMinuto = 25;
        const costoTiempo = duracion * tarifaPorMinuto;
        const montoFinal = costoTiempo + costosExtras;

        document.getElementById("resumen-cliente").textContent = sesionActiva.cliente;
        document.getElementById("resumen-computador").textContent = sesionActiva.computador;
        document.getElementById("resumen-inicio").textContent = obtenerHora(sesionActiva.horaInicio);
        document.getElementById("resumen-termino").textContent = obtenerHora(horaTermino);
        document.getElementById("resumen-duracion").textContent = duracion + " min";
        document.getElementById("resumen-costo-tiempo").textContent = "$" + costoTiempo;
        document.getElementById("resumen-costo-extra").textContent = "$" + costosExtras;
        document.getElementById("resumen-monto-final").textContent = "$" + montoFinal;

        const nuevaSesion ={
            cliente: sesionActiva.cliente,
            computador: sesionActiva.computador,
            fecha: sesionActiva.fecha,
            duracion: duracion + " min",
            monto: montoFinal
        };

        historial.push(nuevaSesion);
        guardarHistorial();

        localStorage.removeItem("cybernet_sesion_activa");
        sesionActiva = null;
        campoExtras.value = "0";
    });
}

const cuerpoHistorial = document.getElementById("tabla-body-historial");
const filtroCliente = document.getElementById("filtro-cliente");
const filtroEquipo = document.getElementById("filtro-equipo");
const filtroFecha = document.getElementById("filtro-fecha");

function mostrarHistorial(lista){
    if (!cuerpoHistorial){
        return;
    }

    cuerpoHistorial.textContent = "";

    for (let i = 0; i < lista.length; i++){
        const sesion = lista[i];
        const fila = cuerpoHistorial.insertRow();

        fila.insertCell().textContent = sesion.cliente;
        fila.insertCell().textContent = sesion.computador;
        fila.insertCell().textContent = sesion.fecha;
        fila.insertCell().textContent = sesion.duracion;
        fila.insertCell().textContent = "$" + sesion.monto;
    }
}

function aplicarFiltrosHistorial(){
    const sesionesFiltradas = [];
    const clienteBuscado = filtroCliente.value.toLowerCase();
    const equipoBuscado = filtroEquipo.value.toLowerCase();
    const fechaBuscada = filtroFecha.value;

    for (let i = 0; i < historial.length; i++){
        const sesion = historial[i];

        const coincideCliente = sesion.cliente
            .toLowerCase()
            .includes(clienteBuscado);

        const coincideEquipo = sesion.computador
            .toLowerCase()
            .includes(equipoBuscado);

        const coincideFecha =
            fechaBuscada === "" || sesion.fecha === fechaBuscada;

        if (coincideCliente && coincideEquipo && coincideFecha){
            sesionesFiltradas.push(sesion);
        }
    }

    mostrarHistorial(sesionesFiltradas);
}

if (cuerpoHistorial){
    mostrarHistorial(historial);

    filtroCliente.addEventListener("input", aplicarFiltrosHistorial);
    filtroEquipo.addEventListener("input", aplicarFiltrosHistorial);
    filtroFecha.addEventListener("change", aplicarFiltrosHistorial);
}