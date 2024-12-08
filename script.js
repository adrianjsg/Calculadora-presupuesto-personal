// Selección de elementos del DOM
const ingresoInput = document.getElementById('ingreso');
const gastoInput = document.getElementById('gasto');
const tipoGastoSelect = document.getElementById('tipo-gasto');
const campoOtro = document.getElementById('campo-otro');
const gastoOtroInput = document.getElementById('gasto-otro');
const calcularBtn = document.getElementById('calcular');
const listaGastos = document.getElementById('lista-gastos');
const balanceOutput = document.getElementById('balance');
const graficoCanvas = document.getElementById('grafico-gastos');

// Variables globales
let presupuesto = 0;
let gastosPorCategoria = {
    comida: 0,
    ocio: 0,
    luz: 0,
    gas: 0,
    agua: 0,
    otro: 0,
};
let graficoGastos;

// Mostrar/ocultar el campo "Otro"
tipoGastoSelect.addEventListener('change', function () {
    if (tipoGastoSelect.value === 'otro') {
        campoOtro.style.display = 'block';
    } else {
        campoOtro.style.display = 'none';
        gastoOtroInput.value = ''; // Limpiar el campo "Otro"
    }
});

// Función para añadir un gasto
function añadirGasto() {
    const ingreso = parseFloat(ingresoInput.value) || 0;
    const gasto = parseFloat(gastoInput.value) || 0;
    const tipoGasto = tipoGastoSelect.value === 'otro' ? gastoOtroInput.value : tipoGastoSelect.value;

    // Validaciones
    if (ingreso > 0) {
        presupuesto += ingreso;
        ingresoInput.value = ''; // Limpiar campo ingreso
    }
    if (gasto <= 0 || tipoGasto.trim() === '') {
        alert('Por favor, ingresa un gasto válido y un tipo de gasto.');
        return;
    }

    // Actualizar el presupuesto y los gastos
    gastosPorCategoria[tipoGasto] = (gastosPorCategoria[tipoGasto] || 0) + gasto;
    presupuesto -= gasto;

    // Añadir gasto a la lista
    const li = document.createElement('li');
    li.textContent = `${tipoGasto}: ${gasto.toFixed(2)}€`;
    listaGastos.appendChild(li);

    // Actualizar gráfico
    actualizarGrafico();
}

// Inicializar gráfico
function inicializarGrafico() {
    graficoGastos = new Chart(graficoCanvas, {
        type: 'pie',
        data: {
            labels: ['Presupuesto Restante', ...Object.keys(gastosPorCategoria)],
            datasets: [{
                data: [presupuesto, ...Object.values(gastosPorCategoria)],
                backgroundColor: ['#0A3981', '#E38E49', '#D4EBF8', '#1F509A', '#B59F78', '#E3A449'],
            }]
        },
        options: {
            responsive: true,
        },
    });
}

// Actualizar gráfico
function actualizarGrafico() {
    graficoGastos.data.datasets[0].data = [presupuesto, ...Object.values(gastosPorCategoria)];
    graficoGastos.update();
}

// Inicializar funcionalidad
calcularBtn.addEventListener('click', añadirGasto);
inicializarGrafico();

