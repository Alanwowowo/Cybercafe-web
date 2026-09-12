let clientes = [
    {id: "12345678-9", nombre: "Jorge Gonzalez", correo: "Jorge@ejemplo.com"},
    {id: "98765432-1", nombre: "Alvaro Herreros", correo: "Alvaro@ejemplo.com"},
    {id: "32323345-5", nombre: "Pablo Paez", correo: "Gavi@ejemplo.com"}
];

let computadores = ["PC-01", "PC-02", "PC-03", "PC-04", "PC-05", "PC-06"];

let historial = [
    {cliente: "Jorge Gonzalez", computador: "PC-01", fecha: "15-04-2024", duracion: "300 min", monto: 10000},
    {cliente: "Pablo Paez", computador: "PC-06", fecha: "29-08-2021", duracion: "67 min", monto: 2500}
];

let clienteEnSesion = "";
let pcEnSesion = "";
let posicionEdicion = -1;

const selectCliente = document.getElementById("select-cliente");
const selectPC = document.getElementById("select-computador");

function cargarSelectClientes(){
    if (selectCliente){
        selectCliente.innerHTML = "";
        for (let i = 0; i < clientes.length; i++){
            selectCliente.innerHTML += `<option value="${clientes[i].nombre}">${clientes[i].nombre}</option>`;
        }
    }
}

const formCliente = document.getElementById("form-cliente");
const buscarCliente = document.getElementById("buscar-cliente");
const tablaClientes = document.getElementById("tabla-clientes");

if (formCliente && tablaClientes){
    const tbody = tablaClientes.querySelector("tbody");

    function cargarTablaClientes(){
        tbody.innerHTML = "";
        for (let i = 0; i < clientes.length; i++){
            let c = clientes[i];
            tbody.innerHTML += `
                <tr>
                    <td>${c.id}</td>
                    <td>${c.nombre}</td>
                    <td>${c.correo}</td>
                    <td>
                        <button class="btn-accion-editar" onclick="editarCliente(${i})">Editar</button>
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
        
        cargarTablaClientes();
        cargarSelectClientes();
        formCliente.reset();
    });

    window.editarCliente = function(posicion){
        let c = clientes[posicion];
        document.getElementById("id-cliente").value = c.id;
        document.getElementById("nombre-cliente").value = c.nombre;
        document.getElementById("correo-cliente").value = c.correo;
        posicionEdicion = posicion;
    };

    const buscarInput = document.getElementById("buscar-cliente");
    if (buscarInput){
        buscarInput.addEventListener("keyup", function(){
            let texto = buscarInput.value.toLowerCase();
            tbody.innerHTML = "";

            for (let i = 0; i < clientes.length; i++){
                let c = clientes[i];
                if (c.nombre.toLowerCase().includes(texto) || c.id.toLowerCase().includes(texto)){
                    tbody.innerHTML += `
                        <tr>
                            <td>${c.id}</td>
                            <td>${c.nombre}</td>
                            <td>${c.correo}</td>
                            <td>
                                <button class="btn-accion-editar" onclick="editarCliente(${i})">Editar</button>
                            </td>
                        </tr>
                    `;
                }
            }
        });
    }
}

const formInicio = document.getElementById("inicio-sesion");
if (formInicio){
    cargarSelectClientes();

    if (selectPC){
        selectPC.innerHTML = "";
        for (let i = 0; i < computadores.length; i++){
            selectPC.innerHTML += `<option value="${computadores[i]}">${computadores[i]}</option>`;
        }
    }

    formInicio.addEventListener("submit", function(e){
        e.preventDefault();
        if (selectCliente && selectPC){
            clienteEnSesion = selectCliente.value;
            pcEnSesion = selectPC.value;
            alert("Sesion iniciada para " + clienteEnSesion + " en " + pcEnSesion);
        }
    });

    const btnFinalizar = document.getElementById("btn-finalizar");
    if (btnFinalizar){
        btnFinalizar.addEventListener("click", function(){
            if (clienteEnSesion === ""){
                alert("Primero debes seleccionar un cliente e iniciar sesion.");
                return;
            }

            let confirmar = confirm("¿Deseas finalizar la sesion de " + clienteEnSesion + "?");
            if (confirmar){
                let extrasInput = document.getElementById("costos-adicionales");
                let extras = 0;
                if (extrasInput && extrasInput.value !== ""){
                    extras = parseInt(extrasInput.value);
                }
                let tarifaBase = 1500;
                let total = tarifaBase + extras;

                let resCliente = document.getElementById("resumen-cliente");
                if (resCliente){
                    resCliente.innerText = clienteEnSesion;
                    document.getElementById("resumen-computador").innerText = pcEnSesion;
                    document.getElementById("resumen-inicio").innerText = "15:00";
                    document.getElementById("resumen-termino").innerText = "16:00";
                    document.getElementById("resumen-duracion").innerText = "60 min";
                    document.getElementById("resumen-costo-tiempo").innerText = tarifaBase;
                    document.getElementById("resumen-costo-extra").innerText = extras;
                    document.getElementById("resumen-monto-final").innerText = total;
                }

                historial.push({
                    cliente: clienteEnSesion,
                    computador: pcEnSesion,
                    fecha: "12-09-2026",
                    duracion: "60 min",
                    monto: total
                });

                if (typeof cargarHistorial === "function"){
                    cargarHistorial();
                }

                clienteEnSesion = "";
                pcEnSesion = "";
                if (extrasInput){
                    extrasInput.value = "";
                }
            }
        });
    }
}

const tbodyHistorial = document.getElementById("tabla-body-historial");
function cargarHistorial(){
    if (tbodyHistorial){
        tbodyHistorial.innerHTML = "";
        for (let i = 0; i < historial.length; i++){
            let h = historial[i];
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
    cargarHistorial();

    const filtroCliente = document.getElementById("filtro-cliente");
    if (filtroCliente){
        filtroCliente.addEventListener("keyup", function(){
            let texto = filtroCliente.value.toLowerCase();
            tbodyHistorial.innerHTML = "";

            for (let i = 0; i < historial.length; i++){
                let h = historial[i];
                if (h.cliente.toLowerCase().includes(texto)){
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
        });
    }
}