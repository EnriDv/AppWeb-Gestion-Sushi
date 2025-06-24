// Objeto principal del Store con el estado inicial
const Store = {
    menu: null, // Para almacenar los datos del menú
    cart: [],   // Para almacenar los ítems del carrito
    isLoggedIn: false, // Añadimos el estado de login aquí
};

// Se utiliza un Proxy para interceptar las operaciones de 'set' (asignación de valores)
// Esto permite disparar eventos cada vez que una propiedad clave del Store cambia.
const proxiedStore = new Proxy(Store, {
    /**
     * Intercepta las asignaciones de propiedades al objeto Store.
     * @param {object} target - El objeto Store original.
     * @param {string} property - El nombre de la propiedad que está siendo modificada.
     * @param {*} value - El nuevo valor asignado a la propiedad.
     * @returns {boolean} - true si la operación fue exitosa.
     */
    set(target, property, value) {
        // Asignar el nuevo valor a la propiedad en el objeto Store original
        target[property] = value;

        // Disparar eventos personalizados según la propiedad que ha cambiado
        if (property === "menu") {
            // Dispara 'appmenuchange' cuando el menú es actualizado
            window.dispatchEvent(new Event("appmenuchange"));
        }
        if (property === "cart") {
            // Dispara 'appcartchange' cuando el carrito es actualizado
            window.dispatchEvent(new Event("appcartchange"));
        }
        if (property === "isLoggedIn") {
            // Dispara 'apploginchange' (o similar) cuando el estado de login cambia
            // Esto es útil para que los componentes que dependen del estado de login puedan reaccionar.
            window.dispatchEvent(new CustomEvent("apploginchange", { detail: { isLoggedIn: value } }));
        }

        // Devolver true para indicar que la asignación fue exitosa
        return true;
    },
});

// Exportar el Store proxied para que otros módulos puedan importarlo y usarlo
export default proxiedStore;
