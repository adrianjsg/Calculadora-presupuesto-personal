const ingresoInput = document.getElementById('ingreso');
const gastoInput = document.getElementById('gasto');
const tipoGastoSelect = document.getElementById('tipo-gasto');
const campoOtro = document.getElementById('campo-otro');
const gastoOtroInput = document.getElementById('gasto-otro');
const calcularBtn = document.getElementById('calcular');
const listaGastos = document.getElementById('lista-gastos');
const balanceOutput = document.getElementById('balance');
const graficoCanvas = document.getElementById('grafico-gastos');

let presupuesto = 0;
let gastosPorCategoria = {};
let grafico;

// Colores predefinidos para las categorías
const coloresGastos = {
    'Presupuesto Restante': '#0A3981',
    'Comida': '#E38E49',
    'Ocio': '#F4C542',
    'Luz': '#9CC4E4',
    'Gas': '#F27D52',
    'Agua': '#5DB6B1',
    'Otro': '#B19CD9'
};

// Mostrar campo "Otro"
tipoGastoSelect.addEventListener('change', () => {
    campoOtro.style.display = tipoGastoSelect.value === "Otro" ? "block" : "none";
});

// Añadir Gasto
function añadirGasto() {
    const ingreso = parseFloat(ingresoInput.value) || 0;
    const gasto = parseFloat(gastoInput.value) || 0;
    const tipoGasto = tipoGastoSelect.value === 'Otro' ? gastoOtroInput.value : tipoGastoSelect.value;

    if (gasto <= 0 || !tipoGasto) {
        alert('Por favor ingresa un gasto válido y selecciona una categoría.');
        return;
    }

    // Actualizar presupuesto y gastos
    presupuesto += ingreso - gasto;
    gastosPorCategoria[tipoGasto] = (gastosPorCategoria[tipoGasto] || 0) + gasto;

    // Actualizar lista de gastos
    const li = document.createElement('li');
    li.textContent = `${tipoGasto}: ${gasto.toFixed(2)}€`;
    listaGastos.appendChild(li);

    // Mostrar balance actualizado
    balanceOutput.textContent = `${presupuesto.toFixed(2)} €`;

    // Actualizar gráfico
    actualizarGrafico();
    ingresoInput.value = gastoInput.value = gastoOtroInput.value = '';
}

// Inicializar Gráfico
function inicializarGrafico() {
    grafico = new Chart(graficoCanvas, {
        type: 'pie',
        data: {
            labels: ['Presupuesto Restante'], // Iniciar con presupuesto restante
            datasets: [{
                data: [0], // Datos iniciales
                backgroundColor: ['#0A3981'] // Color inicial
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });
}

// Actualizar Gráfico
function actualizarGrafico() {
    const categorias = ['Presupuesto Restante', ...Object.keys(gastosPorCategoria)];
    const valores = [presupuesto, ...Object.values(gastosPorCategoria)];

    // Asignar colores dinámicos
    const colores = categorias.map(categoria => coloresGastos[categoria] || generarColorAleatorio());

    grafico.data.labels = categorias;
    grafico.data.datasets[0].data = valores;
    grafico.data.datasets[0].backgroundColor = colores;

    grafico.update();
}

// Función para generar colores aleatorios si no están en el array
function generarColorAleatorio() {
    const letras = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letras[Math.floor(Math.random() * 16)];
    }
    return color;
}

calcularBtn.addEventListener('click', añadirGasto);
inicializarGrafico();
