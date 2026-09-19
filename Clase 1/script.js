const formulario = document.getElementById('form-reporte');
const contenedorCasos = document.getElementById('contenedor-casos');
const inputBusqueda = document.getElementById('busqueda');
const filtroAutoridad = document.getElementById('filtro-autoridad');
const contadorCabecera = document.getElementById('contador-cabecera');
const btnSubmit = document.querySelector('#form-reporte button[type="submit"]');
const btnModoOscuro = document.getElementById('btn-modo-oscuro');
const btnOrdenar = document.getElementById('btn-ordenar');
const API_URL = 'https://jsonplaceholder.typicode.com/posts';

//
async function obtenerCasos() {
    try {
        // realizar petición HTTP
        const response = await fetch(`${API_URL}?_limit=6`);

        // Indicar si el servidor respondió con un código dew éxito (200-299)
        if (response.ok) {
        throw new Error(`Error en la petición: ${response.status}`);
        }   

        // Convertir la respuesta a JSON
        const datos = await response.json();
        casos = datos;
        renderizarCasos(casos);
        actualizarContador();

    } catch (error) {
        console.error('Error al obtener casos:', error);
        mostrarNotificacion('Error al obtener casos. Por favor, intenta de nuevo más tarde.');
    }
}

// Request asincrono al servidor
const respuesta = await fetch(API_URL);
const datos = await respuesta.json();




// Estado inicial
let casos = JSON.parse(localStorage.getItem('casos_cali_vigilante')) || [];
let ordenDescendente = true;

function guardarEnLocalStorage() {
    localStorage.setItem('casos_cali_vigilante', JSON.stringify(casos));
}

function crearTarjetaCaso(caso) {
    const tarjeta = document.createElement('article');
    tarjeta.className = 'tarjeta-caso';
    tarjeta.innerHTML = `
        <h3>${caso.lugar}</h3>
        <p class="meta">${caso.fecha} · ${caso.autoridad.toUpperCase()}</p>
        <p>${caso.descripcion}</p>
    `;
    return tarjeta;
}

function actualizarContador() {
    if (!contadorCabecera) return;
    const total = casos.length;
    contadorCabecera.textContent = total === 1 ? '1 caso registrado' : `${total} casos registrados`;
}

function renderizarCasos(casosAMostrar) {
    if (!contenedorCasos) return;

    contenedorCasos.innerHTML = '';
    if (casosAMostrar.length === 0) {
        contenedorCasos.innerHTML = '<p>No se encontraron casos que coincidan con la búsqueda.</p>';
        return;
    }

    casosAMostrar.forEach(caso => contenedorCasos.appendChild(crearTarjetaCaso(caso)));
    actualizarContador();
}

function aplicarFiltros() {
    const textoBusqueda = inputBusqueda?.value.toLowerCase() || '';
    const autoridadSeleccionada = filtroAutoridad?.value || 'todas';

    const casosFiltrados = casos.filter(caso => {
        const coincideTexto = caso.lugar.toLowerCase().includes(textoBusqueda) || 
                              caso.descripcion.toLowerCase().includes(textoBusqueda);
        const coincideAutoridad = autoridadSeleccionada === 'todas' || caso.autoridad === autoridadSeleccionada;
        
        return coincideTexto && coincideAutoridad;
    });

    renderizarCasos(casosFiltrados);
}

function mostrarNotificacion(mensaje) {
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion-popup';
    notificacion.textContent = mensaje;
    document.body.appendChild(notificacion);

    setTimeout(() => notificacion.classList.add('mostrar'), 10);

    setTimeout(() => {
        notificacion.classList.remove('mostrar');
        setTimeout(() => notificacion.remove(), 300);
    }, 3500);
}

// Eventos principales
formulario?.addEventListener('submit', function (evento) {
    evento.preventDefault();

    casos.push({
        fecha: document.getElementById('fecha').value,
        lugar: document.getElementById('lugar').value,
        descripcion: document.getElementById('descripcion').value,
        autoridad: document.getElementById('autoridad').value,
    });

    guardarEnLocalStorage();
    mostrarNotificacion('¡Reporte enviado exitosamente! Puedes ir a "Ver casos registrados" para comprobarlo.');
    
    formulario.reset();
    formulario.classList.remove('fue-validado');
    actualizarContador();
});

btnSubmit?.addEventListener('click', () => formulario?.classList.add('fue-validado'));

// Filtros de búsqueda
inputBusqueda?.addEventListener('input', aplicarFiltros);
filtroAutoridad?.addEventListener('change', aplicarFiltros);

// Modo Oscuro
if (localStorage.getItem('cali_vigilante_modo_oscuro') === 'activado') {
    document.body.classList.add('dark-mode');
    if (btnModoOscuro) btnModoOscuro.textContent = 'Modo Claro';
}

btnModoOscuro?.addEventListener('click', () => {
    const estaActivo = document.body.classList.toggle('dark-mode');
    localStorage.setItem('cali_vigilante_modo_oscuro', estaActivo ? 'activado' : 'desactivado');
    btnModoOscuro.textContent = estaActivo ? 'Modo Claro' : 'Modo Oscuro';
});

// Ordenamiento por fecha
btnOrdenar?.addEventListener('click', () => {
    casos.sort((a, b) => {
        const fechaA = new Date(a.fecha);
        const fechaB = new Date(b.fecha);
        return ordenDescendente ? fechaA - fechaB : fechaB - fechaA;
    });

    ordenDescendente = !ordenDescendente;
    btnOrdenar.textContent = ordenDescendente ? 'Casos recientes' : 'Casos antiguos';
    aplicarFiltros();
});

// Renderizado inicial
renderizarCasos(casos);
actualizarContador();