'use strict';
document.addEventListener('DOMContentLoaded', () =>{

    // Constantes y URLS 
    const API_BASE_URL = 'https://apidev.uistify.site/api'; //<- Backend
    const REGISTER_URL = `${API_BASE_URL}/authentication/signup`; // <- endpoint registro
    const LOGIN_URL = `${API_BASE_URL}/authentication/login`; // <- endpoint login
    // =====================
    // Selectores del DOM 
    // =====================
    // Vistas Principales 
    const allViews = document.querySelectorAll('.view');

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

    // =============================
    // Navegación y manejo de vistas
    // =============================
   
    const showLoginForm = () => {
        loginForm.classList.remove('hidden');
        showRegisterLink.classList.remove('hidden');
        registerForm.classList.add('hidden');
        showLoginLink.classList.add('hidden');
        errorMessage.textContent = '';
    }
    const showRegisterForm = () => {
        registerForm.classList.remove('hidden');
        showLoginLink.classList.remove('hidden');
        loginForm.classList.add('hidden');
        showRegisterLink.classList.add('hidden');
        errorMessage.textContent = '';
    }
    
    // =========================================
    // Lógica de animación de la mascota UisTiFy
    // =========================================

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

    // =========================================
    // Event Listeners
    // =========================================

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
});