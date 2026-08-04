console.log("auth.js cargado correctamente 🔐🐾");

/* =========================================================
   MODAL VISUAL HUELLINK
   ========================================================= */

function mostrarModalHuellink(mensaje, callback = null, titulo = "Huellink") {
  let modal = document.getElementById("huellinkModal");

  if (!modal) {
    modal = document.createElement("div");
    modal.id = "huellinkModal";
    modal.className = "huellink-modal-overlay";

    modal.innerHTML = `
      <div class="huellink-modal-card">
        <button type="button" class="huellink-modal-close" id="huellinkModalClose">
          ✕
        </button>

        <img
          src="img/icons/aliado-refugio.png"
          alt="Huellink"
          class="huellink-modal-img"
          id="huellinkModalImg"
        >

        <div class="huellink-modal-fallback" id="huellinkModalFallback">
          🐾
        </div>

        <h3 class="huellink-modal-title" id="huellinkModalTitle">
          Huellink
        </h3>

        <p class="huellink-modal-message" id="huellinkModalMessage">
          Mensaje de Huellink.
        </p>

        <button type="button" class="huellink-modal-accept" id="huellinkModalBtn">
          Aceptar
        </button>
      </div>
    `;

    document.body.appendChild(modal);
  }

  const tituloModal = document.getElementById("huellinkModalTitle");
  const mensajeModal = document.getElementById("huellinkModalMessage");
  const botonModal = document.getElementById("huellinkModalBtn");
  const cerrarModal = document.getElementById("huellinkModalClose");
  const imagenModal = document.getElementById("huellinkModalImg");
  const fallbackModal = document.getElementById("huellinkModalFallback");

  if (tituloModal) {
    tituloModal.textContent = titulo;
  }

  if (mensajeModal) {
    mensajeModal.textContent = mensaje;
  }

  if (imagenModal && fallbackModal) {
    imagenModal.style.display = "block";
    fallbackModal.style.display = "none";

    imagenModal.onerror = () => {
      imagenModal.style.display = "none";
      fallbackModal.style.display = "flex";
    };
  }

  modal.classList.add("active");

  function cerrar() {
    modal.classList.remove("active");

    if (callback) {
      callback();
    }
  }

  botonModal.onclick = cerrar;
  cerrarModal.onclick = cerrar;
}

window.mostrarModalHuellink = mostrarModalHuellink;

/* =========================================================
   PÁGINAS PROTEGIDAS
   ========================================================= */

const AUTH_PAGINAS_PROTEGIDAS = [
  "dashboard.html",
  "admin.html",
  "publicar-mascota.html",
  "solicitudes.html",
  "seguimiento.html",
  "historial-seguimiento.html",
  "reportar-perdida.html",
  "reportar-encontrada.html",
  "solicitud-adopcion.html",
  "mis-solicitudes.html"
];

/* =========================================================
   PERMISOS POR ROL
   ========================================================= */

const AUTH_PERMISOS_POR_PAGINA = {
  "admin.html": ["administrador"],

  "publicar-mascota.html": ["rescatista", "refugio", "administrador"],
  "solicitudes.html": ["rescatista", "refugio", "administrador"],
  "seguimiento.html": ["rescatista", "refugio", "administrador"],
  "historial-seguimiento.html": ["rescatista", "refugio", "administrador"],

  "reportar-perdida.html": ["ciudadano", "rescatista", "refugio", "administrador"],
  "reportar-encontrada.html": ["ciudadano", "rescatista", "refugio", "administrador"],
  "solicitud-adopcion.html": ["ciudadano", "rescatista", "refugio", "administrador"],

  "dashboard.html": ["ciudadano", "rescatista", "refugio", "administrador"],
  "mis-solicitudes.html": ["ciudadano", "rescatista", "refugio", "administrador"]
};

/* =========================================================
   PERFIL Y SESIÓN LOCAL
   ========================================================= */

async function obtenerPerfilActual(userId) {
  if (typeof db === "undefined") {
    console.error("Supabase no está cargado.");
    return null;
  }

  const { data: perfil, error } = await db
    .from("perfiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error al obtener perfil:", error);
    return null;
  }

  return perfil;
}

function guardarPerfilLocal(perfil) {
  if (!perfil) return;

  localStorage.setItem("huellinkCorreo", perfil.correo || "");
  localStorage.setItem("huellinkRol", perfil.rol || "");
  localStorage.setItem("huellinkNombre", perfil.nombre || "");
}

function limpiarSesionLocal() {
  localStorage.removeItem("huellinkCorreo");
  localStorage.removeItem("huellinkRol");
  localStorage.removeItem("huellinkNombre");
}

/* =========================================================
   VERIFICAR SESIÓN Y PERMISOS
   ========================================================= */

async function verificarSesionYPermisos() {
  const paginaActual = window.location.pathname.split("/").pop() || "index.html";
  const destinoActual = `${paginaActual}${window.location.search || ""}`;

  if (!AUTH_PAGINAS_PROTEGIDAS.includes(paginaActual)) {
    return;
  }

  if (typeof db === "undefined") {
    mostrarModalHuellink(
      "Supabase no está cargado. Revisa los scripts de esta página.",
      () => {
        window.location.href = "login.html";
      },
      "Error de conexión"
    );
    return;
  }

  const { data, error } = await db.auth.getSession();

  if (error) {
    console.error("Error al verificar sesión:", error);

    mostrarModalHuellink(
      "Ocurrió un error al verificar tu sesión.",
      () => {
        window.location.href = "login.html";
      },
      "Sesión no verificada"
    );
    return;
  }

  const session = data.session;

  if (!session) {
    mostrarModalHuellink(
      "Debes iniciar sesión para acceder a esta página.",
      () => {
        window.location.href = `login.html?redirect=${encodeURIComponent(destinoActual)}`;
      },
      "Acceso requerido"
    );
    return;
  }

  const perfil = await obtenerPerfilActual(session.user.id);

  if (!perfil) {
    mostrarModalHuellink(
      "No se encontró el perfil del usuario.",
      async () => {
        await db.auth.signOut();
        limpiarSesionLocal();
        window.location.href = "login.html";
      },
      "Perfil no encontrado"
    );
    return;
  }

  guardarPerfilLocal(perfil);

  const rolesPermitidos = AUTH_PERMISOS_POR_PAGINA[paginaActual];

  if (rolesPermitidos && !rolesPermitidos.includes(perfil.rol)) {
    mostrarModalHuellink(
      "No tienes permiso para acceder a esta página.",
      () => {
        window.location.href = `dashboard.html?rol=${perfil.rol}`;
      },
      "Acceso restringido"
    );
    return;
  }

  const dashboardUsuario = document.getElementById("dashboardUsuario");

  if (dashboardUsuario) {
    dashboardUsuario.textContent = `Hola, ${perfil.nombre}`;
  }
}

/* =========================================================
   CAMBIAR BOTÓN LOGIN / MI PANEL
   ========================================================= */

async function actualizarBotonesSesion() {
  const botonesLogin = document.querySelectorAll(".btn-login");

  if (!botonesLogin.length) return;
  if (typeof db === "undefined") return;

  const { data } = await db.auth.getSession();
  const session = data.session;

  botonesLogin.forEach((boton) => {
    if (boton.classList.contains("btn-logout")) {
      return;
    }

    if (session) {
      boton.textContent = "Mi panel";
      boton.href = "dashboard.html";
    } else {
      boton.textContent = "Iniciar sesión";
      boton.href = "login.html";
    }
  });
}

/* =========================================================
   CERRAR SESIÓN
   ========================================================= */

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btn-logout")) {
    e.preventDefault();

    if (typeof db !== "undefined") {
      await db.auth.signOut();
    }

    limpiarSesionLocal();

    mostrarModalHuellink(
      "Sesión cerrada correctamente 🐾",
      () => {
        window.location.href = "index.html";
      },
      "Sesión cerrada"
    );
  }
});

/* =========================================================
   LOGIN
   ========================================================= */

const authFormLogin = document.getElementById("formLogin");

if (authFormLogin) {
  authFormLogin.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (typeof db === "undefined") {
      mostrarModalHuellink(
        "Supabase no está cargado. Revisa los scripts en login.html",
        null,
        "Error de conexión"
      );
      return;
    }

    const correoLogin = document.getElementById("correoLogin").value.trim();
    const passwordLogin = document.getElementById("passwordLogin").value;

    const { data, error } = await db.auth.signInWithPassword({
      email: correoLogin,
      password: passwordLogin
    });

    if (error) {
      mostrarModalHuellink(
        "Error al iniciar sesión: " + error.message,
        null,
        "No se pudo iniciar sesión"
      );
      return;
    }

    const user = data.user;
    const perfil = await obtenerPerfilActual(user.id);

    if (!perfil) {
      mostrarModalHuellink(
        "No se pudo cargar el perfil del usuario.",
        null,
        "Perfil no disponible"
      );
      return;
    }

    guardarPerfilLocal(perfil);

    const params = new URLSearchParams(window.location.search);
    let destino = params.get("redirect");

    if (!destino || destino.includes("://") || destino.startsWith("//")) {
      destino = `dashboard.html?rol=${perfil.rol}`;
    }

    window.location.href = destino;
  });
}

/* =========================================================
   REGISTRO
   ========================================================= */

const authFormRegistro = document.getElementById("formRegistro");

if (authFormRegistro) {
  authFormRegistro.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (typeof db === "undefined") {
      mostrarModalHuellink(
        "Supabase no está cargado. Revisa los scripts en registro.html",
        null,
        "Error de conexión"
      );
      return;
    }

    const nombre = document.getElementById("nombreRegistro").value.trim();
    const correo = document.getElementById("correoRegistro").value.trim();
    const telefono = document.getElementById("telefonoRegistro").value.trim();
    const ciudad = document.getElementById("ciudadRegistro").value.trim();
    const rol = document.getElementById("rolRegistro").value;
    const password = document.getElementById("passwordRegistro").value;
    const confirmarPassword = document.getElementById("confirmarPassword").value;

    if (password !== confirmarPassword) {
      mostrarModalHuellink(
        "Las contraseñas no coinciden. Intenta nuevamente.",
        null,
        "Verifica tu contraseña"
      );
      return;
    }

    const { data, error } = await db.auth.signUp({
      email: correo,
      password: password
    });

    if (error) {
      mostrarModalHuellink(
        "Error al registrar usuario: " + error.message,
        null,
        "No se pudo registrar"
      );
      return;
    }

    const user = data.user;

    if (!user) {
      mostrarModalHuellink(
        "Usuario creado, pero falta confirmar el correo. Revisa tu email.",
        null,
        "Confirma tu correo"
      );
      return;
    }

    const nuevoPerfil = {
      id: user.id,
      nombre,
      correo,
      telefono,
      ciudad,
      rol,
      estado: "activo"
    };

    const { error: errorPerfil } = await db
      .from("perfiles")
      .insert([nuevoPerfil]);

    if (errorPerfil) {
      mostrarModalHuellink(
        "Usuario creado, pero ocurrió un error al guardar el perfil: " + errorPerfil.message,
        null,
        "Perfil no guardado"
      );
      return;
    }

    mostrarModalHuellink(
      `Registro creado correctamente 🐾\n\nNombre: ${nombre}\nCorreo: ${correo}\nRol: ${rol}`,
      () => {
        authFormRegistro.reset();
        window.location.href = "login.html";
      },
      "Registro exitoso"
    );
  });
}

/* =========================================================
   EJECUTAR FUNCIONES DE AUTH
   ========================================================= */

verificarSesionYPermisos();
actualizarBotonesSesion();

/* =========================================================
   FUNCIONES GLOBALES
   ========================================================= */

window.obtenerPerfilActual = obtenerPerfilActual;
window.guardarPerfilLocal = guardarPerfilLocal;
window.limpiarSesionLocal = limpiarSesionLocal;
window.verificarSesionYPermisos = verificarSesionYPermisos;
window.actualizarBotonesSesion = actualizarBotonesSesion;