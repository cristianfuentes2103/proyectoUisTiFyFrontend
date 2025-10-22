import { API_BASE_URL } from '../config.js'; //<- Backend

document.addEventListener('DOMContentLoaded', () => {

    // ============================================================================
    // ============ URLs de la API ================================================
    // ============================================================================


    const REGISTER_URL = `${API_BASE_URL}/auth/register`; // <- endpoint registro
    const LOGIN_URL = `${API_BASE_URL}/auth/login`; // <- endpoint login


    // ============================================================================
    // ============ Fin URLs de la API ============================================
    // ============================================================================

    // ============================================================================
    // ============ Selectores del DOM ============================================
    // ============================================================================

    // Vistas Principales
    const allViews = document.querySelectorAll('.view');
    const contentArea = document.querySelector('.content-area');

    // Vistas Contenido Principal
    const homeViewContent = document.getElementById('home-view-content');
    const playlistViewContent = document.getElementById('playlist-view-content');
    const searchViewContent = document.getElementById('search-view-content');

    // Selectores de la Sidebar
    const homeBtn = document.querySelector('.main-nav .icon-home').closest('a');
    const searchBtn = document.querySelector('.main-nav .icon-search').closest('a');
    const sidebarAuthBlock = document.getElementById('sidebar-auth-content');
    const sidebarLibraryContent = document.getElementById('sidebar-library-content');
    const createPlaylistBtn = document.getElementById('create-playlist-btn');
    const playlistContainer = document.getElementById('playlist-container');

    // Selectores para los detalles de la playlist
    const playlistTitleEl = document.getElementById('playlist-title');
    const playlistDescriptionEl = document.getElementById('playlist-description');
    const playlistOwnerEl = document.getElementById('playlist-owner');
    const songListContainer = document.getElementById('song-list');

    // Selectores Menú de Usuario y Cierre de Sesión
    const userProfileMenu = document.getElementById('user-profile-menu');
    const userAvatarBtn = document.getElementById('user-avatar-btn');
    const logoutDropdown = document.getElementById('logout-dropdown');
    const logoutBtn = document.getElementById('logout-btn');

    // Selectores Vista de Autenticación
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const registerName = document.getElementById('register-name');
    const registerEmail = document.getElementById('register-email');
    const registerPassword = document.getElementById('register-password');
    const loginEmail = document.getElementById('login-email');
    const loginPassword = document.getElementById('login-password');
    const showRegisterLink = document.getElementById('show-register-link');
    const showLoginLink = document.getElementById('show-login-link');
    const errorMessage = document.getElementById('error-message');
    const pupilLeft = document.getElementById('pupil-left');
    const pupilRight = document.getElementById('pupil-right');
    const mainFooter = document.getElementById('main-footer');
    const backToHomeBtn = document.getElementById('back-to-home-btn');

    // Selectores Vista Principal (Home)
    const goToLoginBtn = document.getElementById('go-to-login-btn');
    const goToRegisterBtn = document.getElementById('go-to-register-btn');

    // Selectores Vista de Búsqueda de Canciones
    const allSongsContainer = document.getElementById('all-songs-container');
    const searchInput = document.getElementById('search-input');

    // Selectores Navegación General
    const backButtons = document.querySelectorAll('.back-btn');

    // Selectores Modal: Añadir a Playlist
    const addToPlaylistModal = document.getElementById('add-to-playlist-modal');
    const modalPlaylistList = document.getElementById('modal-playlist-list');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalFeedbackMessage = document.getElementById('modal-feedback-message');

    // Selectores Modal: Editar Playlist
    const editPlaylistModal = document.getElementById('edit-playlist-modal');
    const closeEditModalBtn = document.getElementById('close-edit-modal-btn');
    const editPlaylistForm = document.getElementById('edit-playlist-form');
    const editPlaylistErrorMsg = document.getElementById('edit-playlist-error-msg');
    const editPlaylistCoverImg = document.getElementById('edit-playlist-cover-img');
    const editPlaylistNameInput = document.getElementById('edit-playlist-name-input');
    const editPlaylistDescriptionInput = document.getElementById('edit-playlist-description-input');
    const editPlaylistErrorText = editPlaylistErrorMsg.querySelector('.error-text');
    const descriptionCharCounter = document.getElementById('description-char-counter');
    const nameCharCounter = document.getElementById('name-char-counter');

    // Selectores Modal y Menú: Eliminar Playlist
    const playlistContextMenu = document.getElementById('playlist-context-menu');
    const contextMenuDeleteOption = document.getElementById('context-menu-delete-option');
    const deletePlaylistModal = document.getElementById('delete-playlist-modal');
    const deleteModalText = document.getElementById('delete-modal-text');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');

    // Selectores Reproductor de Audio
    const audioPlayer = document.getElementById('audio-player');
    const playerPlayBtn = document.getElementById('player-play-btn');
    const currentSongInfo = document.getElementById('current-song-info');
    const playerSongCover = document.getElementById('player-song-cover');
    const playerSongTitle = document.getElementById('player-song-title');
    const playerSongArtist = document.getElementById('player-song-artist');
    const progressSlider = document.getElementById('progress-slider');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const playerPrevBtn = document.getElementById('player-prev-btn');
    const playerNextBtn = document.getElementById('player-next-btn');

    // ============================================================================
    // ========== Fin Selectores del DOM ==========================================
    // ============================================================================


    // =======================================================
    // ===== ESTADO DE LA APLICACIÓN
    // =======================================================

    // -- Variables para el estado de la canción actual y la navegación del usuario --
    let currentPlayingSong = null;
    let playlistIdToAction = null;
    let currentOpenPlaylistId = null;
    let navigationHistory = [];
    let songIdToAdd = null;

    // --- Variables para paginación de canciones ---
    let currentPage = 0;      // La página actual que se carga
    const pageSize = 20;      // Cuántas canciones cargar por página
    let isLoading = false;    // Evitar cargar múltiples páginas a la vez
    let allSongsLoaded = false; // Cuándo hemos llegado al final
    // -- Variable de filtrado para la vista Search ---
    let loadedSongsCache = []; // Almacenará todas las canciones cargadas por el scroll infinito
    // --- Variables para la cola de reproducción ---
    let currentQueue = [];      // Almacena la lista de canciones actual
    let currentQueueIndex = -1; // El índice de la canción que está sonando en `currentQueue`
    let currentPlaylistData = null;

    // =======================================================
    // ===== NAVEGACIÓN Y MANEJO DE VISTAS
    // =======================================================

    //Muestra una vista de contenido específica, oculta las demás y actualiza el estado del botón "Atrás".

    function updateNavigationUI() {
        const currentViewId = navigationHistory[navigationHistory.length - 1];
        const allContentViews = [homeViewContent, playlistViewContent, searchViewContent];

        allContentViews.forEach(view => {
            view.classList.toggle('hidden', view.id !== currentViewId);
        });

        backButtons.forEach(btn => {
            const isDisabled = navigationHistory.length <= 1;
            btn.disabled = isDisabled;
            btn.classList.toggle('disabled', isDisabled);
        });
    }

    // Navega a una nueva vista de contenido, registrándola en el historial (ID de la vista a la que se va a navegar)

    function navigateToNewView(viewId) {
        if (navigationHistory[navigationHistory.length - 1] === viewId) {
            return;
        }
        navigationHistory.push(viewId);
        updateNavigationUI();
    }

    // Navega a la vista anterior en el historial.

    function navigateBack() {
        if (navigationHistory.length > 1) {
            navigationHistory.pop();
            updateNavigationUI();
        }
    }

    // Navega a la vista de Home, reseteando el historial.

    function navigateHome() {
        navigationHistory = ['home-view-content'];
        updateNavigationUI();
    }

    function navigateTo(viewId) {
        allViews.forEach(view => view.classList.add('hidden'));
        const targetView = document.getElementById(viewId);
        if (targetView) {
            targetView.classList.remove('hidden');
        }
        mainFooter.classList.toggle('hidden', viewId !== 'auth-view');
    }

    const showLoginForm = () => {
        loginForm.classList.remove('hidden');
        showRegisterLink.classList.remove('hidden');
        registerForm.classList.add('hidden');
        showLoginLink.classList.add('hidden');
        errorMessage.textContent = '';
    };

    const showRegisterForm = () => {
        registerForm.classList.remove('hidden');
        showLoginLink.classList.remove('hidden');
        loginForm.classList.add('hidden');
        showRegisterLink.classList.add('hidden');
        errorMessage.textContent = '';
    };

    // =======================================================
    // ===== FUNCIONES DE RENDERIZADO (UI)
    // =======================================================

    // Carga una página de canciones desde la API y las añade al contenedor.

    async function loadSongsPage() {
        // Si ya estamos cargando o si ya se cargaron todas las canciones, no hacemos nada.
        if (isLoading || allSongsLoaded) {
            return;
        }

        isLoading = true;
        console.log(`Cargando página ${currentPage}...`);

        try {
            // Construimos la URL con los parámetros de paginación
            const endpoint = `/songs?page=${currentPage}&size=${pageSize}`;
            const newSongs = await apiFetch(endpoint);
            loadedSongsCache.push(...newSongs);
            // Si la API devuelve menos canciones que el tamaño de la página es que ya estamos en el final
            if (newSongs.length < pageSize) {
                allSongsLoaded = true;
            }
            // Le pasamos las nuevas canciones para que las añada al DOM.
            renderAllSongsInSearchView(newSongs, true);
            updateSearchViewSongIcons();
            currentPage++;

        } catch (error) {
            console.error("Error al cargar la página de canciones:", error.message);
        } finally {
            isLoading = false;
        }
    }

    function updateUserUI(isLoggedIn) {
        sidebarAuthBlock.classList.toggle('hidden', isLoggedIn);
        sidebarLibraryContent.classList.toggle('hidden', !isLoggedIn);
        userProfileMenu.classList.toggle('hidden', !isLoggedIn);
    }
    // Lógica de creación de cantidad de álbumes
    function chunkArray(arr, size) {
        const chunkedArr = [];
        for (let i = 0; i < arr.length; i += size) {
            chunkedArr.push(arr.slice(i, i + size));
        }
        return chunkedArr;
    }

    function updatePlaylistInSidebar(playlistId, newTitle) {
        const playlistElement = playlistContainer.querySelector(`.playlist-item[data-playlist-id="${playlistId}"]`);
        if (playlistElement) {
            const titleElement = playlistElement.querySelector('.playlist-item-title');
            if (titleElement) {
                titleElement.textContent = newTitle;
            }
        }
    }

    function renderAllSongsInSearchView(songs, append = false) {
        if (!append) {
            allSongsContainer.innerHTML = '';
        }

        if (songs.length === 0 && !append) {
            allSongsContainer.innerHTML = '<p class="empty-results-message">No se encontraron canciones.</p>';
            return;
        }
        songs.forEach((song) => {
            const songElement = document.createElement('div');
            songElement.className = 'song-item';
            songElement.dataset.songId = song.id;

            songElement.innerHTML = `
                <div class="song-item-cover-container">
                    <img src="${song.pictureUrl}" alt="${song.title}" class="song-item-cover">
                    <button class="song-item-play-btn" title="Reproducir">
                        ${playIconSVG}
                    </button>
                </div>
                <div class="song-item-title-search">
                    <div>
                        <p class="song-title">${song.title}</p>
                        <p class="song-artist">${song.artist}</p>
                    </div>
                </div>
                <div class="song-item-album">${song.album}</div>
                <div class="song-item-duration">
                    <button class="add-to-playlist-btn" title="Añadir a playlist">+</button>
                </div>
            `;

            songElement.addEventListener('click', (event) => {
                if (event.target.closest('.add-to-playlist-btn')) {
                    return;
                }
                if (currentPlayingSong && currentPlayingSong.id === song.id) {
                    if (audioPlayer.paused) {
                        audioPlayer.play();
                    } else {
                        audioPlayer.pause();
                    }
                } else {
                    playSong(song);
                }
            });

            allSongsContainer.appendChild(songElement);
        });
    }

    function renderAlbumShelves(albums) {
        if (!contentArea) return;
        contentArea.querySelectorAll('.album-shelf').forEach(shelf => shelf.remove());

        const ALBUMS_PER_ROW = 12;
        const albumRows = chunkArray(albums, ALBUMS_PER_ROW);
        const scrollAmountFactor = 0.4;

        albumRows.forEach((row, index) => {
            const shelfContainer = document.createElement('section');
            shelfContainer.className = 'album-shelf';

            const grid = document.createElement('div');
            grid.className = 'album-grid';
            grid.id = `album-grid-${index}`;

            row.forEach(album => {
                const card = document.createElement('div');
                card.className = 'album-card';
                card.innerHTML = `
                    <img src="${album.cover}" alt="Portada de ${album.title}">
                    <h4>${album.title}</h4>
                    <p>${album.artists.join(', ')}</p>
                `;
                grid.appendChild(card);
            });

            const leftBtn = document.createElement('button');
            leftBtn.className = 'shelf-arrow-btn scroll-left-btn';
            leftBtn.innerHTML = '<i class="icon-arrow-left"></i>';

            const rightBtn = document.createElement('button');
            rightBtn.className = 'shelf-arrow-btn scroll-right-btn';
            rightBtn.innerHTML = '<i class="icon-arrow-right"></i>';

            leftBtn.addEventListener('click', () => {
                const scrollAmount = grid.clientWidth * scrollAmountFactor;
                grid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            });

            rightBtn.addEventListener('click', () => {
                const scrollAmount = grid.clientWidth * scrollAmountFactor;
                grid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            });

            shelfContainer.appendChild(grid);
            shelfContainer.appendChild(leftBtn);
            shelfContainer.appendChild(rightBtn);
            contentArea.appendChild(shelfContainer);
        });
    }

    function renderPlaylistInSidebar(playlist) {
        const playlistElement = document.createElement('a');
        playlistElement.href = '#';
        playlistElement.className = 'playlist-item';
        playlistElement.dataset.playlistId = playlist.id;

        playlistElement.innerHTML = `
            <div class="playlist-item-cover">
                <svg viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M31.2188 4.37207L29.8457 4.66113L11.3457 8.12988L10.4062 8.27441V23.7754C9.71973 23.3734 8.94287 23.125 8.09375 23.125C5.5509 23.125 3.46875 25.2072 3.46875 27.75C3.46875 30.2928 5.5509 32.375 8.09375 32.375C10.6366 32.375 12.7188 30.2928 12.7188 27.75V14.8145L28.9062 11.7793V20.3066C28.2197 19.9047 27.4429 19.6562 26.5938 19.6562C24.0509 19.6562 21.9688 21.7384 21.9688 24.2812C21.9688 26.8241 24.0509 28.9062 26.5938 28.9062C29.1366 28.9062 31.2188 26.8241 31.2188 24.2812V4.37207ZM28.9062 7.1543V9.4668L12.7188 12.502V10.1895L28.9062 7.1543ZM26.5938 21.9688C27.8855 21.9688 28.9062 22.9895 28.9062 24.2812C28.9062 25.573 27.8855 26.5938 26.5938 26.5938C25.302 26.5938 24.2812 25.573 24.2812 24.2812C24.2812 22.9895 25.302 21.9688 26.5938 21.9688ZM8.09375 25.4375C9.3855 25.4375 10.4062 26.4583 10.4062 27.75C10.4062 29.0417 9.3855 30.0625 8.09375 30.0625C6.802 30.0625 5.78125 29.0417 5.78125 27.75C5.78125 26.4583 6.802 25.4375 8.09375 25.4375Z" fill="#848484"/>
                </svg>
            </div>
            <div class="playlist-item-info">
                <p class="playlist-item-title">${playlist.title}</p>
                <p class="playlist-item-owner"> Dueño lista</p>
            </div>
        `;

        playlistElement.addEventListener('click', (e) => {
            e.preventDefault();
            const id = parseInt(playlistElement.dataset.playlistId);
            showPlaylistDetails(id);
        });

        playlistContainer.prepend(playlistElement);
    }

    function renderSongsInPlaylistView(songs) {
        songListContainer.innerHTML = '';

        if (songs.length === 0) {
            songListContainer.innerHTML = '<p class="empty-playlist-message">Aún no hay canciones en esta lista. ¡Añade algunas!</p>';
            return;
        }

        songs.forEach((song, index) => {
            const songElement = document.createElement('div');
            songElement.className = 'song-item';
            songElement.dataset.songId = song.id;

            songElement.innerHTML = `
                <div class="song-item-index">
                    <span class="song-index-number">${index + 1}</span>
                    <button class="song-item-play-btn"></button>
                </div>
                <div class="song-item-title">
                    <img src="${song.pictureUrl}" alt="${song.title}" class="song-item-cover">
                    <div>
                        <p class="song-title">${song.title}</p>
                        <p class="song-artist">${song.artist}</p>
                    </div>
                </div>
                <div class="song-item-album">${song.album}</div>
                <div class="song-item-duration">
                    <span>${formatTime(song.duration)}</span>
                    <div class="song-options-menu">
                        <button class="song-options-btn" title="Más opciones">
                            <svg role="img" height="16" width="16" fill="currentColor" viewBox="0 0 16 16"><path d="M3 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm6.5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM16 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"></path></svg>
                        </button>
                        <div class="song-options-dropdown hidden">
                            <button class="remove-song-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="#656565"><path d="M5.25 3v-.917C5.25.933 6.183 0 7.333 0h1.334c1.15 0 2.083.933 2.083 2.083V3h4.75v1.5h-.972l-1.257 9.544A2.25 2.25 0 0 1 11.041 16H4.96a2.25 2.25 0 0 1-2.23-1.956L1.472 4.5H.5V3zm1.5-.917V3h2.5v-.917a.583.583 0 0 0-.583-.583H7.333a.583.583 0 0 0-.583.583M2.986 4.5l1.23 9.348a.75.75 0 0 0 .744.652h6.08a.75.75 0 0 0 .744-.652L13.015 4.5H2.985z"/></svg>
                                Quitar de esta lista
                            </button>
                        </div>
                    </div>
                </div>
            `;

            songElement.addEventListener('click', (event) => {
                if (event.target.closest('.song-options-menu')) {
                    return;
                }
                if (currentPlayingSong && currentPlayingSong.id === song.id) {
                    if (audioPlayer.paused) {
                        audioPlayer.play();
                    } else {
                        audioPlayer.pause();
                    }
                } else {
                    playSong(song);
                }
            });

            songListContainer.appendChild(songElement);
        });
    }

    // =======================================================
    // ===== LÓGICA DEL REPRODUCTOR
    // =======================================================

    const playIconSVG = `<svg role="img" height="24" width="24" fill="currentColor" viewBox="0 0 24 24"><path d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z"></path></svg>`;
    const pauseIconSVG = `<svg role="img" height="24" width="24" fill="currentColor" viewBox="0 0 24 24"><path d="M5.7 3a.7.7 0 00-.7.7v16.6a.7.7 0 00.7.7h2.6a.7.7 0 00.7-.7V3.7a.7.7 0 00-.7-.7H5.7zm10 0a.7.7 0 00-.7.7v16.6a.7.7 0 00.7.7h2.6a.7.7 0 00.7-.7V3.7a.7.7 0 00-.7-.7h-2.6z"></path></svg>`;

    function updatePlayerBarUI(song) {
        if (song) {
            playerSongCover.src = song.pictureUrl;
            playerSongTitle.textContent = song.title;
            playerSongArtist.textContent = song.artistName;
            currentSongInfo.classList.remove('hidden');
        } else {
            currentSongInfo.classList.add('hidden');
        }
    }

    function updateSongItemIcons() {
        const allSongItems = songListContainer.querySelectorAll('.song-item');
        allSongItems.forEach(item => {
            const songId = parseInt(item.dataset.songId);
            const playBtn = item.querySelector('.song-item-play-btn');
            item.classList.remove('is-playing');
            playBtn.innerHTML = playIconSVG;
            if (currentPlayingSong && currentPlayingSong.id === songId) {
                item.classList.add('is-playing');
                playBtn.innerHTML = audioPlayer.paused ? playIconSVG : pauseIconSVG;
            }
        });
    }

    function updateSearchViewSongIcons() {
        if (!allSongsContainer) return;
        const allSongItems = allSongsContainer.querySelectorAll('.song-item');
        allSongItems.forEach(item => {
            const songId = parseInt(item.dataset.songId);
            const playBtn = item.querySelector('.song-item-play-btn');
            if (!playBtn) return;
            item.classList.remove('is-playing');
            playBtn.innerHTML = playIconSVG;
            if (currentPlayingSong && currentPlayingSong.id === songId) {
                item.classList.add('is-playing');
                playBtn.innerHTML = audioPlayer.paused ? playIconSVG : pauseIconSVG;
            }
        });
    }

    function updatePlayPauseIcon(isPlaying) {
        const icon = playerPlayBtn.querySelector('i');
        icon.className = isPlaying ? 'icon-pause' : 'icon-play';
    }

    async function refreshCurrentPlaylistView() {
        // Si no hay ninguna playlist abierta, no hay nada que hacer.
        if (!currentOpenPlaylistId) {
            return;
        }

        try {
            // 1. Volvemos a pedir los datos actualizados al backend.
            const updatedPlaylist = await apiFetch(`/playlists/${currentOpenPlaylistId}`);

            // 2. Actualizamos nuestra variable de estado principal.
            currentPlaylistData = updatedPlaylist;

            // 3. Re-renderizamos la lista de canciones en la UI.
            renderSongsInPlaylistView(updatedPlaylist.songs);
            updateSongItemIcons(); // Sincronizamos los iconos de play/pausa

            // 4. Actualizamos la cola de reproducción si hay una canción sonando.
            if (currentPlayingSong) {
                currentQueue = updatedPlaylist.songs;
                // Re-calculamos el índice de la canción actual en la nueva cola.
                currentQueueIndex = currentQueue.findIndex(s => s.id === currentPlayingSong.id);
            }

        } catch (error) {
            console.error("No se pudo refrescar la playlist:", error);
            showToast("Error al actualizar la playlist.", 'error');
        }
    }

    let currentObjectUrl = null;

    async function playSong(song) {
        // 1. Verificación inicial de la canción.
        if (!song?.sourceUrl) {
            console.error("No se puede reproducir: la canción no tiene una clave de objeto válida.");
            showToast('Esta canción no está disponible para reproducción.', 'error');
            return;
        }
        // 2. Limpieza de la URL de Blob anterior (muy importante para la gestión de memoria).
        // Cada vez que se crea una URL de objeto, se reserva memoria. Debemos liberarla.
        if (currentObjectUrl) {
            URL.revokeObjectURL(currentObjectUrl);
        }
        // 3. Informar al usuario que la canción está cargando.
        // Con este método, la descarga completa debe finalizar antes de que comience la reproducción.
        showToast('Cargando canción...', 'info', 2000);
        setPlayerControlsEnabled(false); // Deshabilitamos controles mientras descarga.

        try {
            const objectKey = song.sourceUrl;
            const fileEndpointUrl = `${API_BASE_URL}/file/${objectKey}`;
            const token = localStorage.getItem('authToken');

            // 4. Usamos `fetch` para descargar el archivo, añadiendo el encabezado de autorización.
            const response = await fetch(fileEndpointUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                // Si el token es inválido o el archivo no se encuentra, el error se captura aquí.
                throw new Error(`No se pudo descargar la canción. Estado: ${response.status}`);
            }

            // 5. Convertimos la respuesta en un "Blob", que son los datos crudos del archivo MP3.
            const audioBlob = await response.blob();

            // 6. Creamos una URL de objeto temporal a partir del Blob.
            const playableUrl = URL.createObjectURL(audioBlob);
            currentObjectUrl = playableUrl; // Guardamos la nueva URL para poder limpiarla después.

            // 7. La lógica de la cola de reproducción
            let songSourceList = [];
            if (!playlistViewContent.classList.contains('hidden') && currentPlaylistData) {
                songSourceList = currentPlaylistData.songs;
            } else if (!searchViewContent.classList.contains('hidden')) {
                const searchTerm = searchInput.value.trim().toLowerCase();
                if (searchTerm !== '') {
                    songSourceList = loadedSongsCache.filter(s =>
                        s.title.toLowerCase().includes(searchTerm) ||
                        (s.artist || "").toLowerCase().includes(searchTerm) ||
                        (s.album || "").toLowerCase().includes(searchTerm)
                    );
                } else {
                    songSourceList = loadedSongsCache;
                }
            }
            currentQueue = songSourceList;
            currentQueueIndex = currentQueue.findIndex(s => s.id === song.id);
            if (currentQueueIndex === -1) {
                currentQueue = [song];
                currentQueueIndex = 0;
            }

            // 8. Asignación y Reproducción.
            currentPlayingSong = song;
            audioPlayer.src = playableUrl; // Asignamos la URL de Blob al reproductor.

            // En lugar de `await`, usamos el evento `canplay` para saber cuándo está listo para reproducir.
            audioPlayer.addEventListener('canplay', async () => {
                try {
                    await audioPlayer.play();

                    // Actualizamos la UI solo cuando la reproducción comienza con éxito.
                    updatePlayerBarUI(song);
                    setPlayerControlsEnabled(true);
                    updateSongItemIcons();
                    updateSearchViewSongIcons();

                    currentTimeEl.textContent = '0:00';
                    progressSlider.value = 0;
                } catch (playError) {
                    console.error("Error en el aut-play después de la carga:", playError);
                    showToast('No se pudo iniciar la reproducción.', 'error');
                }
            }, { once: true }); // { once: true } asegura que este listener se ejecute solo una vez.

        } catch (error) {
            console.error("Error al intentar cargar la canción:", error);
            showToast('Debes iniciar sesión para reproducir canciones.', 'error');
            setPlayerControlsEnabled(false);
        }
    }

    function playNextSongInQueue() {
        // Verificamos si hay una siguiente canción en la cola.
        if (currentQueue.length === 0 || currentQueueIndex >= currentQueue.length - 1) {
            console.log("Fin de la cola.");
            return;
        }
        // Incrementamos el índice y reproducimos la siguiente canción.
        currentQueueIndex++;
        const nextSong = currentQueue[currentQueueIndex];
        playSong(nextSong);
    }

    function playPreviousSongInQueue() {
        // Verificamos si hay una canción anterior en la cola.
        if (currentQueue.length === 0 || currentQueueIndex <= 0) {
            console.log("Inicio de la cola.");
            return;
        }
        // Decrementamos el índice y reproducimos la canción anterior.
        currentQueueIndex--;
        const prevSong = currentQueue[currentQueueIndex];
        playSong(prevSong);
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    function setPlayerControlsEnabled(enabled) {
        playerPlayBtn.disabled = !enabled;
        progressSlider.disabled = !enabled;
    }

    // =======================================================
    // ===== LÓGICA DE API Y DATOS
    // =======================================================

    // --- Función principal de filtrado ---
    function filterSongs() {
        const searchTerm = searchInput.value.toLowerCase().trim();

        if (searchTerm === '') {
            renderAllSongsInSearchView(loadedSongsCache);
            updateSearchViewSongIcons();
            return;
        }

        const filteredSongs = loadedSongsCache.filter(song => {
            const titleMatch = song.title.toLowerCase().includes(searchTerm);
            const artistMatch = (song.artist || "").toLowerCase().includes(searchTerm);
            const albumMatch = (song.album || "").toLowerCase().includes(searchTerm);
            return titleMatch || artistMatch || albumMatch;
        });

        if (filteredSongs.length > 0) {
            // Si hay resultados, los renderizamos
            renderAllSongsInSearchView(filteredSongs);
            updateSearchViewSongIcons();
        } else {
            // Si no hay resultados, mostramos un mensaje informativo.
            let message = `No se encontraron resultados para "${searchInput.value}" en la lista de canciones.`;

            if (!allSongsLoaded) {
                // Si todavía quedan canciones por cargar en el servidor, le decimos al usuario que siga bajando.
                message += ' <br>Sigue haciendo scroll para cargar más canciones y vuelve a intentarlo.';
            }

            allSongsContainer.innerHTML = `<p class="empty-results-message">${message}</p>`;
        }
    }

    async function apiFetch(endpoint, method = 'GET', body = null) {
        const token = localStorage.getItem('authToken');
        const headers = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            method: method,
            headers: headers,
        };

        if (body) {
            config.body = JSON.stringify(body);
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        // Primero, verificamos si la respuesta NO es exitosa.
        if (!response.ok) {
            // Si hay un error, intentamos leer el cuerpo del error como JSON.
            const errorData = await response.json().catch(() => ({})); // .catch() por si el cuerpo del error también está vacío
            throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
        }
        // Si la respuesta es exitosa (ej. 200, 201, 204),
        // verificamos si tiene contenido antes de intentar parsearlo.
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
            return await response.json();
        } else {
            return null;
        }
    }


    // Muestra una notificación "toast" en la pantalla.

    function showToast(message, type = 'info', duration = 3000) {
        const container = document.getElementById('toast-container');
        if (!container) return;
        // 1. Crear el elemento del toast
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        // 2. Añadirlo al contenedor
        container.appendChild(toast);
        // 3. Hacerlo visible
        // Usamos un pequeño timeout para asegurar que la transición CSS se aplique
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        // 4. Configurar su desaparición
        setTimeout(() => {
            toast.classList.remove('show');
            // 5. Eliminar el toast del DOM después de que la animación de salida termine
            toast.addEventListener('transitionend', () => {
                toast.remove();
            });
        }, duration);
    }

    async function loadUserPlaylists() {
        try {
            // Usar función auxiliar. El token se añade automáticamente.
            const playlists = await apiFetch('/playlists');
            playlistContainer.innerHTML = '';
            playlists.forEach(playlist => renderPlaylistInSidebar(playlist));
        } catch (error) {
            console.error("Error al cargar las playlists del usuario:", error.message);
            // Si el token expira o es inválido, el error 403 o 401 será capturado aquí.
        }
    }

    async function showPlaylistDetails(playlistId) {
        try {
            currentOpenPlaylistId = playlistId;
            //endpoint que devuelve los detalles y las canciones de la playlist.
            const playlist = await apiFetch(`/playlists/${playlistId}`);
            currentPlaylistData = playlist; // ¡Guardamos los datos!
            playlistTitleEl.textContent = playlist.title;
            playlistDescriptionEl.textContent = playlist.description || '';
            // Asumimos que el backend no nos da el nombre del dueño por ahora.
            playlistOwnerEl.textContent = 'Dueño lista';

            renderSongsInPlaylistView(playlist.songs);
            updateSongItemIcons();

            navigateToNewView('playlist-view-content');

        } catch (error) {
            console.error("Error al mostrar los detalles de la playlist:", error.message);
            currentOpenPlaylistId = null;
        }
    }

    async function handleRegistration(name, email, password) {
        errorMessage.textContent = 'Creando cuenta...';
        const body = { name, email, password };
        try {
            const response = await fetch(REGISTER_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (response.ok) {
                const responseData = await response.json();
                localStorage.setItem('authToken', responseData.token);
                updateUserUI(true);
                navigateTo('main-view');
                await loadUserPlaylists();
                errorMessage.textContent = '';
            } else if (response.status === 409) {
                errorMessage.textContent = 'El correo electrónico ya está registrado.';
            } else {
                errorMessage.textContent = 'Ocurrió un error. Inténtalo de nuevo.';
            }
        } catch (error) {
            console.error("Error de red en el registro:", error);
            errorMessage.textContent = 'No se pudo conectar con el servidor.';
        }
    }

    async function handleLogin(email, password) {
        errorMessage.textContent = 'Iniciando sesión...';
        const body = { email, password };
        try {
            const response = await fetch(LOGIN_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (response.ok) {
                const responseData = await response.json();
                localStorage.setItem('authToken', responseData.token);
                updateUserUI(true);
                navigateTo('main-view');
                await loadUserPlaylists();
                errorMessage.textContent = '';
            } else {
                errorMessage.textContent = 'Correo o contraseña incorrectos.';
            }
        } catch (error) {
            console.error("Error de red en el login:", error);
            errorMessage.textContent = 'No se pudo conectar con el servidor.';
        }
    }

    // =======================================================
    // ===== LÓGICA DE MODALES
    // =======================================================

    // --- Modal "Añadir a Playlist" ---
    async function openAddToPlaylistModal(songId) {
        songIdToAdd = songId;
        // Reseteamos la UI del modal
        modalPlaylistList.classList.remove('hidden');
        modalFeedbackMessage.classList.add('hidden');

        try {
            // Usamos apiFetch para obtener las playlists del usuario.
            // El token de autorización se añade automáticamente.
            const myPlaylists = await apiFetch('/playlists');
            modalPlaylistList.innerHTML = '';
            if (myPlaylists.length === 0) {
                modalPlaylistList.innerHTML = '<p class="empty-playlist-message">No tienes playlists. ¡Crea una primero!</p>';
            } else {
                myPlaylists.forEach(playlist => {
                    const item = document.createElement('div');
                    item.className = 'modal-playlist-item';
                    item.textContent = playlist.title;
                    item.dataset.playlistId = playlist.id;
                    modalPlaylistList.appendChild(item);
                });
            }
            addToPlaylistModal.classList.remove('hidden');

        } catch (error) {
            console.error("Error al obtener playlists para el modal:", error.message);
            // Mostrar un error dentro del modal para el usuario.
            modalPlaylistList.innerHTML = `<p class="error-message">Inicia sesión para agregar canciones a una Playlist.</p>`;
            addToPlaylistModal.classList.remove('hidden');
        }
    }

    function showModalFeedback(message, type = 'success') {
        modalFeedbackMessage.textContent = message;
        modalFeedbackMessage.classList.remove('hidden', 'success', 'error');
        modalFeedbackMessage.classList.add(type);
    }

    function closeAddToPlaylistModal() {
        addToPlaylistModal.classList.add('hidden');
        songIdToAdd = null;
        modalFeedbackMessage.classList.add('hidden');
        modalFeedbackMessage.textContent = '';
    }

    // --- Modal "Editar Playlist" ---
    function closeEditPlaylistModal() {
        editPlaylistModal.classList.add('hidden');
        editPlaylistErrorMsg.classList.add('hidden');
    }

    async function openEditPlaylistModal() {
        if (!currentOpenPlaylistId) return;

        try {
            // Usamos apiFetch para obtener los detalles más recientes de la playlist.
            const playlist = await apiFetch(`/playlists/${currentOpenPlaylistId}`);
            // Rellenamos el modal con los datos del backend.
            editPlaylistNameInput.value = playlist.title;
            editPlaylistDescriptionInput.value = playlist.description || ''; // Usamos '' si la descripción es null
            // La lógica para la imagen de portada 
            editPlaylistCoverImg.src = playlist.songs && playlist.songs.length > 0
                ? playlist.songs[0].pictureUrl
                : 'img/default-playlist.png';

            editPlaylistModal.classList.remove('hidden');
            // Las funciones de validación y contadores
            validateEditForm();
            updateCharCounter();
            updateNameCharCounter();

        } catch (error) {
            console.error("Error al obtener datos para editar la playlist:", error);
            showToast('No se pudieron cargar los detalles de la playlist.', 'error');
        }
    }

    function validateEditForm() {
        const saveButton = editPlaylistForm.querySelector('.save-playlist-btn');
        const playlistName = editPlaylistNameInput.value.trim();
        const isInvalid = playlistName === '';

        editPlaylistErrorText.textContent = isInvalid ? 'El nombre de la lista de reproducción es obligatorio.' : '';
        editPlaylistErrorMsg.classList.toggle('hidden', !isInvalid);
        editPlaylistNameInput.classList.toggle('error-field', isInvalid);
        saveButton.disabled = isInvalid;
    }

    function updateCharCounter() {
        const maxLength = editPlaylistDescriptionInput.maxLength;
        const currentLength = editPlaylistDescriptionInput.value.length;
        descriptionCharCounter.textContent = `${currentLength} / ${maxLength}`;
        descriptionCharCounter.classList.toggle('limit-reached', currentLength >= maxLength);
    }

    function updateNameCharCounter() {
        const maxLength = editPlaylistNameInput.maxLength;
        const currentLength = editPlaylistNameInput.value.length;
        nameCharCounter.textContent = `${currentLength} / ${maxLength}`;
        nameCharCounter.classList.toggle('limit-reached', currentLength >= maxLength);
    }

    // --- Modal "Eliminar Playlist" ---
    function closeDeleteModal() {
        deletePlaylistModal.classList.add('hidden');
        playlistIdToAction = null;
    }

    // =======================================================
    // ===== LÓGICA DE ANIMACIÓN (YETI)
    // =======================================================

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

    // =======================================================
    // ===== EVENT LISTENERS
    // =======================================================

    // --- Navegación Principal y Autenticación ---
    goToLoginBtn.addEventListener('click', () => {
        navigateTo('auth-view');
        showLoginForm();
    });
    goToRegisterBtn.addEventListener('click', () => {
        navigateTo('auth-view');
        showRegisterForm();
    });
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        showRegisterForm();
    });
    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        showLoginForm();
    });
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleLogin(loginEmail.value, loginPassword.value);
    });
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleRegistration(registerName.value, registerEmail.value, registerPassword.value);
    });
    backToHomeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('main-view');
    });
    // --- Navegación Sidebar ---
    searchBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        navigateToNewView('search-view-content');
        // Reseteamos el estado como antes
        currentPage = 0;
        allSongsLoaded = false;
        isLoading = false;
        allSongsContainer.innerHTML = ''; // Limpiamos el contenedor
        loadedSongsCache = []; // Limpiamos la caché
        document.getElementById('search-input').value = '';
        // Mostramos un indicador de carga inicial
        allSongsContainer.innerHTML = '<p class="loading-message">Cargando canciones...</p>';
        // Función para cargar un número inicial de páginas
        const loadInitialPages = async (pagesToLoad) => {
            for (let i = 0; i < pagesToLoad; i++) {
                if (allSongsLoaded) break; // Si llegamos al final, paramos
                await loadSongsPage();
            }
        };
        // Cargamos proactivamente las primeras 5 páginas (o hasta que se acaben las canciones)
        await loadInitialPages(5); // 5 páginas * 20 canciones/página = 100 canciones
        // Una vez cargadas, si la búsqueda está vacía, nos aseguramos de que no haya mensajes de carga.
        if (searchInput.value === '') {
            renderAllSongsInSearchView(loadedSongsCache);
            updateSearchViewSongIcons();
        }
    });

    homeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        navigateHome();
    });
    backButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            navigateBack();
        });
    });

    // --- Playlists ---
    createPlaylistBtn.addEventListener('click', async () => {
        createPlaylistBtn.classList.add('is-loading');
        try {
            // 1. Contamos cuántas playlists con el nombre por defecto ya existen.
            //    Buscamos en la sidebar los elementos cuyo texto comience con "Mi lista n.º".
            const existingDefaultPlaylists = document.querySelectorAll('.playlist-item-title');
            let nextPlaylistNumber = 1;

            existingDefaultPlaylists.forEach(titleElement => {
                if (titleElement.textContent.startsWith('Mi lista n.º')) {
                    nextPlaylistNumber++;
                }
            });
            // 2. Creamos el título dinámico.
            const newPlaylistTitle = `Mi lista n.º ${nextPlaylistNumber}`;
            // 3. Preparamos el cuerpo de la petición para la API.
            const newPlaylistData = {
                title: newPlaylistTitle,
                description: ""
            };
            const newPlaylist = await apiFetch('/playlists', 'POST', newPlaylistData);

            renderPlaylistInSidebar(newPlaylist);

        } catch (error) {
            console.error("Error al crear la playlist:", error.message);
            showToast('No se pudo crear la playlist. Inténtalo de nuevo.', 'error');
        } finally {
            // Quitamos la clase .is-loading al final, pase lo que pase
            createPlaylistBtn.classList.remove('is-loading');
        }
    });

    // --- Menú de Usuario ---
    userAvatarBtn.addEventListener('click', () => {
        logoutDropdown.classList.toggle('hidden');
    });
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('authToken');
        updateUserUI(false);
        playlistContainer.innerHTML = '';
        audioPlayer.pause();
        audioPlayer.src = '';
        setPlayerControlsEnabled(false);
        updatePlayerBarUI(null);
    });

    // --- Modal "Añadir a Playlist" ---
    allSongsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-playlist-btn')) {
            const songItem = e.target.closest('.song-item');
            const songId = parseInt(songItem.dataset.songId);
            openAddToPlaylistModal(songId);
        }
    });
    modalCloseBtn.addEventListener('click', closeAddToPlaylistModal);
    modalPlaylistList.addEventListener('click', async (e) => {
        if (modalPlaylistList.classList.contains('is-loading')) {
            return;
        }

        if (e.target.classList.contains('modal-playlist-item')) {
            const playlistItem = e.target;
            const playlistId = parseInt(playlistItem.dataset.playlistId);
            // 1. Deshabilitamos el botón de cerrar
            modalCloseBtn.disabled = true;
            // 2. Añadimos la clase de carga al contenedor principal para bloquear la lista
            modalPlaylistList.classList.add('is-loading');

            try {
                await apiFetch(`/playlists/${playlistId}/songs/${songIdToAdd}`, 'POST');

                showModalFeedback(`¡Añadida a "${playlistItem.textContent}"!`, 'success');
                if (playlistId === currentOpenPlaylistId) {
                    await refreshCurrentPlaylistView();
                }
                modalPlaylistList.classList.add('hidden');

            } catch (error) {
                console.error("Error al añadir la canción:", error.message);
                showModalFeedback('Error: La canción ya está en esta playlist.', 'error');
                modalPlaylistList.classList.add('hidden');

            } finally {
                // Volvemos a habilitar el botón de cerrar, pase lo que pase.
                modalCloseBtn.disabled = false;
                // Limpiamos los estados de carga de la lista.
                modalPlaylistList.classList.remove('is-loading');
                playlistItem.classList.remove('is-loading');
            }
        }
    });

    // --- Lógica en Vista de Playlist (Eliminar canción) ---
    songListContainer.addEventListener('click', async (e) => {
        const optionsButton = e.target.closest('.song-options-btn');
        const removeButton = e.target.closest('.remove-song-btn');

        if (optionsButton) {
            e.stopPropagation();
            document.querySelectorAll('.song-options-dropdown').forEach(dropdown => {
                if (dropdown !== optionsButton.nextElementSibling) {
                    dropdown.classList.add('hidden');
                }
            });
            optionsButton.nextElementSibling.classList.toggle('hidden');
            return;
        }
        if (removeButton) {
            const songItem = removeButton.closest('.song-item');
            const songId = parseInt(songItem.dataset.songId);
            // Oculta inmediatamente el menú desplegable que contiene el botón.
            removeButton.closest('.song-options-dropdown').classList.add('hidden');
            if (!currentOpenPlaylistId || !songId || songItem.classList.contains('is-deleting')) {
                return;
            }

            try {
                await apiFetch(`/playlists/${currentOpenPlaylistId}/songs/${songId}`, 'DELETE');
                showToast('Canción eliminada de la playlist', 'success');
                await refreshCurrentPlaylistView();
                songItem.style.opacity = '0';
                setTimeout(() => {
                    songItem.remove();
                    if (songListContainer.children.length === 0) {
                        renderSongsInPlaylistView([]);
                    }
                }, 300);

            } catch (error) {
                console.error("Error al quitar la canción:", error.message);
                songItem.classList.remove('is-deleting');
                showToast('No se pudo quitar la canción', 'error');
            }
        }
    });

    playlistTitleEl.addEventListener('click', openEditPlaylistModal);
    playlistDescriptionEl.addEventListener('click', openEditPlaylistModal);

    // --- Modal "Editar Playlist" ---
    closeEditModalBtn.addEventListener('click', closeEditPlaylistModal);
    editPlaylistNameInput.addEventListener('input', () => {
        validateEditForm();
        updateNameCharCounter();
    });
    editPlaylistDescriptionInput.addEventListener('input', updateCharCounter);
    editPlaylistForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const saveButton = editPlaylistForm.querySelector('.save-playlist-btn');
        saveButton.classList.add('is-loading');

        const newTitle = editPlaylistNameInput.value.trim();
        const newDescription = editPlaylistDescriptionInput.value.trim();

        // Preparamos el cuerpo de la petición (PlaylistDto)
        const updatedPlaylistData = {
            id: currentOpenPlaylistId,
            title: newTitle,
            description: newDescription
        };

        try {
            // Usamos apiFetch con el método PUT para enviar la actualización.
            const updatedPlaylist = await apiFetch('/playlists', 'PUT', updatedPlaylistData);
            // Actualizamos la UI con la respuesta del backend.
            playlistTitleEl.textContent = updatedPlaylist.title;
            playlistDescriptionEl.textContent = updatedPlaylist.description;
            // Actualizamos también el nombre en la sidebar.
            updatePlaylistInSidebar(currentOpenPlaylistId, updatedPlaylist.title);

            closeEditPlaylistModal();

        } catch (error) {
            console.error("Error al guardar la playlist:", error.message);
            editPlaylistErrorText.textContent = 'No se pudo guardar la playlist. Inténtalo de nuevo.';
            editPlaylistErrorMsg.classList.remove('hidden');
        } finally {
            // Quitamos la clase .is-loading del botón de guardar
            saveButton.classList.remove('is-loading');
        }
    });

    // --- Menú Contextual y Modal "Eliminar Playlist" ---
    playlistContainer.addEventListener('contextmenu', (e) => {
        const playlistItem = e.target.closest('.playlist-item');
        if (playlistItem) {
            e.preventDefault();
            playlistIdToAction = parseInt(playlistItem.dataset.playlistId);
            playlistContextMenu.style.top = `${e.clientY}px`;
            playlistContextMenu.style.left = `${e.clientX}px`;
            playlistContextMenu.classList.remove('hidden');
        }
    });
    contextMenuDeleteOption.addEventListener('click', () => {
        if (playlistIdToAction) {
            const playlistElement = playlistContainer.querySelector(`.playlist-item[data-playlist-id="${playlistIdToAction}"]`);
            const playlistTitle = playlistElement.querySelector('.playlist-item-title').textContent;
            deleteModalText.textContent = `¿Quieres eliminar permanentemente "${playlistTitle}"?`;
            deletePlaylistModal.classList.remove('hidden');
        }
    });
    cancelDeleteBtn.addEventListener('click', closeDeleteModal);
    confirmDeleteBtn.addEventListener('click', async () => {
        if (!playlistIdToAction) return;
        confirmDeleteBtn.classList.add('is-loading');
        try {
            // Función apiFetch con el método DELETE.
            await apiFetch(`/playlists/${playlistIdToAction}`, 'DELETE');
            showToast('Playlist eliminada con éxito', 'success');

            const playlistElement = playlistContainer.querySelector(`.playlist-item[data-playlist-id="${playlistIdToAction}"]`);
            if (playlistElement) {
                playlistElement.remove();
            }
            // Si eliminamos la playlist que estamos viendo, volvemos a Home.
            if (playlistIdToAction === currentOpenPlaylistId) {
                navigateHome();
                currentOpenPlaylistId = null;
            }

        } catch (error) {
            console.error("Error al eliminar la playlist:", error.message);
            // Usamos un alert simple para notificar al usuario
            showToast(`Error: No se pudo eliminar la playlist.`, 'error');
        } finally {
            // Quitamos la clase y cerramos el modal
            confirmDeleteBtn.classList.remove('is-loading');
            closeDeleteModal();
        }
    });

    // --- Listener para Scroll Infinito en la Vista de Búsqueda ---
    // Usamos el 'main-content' como el elemento que tiene el scroll
    const mainContent = document.querySelector('.main-content');
    mainContent.addEventListener('scroll', () => {
        // Verificamos que estemos en la vista de búsqueda antes de hacer algo
        if (searchViewContent.classList.contains('hidden')) {
            return;
        }

        if (searchInput.value.trim() !== '') {
            return;
        }
        // `scrollTop`: cuánto hemos bajado desde arriba.
        // `clientHeight`: la altura visible del contenedor.
        // `scrollHeight`: la altura total del contenido (incluyendo lo que no se ve).
        const { scrollTop, clientHeight, scrollHeight } = mainContent;
        // Si la suma de lo que hemos bajado y la altura visible es casi igual a la altura total,
        // significa que estamos al final de la lista.
        if (scrollTop + clientHeight >= scrollHeight - 5) { // -5 es un pequeño umbral
            loadSongsPage(); // Llamamos a nuestra función para cargar la siguiente página
        }
    });

    searchInput.addEventListener('input', filterSongs);

    // --- Controles del Reproductor ---
    playerPlayBtn.addEventListener('click', () => {
        if (!currentPlayingSong) return;
        if (audioPlayer.paused) {
            audioPlayer.play();
        } else {
            audioPlayer.pause();
        }
    });
    audioPlayer.addEventListener('play', () => {
        updatePlayPauseIcon(true);
        updateSongItemIcons();
        updateSearchViewSongIcons();
    });
    audioPlayer.addEventListener('pause', () => {
        updatePlayPauseIcon(false);
        updateSongItemIcons();
        updateSearchViewSongIcons();
    });
    audioPlayer.addEventListener('ended', () => {
        updatePlayPauseIcon(false);
        updateSongItemIcons();
        updateSearchViewSongIcons();
        // Llama a la función para reproducir la siguiente canción de la cola.
        playNextSongInQueue();
    });
    audioPlayer.addEventListener('timeupdate', () => {
        if (audioPlayer.duration) {
            progressSlider.value = audioPlayer.currentTime;
            currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
        }
    });
    audioPlayer.addEventListener('loadedmetadata', () => {
        progressSlider.max = audioPlayer.duration;
        durationEl.textContent = formatTime(audioPlayer.duration);
    });
    progressSlider.addEventListener('input', () => {
        audioPlayer.currentTime = progressSlider.value;
    });
    playerNextBtn.addEventListener('click', playNextSongInQueue);
    playerPrevBtn.addEventListener('click', playPreviousSongInQueue);

    // --- Listeners Globales (Animación Yeti, cerrar menús) ---
    window.addEventListener('mousemove', (event) => {
        moveEye(pupilLeft, event);
        moveEye(pupilRight, event);
    });
    window.addEventListener('click', (e) => {
        // Cierra menús contextuales y dropdowns si el clic es fuera de ellos
        if (!e.target.closest('.song-options-menu')) {
            document.querySelectorAll('.song-options-dropdown').forEach(dropdown => {
                dropdown.classList.add('hidden');
            });
        }
        if (!userProfileMenu.contains(e.target) && !logoutDropdown.classList.contains('hidden')) {
            logoutDropdown.classList.add('hidden');
        }
        if (!playlistContextMenu.classList.contains('hidden')) {
            playlistContextMenu.classList.add('hidden');
        }
    });

    // =======================================================
    // ===== INICIALIZACIÓN DE LA APP
    // =======================================================
    async function initializeApp() {
        // 1. Preparamos la UI base de la aplicación.
        navigateTo('main-view');
        navigateHome();
        updatePlayPauseIcon(false);
        setPlayerControlsEnabled(false);
        // 2. Renderizamos los álbumes de la home, que siguen usando datos locales del mockup.
        if (window.UisTiFyData?.allPlaylists) {
            renderAlbumShelves(window.UisTiFyData.allPlaylists);
        } else {
            console.error("Los datos de UisTiFy (para los álbumes) no se cargaron correctamente.");
        }
        // 3. Verificamos el estado de autenticación del usuario.
        const token = localStorage.getItem('authToken');

        if (token) {
            // Si encontramos un token, intentamos cargar los datos del usuario.
            try {
                await loadUserPlaylists(); // Intentamos obtener un recurso protegido.
                // Si la línea anterior no lanzó un error, el token es válido.
                updateUserUI(true); // Mostramos la UI de usuario logueado.
            } catch (error) {
                // Si `loadUserPlaylists` falla (probablemente por un error 401/403),
                // significa que el token es inválido o ha expirado.
                console.error("Token inválido o expirado. Cerrando sesión.", error.message);
                // Forzamos el cierre de sesión.
                localStorage.removeItem('authToken');
                updateUserUI(false);
                playlistContainer.innerHTML = ''; // Limpiamos la lista de playlists.
            }
        } else {
            // Si no hay token, el usuario no está logueado.
            updateUserUI(false);
        }
    }

    initializeApp();

});