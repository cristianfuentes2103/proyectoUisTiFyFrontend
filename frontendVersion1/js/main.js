'use strict';
document.addEventListener('DOMContentLoaded', () =>{

    // Constantes y URLS 
    
    // =====================
    // Selectores del DOM 
    // =====================
    // Elementos de la vista de Authentication
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterLink = document.getElementById('show-register-link');
    const showLoginLink = document.getElementById('show-login-link');
    const errorMessage = document.getElementById('error-message');
    const pupilLeft = document.getElementById('pupil-left');
    const pupilRight = document.getElementById('pupil-right');


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