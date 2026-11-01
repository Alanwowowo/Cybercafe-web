document.addEventListener('alpine:init', () => {
  Alpine.data('gestionClientesSesiones', () => ({
    clientes: [],
    computadores: [],
    historial: [],
    sesionActiva: null,
    precioHora: 1500,

    clienteForm: { id: '', nombre: '', correo: '' },
    posicionEdicion: -1,
    busquedaCliente: '',
    ordenCliente: 'nombre-asc',

    selectCliente: '',
    selectComputador: '',
    costosAdicionales: 0,

    filtroClienteHistorial: '',
    filtroEquipoHistorial: '',
    filtroFechaHistorial: '',
    ordenHistorial: 'fecha-desc',

    mensajeError: '',
    mensajeExito: '',

    init() {
      this.cargarConfiguracionChris();
      this.cargarComputadoresAlan();
      this.cargarClientes();
      this.cargarSesionActiva();
      this.cargarHistorial();
    },

    cargarConfiguracionChris() {
      const config = JSON.parse(localStorage.getItem('cybernet_configuracion'));
      if (config && config.precioHora) {
        this.precioHora = Number(config.precioHora);
      }
    },

    cargarComputadoresAlan() {
      const equipos = JSON.parse(localStorage.getItem('cybernet_computadores'));
      if (equipos && Array.isArray(equipos) && equipos.length > 0) {
        this.computadores = equipos.filter(e => e.estado === 'disponible');
      } else {
        this.computadores = [
          { id: 'PC 01', nombre: 'PC 01' },
          { id: 'PC 02', nombre: 'PC 02' },
          { id: 'PC 03', nombre: 'PC 03' },
          { id: 'PC 04', nombre: 'PC 04' },
          { id: 'PC 05', nombre: 'PC 05' },
          { id: 'PC 06', nombre: 'PC 06' }
        ];
      }
    },

    cargarClientes() {
      const guardados = localStorage.getItem('cybernet_clientes');
      if (guardados) {
        this.clientes = JSON.parse(guardados);
      } else {
        this.clientes = [
          { id: '12345678-9', nombre: 'Jorge Gonzalez', correo: 'jorge@ejemplo.com' },
          { id: '98765432-1', nombre: 'Alvaro Herreros', correo: 'alvaro@ejemplo.com' },
          { id: '32323345-5', nombre: 'Pablo Paez', correo: 'pablo@ejemplo.com' }
        ];
        this.guardarClientes();
      }
    },

    guardarClientes() {
      localStorage.setItem('cybernet_clientes', JSON.stringify(this.clientes));
    },

    cargarSesionActiva() {
      const sesion = localStorage.getItem('cybernet_sesion_activa');
      if (sesion) {
        this.sesionActiva = JSON.parse(sesion);
      }
    },

    cargarHistorial() {
      const guardados = localStorage.getItem('cybernet_historial');
      if (guardados) {
        this.historial = JSON.parse(guardados);
      } else {
        this.historial = [
          { cliente: 'Jorge Gonzalez', computador: 'PC 01', fecha: '2024-04-15', duracion: '300 min', monto: 10000 },
          { cliente: 'Pablo Paez', computador: 'PC 06', fecha: '2021-08-29', duracion: '67 min', monto: 2500 }
        ];
        this.guardarHistorial();
      }
    },

    guardarHistorial() {
      localStorage.setItem('cybernet_historial', JSON.stringify(this.historial));
    },

    guardarCliente() {
      this.mensajeError = '';
      this.mensajeExito = '';

      const id = this.clienteForm.id.trim();
      const nombre = this.clienteForm.nombre.trim();
      const correo = this.clienteForm.correo.trim();

      if (!id || !nombre || !correo) {
        this.mensajeError = 'Todos los campos son obligatorios.';
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(correo)) {
        this.mensajeError = 'Ingrese un correo electrónico válido.';
        return;
      }

      const existeId = this.clientes.some((c, idx) => c.id.toLowerCase() === id.toLowerCase() && idx !== this.posicionEdicion);
      if (existeId) {
        this.mensajeError = 'Ya existe un cliente con este ID/RUT.';
        return;
      }

      const existeCorreo = this.clientes.some((c, idx) => c.correo.toLowerCase() === correo.toLowerCase() && idx !== this.posicionEdicion);
      if (existeCorreo) {
        this.mensajeError = 'Ya existe un cliente con este correo.';
        return;
      }

      const datosCliente = { id, nombre, correo };

      if (this.posicionEdicion === -1) {
        this.clientes.push(datosCliente);
        this.mensajeExito = 'Cliente registrado correctamente.';
      } else {
        this.clientes[this.posicionEdicion] = datosCliente;
        this.posicionEdicion = -1;
        this.mensajeExito = 'Cliente actualizado correctamente.';
      }

      this.guardarClientes();
      this.limpiarFormCliente();
    },

    editarCliente(cliente) {
      this.mensajeError = '';
      this.mensajeExito = '';
      this.posicionEdicion = this.clientes.findIndex(c => c.id === cliente.id);
      if (this.posicionEdicion !== -1) {
        this.clienteForm = { ...this.clientes[this.posicionEdicion] };
      }
    },

    eliminarCliente(id) {
      if (confirm('¿Deseas eliminar este cliente?')) {
        this.clientes = this.clientes.filter(c => c.id !== id);
        this.guardarClientes();
        if (this.clienteForm.id === id) {
          this.limpiarFormCliente();
        }
        this.mensajeExito = 'Cliente eliminado correctamente.';
      }
    },

    limpiarFormCliente() {
      this.clienteForm = { id: '', nombre: '', correo: '' };
      this.posicionEdicion = -1;
    },

    get clientesFiltrados() {
      let resultado = [...this.clientes];
      const texto = this.busquedaCliente.toLowerCase().trim();

      if (texto !== '') {
        resultado = resultado.filter(c => 
          c.id.toLowerCase().includes(texto) ||
          c.nombre.toLowerCase().includes(texto) ||
          c.correo.toLowerCase().includes(texto)
        );
      }

      resultado.sort((a, b) => {
        if (this.ordenCliente === 'nombre-asc') return a.nombre.localeCompare(b.nombre);
        if (this.ordenCliente === 'nombre-desc') return b.nombre.localeCompare(a.nombre);
        if (this.ordenCliente === 'id-asc') return a.id.localeCompare(b.id);
        if (this.ordenCliente === 'id-desc') return b.id.localeCompare(a.id);
        return 0;
      });

      return resultado;
    },

    iniciarSesion() {
      if (this.sesionActiva) {
        alert('Ya existe una sesión activa. Debes finalizarla primero.');
        return;
      }

      if (!this.selectCliente || !this.selectComputador) {
        alert('Selecciona un cliente y un computador.');
        return;
      }

      const ahora = new Date();
      const anio = ahora.getFullYear();
      const mes = String(ahora.getMonth() + 1).padStart(2, '0');
      const dia = String(ahora.getDate()).padStart(2, '0');

      this.sesionActiva = {
        cliente: this.selectCliente,
        computador: this.selectComputador,
        horaInicio: ahora.getTime(),
        horaInicioTexto: String(ahora.getHours()).padStart(2, '0') + ':' + String(ahora.getMinutes()).padStart(2, '0'),
        fecha: `${anio}-${mes}-${dia}`
      };

      localStorage.setItem('cybernet_sesion_activa', JSON.stringify(this.sesionActiva));
      alert(`Sesión iniciada para ${this.sesionActiva.cliente} en ${this.sesionActiva.computador}`);
    },

    finalizarSesion() {
      if (!this.sesionActiva) {
        alert('Primero debes iniciar una sesión.');
        return;
      }

      if (!confirm(`¿Deseas finalizar la sesión de ${this.sesionActiva.cliente}?`)) {
        return;
      }

      const horaTermino = new Date().getTime();
      let duracion = Math.ceil((horaTermino - this.sesionActiva.horaInicio) / 60000);
      if (duracion < 1) duracion = 1;

      const tarifaPorMinuto = this.precioHora / 60;
      const costoTiempo = Math.round(duracion * tarifaPorMinuto);
      const extras = Number(this.costosAdicionales) || 0;
      const montoFinal = costoTiempo + extras;

      const nuevaSesion = {
        cliente: this.sesionActiva.cliente,
        computador: this.sesionActiva.computador,
        fecha: this.sesionActiva.fecha,
        duracion: duracion + ' min',
        monto: montoFinal
      };

      this.historial.push(nuevaSesion);
      this.guardarHistorial();

      localStorage.removeItem('cybernet_sesion_activa');
      this.sesionActiva = null;
      this.costosAdicionales = 0;
      this.selectCliente = '';
      this.selectComputador = '';

      alert('Sesión finalizada y guardada en el historial.');
    },

    get historialFiltrado() {
      let resultado = [...this.historial];
      const clienteBuscado = this.filtroClienteHistorial.toLowerCase().trim();
      const equipoBuscado = this.filtroEquipoHistorial.toLowerCase().trim();
      const fechaBuscada = this.filtroFechaHistorial;

      if (clienteBuscado) {
        resultado = resultado.filter(s => s.cliente.toLowerCase().includes(clienteBuscado));
      }

      if (equipoBuscado) {
        resultado = resultado.filter(s => s.computador.toLowerCase().includes(equipoBuscado));
      }

      if (fechaBuscada) {
        resultado = resultado.filter(s => s.fecha === fechaBuscada);
      }

      resultado.sort((a, b) => {
        if (this.ordenHistorial === 'fecha-desc') return b.fecha.localeCompare(a.fecha);
        if (this.ordenHistorial === 'fecha-asc') return a.fecha.localeCompare(b.fecha);
        if (this.ordenHistorial === 'monto-desc') return b.monto - a.monto;
        if (this.ordenHistorial === 'monto-asc') return a.monto - b.monto;
        return 0;
      });

      return resultado;
    }
  }));
});