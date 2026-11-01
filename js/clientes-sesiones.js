document.addEventListener('alpine:init', () => {
  Alpine.data('gestionClientesSesiones', () => ({
    clientes: [],
    computadores: [],
    historial: [],
    sesionesActivas: [],
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
      this.cargarSesionesActivas();
      this.sincronizarComputadoresConSesiones();
      this.cargarComputadoresAlan();
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
      if (Array.isArray(equipos)) {
        this.computadores = equipos.filter(e => e.estado === 'disponible');
      } else {
        const equiposIniciales = [
          {
            id: 1,
            nombre: 'PC 01',
            estado: 'disponible',
            ubicacion: 'Sala principal'
          },
          {
            id: 2,
            nombre: 'PC 02',
            estado: 'disponible',
            ubicacion: 'Sala principal'
          },
          {
            id: 3,
            nombre: 'PC 03',
            estado: 'disponible',
            ubicacion: 'Sala principal'
          },
          {
            id: 4,
            nombre: 'PC 04',
            estado: 'fuera-servicio',
            ubicacion: 'Sala secundaria'
          },
          {
            id: 5,
            nombre: 'PC 05',
            estado: 'disponible',
            ubicacion: 'Sala secundaria'
          },
          {
            id: 6,
            nombre: 'PC 06',
            estado: 'disponible',
            ubicacion: 'Sala secundaria'
          }
        ];

        localStorage.setItem(
          'cybernet_computadores',
          JSON.stringify(equiposIniciales)
        );

        this.computadores = equiposIniciales.filter(
          equipo => equipo.estado === 'disponible'
        );
      }
    },

    sincronizarComputadoresConSesiones() {
      const equipos = JSON.parse(
        localStorage.getItem('cybernet_computadores')
      ) || [];

      let huboCambios = false;

      this.sesionesActivas.forEach(sesion => {
        const equipo = equipos.find(computador =>
          sesion.computadorId !== undefined
            ? String(computador.id) === String(sesion.computadorId)
            : computador.nombre === sesion.computador
        );

        if (equipo && equipo.estado !== 'ocupado') {
          equipo.estado = 'ocupado';
          huboCambios = true;
        }
      });

      if (huboCambios) {
        localStorage.setItem(
          'cybernet_computadores',
          JSON.stringify(equipos)
        );
      }
    },

    actualizarEstadoComputador(id, nombre, nuevoEstado) {
      const equipos = JSON.parse(
        localStorage.getItem('cybernet_computadores')
      ) || [];

      const equipo = equipos.find(computador =>
        id !== undefined && id !== null
          ? String(computador.id) === String(id)
          : computador.nombre === nombre
      );

      if (!equipo) {
        return false;
      }

      equipo.estado = nuevoEstado;

      localStorage.setItem(
        'cybernet_computadores',
        JSON.stringify(equipos)
      );

      this.computadores = equipos.filter(
        computador => computador.estado === 'disponible'
      );

      return true;
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

    cargarSesionesActivas() {
      const guardadas = localStorage.getItem('cybernet_sesiones_activas');
      if (guardadas) {
        this.sesionesActivas = JSON.parse(guardadas);
      } else {
        this.sesionesActivas = [];
      }
    },

    guardarSesionesActivas() {
      localStorage.setItem('cybernet_sesiones_activas', JSON.stringify(this.sesionesActivas));
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

      const rutRegex = /^(\d{1,2}\.\d{3}\.\d{3}-[\dkK]|\d{7,8}-[\dkK])$/;
      if (!rutRegex.test(id)) {
        this.mensajeError = 'Ingrese un RUT con formato válido (Ej: 12345678-9 o 12.345.678-K).';
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

    clienteTieneSesionActiva(cliente) {
        return this.sesionesActivas.some(sesion => {
            const coincideId =
                sesion.clienteId !== undefined &&
                String(sesion.clienteId) === String(cliente.id);

            const coincideNombreAnterior =
                sesion.clienteId === undefined &&
                sesion.cliente === cliente.nombre;

            return coincideId || coincideNombreAnterior;
        });
    },

    editarCliente(cliente) {
        this.mensajeError = '';
        this.mensajeExito = '';

        if (this.clienteTieneSesionActiva(cliente)) {
            alert(
                'No puedes editar este cliente ' +
                'mientras tenga una sesión activa.'
            );
            return;
        }

        this.posicionEdicion = this.clientes.findIndex(
            clienteGuardado =>
                String(clienteGuardado.id) === String(cliente.id)
        );

        if (this.posicionEdicion !== -1) {
            this.clienteForm = {
                ...this.clientes[this.posicionEdicion]
            };
        }
    },

    eliminarCliente(id) {
        const cliente = this.clientes.find(
            cliente => String(cliente.id) === String(id)
        );

        if (!cliente) {
            return;
        }

        if (this.clienteTieneSesionActiva(cliente)) {
            alert(
                'No puedes eliminar este cliente ' +
                'mientras tenga una sesión activa.'
            );
            return;
        }

        if (confirm('¿Deseas eliminar este cliente?')) {
            this.clientes = this.clientes.filter(
                cliente => String(cliente.id) !== String(id)
            );

            this.guardarClientes();

            if (String(this.clienteForm.id) === String(id)) {
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
      if (!this.selectCliente || !this.selectComputador) {
        alert('Selecciona un cliente y un computador.');
        return;
      }

      const clienteSeleccionado = this.clientes.find(
          cliente =>
              String(cliente.id) === String(this.selectCliente)
      );

      if (!clienteSeleccionado) {
          alert('El cliente seleccionado ya no existe.');
          this.selectCliente = '';
          return;
      }

      const equiposGuardados = JSON.parse(
        localStorage.getItem('cybernet_computadores')
      ) || [];

      const equipoSeleccionado = equiposGuardados.find(
        equipo => equipo.nombre === this.selectComputador
      );

      if (
        !equipoSeleccionado ||
        equipoSeleccionado.estado !== 'disponible'
      ) {
        alert('El computador seleccionado ya no está disponible.');
        this.selectComputador = '';
        this.cargarComputadoresAlan();
        return;
      }

      const equipoOcupado = this.sesionesActivas.some(
        sesion =>
          String(sesion.computadorId) ===
            String(equipoSeleccionado.id) ||
          sesion.computador === equipoSeleccionado.nombre
      );

      if (equipoOcupado) {
        alert('Este computador ya tiene una sesión activa.');
        this.selectComputador = '';
        this.cargarComputadoresAlan();
        return;
      }

      const ahora = new Date();
      const anio = ahora.getFullYear();
      const mes = String(ahora.getMonth() + 1).padStart(2, '0');
      const dia = String(ahora.getDate()).padStart(2, '0');

      const nuevaSesion = {
        id: Date.now(),
        clienteId: clienteSeleccionado.id,
        cliente: clienteSeleccionado.nombre,
        computadorId: equipoSeleccionado.id,
        computador: equipoSeleccionado.nombre,
        horaInicio: ahora.getTime(),
        horaInicioTexto:
          String(ahora.getHours()).padStart(2, '0') +
          ':' +
          String(ahora.getMinutes()).padStart(2, '0'),
        fecha: `${anio}-${mes}-${dia}`,
        costosAdicionales: 0
      };

      this.sesionesActivas.push(nuevaSesion);
      this.guardarSesionesActivas();

      this.actualizarEstadoComputador(
        equipoSeleccionado.id,
        equipoSeleccionado.nombre,
        'ocupado'
      );

      alert(
        `Sesión iniciada para ${nuevaSesion.cliente} ` +
        `en ${nuevaSesion.computador}`
      );

      this.selectCliente = '';
      this.selectComputador = '';
    },

    finalizarSesion(sesionAProcesar) {
      let sesion = sesionAProcesar;
      if (!sesion && this.sesionesActivas.length > 0) {
        sesion = this.sesionesActivas[0];
      }

      if (!sesion) {
        alert('No hay ninguna sesión activa para finalizar.');
        return;
      }

      if (!confirm(`¿Deseas finalizar la sesión de ${sesion.cliente}?`)) {
        return;
      }

      const horaTermino = new Date().getTime();
      let duracion = Math.ceil((horaTermino - sesion.horaInicio) / 60000);
      if (duracion < 1) duracion = 1;

      const tarifaPorMinuto = this.precioHora / 60;
      const costoTiempo = Math.round(duracion * tarifaPorMinuto);
      const extras = Number(sesion.costosAdicionales) || 0;
      const montoFinal = costoTiempo + extras;

      const registroHistorial = {
        cliente: sesion.cliente,
        computador: sesion.computador,
        fecha: sesion.fecha,
        duracion: duracion + ' min',
        monto: montoFinal
      };

      this.historial.push(registroHistorial);
      this.guardarHistorial();

      this.sesionesActivas = this.sesionesActivas.filter(s => s.id !== sesion.id);
      this.guardarSesionesActivas();

      this.actualizarEstadoComputador(
        sesion.computadorId,
        sesion.computador,
        'disponible'
      );

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