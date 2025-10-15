#include <Arduino.h>
#include <WiFi.h>
#include <FirebaseESP32.h>
#include <Wire.h>
#include <math.h> // Para usar abs()
#include <driver/timer.h>
#include <Adafruit_VL53L0X.h> // Biblioteca para el sensor VL53L0X

// Provide the token generation process info.
#include <addons/TokenHelper.h>

// Provide the RTDB payload printing info and other helper functions.
#include <addons/RTDBHelper.h>

/* 1. Define the WiFi credentials */
#define WIFI_SSID "Guts"
#define WIFI_PASSWORD "Berserk666"

/* 2. Define the API Key */
#define API_KEY "AIzaSyD8OvmstfYLS1Qv11aFYRrzDn79uDiW4m0"

/* 3. Define the RTDB URL */
#define DATABASE_URL "https://monitorrcp-31512-default-rtdb.firebaseio.com/"

/* 4. Define the user Email and password that alreadey registerd or added in your project */
#define USER_EMAIL "bad.elterrible@gmail.com"
#define USER_PASSWORD "123456"

// Definición de pines
#define LIMIT_SWITCH_PIN 13    // Pin para el limit switch
// El VL53L0X usa I2C: SDA (GPIO 21) y SCL (GPIO 22) por defecto en ESP32

// Configuración de pulsaciones
const unsigned long VENTANA_TIEMPO = 5000; // 5 segundos para calcular BPM
const unsigned long TIMEOUT_BPM = 10000; // 10 segundos sin pulsaciones para resetear BPM
const unsigned long DEBOUNCE_TIME = 100; // 100ms para antirrebote
const float DISTANCIA_OFFSET = 13.9; // Valor a restar de la distancia

// Variables globales
volatile unsigned long pulsaciones[100]; // Aumentado a 100 pulsaciones
volatile int pulsacionIndex = 0;
volatile int totalPulsaciones = 0;
volatile float currentBPM = 0;
volatile float currentDistance = 0;
volatile unsigned long ultimaPulsacion = 0;
unsigned long sendDataPrevMillis = 0;
unsigned long lastDistanceMeasure = 0;
volatile bool metronomoActivo = false;
bool limitSwitchPresionado = false;

// Declaración anticipada de la función handleInterrupt
void IRAM_ATTR handleInterrupt();

// Objetos
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;
Adafruit_VL53L0X lox = Adafruit_VL53L0X(); // Objeto del sensor VL53L0X

// Función para calcular BPM
void calcularBPM() {
    unsigned long tiempoActual = millis();
    
    // Si no hay pulsaciones en los últimos 10 segundos, resetear BPM
    if (tiempoActual - ultimaPulsacion > TIMEOUT_BPM) {
        currentBPM = 0;
        return;
    }
    
    int pulsacionesEnVentana = 0;
    
    // Contar pulsaciones dentro de la ventana de tiempo
    for (int i = 0; i < totalPulsaciones; i++) {
        if (tiempoActual - pulsaciones[i] <= VENTANA_TIEMPO) {
            pulsacionesEnVentana++;
        }
    }
    
    // Calcular BPM: (pulsaciones * 60) / 6.5
    if (pulsacionesEnVentana > 0) {
        currentBPM = (pulsacionesEnVentana * 60.0) / 6.5;
    }
    
    // Imprimir por Serial
    Serial.print("BPM: ");
    Serial.println(currentBPM);
}

void setup() {
    Serial.begin(115200);
    
    // Inicializar pines
    pinMode(LIMIT_SWITCH_PIN, INPUT_PULLUP);
    
    // Configurar interrupción para el limit switch
    attachInterrupt(digitalPinToInterrupt(LIMIT_SWITCH_PIN), handleInterrupt, FALLING);
    
    // Inicializar sensor VL53L0X
    Serial.println("Iniciando sensor VL53L0X...");
    
    if (!lox.begin()) {
        Serial.println(F("Error al inicializar VL53L0X"));
        Serial.println("Continuando sin sensor...");
    } else {
        Serial.println(F("Sensor VL53L0X iniciado correctamente"));
    }
    
    // Configuración WiFi
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    Serial.print("Conectando a Wi-Fi");
    while (WiFi.status() != WL_CONNECTED) {
        Serial.print(".");
        delay(300);
    }
    Serial.println();
    Serial.print("Conectado con IP: ");
    Serial.println(WiFi.localIP());
    Serial.println();

    // Configuración Firebase con timeout
    config.api_key = API_KEY;
    auth.user.email = USER_EMAIL;
    auth.user.password = USER_PASSWORD;
    config.database_url = DATABASE_URL;
    config.token_status_callback = tokenStatusCallback;
    Firebase.reconnectNetwork(true);
    fbdo.setBSSLBufferSize(4096, 1024);
    
    // Intentar conectar a Firebase con timeout
    unsigned long firebaseStartTime = millis();
    Firebase.begin(&config, &auth);
    
    // Esperar máximo 10 segundos por la autenticación
    while (millis() - firebaseStartTime < 10000 && Firebase.ready() == false) {
        delay(100);
        Serial.print(".");
    }
    
    if (Firebase.ready()) {
        Firebase.setDoubleDigits(5);
        Serial.println();
        Serial.println("Firebase conectado correctamente");
    } else {
        Serial.println();
        Serial.println("Firebase timeout - continuando sin Firebase");
    }
    
    // Mensaje inicial
    Serial.println("Sistema iniciado. Esperando primera pulsación...");
}

void loop() {
    // Calcular BPM constantemente
    calcularBPM();
    
    // Verificar si el limit switch se ha soltado
    if (limitSwitchPresionado && digitalRead(LIMIT_SWITCH_PIN) == HIGH) {
        limitSwitchPresionado = false;
    }
    
    // Medir distancia rápidamente (cada 100ms como en el ejemplo)
    if (millis() - lastDistanceMeasure >= 100) {
        VL53L0X_RangingMeasurementData_t measure;
        
        // Realizar medición con el VL53L0X
        lox.rangingTest(&measure, false);
        
        if (measure.RangeStatus != 4) { // 4 = fuera de rango
            float distanciaRaw = measure.RangeMilliMeter / 10.0; // Convertir de mm a cm
            
            // Aplicar offset y valor absoluto
            currentDistance = abs(distanciaRaw - DISTANCIA_OFFSET);
            
            // Imprimir datos en Serial (más rápido)
            Serial.print("BPM: ");
            Serial.print(currentBPM, 1);
            Serial.print(" | Dist: ");
            Serial.print(currentDistance, 1);
            Serial.println(" cm");
        } else {
            Serial.println("Fuera de rango");
        }
        
        lastDistanceMeasure = millis();
    }
    
    // Enviar datos a Firebase cada 1 segundo (solo si está conectado)
    if (Firebase.ready() && (millis() - sendDataPrevMillis >= 1000)) {
        sendDataPrevMillis = millis();
        bool firebaseSuccess = true;
        
        if (!Firebase.setFloat(fbdo, "/monitor/bpm", currentBPM)) {
            firebaseSuccess = false;
        }
        if (!Firebase.setFloat(fbdo, "/monitor/distance", currentDistance)) {
            firebaseSuccess = false;
        }
        if (!Firebase.setInt(fbdo, "/monitor/pulsaciones", totalPulsaciones)) {
            firebaseSuccess = false;
        }
        
        if (!firebaseSuccess) {
            Serial.println("Error enviando datos a Firebase");
        }
    }
}

void IRAM_ATTR handleInterrupt() {
    unsigned long tiempoActual = millis();
    
    // Antirrebote mejorado
    if (tiempoActual - ultimaPulsacion > DEBOUNCE_TIME) {
        pulsaciones[pulsacionIndex] = tiempoActual;
        pulsacionIndex = (pulsacionIndex + 1) % 100;
        totalPulsaciones++;
        ultimaPulsacion = tiempoActual;
        limitSwitchPresionado = true;
    }
}
