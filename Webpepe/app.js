// Variables globales
let sessionActive = false;
let sessionStartTime = null;
let sessionTimer = null;
let bpmData = [];
let distanceData = [];
let chart = null;
let sessionChart = null;
let metronomeInterval = null;
let metronomeActive = false;

// Referencias a elementos del DOM
const startSessionBtn = document.getElementById('startSessionBtn');
const endSessionBtn = document.getElementById('endSessionBtn');
const sessionTimeDisplay = document.getElementById('sessionTime');
const currentBPMDisplay = document.getElementById('currentBPM');
const currentDistanceDisplay = document.getElementById('currentDistance');
const metronomeBtn = document.getElementById('metronomeBtn');
const metronomeBPMInput = document.getElementById('metronomeBPM');
const metronomeStatus = document.getElementById('metronomeStatus');
const nameModal = document.getElementById('nameModal');
const personNameInput = document.getElementById('personName');
const saveSessionBtn = document.getElementById('saveSessionBtn');
const closeModal = document.getElementById('closeModal');
const loadingOverlay = document.getElementById('loadingOverlay');
const sessionDataDiv = document.getElementById('sessionData');

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Verificar dependencias antes de inicializar
    if (checkDependencies()) {
        initializeApp();
        setupEventListeners();
        initializeChart();
    } else {
        showDependencyError();
    }
});

// Verificar que todas las dependencias estén cargadas
function checkDependencies() {
    const dependencies = [
        { name: 'Chart.js', check: () => typeof Chart !== 'undefined' },
        { name: 'Firebase', check: () => typeof firebase !== 'undefined' },
        { name: 'jsPDF', check: () => typeof window.jspdf !== 'undefined' }
    ];
    
    const missing = dependencies.filter(dep => !dep.check());
    
    if (missing.length > 0) {
        console.error('Dependencias faltantes:', missing.map(dep => dep.name));
        return false;
    }
    
    return true;
}

// Mostrar error de dependencias
function showDependencyError() {
    hideLoadingOverlay();
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #dc3545;
        color: white;
        padding: 20px;
        border-radius: 8px;
        text-align: center;
        z-index: 10000;
        max-width: 400px;
    `;
    errorDiv.innerHTML = `
        <h3>Error de Dependencias</h3>
        <p>No se pudieron cargar todas las dependencias necesarias.</p>
        <p>Verifica tu conexión a internet y recarga la página.</p>
        <button onclick="location.reload()" style="
            background: white;
            color: #dc3545;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 10px;
        ">Recargar Página</button>
    `;
    document.body.appendChild(errorDiv);
}

// Inicializar la aplicación
async function initializeApp() {
    showLoadingOverlay();
    
    try {
        // Esperar a que Firebase esté disponible
        if (typeof window.checkFirebaseConnection !== 'function') {
            throw new Error('Firebase no está disponible');
        }
        
        // Verificar conexión a Firebase
        await window.checkFirebaseConnection();
        
        // Configurar listeners de Firebase
        setupFirebaseListeners();
        
        hideLoadingOverlay();
        console.log('Aplicación inicializada correctamente con Firebase');
        
        // Mostrar notificación de conexión exitosa
        showNotification('Conectado a Firebase', 'Los datos se están recibiendo en tiempo real', 'success');
        
    } catch (error) {
        console.error('Error conectando a Firebase:', error);
        
        // Continuar sin Firebase en modo demo
        console.log('Continuando en modo demo sin Firebase');
        setupDemoMode();
        
        hideLoadingOverlay();
        showNotification('Modo Demo', 'Funcionando sin conexión a Firebase. Los datos son simulados.', 'warning');
    }
}

// Configurar modo demo sin Firebase
function setupDemoMode() {
    // Simular datos cada 2 segundos
    setInterval(() => {
        const mockBPM = Math.random() * 50 + 80; // BPM entre 80-130
        const mockDistance = Math.random() * 3 + 4; // Distancia entre 4-7 cm
        
        updateBPMDisplay(mockBPM);
        updateDistanceDisplay(mockDistance);
        
        if (sessionActive) {
            addBPMDataPoint(mockBPM);
            addDistanceDataPoint(mockDistance);
        }
    }, 2000);
}

// Mostrar notificación
function showNotification(title, message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'warning' ? '#ffc107' : '#007bff'};
        color: ${type === 'warning' ? '#000' : '#fff'};
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 300px;
        animation: slideInRight 0.3s ease;
    `;
    
    notification.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 5px;">${title}</div>
        <div style="font-size: 0.9rem;">${message}</div>
    `;
    
    document.body.appendChild(notification);
    
    // Remover después de 5 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Configurar listeners de Firebase para datos en tiempo real
function setupFirebaseListeners() {
    // Listener para BPM
    window.firebaseConfig.bpmRef.on('value', (snapshot) => {
        const bpm = snapshot.val() || 0;
        updateBPMDisplay(bpm);
        
        if (sessionActive) {
            addBPMDataPoint(bpm);
        }
    });
    
    // Listener para distancia
    window.firebaseConfig.distanceRef.on('value', (snapshot) => {
        const distance = snapshot.val() || 0;
        updateDistanceDisplay(distance);
        
        if (sessionActive) {
            addDistanceDataPoint(distance);
        }
    });
    
    // Listener para pulsaciones
    window.firebaseConfig.pulsacionesRef.on('value', (snapshot) => {
        const pulsaciones = snapshot.val() || 0;
        console.log('Pulsaciones totales:', pulsaciones);
    });
}

// Configurar event listeners
function setupEventListeners() {
    // Botones de sesión
    startSessionBtn.addEventListener('click', startSession);
    endSessionBtn.addEventListener('click', endSession);
    
    // Metrónomo
    metronomeBtn.addEventListener('click', toggleMetronome);
    
    // Modal
    closeModal.addEventListener('click', closeNameModal);
    saveSessionBtn.addEventListener('click', saveSessionAndDownloadPDF);
    
    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', (event) => {
        if (event.target === nameModal) {
            closeNameModal();
        }
    });
    
    // Enter en el input de nombre
    personNameInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            saveSessionAndDownloadPDF();
        }
    });
}

// Inicializar gráfico
function initializeChart() {
    const ctx = document.getElementById('bpmChart').getContext('2d');
    
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'BPM',
                data: [],
                borderColor: '#007bff',
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#007bff',
                pointBorderColor: '#007bff',
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'BPM'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Tiempo'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            },
            animation: {
                duration: 750
            }
        }
    });
}

// Actualizar display de BPM
function updateBPMDisplay(bpm) {
    currentBPMDisplay.textContent = bpm.toFixed(1);
}

// Actualizar display de distancia
function updateDistanceDisplay(distance) {
    currentDistanceDisplay.textContent = distance.toFixed(1);
}

// Iniciar sesión
function startSession() {
    sessionActive = true;
    sessionStartTime = new Date();
    bpmData = [];
    distanceData = [];
    
    // Actualizar UI
    startSessionBtn.disabled = true;
    endSessionBtn.disabled = false;
    sessionDataDiv.style.display = 'none';
    
    // Iniciar timer
    sessionTimer = setInterval(updateSessionTimer, 1000);
    
    console.log('Sesión iniciada');
}

// Finalizar sesión
function endSession() {
    if (!sessionActive) return;
    
    sessionActive = false;
    clearInterval(sessionTimer);
    
    // Actualizar UI
    startSessionBtn.disabled = false;
    endSessionBtn.disabled = true;
    
    // Calcular estadísticas de la sesión
    const sessionStats = calculateSessionStats();
    displaySessionStats(sessionStats);
    
    // Mostrar modal para nombre
    showNameModal();
    
    console.log('Sesión finalizada');
}

// Actualizar timer de sesión
function updateSessionTimer() {
    if (!sessionStartTime) return;
    
    const now = new Date();
    const elapsed = now - sessionStartTime;
    const hours = Math.floor(elapsed / 3600000);
    const minutes = Math.floor((elapsed % 3600000) / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    
    sessionTimeDisplay.textContent = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Agregar punto de datos de BPM
function addBPMDataPoint(bpm) {
    const now = new Date();
    const timeLabel = now.toLocaleTimeString();
    
    bpmData.push({
        time: now,
        value: bpm,
        label: timeLabel
    });
    
    // Mantener solo los últimos 15 puntos
    if (bpmData.length > 15) {
        bpmData.shift();
    }
    
    updateChart();
}

// Agregar punto de datos de distancia
function addDistanceDataPoint(distance) {
    distanceData.push({
        time: new Date(),
        value: distance
    });
    
    // Mantener solo los últimos 15 puntos
    if (distanceData.length > 15) {
        distanceData.shift();
    }
}

// Actualizar gráfico
function updateChart() {
    if (!chart || bpmData.length === 0) return;
    
    const labels = bpmData.map(point => point.label);
    const data = bpmData.map(point => point.value);
    
    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.update('none'); // Sin animación para actualizaciones en tiempo real
}

// Calcular estadísticas de la sesión
function calculateSessionStats() {
    if (bpmData.length === 0) {
        return {
            duration: '00:00:00',
            averageBPM: 0,
            maxBPM: 0,
            minBPM: 0,
            totalDataPoints: 0
        };
    }
    
    const bpmValues = bpmData.map(point => point.value);
    const averageBPM = bpmValues.reduce((sum, bpm) => sum + bpm, 0) / bpmValues.length;
    const maxBPM = Math.max(...bpmValues);
    const minBPM = Math.min(...bpmValues);
    
    const duration = sessionTimeDisplay.textContent;
    
    return {
        duration,
        averageBPM: averageBPM.toFixed(1),
        maxBPM: maxBPM.toFixed(1),
        minBPM: minBPM.toFixed(1),
        totalDataPoints: bpmData.length
    };
}

// Mostrar estadísticas de la sesión
function displaySessionStats(stats) {
    document.getElementById('sessionDuration').textContent = stats.duration;
    document.getElementById('averageBPM').textContent = stats.averageBPM;
    document.getElementById('maxBPM').textContent = stats.maxBPM;
    document.getElementById('minBPM').textContent = stats.minBPM;
    
    // Crear gráfico de la sesión
    createSessionChart();
    
    sessionDataDiv.style.display = 'block';
}

// Crear gráfico de la sesión
function createSessionChart() {
    // Destruir gráfico anterior si existe
    if (sessionChart) {
        sessionChart.destroy();
    }
    
    const ctx = document.getElementById('sessionChart').getContext('2d');
    
    if (bpmData.length === 0) {
        // Mostrar mensaje si no hay datos
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.font = '16px Arial';
        ctx.fillStyle = '#666';
        ctx.textAlign = 'center';
        ctx.fillText('No hay datos de sesión disponibles', ctx.canvas.width / 2, ctx.canvas.height / 2);
        return;
    }
    
    sessionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: bpmData.map(point => point.label),
            datasets: [{
                label: 'BPM',
                data: bpmData.map(point => point.value),
                borderColor: '#007bff',
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#007bff',
                pointBorderColor: '#007bff',
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Evolución del BPM durante la Sesión',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    color: '#333'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'BPM',
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        color: '#333'
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.1)',
                        lineWidth: 1
                    },
                    ticks: {
                        font: {
                            size: 12
                        },
                        color: '#666'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Tiempo',
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        color: '#333'
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.1)',
                        lineWidth: 1
                    },
                    ticks: {
                        font: {
                            size: 12
                        },
                        color: '#666',
                        maxRotation: 45
                    }
                }
            },
            elements: {
                point: {
                    radius: 4,
                    hoverRadius: 6
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// Alternar metrónomo
function toggleMetronome() {
    if (metronomeActive) {
        stopMetronome();
    } else {
        startMetronome();
    }
}

// Iniciar metrónomo
function startMetronome() {
    const bpm = parseInt(metronomeBPMInput.value) || 120;
    const interval = 60000 / bpm; // Convertir BPM a milisegundos
    
    metronomeInterval = setInterval(() => {
        // Aquí podrías agregar un sonido o vibración
        console.log('Tick del metrónomo');
    }, interval);
    
    metronomeActive = true;
    metronomeBtn.innerHTML = '<i class="fas fa-stop"></i> Detener';
    metronomeBtn.classList.remove('btn-secondary');
    metronomeBtn.classList.add('btn-danger');
    metronomeStatus.textContent = 'Activo';
    metronomeStatus.className = 'status-active';
    
    console.log(`Metrónomo iniciado a ${bpm} BPM`);
}

// Detener metrónomo
function stopMetronome() {
    if (metronomeInterval) {
        clearInterval(metronomeInterval);
        metronomeInterval = null;
    }
    
    metronomeActive = false;
    metronomeBtn.innerHTML = '<i class="fas fa-play"></i> Iniciar';
    metronomeBtn.classList.remove('btn-danger');
    metronomeBtn.classList.add('btn-secondary');
    metronomeStatus.textContent = 'Desactivado';
    metronomeStatus.className = 'status-inactive';
    
    console.log('Metrónomo detenido');
}

// Mostrar modal de nombre
function showNameModal() {
    personNameInput.value = '';
    nameModal.style.display = 'block';
    personNameInput.focus();
}

// Cerrar modal de nombre
function closeNameModal() {
    nameModal.style.display = 'none';
}

// Guardar sesión y descargar PDF
async function saveSessionAndDownloadPDF() {
    const personName = personNameInput.value.trim();
    
    if (!personName) {
        alert('Por favor ingresa el nombre de la persona');
        return;
    }
    
    console.log('Iniciando guardado de sesión...');
    console.log('window.saveSessionToFirebase disponible:', typeof window.saveSessionToFirebase);
    console.log('firebaseConfig disponible:', typeof window.firebaseConfig);
    
    try {
        // Calcular estadísticas finales
        const sessionStats = calculateSessionStats();
        
        // Crear objeto de datos de sesión
        const sessionData = {
            personName: personName,
            startTime: sessionStartTime.toISOString(),
            endTime: new Date().toISOString(),
            duration: sessionStats.duration,
            averageBPM: parseFloat(sessionStats.averageBPM),
            maxBPM: parseFloat(sessionStats.maxBPM),
            minBPM: parseFloat(sessionStats.minBPM),
            totalDataPoints: sessionStats.totalDataPoints,
            bpmData: bpmData,
            distanceData: distanceData
        };
        
        // Guardar en Firebase (si está disponible)
        try {
            if (typeof window.saveSessionToFirebase === 'function') {
                console.log('Guardando en Firebase...');
                await window.saveSessionToFirebase(sessionData);
                console.log('Sesión guardada en Firebase exitosamente');
                showNotification('Sesión Guardada', 'Los datos se han guardado en Firebase', 'success');
            } else {
                console.log('Firebase no disponible, guardando solo localmente');
                showNotification('Guardado Local', 'Los datos se guardaron solo localmente', 'warning');
            }
        } catch (error) {
            console.warn('Error guardando en Firebase:', error);
            showNotification('Error de Guardado', 'No se pudo guardar en Firebase, pero el PDF se generó', 'warning');
        }
        
        // Asegurar que el gráfico de sesión esté visible antes de capturar
        if (sessionDataDiv.style.display === 'none') {
            sessionDataDiv.style.display = 'block';
        }
        
        // Pequeña pausa para asegurar que el gráfico se renderice
        setTimeout(() => {
            // Generar y descargar PDF
            generateAndDownloadPDF(sessionData);
            
            // Cerrar modal
            closeNameModal();
            
            // Resetear para nueva sesión
            resetSession();
            
            // Mostrar notificación de éxito
            showNotification('PDF Generado', 'El reporte se ha descargado correctamente', 'success');
        }, 500);
        
    } catch (error) {
        console.error('Error guardando sesión:', error);
        alert('Error guardando la sesión. Intenta nuevamente.');
    }
}

// Generar y descargar PDF
function generateAndDownloadPDF(sessionData) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Configuración del PDF
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = margin;
    
    // Título
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('Reporte de Sesión RCP', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;
    
    // Información de la persona
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Nombre del Alumno:', margin, yPosition);
    yPosition += 10;
    
    doc.setFont(undefined, 'normal');
    doc.text(`Nombre: ${sessionData.personName}`, margin, yPosition);
    yPosition += 8;
    doc.text(`Fecha: ${new Date(sessionData.startTime).toLocaleDateString()}`, margin, yPosition);
    yPosition += 8;
    doc.text(`Hora de inicio: ${new Date(sessionData.startTime).toLocaleTimeString()}`, margin, yPosition);
    yPosition += 8;
    doc.text(`Hora de finalización: ${new Date(sessionData.endTime).toLocaleTimeString()}`, margin, yPosition);
    yPosition += 15;
    
    // Estadísticas de la sesión
    doc.setFont(undefined, 'bold');
    doc.text('Estadísticas de la Sesión:', margin, yPosition);
    yPosition += 10;
    
    doc.setFont(undefined, 'normal');
    doc.text(`Duración total: ${sessionData.duration}`, margin, yPosition);
    yPosition += 8;
    doc.text(`BPM Promedio: ${sessionData.averageBPM}`, margin, yPosition);
    yPosition += 8;
    doc.text(`BPM Máximo: ${sessionData.maxBPM}`, margin, yPosition);
    yPosition += 20;
    
    // Gráfico de BPM (si hay datos)
    if (sessionData.bpmData.length > 0) {
        // Capturar el gráfico de la sesión de la web
        const chartImage = captureSessionChart();
        
        if (chartImage) {
            doc.setFont(undefined, 'bold');
            doc.text('Gráfico de BPM a lo Largo del Tiempo:', margin, yPosition);
            yPosition += 15;
            
            // Agregar el gráfico al PDF
            const chartWidth = pageWidth - (margin * 2);
            const chartHeight = 80;
            
            doc.addImage(chartImage, 'PNG', margin, yPosition, chartWidth, chartHeight);
            yPosition += chartHeight + 20;
        }
    }
    
    // Nueva página para la tabla de datos
    if (sessionData.bpmData.length > 0) {
        doc.addPage();
        yPosition = margin;
        
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text('Datos Detallados de BPM', margin, yPosition);
        yPosition += 15;
        
        // Encabezados de tabla
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.text('Tiempo', margin, yPosition);
        doc.text('BPM', margin + 60, yPosition);
        doc.text('Distancia (cm)', margin + 100, yPosition);
        yPosition += 8;
        
        // Línea separadora
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 5;
        
        // Datos de la tabla
        doc.setFont(undefined, 'normal');
        sessionData.bpmData.forEach((point, index) => {
            if (yPosition > 250) { // Nueva página si es necesario
                doc.addPage();
                yPosition = margin;
            }
            
            const distanceValue = sessionData.distanceData[index] ? 
                sessionData.distanceData[index].value.toFixed(1) : 'N/A';
            
            doc.text(point.label, margin, yPosition);
            doc.text(point.value.toFixed(1), margin + 60, yPosition);
            doc.text(distanceValue, margin + 100, yPosition);
            yPosition += 6;
        });
    }
    
    // Pie de página
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Página ${i} de ${totalPages}`, pageWidth - margin, doc.internal.pageSize.getHeight() - 10, { align: 'right' });
        doc.text(`Generado el: ${new Date().toLocaleString()}`, margin, doc.internal.pageSize.getHeight() - 10);
    }
    
    // Descargar PDF
    const fileName = `Sesion_RCP_${sessionData.personName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    
    console.log('PDF generado y descargado con gráfico');
}

// Capturar el gráfico de la sesión de la web
function captureSessionChart() {
    try {
        // Verificar que el gráfico de sesión existe
        if (!sessionChart) {
            console.warn('No hay gráfico de sesión para capturar');
            return null;
        }
        
        // Obtener el canvas del gráfico de sesión
        const canvas = sessionChart.canvas;
        
        if (!canvas) {
            console.warn('No se pudo obtener el canvas del gráfico de sesión');
            return null;
        }
        
        // Capturar la imagen del canvas
        const imageData = canvas.toDataURL('image/png', 1.0);
        
        console.log('Gráfico de sesión capturado exitosamente');
        return imageData;
        
    } catch (error) {
        console.error('Error capturando gráfico de sesión:', error);
        return null;
    }
}

// Resetear sesión
function resetSession() {
    sessionActive = false;
    sessionStartTime = null;
    bpmData = [];
    distanceData = [];
    
    // Limpiar timer
    if (sessionTimer) {
        clearInterval(sessionTimer);
        sessionTimer = null;
    }
    
    // Resetear UI
    sessionTimeDisplay.textContent = '00:00:00';
    startSessionBtn.disabled = false;
    endSessionBtn.disabled = true;
    sessionDataDiv.style.display = 'none';
    
    // Limpiar gráfico principal
    if (chart) {
        chart.data.labels = [];
        chart.data.datasets[0].data = [];
        chart.update();
    }
    
    // Limpiar gráfico de sesión
    if (sessionChart) {
        sessionChart.destroy();
        sessionChart = null;
    }
    
    console.log('Sesión reseteada');
}

// Mostrar overlay de carga
function showLoadingOverlay() {
    loadingOverlay.style.display = 'flex';
}

// Ocultar overlay de carga
function hideLoadingOverlay() {
    loadingOverlay.style.display = 'none';
}

// Función de utilidad para formatear tiempo
function formatTime(milliseconds) {
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
