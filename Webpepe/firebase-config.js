// Configuración de Firebase
// Usando las mismas credenciales del código Arduino
const firebaseConfig = {
    apiKey: "AIzaSyD8OvmstfYLS1Qv11aFYRrzDn79uDiW4m0",
    authDomain: "monitorrcp-31512.firebaseapp.com",
    databaseURL: "https://monitorrcp-31512-default-rtdb.firebaseio.com/",
    projectId: "monitorrcp-31512",
    storageBucket: "monitorrcp-31512.appspot.com",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Obtener referencia a la base de datos
const database = firebase.database();

// Referencias a los nodos de datos del Arduino
const bpmRef = database.ref('/monitor/bpm');
const distanceRef = database.ref('/monitor/distance');
const pulsacionesRef = database.ref('/monitor/pulsaciones');

// Función para verificar la conexión a Firebase
function checkFirebaseConnection() {
    return new Promise((resolve, reject) => {
        // Timeout de 10 segundos
        const timeout = setTimeout(() => {
            reject(new Error('Timeout: No se pudo conectar a Firebase en 10 segundos'));
        }, 10000);
        
        const testRef = database.ref('/monitor');
        testRef.once('value')
            .then(() => {
                clearTimeout(timeout);
                console.log('Conexión a Firebase establecida correctamente');
                resolve(true);
            })
            .catch((error) => {
                clearTimeout(timeout);
                console.error('Error conectando a Firebase:', error);
                reject(error);
            });
    });
}

// Función para guardar datos de sesión en Firebase
function saveSessionToFirebase(sessionData) {
    const sessionsRef = database.ref('/sessions');
    const newSessionRef = sessionsRef.push();
    
    return newSessionRef.set({
        ...sessionData,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        createdAt: new Date().toISOString()
    });
}

// Función para obtener todas las sesiones
function getAllSessions() {
    return database.ref('/sessions').once('value');
}

// Exportar funciones para uso en app.js
window.firebaseConfig = {
    database,
    bpmRef,
    distanceRef,
    pulsacionesRef,
    checkFirebaseConnection,
    saveSessionToFirebase,
    getAllSessions
};

// Asegurar que las funciones estén disponibles globalmente
window.checkFirebaseConnection = checkFirebaseConnection;
window.saveSessionToFirebase = saveSessionToFirebase;
window.getAllSessions = getAllSessions;

// Log para verificar que las funciones se cargaron correctamente
console.log('Firebase config cargado:', {
    checkFirebaseConnection: typeof window.checkFirebaseConnection,
    saveSessionToFirebase: typeof window.saveSessionToFirebase,
    getAllSessions: typeof window.getAllSessions,
    firebaseConfig: typeof window.firebaseConfig
});
