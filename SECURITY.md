# Política de Seguridad - Monitor RCP

## Versiones Soportadas

Usa esta sección para informar a las personas sobre qué versiones de tu proyecto están actualmente siendo soportadas con actualizaciones de seguridad.

| Versión | Soportada          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reportar una Vulnerabilidad

Si descubres una vulnerabilidad de seguridad en el proyecto Monitor RCP, por favor sigue estos pasos:

### 1. No Divulgues Públicamente
- **NO** crees un issue público en GitHub
- **NO** discutas la vulnerabilidad en foros públicos
- **NO** publiques detalles en redes sociales

### 2. Reporta Privadamente
Envía un email a [email de seguridad] con la siguiente información:

- Descripción detallada de la vulnerabilidad
- Pasos para reproducir el problema
- Impacto potencial de la vulnerabilidad
- Cualquier código o archivos relevantes
- Tu información de contacto

### 3. Proceso de Respuesta
- Recibirás confirmación del reporte dentro de 48 horas
- Evaluaremos la vulnerabilidad y su impacto
- Te mantendremos informado sobre el progreso
- Coordinaremos la publicación de un fix

## Mejores Prácticas de Seguridad

### Para Desarrolladores
- Nunca commitees credenciales reales
- Usa variables de entorno para configuraciones sensibles
- Valida todas las entradas de usuario
- Mantén las dependencias actualizadas
- Revisa el código antes de hacer merge

### Para Usuarios
- Cambia las credenciales por defecto
- Usa conexiones WiFi seguras
- Mantén el firmware actualizado
- No expongas el sistema a internet público sin protección

## Configuración Segura

### Arduino (ESP32)
```cpp
// Cambia estas credenciales por defecto
#define WIFI_SSID "tu-wifi-seguro"
#define WIFI_PASSWORD "tu-password-seguro"
#define USER_EMAIL "tu-email@dominio.com"
#define USER_PASSWORD "tu-password-seguro"
```

### Firebase
- Usa reglas de seguridad apropiadas
- Limita el acceso a los datos
- Monitorea el uso de la base de datos
- Usa autenticación cuando sea posible

### Aplicación Web
- Sirve solo sobre HTTPS en producción
- Implementa Content Security Policy (CSP)
- Valida todas las entradas del usuario
- Usa headers de seguridad apropiados

## Vulnerabilidades Conocidas

### Versión 1.0.0
- No hay vulnerabilidades conocidas actualmente

## Actualizaciones de Seguridad

### 2025-01-XX
- Versión inicial del proyecto
- Implementación de medidas de seguridad básicas

## Contacto de Seguridad

Para reportar vulnerabilidades de seguridad:
- Email: [email de seguridad]
- Respuesta esperada: 48 horas

## Agradecimientos

Agradecemos a todos los investigadores de seguridad que reportan vulnerabilidades de manera responsable. Su trabajo ayuda a mantener seguro el proyecto Monitor RCP.

## Licencia

Este documento está bajo la misma licencia que el proyecto principal (MIT License).
