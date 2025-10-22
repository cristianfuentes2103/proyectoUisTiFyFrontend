<p align="center">  Frontend para la aplicación UisTiFy</p>

<h4 align="center">  ENTORNOS DE PROGRAMACIÓN F1 </h4>
<h5 align="center">  Marcos Duvan Nitola Rodriguez - 2200146 </h5>
<h5 align="center">  Christian David Fuentes Duarte - 2182062 </h5>
<h5 align="center">  Diego Andrés Toscano Zabala - 2201780 </h5>

El proyecto UisTiFy consiste en una aplicación de música enfocada en el usuario, permitiéndole administrar sus propias listas de reproducción personalizándolas con las canciones de su agrado, el propósito es que el usuario pueda subir su propio contenido para compartirlo con los demás, como esta es la primera versión del proyecto que integra, HTML, CSS y JavaScript vanilla para el frontend se adoptaron las funcionalidades principales, como lo son:

- Registro en la aplicación
- Login en la aplicación
- Creación de playlists
- Cambiar el nombre y la descripción de playlists
- Agregar canciones a las playlists
- Eliminar canciones de las playlists
- Escuchar las canciones dentro de las playlists
- Reproducir de manera secuencial las playlists
- Devolverse en las playlists
- Búsqueda o filtrado de canciones en la lista de canciones
- Retroalimentación instantánea al usuario sobre las acciones

<p align="center"> <img width="518" height="442" alt="image" src="https://github.com/user-attachments/assets/7663be09-2bb3-43cc-8a89-9fd88092723e" /> </p>

------------

# Resumen de la Aplicación **UisTiFy**

Nuestra aplicación **UisTiFy** funciona como una **Single-Page Application (SPA)** que se comunica con un **backend** a través de una **API REST**.  
Toda la lógica de la interfaz y la gestión del estado se manejan en el **frontend con JavaScript vanilla**.

---

## 1. Autenticación: El Acceso a la Aplicación

El punto de entrada para cualquier usuario es el sistema de autenticación:

### Registro y Login (`handleRegistration`, `handleLogin`)
- Al enviar el formulario de registro o login, se usa `fetch` para enviar una solicitud **POST** a:
  - `/api/auth/register`
  - `/api/auth/login`
- El cuerpo de la solicitud contiene las credenciales del usuario (`name`, `email`, `password`).
- Estas solicitudes iniciales **no** incluyen token, ya que son **públicas**.
- Si las credenciales son correctas, el backend responde con un **JSON Web Token (JWT)**.
- El frontend almacena este token en `localStorage` bajo la clave **`authToken`**, que funcionará como la “llave” del usuario para futuras solicitudes.
---

## 2. La Sesión Autenticada: El Orquestador `apiFetch`

Una vez guardado el token, toda la comunicación con endpoints protegidos se gestiona mediante la función auxiliar **`apiFetch`**.

### El Orquestador (`apiFetch`)
- Antes de enviar una solicitud, revisa `localStorage` en busca del `authToken`.
- Si existe, lo añade a los encabezados como:
  ```
  Authorization: Bearer <token>
  ```
- Esta función **centraliza la lógica de autenticación**, manteniendo limpio el resto del código.

---

## 3. Inicialización y Gestión de Vistas

### Arranque de la App (`initializeApp`)
- Al cargar la aplicación, revisa si existe un `authToken` en `localStorage`.
- Si lo encuentra, intenta validarlo llamando a `loadUserPlaylists()` (requiere autorización).
  - Si tiene éxito → el token es válido y la UI pasa al modo **logueado**.
  - Si falla → se limpia el `localStorage` y se muestra la UI de **no logueado**.
- En paralelo, `renderAlbumShelves` sigue mostrando los álbumes locales en la página principal.

### Navegación
El sistema de vistas (`navigateToNewView`, `navigateBack`, `navigateHome`) controla qué sección es visible y mantiene un historial para que el botón **"Atrás"** funcione correctamente.

---

## 4. Interacción con los Datos (CRUD Completo)

Todas las operaciones usan **`apiFetch`** y, por tanto, **envían el token JWT** en la cabecera.

### Playlists
- **Lectura:**  
  - `loadUserPlaylists` → `GET /api/playlists`  
  - `showPlaylistDetails` → `GET /api/playlists/{id}`
- **Creación:**  
  - `POST /api/playlists` (nombre generado dinámicamente: “Mi lista n.º X”)
- **Actualización:**  
  - `PUT /api/playlists` con `id` y campos modificados.
- **Eliminación:**  
  - `DELETE /api/playlists/{id}`

### Canciones
- **Catálogo (Paginación):**  
  - `loadSongsPage` → `GET /api/songs?page=X&size=Y`  
  - Implementa **scroll infinito** y guarda resultados en `loadedSongsCache`.
- **Búsqueda (Frontend):**  
  - El input filtra `loadedSongsCache` en tiempo real (sin nuevas llamadas a la API).
- **Añadir/Quitar de Playlist:**  
  - `POST /api/playlists/{playlistId}/songs/{songId}`  
  - `DELETE /api/playlists/{playlistId}/songs/{songId}`

---


## 5. Reproducción de Música: Integración con MinIO

El frontend se comunica directamente con el **Backend** para realizar la solicitud al endpoint que está apuntando al **Bucket** llamado ``develop``.

**Endpoint Proxy del Backend (/api/file):** El backend expone un endpoint (/api/file/{key}) que actúa como un proxy seguro.

### Flujo de Reproducción (`playSong`)
1. Cuando el usuario reproduce una canción, el objeto song del backend contiene una sourceUrl que es una clave (ej: "song_9").
2. La función playSong construye una URL apuntando al endpoint del backend: https://apidev.uistify.site/api/file/{key}.
3. Esta URL se asigna al src del elemento <audio>.
4. El navegador solicita la canción a nuestro backend.
5. El backend recibe la solicitud, la valida, va a MinIO a buscar el archivo MP3 correspondiente y lo transmite (hace streaming) de vuelta al navegador en la respuesta.

---

### Cola de Reproducción
- Al ejecutar `playSong`, se crea una cola (`currentQueue`) con las canciones visibles y se guarda el índice actual (`currentQueueIndex`).
- Cuando termina una canción, el evento `ended` llama a `playNextSongInQueue`, reproduciendo la siguiente.
- Los botones **“Siguiente”** y **“Anterior”** permiten navegar manualmente por la cola.

## 6. Mejoras de Experiencia de Usuario (UX)

Para que la aplicación se sienta profesional y responsiva, se han implementado varias mejoras clave en el frontend:

* Indicadores de Carga: Todas las acciones asíncronas (crear, guardar, eliminar) muestran spinners de carga en los botones y deshabilitan interacciones múltiples, dando al usuario un feedback visual inmediato.
  
* Notificaciones "Toast": Los alert() han sido reemplazados por un sistema de notificaciones "toast" no intrusivas creadas con JavaScript vanilla. Estas informan de acciones exitosas (en verde) o errores (en rojo) sin interrumpir el flujo del usuario.

* Sincronización de Estado: Se implementó una función refreshCurrentPlaylistView que se llama después de añadir o quitar una canción de la playlist actual. Esto asegura que la UI y la cola de reproducción siempre reflejen el estado más reciente del servidor, solucionando bugs de desincronización.
  
------------

## Registro
Registro implementado con fetch y el token JWT enviado por el backend para almacenarlo en el local storage y permitir el ingreso a la aplicación a los usuarios.

<p align="center"> 
<img width="164" height="479" alt="image" src="https://github.com/user-attachments/assets/27042991-3170-45fc-88e4-51628dd7fe3e" /></p>

## Login
<p align="center">
  <img width="164" height="479" alt="image" src="https://github.com/user-attachments/assets/8951490d-ddef-4940-98f4-1586991149a5" /></p>

## Vista principal para usuario no logueado
Esta es la vista ``main-view`` que ve el usuario al momento de ingresar a la aplicación.
<p align="center">
  <img width="1534" height="777" alt="image" src="https://github.com/user-attachments/assets/aa87b40d-6e89-4672-acba-36e52c7da124"/></p>

## Vista para usuario logueado
<p align="center">
<img width="1536" height="779" alt="image" src="https://github.com/user-attachments/assets/5bbaf6ec-d7e1-4dd7-a376-181c3fe34a4e" /></p>

## Vista para buscar canciones
En esta vista llamada ``search-view`` el usuario puede añadir las canciones que seleccione a una playlist personal
<p align="center">
<img width="1541" height="776" alt="image" src="https://github.com/user-attachments/assets/6df12fa0-d4f9-4bb8-8e4f-2861b48638af" /></p>


## Vista de Playlist seleccionada
En esta vista ``playlist-view`` el usuario puede personalizar su playlist y escuchar las canciones añadidas.
<p align="center">
<img width="1532" height="776" alt="image" src="https://github.com/user-attachments/assets/3e5b4d43-2d56-4a12-9fef-4415f96bafee" /></p>


