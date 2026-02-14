// ============================================================================
// SISTEMA DE RESERVAS EMPRESARIAL MULTIRROL
// Desarrollado con JavaScript Vanilla y localStorage
// ============================================================================

// ============================================================================
// CONFIGURACIÓN INICIAL Y DATOS BASE
// ============================================================================

/**
 * Clase principal para gestionar el sistema de reservas
 * Maneja autenticación, CRUD de reservas, roles y persistencia
 */
class ReservationSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    /**
     * Inicializa el sistema: carga datos y configura usuarios de prueba
     * PROMPT IA #1: "Crea una estructura de datos eficiente en localStorage 
     * para un sistema de reservas que maneje usuarios, reservas y roles"
     */
    init() {
        // Verificar si es la primera vez que se ejecuta el sistema
        if (!localStorage.getItem('systemInitialized')) {
            this.initializeDefaultData();
            localStorage.setItem('systemInitialized', 'true');
        }

        // Cargar usuario actual si existe sesión activa
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.showMainScreen();
        }

        this.attachEventListeners();
    }

    /**
     * Inicializa datos por defecto: usuarios de prueba
     * PROMPT IA #2: "Diseña una estructura de usuarios con roles (admin, operador, cliente)
     * que incluya autenticación básica y permisos diferenciados"
     */
    initializeDefaultData() {
        const defaultUsers = [
            {
                id: this.generateId(),
                name: 'Administrador Sistema',
                email: 'admin@empresa.com',
                password: 'admin123',
                phone: '3001234567',
                role: 'admin',
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                name: 'Operador Principal',
                email: 'operador@empresa.com',
                password: 'oper123',
                phone: '3009876543',
                role: 'operador',
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                name: 'Cliente Demo',
                email: 'cliente@test.com',
                password: 'cliente123',
                phone: '3005555555',
                role: 'cliente',
                createdAt: new Date().toISOString()
            }
        ];

        localStorage.setItem('users', JSON.stringify(defaultUsers));
        localStorage.setItem('reservations', JSON.stringify([]));
    }

    /**
     * Genera un ID único para registros
     * PROMPT IA #3: "Crea una función para generar IDs únicos sin dependencias externas"
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // ============================================================================
    // GESTIÓN DE EVENTOS
    // ============================================================================

    /**
     * Configura todos los event listeners del sistema
     * PROMPT IA #4: "Organiza los event listeners de forma modular y mantenible
     * para un sistema con múltiples vistas y roles"
     */
    attachEventListeners() {
        // Login y Registro
        document.getElementById('loginForm')?.addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('registerForm')?.addEventListener('submit', (e) => this.handleRegister(e));
        
        // Navegación
        document.getElementById('logoutBtn')?.addEventListener('click', () => this.handleLogout());
        
        // Navegación entre vistas
        document.addEventListener('click', (e) => {
            if (e.target.hasAttribute('data-view') || e.target.closest('[data-view]')) {
                const button = e.target.hasAttribute('data-view') ? e.target : e.target.closest('[data-view]');
                const viewName = button.getAttribute('data-view');
                this.showView(viewName);
            }
        });

        // Nueva Reserva (Cliente)
        document.getElementById('newReservationForm')?.addEventListener('submit', (e) => this.handleNewReservation(e));
        
        // Filtros Admin
        document.getElementById('adminApplyFilters')?.addEventListener('click', () => this.loadAdminReservations());
        
        // Filtro Operador
        document.getElementById('operatorDateFilter')?.addEventListener('change', (e) => this.loadDailyAgenda(e.target.value));
        
        // Modal de Edición
        document.getElementById('saveReservationChanges')?.addEventListener('click', () => this.saveReservationEdit());
        
        // Establecer fecha mínima en formularios (hoy)
        this.setMinDate();
    }

    /**
     * Establece la fecha mínima en los inputs de fecha (no permitir fechas pasadas)
     * PROMPT IA #5: "Implementa validación de fechas para que no se puedan crear
     * reservas en fechas pasadas"
     */
    setMinDate() {
        const today = new Date().toISOString().split('T')[0];
        const dateInputs = ['reservationDate', 'editReservationDate', 'operatorDateFilter'];
        dateInputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) input.min = today;
        });
        
        // Establecer fecha de hoy por defecto en filtro de operador
        const operatorDateFilter = document.getElementById('operatorDateFilter');
        if (operatorDateFilter) {
            operatorDateFilter.value = today;
        }
    }

    // ============================================================================
    // AUTENTICACIÓN
    // ============================================================================

    /**
     * Maneja el inicio de sesión
     * PROMPT IA #6: "Implementa un sistema de autenticación seguro con validación
     * de credenciales y manejo de errores"
     */
    handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        const users = this.getUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Guardar usuario actual (sin contraseña por seguridad)
            const userSession = { ...user };
            delete userSession.password;
            
            this.currentUser = userSession;
            localStorage.setItem('currentUser', JSON.stringify(userSession));
            
            this.showSuccess('¡Bienvenido! Sesión iniciada correctamente');
            this.showMainScreen();
        } else {
            this.showError('Credenciales incorrectas. Verifica tu email y contraseña.');
        }
    }

    /**
     * Maneja el registro de nuevos usuarios (clientes)
     * PROMPT IA #7: "Crea validación completa para registro de usuarios incluyendo
     * verificación de email único y confirmación de contraseña"
     */
    handleRegister(e) {
        e.preventDefault();

        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const phone = document.getElementById('registerPhone').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerPasswordConfirm').value;

        // Validaciones
        if (password !== confirmPassword) {
            this.showError('Las contraseñas no coinciden');
            return;
        }

        if (password.length < 6) {
            this.showError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        const users = this.getUsers();
        
        // Verificar si el email ya existe
        if (users.some(u => u.email === email)) {
            this.showError('Este email ya está registrado');
            return;
        }

        // Crear nuevo usuario
        const newUser = {
            id: this.generateId(),
            name,
            email,
            phone,
            password,
            role: 'cliente', // Los registros nuevos siempre son clientes
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        this.showSuccess('¡Registro exitoso! Ya puedes iniciar sesión');
        
        // Cambiar a tab de login y limpiar formulario
        document.getElementById('login-tab').click();
        document.getElementById('registerForm').reset();
        
        // Pre-llenar email en login
        document.getElementById('loginEmail').value = email;
    }

    /**
     * Cierra la sesión actual
     */
    handleLogout() {
        if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
            this.currentUser = null;
            localStorage.removeItem('currentUser');
            
            document.getElementById('mainScreen').classList.add('d-none');
            document.getElementById('loginScreen').classList.remove('d-none');
            
            // Limpiar formularios
            document.getElementById('loginForm').reset();
            
            this.showSuccess('Sesión cerrada correctamente');
        }
    }

    // ============================================================================
    // GESTIÓN DE VISTAS
    // ============================================================================

    /**
     * Muestra la pantalla principal según el rol del usuario
     * PROMPT IA #8: "Diseña un sistema de navegación que muestre diferentes menús
     * y vistas según el rol del usuario (admin, operador, cliente)"
     */
    showMainScreen() {
        document.getElementById('loginScreen').classList.add('d-none');
        document.getElementById('mainScreen').classList.remove('d-none');
        
        // Mostrar nombre del usuario
        document.getElementById('currentUserName').textContent = this.currentUser.name;
        
        // Crear menú según rol
        this.createMenu();
        
        // Mostrar vista inicial según rol
        switch(this.currentUser.role) {
            case 'admin':
                this.showView('adminDashboard');
                break;
            case 'operador':
                this.showView('operatorDashboard');
                break;
            case 'cliente':
                this.showView('clientDashboard');
                break;
        }
    }

    /**
     * Crea el menú de navegación según el rol
     */
    createMenu() {
        const navMenu = document.getElementById('navMenu');
        navMenu.innerHTML = '';

        const menuItems = {
            admin: [
                { view: 'adminDashboard', icon: 'speedometer2', text: 'Dashboard' },
                { view: 'adminStats', icon: 'bar-chart', text: 'Estadísticas' },
                { view: 'userManagement', icon: 'people', text: 'Usuarios' }
            ],
            operador: [
                { view: 'operatorDashboard', icon: 'clipboard-check', text: 'Panel' },
                { view: 'adminDashboard', icon: 'calendar-check', text: 'Todas las Reservas' }
            ],
            cliente: [
                { view: 'clientDashboard', icon: 'house-door', text: 'Mis Reservas' },
                { view: 'newReservation', icon: 'calendar-plus', text: 'Nueva Reserva' }
            ]
        };

        const items = menuItems[this.currentUser.role] || [];
        
        items.forEach(item => {
            const li = document.createElement('li');
            li.className = 'nav-item';
            li.innerHTML = `
                <a class="nav-link cursor-pointer" data-view="${item.view}">
                    <i class="bi bi-${item.icon}"></i> ${item.text}
                </a>
            `;
            navMenu.appendChild(li);
        });
    }

    /**
     * Muestra una vista específica y oculta las demás
     */
    showView(viewName) {
        // Ocultar todas las vistas
        document.querySelectorAll('.view-container').forEach(view => {
            view.classList.add('d-none');
        });
        
        // Mostrar vista solicitada
        const targetView = document.getElementById(viewName);
        if (targetView) {
            targetView.classList.remove('d-none');
            
            // Actualizar menú activo
            document.querySelectorAll('#navMenu .nav-link').forEach(link => {
                link.classList.remove('active');
            });
            document.querySelector(`[data-view="${viewName}"]`)?.classList.add('active');
            
            // Cargar datos según la vista
            this.loadViewData(viewName);
        }
    }

    /**
     * Carga los datos específicos de cada vista
     */
    loadViewData(viewName) {
        switch(viewName) {
            case 'clientDashboard':
                this.loadClientReservations();
                break;
            case 'adminDashboard':
                this.loadAdminReservations();
                break;
            case 'adminStats':
                this.loadStatistics();
                break;
            case 'userManagement':
                this.loadUserManagement();
                break;
            case 'operatorDashboard':
                this.loadOperatorDashboard();
                break;
        }
    }

    // ============================================================================
    // CRUD DE RESERVAS
    // ============================================================================

    /**
     * Crea una nueva reserva (Cliente)
     * PROMPT IA #9: "Implementa validaciones completas para crear reservas:
     * fecha no pasada, horario laboral, evitar duplicados en mismo horario"
     */
    handleNewReservation(e) {
        e.preventDefault();

        const service = document.getElementById('serviceSelect').value;
        const date = document.getElementById('reservationDate').value;
        const time = document.getElementById('reservationTime').value;
        const notes = document.getElementById('reservationNotes').value.trim();

        // Validar fecha no sea pasada
        const reservationDateTime = new Date(`${date}T${time}`);
        const now = new Date();
        
        if (reservationDateTime < now) {
            this.showError('No puedes crear reservas en fechas u horarios pasados');
            return;
        }

        // Validar horario laboral (8 AM - 6 PM)
        const hour = parseInt(time.split(':')[0]);
        if (hour < 8 || hour >= 18) {
            this.showError('El horario de atención es de 8:00 AM a 6:00 PM');
            return;
        }

        // Crear nueva reserva
        const newReservation = {
            id: this.generateId(),
            userId: this.currentUser.id,
            userName: this.currentUser.name,
            userEmail: this.currentUser.email,
            userPhone: this.currentUser.phone,
            service,
            date,
            time,
            notes,
            status: 'pendiente',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const reservations = this.getReservations();
        reservations.push(newReservation);
        localStorage.setItem('reservations', JSON.stringify(reservations));

        this.showSuccess('¡Reserva creada exitosamente! Recibirás confirmación pronto.');
        
        // Limpiar formulario y volver al dashboard
        document.getElementById('newReservationForm').reset();
        this.showView('clientDashboard');
    }

    /**
     * Cancela una reserva (Cliente)
     */
    cancelReservation(reservationId) {
        if (!confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
            return;
        }

        const reservations = this.getReservations();
        const reservation = reservations.find(r => r.id === reservationId);
        
        if (reservation) {
            reservation.status = 'cancelada';
            reservation.updatedAt = new Date().toISOString();
            localStorage.setItem('reservations', JSON.stringify(reservations));
            
            this.showSuccess('Reserva cancelada correctamente');
            this.loadClientReservations();
        }
    }

    /**
     * Elimina una reserva (Admin)
     */
    deleteReservation(reservationId) {
        if (!confirm('¿Estás seguro de que deseas eliminar esta reserva? Esta acción no se puede deshacer.')) {
            return;
        }

        let reservations = this.getReservations();
        reservations = reservations.filter(r => r.id !== reservationId);
        localStorage.setItem('reservations', JSON.stringify(reservations));
        
        this.showSuccess('Reserva eliminada correctamente');
        this.loadAdminReservations();
    }

    /**
     * Abre el modal para editar una reserva
     */
    openEditModal(reservationId) {
        const reservation = this.getReservations().find(r => r.id === reservationId);
        
        if (reservation) {
            document.getElementById('editReservationId').value = reservation.id;
            document.getElementById('editReservationDate').value = reservation.date;
            document.getElementById('editReservationTime').value = reservation.time;
            document.getElementById('editReservationStatus').value = reservation.status;
            
            // Mostrar modal
            const modal = new bootstrap.Modal(document.getElementById('editReservationModal'));
            modal.show();
        }
    }

    /**
     * Guarda los cambios de la edición
     */
    saveReservationEdit() {
        const id = document.getElementById('editReservationId').value;
        const date = document.getElementById('editReservationDate').value;
        const time = document.getElementById('editReservationTime').value;
        const status = document.getElementById('editReservationStatus').value;

        const reservations = this.getReservations();
        const reservation = reservations.find(r => r.id === id);
        
        if (reservation) {
            reservation.date = date;
            reservation.time = time;
            reservation.status = status;
            reservation.updatedAt = new Date().toISOString();
            
            localStorage.setItem('reservations', JSON.stringify(reservations));
            
            // Cerrar modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('editReservationModal'));
            modal.hide();
            
            this.showSuccess('Reserva actualizada correctamente');
            
            // Recargar vista actual
            const currentView = Array.from(document.querySelectorAll('.view-container'))
                .find(v => !v.classList.contains('d-none'))?.id;
            this.loadViewData(currentView);
        }
    }

    /**
     * Cambia el estado de una reserva rápidamente (Operador/Admin)
     */
    changeStatus(reservationId, newStatus) {
        const reservations = this.getReservations();
        const reservation = reservations.find(r => r.id === reservationId);
        
        if (reservation) {
            reservation.status = newStatus;
            reservation.updatedAt = new Date().toISOString();
            localStorage.setItem('reservations', JSON.stringify(reservations));
            
            this.showSuccess(`Estado cambiado a: ${newStatus}`);
            
            // Recargar vista actual
            const currentView = Array.from(document.querySelectorAll('.view-container'))
                .find(v => !v.classList.contains('d-none'))?.id;
            this.loadViewData(currentView);
        }
    }

    // ============================================================================
    // VISUALIZACIÓN DE DATOS
    // ============================================================================

    /**
     * Carga las reservas del cliente actual
     */
    loadClientReservations() {
        const reservations = this.getReservations()
            .filter(r => r.userId === this.currentUser.id)
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        const container = document.getElementById('clientReservationsList');
        
        if (reservations.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="bi bi-calendar-x"></i>
                    <p>No tienes reservas aún. ¡Crea tu primera reserva!</p>
                </div>
            `;
        } else {
            container.innerHTML = reservations.map(r => this.createReservationCard(r, 'client')).join('');
        }

        // Actualizar estadísticas
        this.updateClientStats(reservations);
    }

    /**
     * Actualiza las estadísticas del cliente
     */
    updateClientStats(reservations) {
        document.getElementById('clientTotalReservations').textContent = reservations.length;
        document.getElementById('clientPendingReservations').textContent = 
            reservations.filter(r => r.status === 'pendiente').length;
        document.getElementById('clientConfirmedReservations').textContent = 
            reservations.filter(r => r.status === 'confirmada').length;
    }

    /**
     * Carga todas las reservas para el administrador con filtros
     * PROMPT IA #10: "Implementa un sistema de filtros eficiente para reservas
     * por estado, fecha y múltiples criterios simultáneos"
     */
    loadAdminReservations() {
        let reservations = this.getReservations();

        // Aplicar filtros
        const statusFilter = document.getElementById('adminFilterStatus').value;
        const dateFrom = document.getElementById('adminFilterDateFrom').value;
        const dateTo = document.getElementById('adminFilterDateTo').value;

        if (statusFilter) {
            reservations = reservations.filter(r => r.status === statusFilter);
        }

        if (dateFrom) {
            reservations = reservations.filter(r => r.date >= dateFrom);
        }

        if (dateTo) {
            reservations = reservations.filter(r => r.date <= dateTo);
        }

        // Ordenar por fecha más reciente
        reservations.sort((a, b) => new Date(b.date) - new Date(a.date));

        const tbody = document.getElementById('adminReservationsTable');
        
        if (reservations.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-4">
                        <i class="bi bi-inbox" style="font-size: 3rem; opacity: 0.3;"></i>
                        <p class="mt-2">No hay reservas que coincidan con los filtros</p>
                    </td>
                </tr>
            `;
        } else {
            tbody.innerHTML = reservations.map(r => `
                <tr>
                    <td><small>${r.id.substr(0, 8)}</small></td>
                    <td>
                        <strong>${r.userName}</strong><br>
                        <small class="text-muted">${r.userEmail}</small>
                    </td>
                    <td>${r.service}</td>
                    <td>${this.formatDate(r.date)}</td>
                    <td>${r.time}</td>
                    <td><span class="badge status-${r.status}">${r.status.toUpperCase()}</span></td>
                    <td>
                        <div class="btn-group btn-group-sm">
                            <button class="btn btn-outline-primary" onclick="system.openEditModal('${r.id}')" 
                                title="Editar">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-outline-danger" onclick="system.deleteReservation('${r.id}')" 
                                title="Eliminar">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');
        }
    }

    /**
     * Carga el panel del operador
     */
    loadOperatorDashboard() {
        // Cargar agenda del día actual
        const today = new Date().toISOString().split('T')[0];
        this.loadDailyAgenda(today);
        
        // Cargar reservas pendientes
        this.loadPendingReservations();
    }

    /**
     * Carga la agenda diaria del operador
     */
    loadDailyAgenda(date) {
        const reservations = this.getReservations()
            .filter(r => r.date === date && r.status !== 'cancelada')
            .sort((a, b) => a.time.localeCompare(b.time));

        const container = document.getElementById('dailyAgenda');
        
        if (reservations.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="bi bi-calendar-day"></i>
                    <p>No hay reservas para esta fecha</p>
                </div>
            `;
        } else {
            container.innerHTML = reservations.map(r => `
                <div class="agenda-item status-${r.status}">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <div class="agenda-time">${r.time}</div>
                            <div class="agenda-service">${r.service}</div>
                            <div class="agenda-client">
                                <i class="bi bi-person"></i> ${r.userName}
                                <br><i class="bi bi-telephone"></i> ${r.userPhone}
                            </div>
                            ${r.notes ? `<div class="mt-2"><small><i class="bi bi-sticky"></i> ${r.notes}</small></div>` : ''}
                        </div>
                        <div>
                            <span class="badge status-${r.status}">${r.status.toUpperCase()}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }

    /**
     * Carga las reservas pendientes para el operador
     */
    loadPendingReservations() {
        const reservations = this.getReservations()
            .filter(r => r.status === 'pendiente')
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        const tbody = document.getElementById('operatorReservationsTable');
        
        if (reservations.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center py-4">
                        <i class="bi bi-check-circle" style="font-size: 3rem; opacity: 0.3; color: #28a745;"></i>
                        <p class="mt-2">¡Excelente! No hay reservas pendientes</p>
                    </td>
                </tr>
            `;
        } else {
            tbody.innerHTML = reservations.map(r => `
                <tr>
                    <td>
                        <strong>${r.userName}</strong><br>
                        <small class="text-muted">${r.userPhone}</small>
                    </td>
                    <td>${r.service}</td>
                    <td>${this.formatDate(r.date)}</td>
                    <td>${r.time}</td>
                    <td>
                        <div class="btn-group btn-group-sm">
                            <button class="btn btn-success" onclick="system.changeStatus('${r.id}', 'confirmada')" 
                                title="Confirmar">
                                <i class="bi bi-check"></i>
                            </button>
                            <button class="btn btn-warning" onclick="system.openEditModal('${r.id}')" 
                                title="Reprogramar">
                                <i class="bi bi-clock"></i>
                            </button>
                            <button class="btn btn-danger" onclick="system.changeStatus('${r.id}', 'cancelada')" 
                                title="Cancelar">
                                <i class="bi bi-x"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');
        }
    }

    /**
     * Carga las estadísticas del sistema (Admin)
     */
    loadStatistics() {
        const reservations = this.getReservations();
        const users = this.getUsers();

        // Estadísticas generales
        document.getElementById('statTotalReservations').textContent = reservations.length;
        document.getElementById('statPendingReservations').textContent = 
            reservations.filter(r => r.status === 'pendiente').length;
        document.getElementById('statConfirmedReservations').textContent = 
            reservations.filter(r => r.status === 'confirmada').length;
        document.getElementById('statTotalUsers').textContent = users.length;

        // Gráfico de estados
        this.createStatusChart(reservations);
        
        // Gráfico de servicios
        this.createServicesChart(reservations);
    }

    /**
     * Crea gráfico de reservas por estado
     */
    createStatusChart(reservations) {
        const statusCounts = {
            pendiente: reservations.filter(r => r.status === 'pendiente').length,
            confirmada: reservations.filter(r => r.status === 'confirmada').length,
            cancelada: reservations.filter(r => r.status === 'cancelada').length,
            completada: reservations.filter(r => r.status === 'completada').length
        };

        const ctx = document.getElementById('statusChart');
        
        // Destruir gráfico existente si existe
        if (window.statusChartInstance) {
            window.statusChartInstance.destroy();
        }

        window.statusChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Pendiente', 'Confirmada', 'Cancelada', 'Completada'],
                datasets: [{
                    data: [statusCounts.pendiente, statusCounts.confirmada, 
                           statusCounts.cancelada, statusCounts.completada],
                    backgroundColor: ['#ffc107', '#28a745', '#dc3545', '#17a2b8']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    /**
     * Crea gráfico de servicios más solicitados
     */
    createServicesChart(reservations) {
        const serviceCounts = {};
        
        reservations.forEach(r => {
            serviceCounts[r.service] = (serviceCounts[r.service] || 0) + 1;
        });

        const ctx = document.getElementById('servicesChart');
        
        // Destruir gráfico existente si existe
        if (window.servicesChartInstance) {
            window.servicesChartInstance.destroy();
        }

        window.servicesChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(serviceCounts),
                datasets: [{
                    label: 'Cantidad de Reservas',
                    data: Object.values(serviceCounts),
                    backgroundColor: '#667eea'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    /**
     * Carga la gestión de usuarios (Admin)
     */
    loadUserManagement() {
        const users = this.getUsers();
        const tbody = document.getElementById('usersTable');

        tbody.innerHTML = users.map(u => `
            <tr>
                <td><strong>${u.name}</strong></td>
                <td>${u.email}</td>
                <td>${u.phone}</td>
                <td><span class="badge bg-secondary">${u.role.toUpperCase()}</span></td>
                <td>
                    ${u.role !== 'admin' ? `
                        <button class="btn btn-sm btn-outline-primary" onclick="system.changeUserRole('${u.id}')" 
                            title="Cambiar rol">
                            <i class="bi bi-arrow-repeat"></i>
                        </button>
                    ` : '<span class="text-muted">-</span>'}
                </td>
            </tr>
        `).join('');
    }

    /**
     * Cambia el rol de un usuario (Admin)
     */
    changeUserRole(userId) {
        const users = this.getUsers();
        const user = users.find(u => u.id === userId);
        
        if (!user) return;

        const newRole = user.role === 'cliente' ? 'operador' : 'cliente';
        
        if (confirm(`¿Cambiar rol de ${user.name} a ${newRole}?`)) {
            user.role = newRole;
            localStorage.setItem('users', JSON.stringify(users));
            this.showSuccess('Rol actualizado correctamente');
            this.loadUserManagement();
        }
    }

    // ============================================================================
    // HELPERS Y UTILIDADES
    // ============================================================================

    /**
     * Crea una tarjeta de reserva para visualización
     */
    createReservationCard(reservation, type) {
        const canCancel = type === 'client' && 
            reservation.status === 'pendiente' || reservation.status === 'confirmada';

        return `
            <div class="reservation-card">
                <div class="reservation-header">
                    <div class="reservation-service">${reservation.service}</div>
                    <span class="badge status-${reservation.status}">${reservation.status.toUpperCase()}</span>
                </div>
                <div class="reservation-details">
                    <div class="detail-item">
                        <i class="bi bi-calendar3"></i>
                        <span>${this.formatDate(reservation.date)}</span>
                    </div>
                    <div class="detail-item">
                        <i class="bi bi-clock"></i>
                        <span>${reservation.time}</span>
                    </div>
                    <div class="detail-item">
                        <i class="bi bi-hash"></i>
                        <span>${reservation.id.substr(0, 8)}</span>
                    </div>
                </div>
                ${reservation.notes ? `
                    <div class="reservation-notes">
                        <i class="bi bi-sticky"></i> ${reservation.notes}
                    </div>
                ` : ''}
                ${canCancel ? `
                    <button class="btn btn-sm btn-outline-danger" 
                        onclick="system.cancelReservation('${reservation.id}')">
                        <i class="bi bi-x-circle"></i> Cancelar Reserva
                    </button>
                ` : ''}
            </div>
        `;
    }

    /**
     * Formatea una fecha para mostrarla al usuario
     */
    formatDate(dateString) {
        const date = new Date(dateString + 'T00:00:00');
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('es-ES', options);
    }

    /**
     * Obtiene todos los usuarios del localStorage
     */
    getUsers() {
        return JSON.parse(localStorage.getItem('users') || '[]');
    }

    /**
     * Obtiene todas las reservas del localStorage
     */
    getReservations() {
        return JSON.parse(localStorage.getItem('reservations') || '[]');
    }

    /**
     * Muestra un mensaje de éxito
     */
    showSuccess(message) {
        this.showAlert(message, 'success');
    }

    /**
     * Muestra un mensaje de error
     */
    showError(message) {
        this.showAlert(message, 'danger');
    }

    /**
     * Muestra una alerta temporal
     */
    showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }
}

// ============================================================================
// INICIALIZACIÓN DEL SISTEMA
// ============================================================================

// Crear instancia global del sistema
let system;

document.addEventListener('DOMContentLoaded', () => {
    system = new ReservationSystem();
});