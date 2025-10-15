# Monitor RCP - Aplicación Web

Una aplicación web responsiva para monitorear sesiones de RCP (Reanimación Cardiopulmonar) en tiempo real, conectada con un dispositivo Arduino que envía datos a Firebase.

## Características

- **Dashboard en tiempo real** con métricas de BPM y distancia de compresión
- **Gráfico interactivo** que muestra la evolución del BPM a lo largo del tiempo
- **Control de sesiones** con botones de inicio y fin
- **Metrónomo integrado** para guiar las compresiones
- **Integración con Firebase** para recibir datos del Arduino
- **Generación de PDF** con reportes detallados de cada sesión
- **Diseño responsivo** que se adapta a diferentes tamaños de pantalla

## Estructura del Proyecto

```
Webpepe/
├── index.html          # Estructura principal de la aplicación
├── styles.css          # Estilos CSS responsivos
├── app.js             # Lógica principal de la aplicación
├── firebase-config.js # Configuración de Firebase
└── README.md          # Este archivo
```

## Configuración

### Firebase
La aplicación está configurada para conectarse a la base de datos Firebase usando las mismas credenciales del código Arduino:

- **API Key**: `AIzaSyD8OvmstfYLS1Qv11aFYRrzDn79uDiW4m0`
- **Database URL**: `https://monitorrcp-31512-default-rtdb.firebaseio.com/`
- **Project ID**: `monitorrcp-31512`

### Estructura de Datos en Firebase

La aplicación lee datos de los siguientes nodos:
- `/monitor/bpm` - BPM actual del Arduino
- `/monitor/distance` - Distancia de compresión actual
- `/monitor/pulsaciones` - Total de pulsaciones registradas

Y guarda sesiones completadas en:
- `/sessions/` - Historial de todas las sesiones realizadas

## Funcionalidades

### 1. Monitoreo en Tiempo Real
- Muestra BPM y distancia de compresión actualizados automáticamente
- Gráfico que mantiene los últimos 15 puntos de datos
- Actualización cada segundo desde Firebase

### 2. Control de Sesiones
- **Iniciar Sesión**: Comienza el registro de datos y el cronómetro
- **Finalizar Sesión**: Termina la sesión y muestra estadísticas
- Cronómetro que muestra la duración de la sesión

### 3. Metrónomo
- Permite configurar BPM objetivo (60-200 BPM)
- Botón para iniciar/detener el metrónomo
- Indicador visual del estado

### 4. Reportes PDF
Al finalizar una sesión:
- Modal para ingresar el nombre de la persona
- Generación automática de PDF con:
  - Información del paciente
  - Estadísticas de la sesión (duración, BPM promedio, máximo, mínimo)
  - Tabla detallada con todos los datos de BPM
  - Timestamps de inicio y fin

### 5. Diseño Responsivo
- Adaptable a dispositivos móviles y tablets
- Grid layout que se reorganiza según el tamaño de pantalla
- Botones y controles optimizados para touch

## Uso

1. **Abrir la aplicación** en un navegador web
2. **Verificar conexión** a Firebase (aparece un indicador de carga)
3. **Iniciar sesión** cuando comience la práctica de RCP
4. **Monitorear datos** en tiempo real en el dashboard
5. **Finalizar sesión** cuando termine la práctica
6. **Ingresar nombre** de la persona en el modal
7. **Descargar PDF** con el reporte completo

## Dependencias

### CDN (incluidas en el HTML)
- **Font Awesome 6.0.0** - Iconos
- **Chart.js** - Gráficos
- **Firebase 9.22.0** - Base de datos en tiempo real
- **jsPDF 2.5.1** - Generación de PDFs

### Navegadores Soportados
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Integración con Arduino

La aplicación está diseñada para trabajar con el código Arduino que:
- Mide BPM usando un limit switch
- Mide distancia de compresión con sensor VL53L0X
- Envía datos a Firebase cada segundo
- Usa las mismas credenciales de Firebase

## Personalización

### Cambiar Colores
Modifica las variables CSS en `styles.css`:
```css
:root {
    --primary-color: #007bff;
    --danger-color: #dc3545;
    --success-color: #28a745;
}
```

### Ajustar Intervalos
En `app.js`, puedes modificar:
- Frecuencia de actualización del gráfico
- Número de puntos de datos mostrados
- Intervalos del metrónomo

### Configurar Firebase
Actualiza `firebase-config.js` con tus propias credenciales si cambias de proyecto.

## Solución de Problemas

### Error de Conexión a Firebase
- Verificar conexión a internet
- Comprobar que las credenciales sean correctas
- Revisar la consola del navegador para errores específicos

### Datos No Se Actualizan
- Verificar que el Arduino esté enviando datos
- Comprobar la estructura de datos en Firebase
- Revisar los listeners en la consola

### PDF No Se Descarga
- Verificar que jsPDF esté cargado correctamente
- Comprobar permisos del navegador para descargas
- Revisar la consola para errores de JavaScript

## Licencia

Este proyecto está desarrollado para uso educativo y médico en prácticas de RCP.
