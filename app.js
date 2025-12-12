/**
 * Aplicación de Gestor de Tareas
 * Utiliza Lista Enlazada como estructura de datos principal
 */

class GestorTareas {
    constructor() {
        // Inicializar la lista enlazada
        this.lista = new ListaEnlazada();
        
        // Contador para IDs únicos
        this.contadorIds = 0;
        
        // Filtro actual
        this.filtroActual = 'todas';
        
        // Elementos del DOM
        this.taskInput = document.getElementById('taskInput');
        this.prioritySelect = document.getElementById('prioritySelect');
        this.addBtn = document.getElementById('addBtn');
        this.taskList = document.getElementById('taskList');
        this.emptyState = document.getElementById('emptyState');
        this.totalTasksSpan = document.getElementById('totalTasks');
        this.completedTasksSpan = document.getElementById('completedTasks');
        this.pendingTasksSpan = document.getElementById('pendingTasks');
        this.clearBtn = document.getElementById('clearBtn');
        this.exportBtn = document.getElementById('exportBtn');
        this.importBtn = document.getElementById('importBtn');
        this.importFile = document.getElementById('importFile');
        
        // Inicializar eventos
        this.inicializarEventos();
        
        // Cargar datos guardados si existen
        this.cargarDatosGuardados();
        
        // Renderizar tareas
        this.renderizar();
    }

    /**
     * Inicializa todos los eventos de la aplicación
     */
    inicializarEventos() {
        // Agregar tarea
        this.addBtn.addEventListener('click', () => this.agregarTarea());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.agregarTarea();
        });

        // Filtros
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.filtroActual = e.target.dataset.filter;
                this.renderizar();
            });
        });

        // Botones de control
        this.clearBtn.addEventListener('click', () => this.limpiarCompletadas());
        this.exportBtn.addEventListener('click', () => this.exportarDatos());
        this.importBtn.addEventListener('click', () => this.importFile.click());
        this.importFile.addEventListener('change', (e) => this.importarDatos(e));
    }

    /**
     * Agrega una nueva tarea a la lista enlazada
     */
    agregarTarea() {
        const texto = this.taskInput.value.trim();
        const prioridad = this.prioritySelect.value;

        if (texto === '') {
            alert('Por favor, escribe una tarea.');
            return;
        }

        // Usar la lista enlazada para agregar
        this.lista.insertarAlInicio(this.contadorIds++, texto, prioridad);

        // Guardar y actualizar UI
        this.guardarDatos();
        this.renderizar();

        // Limpiar input
        this.taskInput.value = '';
        this.taskInput.focus();
    }

    /**
     * Marca una tarea como completada o pendiente
     * @param {number} id - ID de la tarea
     */
    alternarTarea(id) {
        const nodo = this.lista.obtenerPorId(id);
        if (nodo) {
            nodo.completada = !nodo.completada;
            this.guardarDatos();
            this.renderizar();
        }
    }

    /**
     * Elimina una tarea de la lista enlazada
     * @param {number} id - ID de la tarea
     */
    eliminarTarea(id) {
        this.lista.eliminar(id);
        this.guardarDatos();
        this.renderizar();
    }

    /**
     * Limpia todas las tareas completadas
     */
    limpiarCompletadas() {
        const completadas = this.lista.filtrar(nodo => nodo.completada);
        completadas.forEach(nodo => this.lista.eliminar(nodo.id));
        this.guardarDatos();
        this.renderizar();
    }

    /**
     * Obtiene las tareas a mostrar según el filtro
     * @returns {Nodo[]} Array de tareas filtradas
     */
    obtenerTareasFiltradas() {
        let tareas = this.lista.obtenerTodos();

        switch (this.filtroActual) {
            case 'pendientes':
                return tareas.filter(nodo => !nodo.completada);
            case 'completadas':
                return tareas.filter(nodo => nodo.completada);
            case 'todas':
            default:
                return tareas;
        }
    }

    /**
     * Actualiza las estadísticas de la aplicación
     */
    actualizarEstadisticas() {
        const todas = this.lista.obtenerTodos();
        const completadas = this.lista.filtrar(nodo => nodo.completada);
        const pendientes = todas.length - completadas.length;

        this.totalTasksSpan.textContent = todas.length;
        this.completedTasksSpan.textContent = completadas.length;
        this.pendingTasksSpan.textContent = pendientes;
    }

    /**
     * Renderiza todas las tareas en la interfaz
     */
    renderizar() {
        this.taskList.innerHTML = '';
        const tareasFiltradas = this.obtenerTareasFiltradas();

        if (tareasFiltradas.length === 0) {
            this.emptyState.classList.add('show');
        } else {
            this.emptyState.classList.remove('show');
        }

        // Recorrer la lista enlazada y crear elementos HTML
        tareasFiltradas.forEach(nodo => {
            const li = document.createElement('li');
            li.className = `task-item ${nodo.prioridad}`;
            if (nodo.completada) li.classList.add('completed');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'task-checkbox';
            checkbox.checked = nodo.completada;
            checkbox.addEventListener('change', () => this.alternarTarea(nodo.id));

            const content = document.createElement('div');
            content.className = 'task-content';

            const taskText = document.createElement('div');
            taskText.className = 'task-text';
            taskText.textContent = nodo.texto;

            const meta = document.createElement('div');
            meta.className = 'task-meta';

            const badge = document.createElement('span');
            badge.className = `priority-badge ${nodo.prioridad}`;
            badge.textContent = this.capitalizarPrioridad(nodo.prioridad);

            meta.appendChild(badge);
            content.appendChild(taskText);
            content.appendChild(meta);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'task-delete-btn';
            deleteBtn.textContent = '🗑️ Eliminar';
            deleteBtn.addEventListener('click', () => this.eliminarTarea(nodo.id));

            li.appendChild(checkbox);
            li.appendChild(content);
            li.appendChild(deleteBtn);

            this.taskList.appendChild(li);
        });

        this.actualizarEstadisticas();
    }

    /**
     * Capitaliza el texto de prioridad
     * @param {string} prioridad - Nivel de prioridad
     * @returns {string} Prioridad capitalizada
     */
    capitalizarPrioridad(prioridad) {
        return prioridad.charAt(0).toUpperCase() + prioridad.slice(1);
    }

    /**
     * Exporta los datos de la lista enlazada a un archivo JSON
     */
    exportarDatos() {
        const datos = this.lista.aArray();
        const json = JSON.stringify(datos, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tareas-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    /**
     * Importa datos desde un archivo JSON
     * @param {Event} evento - Evento del input file
     */
    importarDatos(evento) {
        const archivo = evento.target.files[0];
        if (!archivo) return;

        const lector = new FileReader();
        lector.onload = (e) => {
            try {
                const datos = JSON.parse(e.target.result);
                this.lista.cargarDatos(datos);
                this.guardarDatos();
                this.renderizar();
                alert('✓ Datos importados correctamente');
            } catch (error) {
                alert('✗ Error al importar datos: ' + error.message);
            }
        };
        lector.readAsText(archivo);
        this.importFile.value = '';
    }

    /**
     * Guarda los datos en localStorage
     */
    guardarDatos() {
        const datos = this.lista.aArray();
        localStorage.setItem('tareas', JSON.stringify(datos));
        localStorage.setItem('contadorIds', this.contadorIds.toString());
    }

    /**
     * Carga los datos desde localStorage
     */
    cargarDatosGuardados() {
        const datosGuardados = localStorage.getItem('tareas');
        const contadorGuardado = localStorage.getItem('contadorIds');

        if (datosGuardados) {
            try {
                const datos = JSON.parse(datosGuardados);
                this.lista.cargarDatos(datos);
            } catch (error) {
                console.error('Error cargando datos:', error);
            }
        }

        if (contadorGuardado) {
            this.contadorIds = parseInt(contadorGuardado, 10);
        }
    }
}

/**
 * Inicializa la aplicación cuando el DOM está listo
 */
document.addEventListener('DOMContentLoaded', () => {
    window.app = new GestorTareas();
});
