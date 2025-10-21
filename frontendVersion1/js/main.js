import { API_BASE_URL } from '../config.js'; //<- Backend

document.addEventListener('DOMContentLoaded', () =>{

    // ============================================================================
    // ============ URLs de la API ================================================
    // ============================================================================

     
    const REGISTER_URL = `${API_BASE_URL}/authentication/signup`; // <- endpoint registro
    const LOGIN_URL = `${API_BASE_URL}/authentication/login`; // <- endpoint login

    // ============================================================================
    // ============ Fin URLs de la API ============================================
    // ============================================================================

    // ============================================================================
    // ============ Selectores del DOM ============================================
    // ============================================================================

    // Vistas Principales 
    const allViews = document.querySelectorAll('.view');

    // Vistas Contenido Prrincipal
    //const homeViewContent = document.getElementById('home-view-content');

    //Selectores de la sidebar
    const homeBtn = document.querySelector('.main-nav .icon-home').closest('a');
    const sidebarAuthBlock = document.getElementById('sidebar-auth-content');
    const sidebarLibraryContent = document.getElementById('sidebar-library-content');

    // Elementos de la vista de Authentication
    const loginForm = document.getElementById('login-form');
    const loginEmail = document.getElementById('login-email');
    const loginPassword = document.getElementById('login-password');
    const registerForm = document.getElementById('register-form');
    const registerName = document.getElementById('register-name');
    const registerEmail = document.getElementById('register-email');
    const registerPassword = document.getElementById('register-password');
    const showRegisterLink = document.getElementById('show-register-link');
    const showLoginLink = document.getElementById('show-login-link');
    const errorMessage = document.getElementById('error-message');
    const pupilLeft = document.getElementById('pupil-left');
    const pupilRight = document.getElementById('pupil-right');
    const mainFooter = document.getElementById('main-footer');
    const backToHomeBtn = document.getElementById('back-to-home-btn'); 

    //Selectores para Cerrar Sesión
    const userProfileMenu = document.getElementById('user-profile-menu');
    const userAvatarBtn = document.getElementById('user-avatar-btn');
    const logoutDropdown = document.getElementById('logout-dropdown');
    const logoutBtn = document.getElementById('logout-btn');

    //Elementos de la vista Principal
    const goToLoginBtn = document.getElementById('go-to-login-btn');
    const goToRegisterBtn = document.getElementById('go-to-register-btn');

    //selector botón de back para las views
    //const backButtons = document.querySelectorAll('.back-btn');
    
    // ============================================================================
    // ========== Fin Selectores del DOM ==========================================
    // ============================================================================

    // ============================================================================
    // ========== Navegación y manejo de vistas ===================================
    // ============================================================================
    
    // Función para actualizar la UI de la vista principal según el estado de la autenticación
    function updateUserUI(isLoggedIn){
        if(isLoggedIn){
            sidebarAuthBlock.classList.add('hidden');
            sidebarLibraryContent.classList.remove('hidden');
            userProfileMenu.classList.remove('hidden');
        } else {
            sidebarAuthBlock.classList.remove('hidden');
            sidebarLibraryContent.classList.add('hidden');
            userProfileMenu.classList.add('hidden');
        }
    }

    function navigateTo(viewId){
        allViews.forEach(view => view.classList.add('hidden'));
        const targetView = document.getElementById(viewId);
        if (targetView){
            targetView.classList.remove('hidden');
        }
        mainFooter.classList.toggle('hidden', viewId !== 'auth-view');
    }

    // Función para mostrar el formulario de login
    const showLoginForm = () => {
        loginForm.classList.remove('hidden');
        showRegisterLink.classList.remove('hidden');
        registerForm.classList.add('hidden');
        showLoginLink.classList.add('hidden');
        errorMessage.textContent = '';
    }
    // Función para mostrar el formulario de registro
    const showRegisterForm = () => {
        registerForm.classList.remove('hidden');
        showLoginLink.classList.remove('hidden');
        loginForm.classList.add('hidden');
        showRegisterLink.classList.add('hidden');
        errorMessage.textContent = '';
    }

    // ============================================================================
    // ========== Fin Navegación y manejo de vistas ===============================
    // ============================================================================

    // ============================================================================
    // ========== Lógica de Autenticación y API ===================================
    // ============================================================================

    async function handleRegistration(name, email, password){
        errorMessage.textContent = 'Creando cuenta...';
        const body = {name, email, password};
        try{
            const response = await fetch(REGISTER_URL,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if(response.ok){
                const token = await response.text();
                localStorage.setItem('authToken', token);
                updateUserUI(true);
                navigateTo('main-view');
                errorMessage.textContent = '';
            } else if (response.status === 409) {
               errorMessage.textContent = "Este correo electrónico ya está registrado.";
            } else {
                errorMessage.textContent = "Ocurrió un error. Inténtalo de nuevo.";
            }
        } catch(error){
            console.error("Error de red en el registro", error);
            errorMessage.textContent = "No se pudo conectar con el servidor";
        }
    }

    async function handleLogin(email, password){
        errorMessage.textContent = 'Iniciando sesión...';
        const body = {email, password};
        try{
            const response = await fetch(LOGIN_URL,{
                method: 'POST',
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify(body)
            });
            if(response.ok){
                const token = await response.text();
                localStorage.setItem('authToken', token);
                updateUserUI(true);
                navigateTo('main-view');
                errorMessage.textContent = '';
            }  else {
            errorMessage.textContent = 'Correo o contraseña incorrectos.';
        }
            } catch(error){
                console.error("Error de red en el login", error);
                errorMessage.textContent = "No se pudo conectar con el servidor";
            }
    }
    
    // ============================================================================
    // ======== Fin ógica de Autenticación y API ==================================
    // ============================================================================

    // ===========================================================================
    // ========= Lógica de animación de la mascota UisTiFy =======================
    // ===========================================================================

  const pupilMoveRadius = 50;
    function moveEye(eyeElement, event) {
        if (!eyeElement) return;
        const eyeRect = eyeElement.getBoundingClientRect();
        const eyeCenterX = eyeRect.left + eyeRect.width / 2;
        const eyeCenterY = eyeRect.top + eyeRect.height / 2;
        const angle = Math.atan2(event.clientY - eyeCenterY, event.clientX - eyeCenterX);
        const newPupilX = pupilMoveRadius * Math.cos(angle);
        const newPupilY = pupilMoveRadius * Math.sin(angle);
        eyeElement.style.transform = `translate(${newPupilX}px, ${newPupilY}px)`;
    }

    // ===========================================================================
    // ======= Fin Lógica de animación de la mascota UisTiFy =====================
    // ===========================================================================

    // ===========================================================================
    // ======= Event Listeners ===================================================
    // ===========================================================================

    window.addEventListener('mousemove', (event) => {
        moveEye(pupilLeft, event);
        moveEye(pupilRight, event);
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        showLoginForm();
    });

    showRegisterLink.addEventListener('click', (e)=>{
        e.preventDefault();
        showRegisterForm();
    });

    homeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('main-view');
    });

    backToHomeBtn.addEventListener('click', (e) => {
        e.preventDefault(); 
        navigateTo('main-view');
    });

    goToLoginBtn.addEventListener('click', () =>{
        navigateTo('auth-view');
        showLoginForm();
    });

    goToRegisterBtn.addEventListener('click', () =>{
        navigateTo('auth-view');
        showRegisterForm();
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleLogin(loginEmail.value, loginPassword.value);
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleRegistration(registerName.value, registerEmail.value, registerPassword.value);
    });

    userAvatarBtn.addEventListener('click', (e) =>{
        logoutDropdown.classList.toggle('hidden');
    });

    window.addEventListener('click', (e) =>{
        if(!userProfileMenu.contains(e.target) && !logoutDropdown.classList.contains('hidden')){
            logoutDropdown.classList.add('hidden');
        }
    });

    logoutBtn.addEventListener('click', () =>{
        localStorage.removeItem('authToken');
        updateUserUI(false);
    });
    // ===========================================================================
    // ====== Fin Event Listeners ================================================
    // ===========================================================================

    // ===========================================================================  
    // ===== Inicialización ======================================================
    // ===========================================================================

    async function initializeApp(){
        const token = localStorage.getItem('authToken');
        if(token){
            try{
                updateUserUI(true);
            }
            catch(error){
                localStorage.removeItem('authToken');
                updateUserUI(false);
                console.log(error);
            }
        }else{
            updateUserUI(false);
        }
        navigateTo('main-view');
    }

    initializeApp();

    // ==========================================================================  
    // ===== Fin inicialización =================================================
    // ==========================================================================

});