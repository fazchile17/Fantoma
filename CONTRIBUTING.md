# Guía de Contribución - Monitor RCP

¡Gracias por tu interés en contribuir al proyecto Monitor RCP! Esta guía te ayudará a entender cómo contribuir de manera efectiva.

## 🚀 Cómo Contribuir

### 1. Fork del Repositorio
1. Ve al repositorio en GitHub
2. Haz clic en "Fork" en la esquina superior derecha
3. Clona tu fork localmente:
   ```bash
   git clone https://github.com/tu-usuario/monitor-rcp.git
   cd monitor-rcp
   ```

### 2. Configurar el Entorno
1. Crea una rama para tu feature:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```

2. Instala las dependencias necesarias (si las hay):
   ```bash
   # Para desarrollo web
   cd Webpepe
   # No hay dependencias de Node.js actualmente
   ```

### 3. Hacer Cambios

#### Para el Código Arduino (`pepe.ino`):
- Mantén la compatibilidad con ESP32
- Documenta cualquier cambio en la configuración de hardware
- Prueba en hardware real antes de hacer commit

#### Para la Aplicación Web (`Webpepe/`):
- Mantén la compatibilidad con navegadores modernos
- Sigue las convenciones de JavaScript existentes
- Prueba la responsividad en diferentes dispositivos
- Usa `test.html` para verificar funcionalidades

### 4. Probar Cambios
1. **Arduino**: Prueba en hardware real
2. **Web**: Abre `Webpepe/test.html` y ejecuta todas las pruebas
3. **Integración**: Verifica que Arduino y web funcionen juntos

### 5. Hacer Commit
```bash
git add .
git commit -m "feat: agregar nueva funcionalidad X"
```

### 6. Push y Pull Request
```bash
git push origin feature/nueva-funcionalidad
```

Luego crea un Pull Request en GitHub.

## 📝 Convenciones de Commit

Usa el formato: `tipo: descripción`

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Cambios de formato (espacios, etc.)
- `refactor:` Refactorización de código
- `test:` Agregar o modificar tests
- `chore:` Cambios en herramientas, configuración, etc.

## 🧪 Testing

### Para Arduino:
- Prueba en hardware real
- Verifica que los sensores funcionen correctamente
- Comprueba la conectividad WiFi y Firebase

### Para Web:
- Usa `Webpepe/test.html` para pruebas básicas
- Prueba en diferentes navegadores (Chrome, Firefox, Safari, Edge)
- Verifica responsividad en móviles y tablets
- Prueba con y sin conexión a Firebase

## 📋 Checklist para Pull Requests

- [ ] Código probado en hardware real (Arduino)
- [ ] Aplicación web probada en múltiples navegadores
- [ ] Responsividad verificada
- [ ] Tests ejecutados y pasando
- [ ] Documentación actualizada si es necesario
- [ ] Commit messages descriptivos
- [ ] No hay errores de linting

## 🐛 Reportar Bugs

Al reportar bugs, incluye:

1. **Descripción clara** del problema
2. **Pasos para reproducir**
3. **Comportamiento esperado**
4. **Comportamiento actual**
5. **Información del sistema**:
   - Navegador y versión
   - Sistema operativo
   - Versión del Arduino IDE
   - Modelo de ESP32

## 💡 Sugerir Features

Para sugerir nuevas funcionalidades:

1. Verifica que no esté ya en el roadmap
2. Describe claramente la funcionalidad
3. Explica el caso de uso
4. Considera la complejidad de implementación
5. Piensa en la compatibilidad con hardware existente

## 📚 Estándares de Código

### JavaScript:
- Usa `const` y `let` en lugar de `var`
- Nombres de variables descriptivos
- Comentarios para lógica compleja
- Manejo de errores apropiado

### CSS:
- Usa clases semánticas
- Mantén consistencia en naming
- Usa variables CSS cuando sea posible
- Optimiza para rendimiento

### Arduino:
- Comentarios en español
- Nombres de variables descriptivos
- Manejo de errores robusto
- Documentación de configuración

## 🔒 Seguridad

- No incluyas credenciales reales en commits
- Usa variables de entorno para configuraciones sensibles
- Valida todas las entradas de usuario
- Mantén las dependencias actualizadas

## 📞 Comunicación

- Usa GitHub Issues para discusiones técnicas
- Mantén el tono profesional y respetuoso
- Sé específico en tus preguntas y respuestas
- Ayuda a otros contribuidores cuando puedas

## 🎯 Roadmap

Funcionalidades planificadas:
- [ ] Soporte para múltiples sesiones simultáneas
- [ ] Exportación a Excel
- [ ] Modo offline mejorado
- [ ] Integración con sistemas LMS
- [ ] App móvil nativa

## 📄 Licencia

Al contribuir, aceptas que tu código será licenciado bajo la MIT License.

---

¡Gracias por contribuir a hacer el Monitor RCP mejor para todos! 🚀
