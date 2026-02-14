# 📅 Sistema de Reservas Empresarial Multirrol

Sistema completo de gestión de reservas con tres roles diferenciados: Administrador, Operador y Cliente. Desarrollado con HTML5, CSS (Bootstrap), JavaScript Vanilla y localStorage.

## 🚀 Características Principales

### Por Rol de Usuario

#### 👨‍💼 Administrador
- Visualizar todas las reservas del sistema
- Cambiar estado de reservas (pendiente, confirmada, cancelada, completada)
- Eliminar reservas
- Acceder a panel estadístico con gráficos
- Gestionar usuarios y cambiar roles
- Aplicar filtros avanzados (estado, rango de fechas)

#### 👨‍💻 Operador
- Confirmar reservas pendientes
- Reprogramar fechas y horarios
- Consultar agenda diaria
- Cambiar estados de reservas
- Visualizar todas las reservas del sistema

#### 👤 Cliente
- Registrarse en el sistema
- Autenticarse con email y contraseña
- Crear nuevas reservas
- Cancelar reservas propias
- Consultar historial de reservas
- Visualizar estadísticas personales

## 🛠️ Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **Bootstrap 5.3** - Framework CSS responsivo
- **Bootstrap Icons** - Iconografía
- **JavaScript Vanilla** - Lógica del sistema (sin frameworks)
- **localStorage** - Persistencia de datos
- **Chart.js** - Gráficos estadísticos

## 📦 Instalación

1. **Descargar el proyecto:**
   ```bash
   # Si tienes el archivo ZIP
   unzip sistema-reservas.zip
   cd sistema-reservas
   ```

2. **Abrir en navegador:**
   - Simplemente abre el archivo `index.html` en tu navegador
   - No requiere servidor web
   - Compatible con: Chrome, Firefox, Safari, Edge (versiones modernas)

## 🎯 Cómo Usar

### Primera Vez

1. Al abrir `index.html`, verás la pantalla de login
2. El sistema crea automáticamente 3 usuarios de prueba
3. Usa cualquiera de estos usuarios para ingresar:

### 👨‍💼 Usuario Administrador
```
Email: admin@empresa.com
Contraseña: admin123
```
**Acceso a:**
- Dashboard de administración
- Panel de estadísticas
- Gestión de usuarios

### 👨‍💻 Usuario Operador
```
Email: operador@empresa.com
Contraseña: oper123
```
**Acceso a:**
- Panel de operador
- Agenda diaria
- Confirmación de reservas

### 👤 Usuario Cliente
```
Email: cliente@test.com
Contraseña: cliente123
```
**Acceso a:**
- Mis reservas
- Crear nueva reserva
- Cancelar reservas

## 📝 Flujo de Trabajo Típico

### Como Cliente:

1. **Registro** (si eres nuevo):
   - Click en "Registrarse"
   - Completa todos los campos
   - El sistema te asigna automáticamente el rol "Cliente"

2. **Crear Reserva**:
   - Ingresa con tus credenciales
   - Click en "Nueva Reserva"
   - Selecciona servicio, fecha y hora
   - Añade notas si es necesario
   - Click en "Crear Reserva"

3. **Ver Mis Reservas**:
   - En el dashboard verás todas tus reservas
   - Puedes ver estadísticas personales
   - Puedes cancelar reservas pendientes o confirmadas

### Como Operador:

1. **Confirmar Reservas**:
   - En "Panel" verás todas las reservas pendientes
   - Click en ✓ para confirmar
   - Click en ⏰ para reprogramar
   - Click en ✗ para cancelar

2. **Consultar Agenda**:
   - Selecciona una fecha en el calendario
   - Verás todas las reservas del día ordenadas por hora

### Como Administrador:

1. **Gestionar Reservas**:
   - En "Dashboard" verás todas las reservas
   - Aplica filtros por estado o fecha
   - Edita o elimina cualquier reserva

2. **Ver Estadísticas**:
   - Click en "Estadísticas"
   - Visualiza gráficos de reservas por estado
   - Ve los servicios más solicitados

3. **Gestionar Usuarios**:
   - Click en "Usuarios"
   - Cambia roles de operador a cliente y viceversa
   - (No puedes cambiar el rol de administrador)

## ⚙️ Configuración

### Servicios Disponibles
Los servicios están definidos en el formulario de nueva reserva:
- Consultoría Empresarial
- Capacitación
- Auditoría
- Soporte Técnico
- Mantenimiento

Para agregar más servicios, edita el `<select id="serviceSelect">` en `index.html`.

### Horario Laboral
Por defecto: 8:00 AM - 6:00 PM

Para cambiar, modifica la validación en `app.js`:
```javascript
const hour = parseInt(time.split(':')[0]);
if (hour < 8 || hour >= 18) { // Cambia estos valores
    this.showError('El horario de atención es de 8:00 AM a 6:00 PM');
    return;
}
```

## 📊 Estructura de Datos

### Usuario
```javascript
{
    id: "unique_id",
    name: "Nombre Completo",
    email: "email@ejemplo.com",
    password: "password123",
    phone: "3001234567",
    role: "admin|operador|cliente",
    createdAt: "2026-02-14T10:30:00.000Z"
}
```

### Reserva
```javascript
{
    id: "unique_id",
    userId: "user_id",
    userName: "Nombre Usuario",
    userEmail: "email@ejemplo.com",
    userPhone: "3001234567",
    service: "Nombre del Servicio",
    date: "2026-02-14",
    time: "10:00",
    notes: "Notas adicionales",
    status: "pendiente|confirmada|cancelada|completada",
    createdAt: "2026-02-14T10:30:00.000Z",
    updatedAt: "2026-02-14T10:30:00.000Z"
}
```

## 🔒 Validaciones Implementadas

### Registro:
- ✅ Email único (no duplicados)
- ✅ Contraseñas coincidentes
- ✅ Contraseña mínimo 6 caracteres
- ✅ Todos los campos requeridos

### Reservas:
- ✅ Fecha no puede ser pasada
- ✅ Hora no puede ser pasada
- ✅ Horario laboral (8 AM - 6 PM)
- ✅ Todos los campos requeridos
- ✅ Servicio válido

### Acceso:
- ✅ Credenciales válidas
- ✅ Vistas protegidas por rol
- ✅ Menús personalizados por rol

## 🎨 Personalización

### Cambiar Colores
Edita `styles.css`:
```css
/* Color primario */
body {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Puedes cambiar estos valores */
```

### Cambiar Textos
Todos los textos están en español en `index.html`. Busca y reemplaza según necesites.

## 🐛 Solución de Problemas

### Las reservas no se guardan
- Verifica que tu navegador permita localStorage
- Asegúrate de no estar en modo incógnito
- Revisa la consola del navegador (F12) por errores

### No puedo ver las estadísticas
- Asegúrate de estar logueado como Administrador
- Verifica que Chart.js se haya cargado correctamente
- Revisa la consola por errores de red

### El sistema no carga
- Verifica que todos los archivos estén en la misma carpeta
- Asegúrate de tener conexión a internet (para Bootstrap y Chart.js)
- Prueba con otro navegador moderno

### Datos desaparecen
- localStorage es específico del navegador y dominio
- Limpiar caché del navegador elimina los datos
- No uses modo incógnito para uso persistente

## 🔄 Reiniciar Sistema

Para volver al estado inicial:

1. Abre la consola del navegador (F12)
2. Escribe y ejecuta:
```javascript
localStorage.clear();
location.reload();
```

Esto eliminará todos los datos y recreará los usuarios de prueba.

## 📱 Compatibilidad

✅ Navegadores Soportados:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

✅ Dispositivos:
- Desktop (Windows, Mac, Linux)
- Tablets
- Móviles (diseño responsivo)

## 📄 Archivos del Proyecto

```
sistema-reservas/
│
├── index.html                    # Estructura HTML completa
├── styles.css                    # Estilos personalizados
├── app.js                        # Lógica JavaScript
├── README.md                     # Este archivo
└── DOCUMENTACION_PROMPTS_IA.md  # Documentación de prompts IA
```

## 🎓 Créditos

**Proyecto Final 3 - Sistema de Reservas Empresarial**
- Tecnologías: HTML5, CSS (Bootstrap), JavaScript Vanilla
- Persistencia: localStorage
- Desarrollo con asistencia de IA

## 📞 Soporte

Si encuentras algún problema o tienes preguntas:
1. Revisa esta documentación completa
2. Verifica la consola del navegador por errores
3. Asegúrate de seguir el flujo de trabajo correcto

## 🚀 Próximos Pasos

Una vez domines el sistema, puedes:
- Agregar más servicios
- Personalizar colores y estilos
- Implementar nuevas validaciones
- Agregar más estadísticas
- Crear nuevos roles personalizados

## ✅ Checklist de Evaluación

El proyecto cumple con:
- ✅ CRUD completo de reservas
- ✅ Manejo de estados (4 estados)
- ✅ Validación de fechas exhaustiva
- ✅ Persistencia completa en localStorage
- ✅ Protección de vistas según rol
- ✅ 3 roles completamente funcionales
- ✅ Interfaz responsiva y moderna
- ✅ Código comentado y organizado
- ✅ Documentación completa

---

**Última actualización:** Febrero 2026  
**Versión:** 1.0.0  
**Estado:** ✅ Producción