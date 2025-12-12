/**
 * Nodo de la Lista Enlazada
 * Representa cada tarea en la estructura de datos
 */
class Nodo {
    constructor(id, texto, prioridad = 'media') {
        this.id = id;
        this.texto = texto;
        this.prioridad = prioridad;
        this.completada = false;
        this.siguiente = null;
    }
}

/**
 * Lista Enlazada
 * Estructura de datos principal para almacenar tareas
 */
class ListaEnlazada {
    constructor() {
        this.cabeza = null;
        this.numElementos = 0;
    }

    /**
     * Inserta un nodo al inicio de la lista
     * @param {number} id - Identificador único
     * @param {string} texto - Descripción de la tarea
     * @param {string} prioridad - Nivel de prioridad
     */
    insertarAlInicio(id, texto, prioridad) {
        const nuevoNodo = new Nodo(id, texto, prioridad);
        nuevoNodo.siguiente = this.cabeza;
        this.cabeza = nuevoNodo;
        this.numElementos++;
        return nuevoNodo;
    }

    /**
     * Inserta un nodo al final de la lista
     * @param {number} id - Identificador único
     * @param {string} texto - Descripción de la tarea
     * @param {string} prioridad - Nivel de prioridad
     */
    insertarAlFinal(id, texto, prioridad) {
        const nuevoNodo = new Nodo(id, texto, prioridad);

        if (this.cabeza === null) {
            this.cabeza = nuevoNodo;
        } else {
            let actual = this.cabeza;
            while (actual.siguiente !== null) {
                actual = actual.siguiente;
            }
            actual.siguiente = nuevoNodo;
        }
        this.numElementos++;
        return nuevoNodo;
    }

    /**
     * Obtiene un nodo por su id
     * @param {number} id - Identificador del nodo
     * @returns {Nodo|null} El nodo encontrado o null
     */
    obtenerPorId(id) {
        let actual = this.cabeza;
        while (actual !== null) {
            if (actual.id === id) {
                return actual;
            }
            actual = actual.siguiente;
        }
        return null;
    }

    /**
     * Elimina un nodo de la lista por su id
     * @param {number} id - Identificador del nodo a eliminar
     * @returns {boolean} true si se eliminó, false si no se encontró
     */
    eliminar(id) {
        if (this.cabeza === null) return false;

        // Si el nodo a eliminar es la cabeza
        if (this.cabeza.id === id) {
            this.cabeza = this.cabeza.siguiente;
            this.numElementos--;
            return true;
        }

        // Buscar en el resto de la lista
        let anterior = this.cabeza;
        let actual = this.cabeza.siguiente;

        while (actual !== null) {
            if (actual.id === id) {
                anterior.siguiente = actual.siguiente;
                this.numElementos--;
                return true;
            }
            anterior = actual;
            actual = actual.siguiente;
        }

        return false;
    }

    /**
     * Obtiene todos los elementos de la lista como array
     * @returns {Nodo[]} Array de nodos
     */
    obtenerTodos() {
        const elementos = [];
        let actual = this.cabeza;
        while (actual !== null) {
            elementos.push(actual);
            actual = actual.siguiente;
        }
        return elementos;
    }

    /**
     * Filtra elementos según un criterio
     * @param {Function} callback - Función de filtro
     * @returns {Nodo[]} Array filtrado de nodos
     */
    filtrar(callback) {
        const elementos = [];
        let actual = this.cabeza;
        while (actual !== null) {
            if (callback(actual)) {
                elementos.push(actual);
            }
            actual = actual.siguiente;
        }
        return elementos;
    }

    /**
     * Obtiene la cantidad de elementos
     * @returns {number} Número de elementos en la lista
     */
    tamaño() {
        return this.numElementos;
    }

    /**
     * Limpia toda la lista
     */
    limpiar() {
        this.cabeza = null;
        this.numElementos = 0;
    }

    /**
     * Busca elementos que cumplan con una condición
     * @param {Function} predicado - Función de búsqueda
     * @returns {Nodo[]} Array de nodos que cumplen la condición
     */
    buscar(predicado) {
        return this.filtrar(predicado);
    }

    /**
     * Convierte la lista a un array serializable (para exportar)
     * @returns {Array} Array serializable
     */
    aArray() {
        return this.obtenerTodos().map(nodo => ({
            id: nodo.id,
            texto: nodo.texto,
            completada: nodo.completada,
            prioridad: nodo.prioridad
        }));
    }

    /**
     * Carga datos desde un array
     * @param {Array} datos - Array con datos de tareas
     */
    cargarDatos(datos) {
        this.limpiar();
        datos.forEach(item => {
            const nodo = this.insertarAlFinal(item.id, item.texto, item.prioridad);
            nodo.completada = item.completada;
        });
    }
}
