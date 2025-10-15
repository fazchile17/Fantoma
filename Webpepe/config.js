// Configuración de la aplicación Monitor RCP
const AppConfig = {
    // Configuración de Firebase (debe coincidir con Arduino)
    firebase: {
        apiKey: "AIzaSyD8OvmstfYLS1Qv11aFYRrzDn79uDiW4m0",
        authDomain: "monitorrcp-31512.firebaseapp.com",
        databaseURL: "https://monitorrcp-31512-default-rtdb.firebaseio.com/",
        projectId: "monitorrcp-31512",
        storageBucket: "monitorrcp-31512.appspot.com"
    },
    
    // Configuración de la aplicación
    app: {
        name: "Monitor RCP",
        version: "1.0.0",
        maxDataPoints: 15, // Número máximo de puntos en el gráfico
        updateInterval: 1000, // Intervalo de actualización en ms
        sessionTimeout: 300000 // 5 minutos de timeout para sesiones
    },
    
    // Configuración del metrónomo
    metronome: {
        defaultBPM: 120,
        minBPM: 60,
        maxBPM: 200,
        step: 5
    },
    
    // Configuración del PDF
    pdf: {
        title: "Reporte de Sesión RCP",
        author: "Monitor RCP System",
        subject: "Datos de Sesión de Reanimación Cardiopulmonar",
        creator: "Monitor RCP Web App",
        producer: "jsPDF"
    },
    
    // Configuración de la UI
    ui: {
        theme: {
            primary: "#007bff",
            secondary: "#6c757d",
            success: "#28a745",
            danger: "#dc3545",
            warning: "#ffc107",
            info: "#17a2b8",
            light: "#f8f9fa",
            dark: "#343a40"
        },
        animations: {
            duration: 300,
            easing: "ease-in-out"
        }
    },
    
    // Configuración de notificaciones
    notifications: {
        enabled: true,
        types: {
            sessionStart: {
                title: "Sesión Iniciada",
                message: "El monitoreo de RCP ha comenzado",
                icon: "fas fa-play-circle"
            },
            sessionEnd: {
                title: "Sesión Finalizada",
                message: "La sesión ha terminado. Ingresa el nombre del paciente.",
                icon: "fas fa-stop-circle"
            },
            metronomeStart: {
                title: "Metrónomo Activado",
                message: "El metrónomo ha comenzado",
                icon: "fas fa-music"
            },
            metronomeStop: {
                title: "Metrónomo Desactivado",
                message: "El metrónomo se ha detenido",
                icon: "fas fa-pause-circle"
            }
        }
    },
    
    // Configuración de validación
    validation: {
        personName: {
            minLength: 2,
            maxLength: 50,
            pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
        },
        bpm: {
            min: 0,
            max: 300
        },
        distance: {
            min: 0,
            max: 50
        }
    },
    
    // Configuración de desarrollo
    development: {
        debug: false,
        logLevel: "info", // debug, info, warn, error
        mockData: false
    }
};

// Función para obtener configuración
function getConfig(path) {
    const keys = path.split('.');
    let value = AppConfig;
    
    for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
            value = value[key];
        } else {
            return undefined;
        }
    }
    
    return value;
}

// Función para establecer configuración
function setConfig(path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    let target = AppConfig;
    
    for (const key of keys) {
        if (!target[key] || typeof target[key] !== 'object') {
            target[key] = {};
        }
        target = target[key];
    }
    
    target[lastKey] = value;
}

// Función para validar configuración
function validateConfig() {
    const required = [
        'firebase.apiKey',
        'firebase.databaseURL',
        'app.name',
        'app.version'
    ];
    
    const missing = required.filter(path => !getConfig(path));
    
    if (missing.length > 0) {
        console.error('Configuración faltante:', missing);
        return false;
    }
    
    return true;
}

// Exportar para uso global
window.AppConfig = AppConfig;
window.getConfig = getConfig;
window.setConfig = setConfig;
window.validateConfig = validateConfig;
