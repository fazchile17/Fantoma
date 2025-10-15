# Monitor RCP - Sistema de Monitoreo en Tiempo Real

Un sistema completo para monitorear sesiones de RCP (Reanimación Cardiopulmonar) que incluye un dispositivo Arduino con sensores y una aplicación web responsiva para visualización y análisis de datos.

## 🚀 Características

### Hardware (Arduino)
- **Sensor de BPM**: Limit switch para detectar compresiones
- **Sensor de Distancia**: VL53L0X para medir profundidad de compresión
- **Conectividad**: WiFi para envío de datos a Firebase
- **Cálculo en Tiempo Real**: BPM calculado cada 5 segundos

### Software (Aplicación Web)
- **Dashboard Responsivo**: Interfaz moderna y adaptable
- **Monitoreo en Tiempo Real**: Datos actualizados automáticamente
- **Control de Sesiones**: Inicio/fin con cronómetro integrado
- **Gráficos Interactivos**: Visualización de BPM a lo largo del tiempo
- **Metrónomo**: Guía de compresiones (60-200 BPM)
- **Reportes PDF**: Generación automática con gráficos
- **Integración Firebase**: Almacenamiento y sincronización de datos

## 📁 Estructura del Proyecto

```
├── pepe.ino                 # Código del Arduino
├── Webpepe/                 # Aplicación web
│   ├── index.html          # Interfaz principal
│   ├── styles.css          # Estilos responsivos
│   ├── app.js              # Lógica de la aplicación
│   ├── firebase-config.js  # Configuración de Firebase
│   ├── config.js           # Configuración general
│   ├── test.html           # Herramientas de diagnóstico
│   └── README.md           # Documentación web
└── README.md               # Este archivo
```

## 🛠️ Instalación y Configuración

### Requisitos del Hardware
- ESP32
- Sensor VL53L0X
- Limit switch
- Conexión WiFi

### Configuración del Arduino
1. Abre `pepe.ino` en Arduino IDE
2. Instala las librerías necesarias:
   - FirebaseESP32
   - Adafruit_VL53L0X
   - WiFi
3. Configura las credenciales WiFi en el código
4. Sube el código al ESP32

### Configuración de la Aplicación Web
1. Abre `Webpepe/index.html` en un navegador
2. La aplicación se conectará automáticamente a Firebase
3. Si no hay conexión, funcionará en modo demo

## 🔧 Configuración de Firebase

El sistema usa Firebase Realtime Database con la siguiente estructura:

```
/monitor/
├── bpm          # BPM actual
├── distance     # Distancia de compresión
└── pulsaciones  # Total de pulsaciones

/sessions/       # Historial de sesiones
└── [sessionId]/
    ├── personName
    ├── startTime
    ├── endTime
    ├── duration
    ├── averageBPM
    ├── maxBPM
    └── bpmData[]
```

## 📊 Uso del Sistema

### 1. Iniciar Sesión
- Haz clic en "Iniciar Sesión"
- El cronómetro comenzará a contar
- Los datos se recopilarán automáticamente

### 2. Monitoreo
- Observa el BPM en tiempo real
- Verifica la profundidad de compresión
- Usa el metrónomo si es necesario

### 3. Finalizar Sesión
- Haz clic en "Finalizar Sesión"
- Ingresa el nombre del alumno
- Descarga el reporte PDF automáticamente

## 🧪 Herramientas de Diagnóstico

Abre `Webpepe/test.html` para:
- Verificar dependencias
- Probar conexión a Firebase
- Validar generación de PDF
- Diagnosticar problemas

## 📱 Características Responsivas

- **Desktop**: Vista completa con todos los controles
- **Tablet**: Layout adaptado con controles táctiles
- **Móvil**: Interfaz optimizada para pantallas pequeñas

## 🔒 Seguridad

- Credenciales de Firebase configuradas
- Datos encriptados en tránsito
- Validación de entrada de datos
- Manejo seguro de sesiones

## 🐛 Solución de Problemas

### Error de Conexión a Firebase
1. Verifica la conexión a internet
2. Comprueba las credenciales en `firebase-config.js`
3. Usa `test.html` para diagnosticar

### Datos No Se Actualizan
1. Verifica que el Arduino esté funcionando
2. Comprueba la conexión WiFi del Arduino
3. Revisa la consola del navegador

### PDF No Se Descarga
1. Verifica permisos del navegador
2. Comprueba que jsPDF esté cargado
3. Revisa la consola para errores

## 📈 Métricas del Sistema

- **Precisión BPM**: ±2 BPM
- **Rango de Distancia**: 0-50 cm
- **Frecuencia de Actualización**: 1 segundo
- **Ventana de Cálculo BPM**: 5 segundos
- **Timeout de Sesión**: 10 segundos sin actividad

## 🤝 Contribuciones

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Autores

- **Bruno** - Desarrollo inicial y implementación

## 🙏 Agradecimientos

- Adafruit por la librería VL53L0X
- Firebase por la plataforma de base de datos
- Chart.js por las capacidades de gráficos
- jsPDF por la generación de PDFs

## 📞 Soporte

Para soporte técnico o preguntas:
- Abre un issue en GitHub
- Revisa la documentación en `Webpepe/README.md`
- Usa las herramientas de diagnóstico en `test.html`

---

**Desarrollado para uso educativo en prácticas de RCP**
