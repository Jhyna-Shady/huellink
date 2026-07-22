console.log("auth.js cargado correctamente 🔐🐾");

// PÁGINAS QUE REQUIEREN SESIÓN
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

];

// PERMISOS POR ROL
const AUTH_PERMISOS_POR_PAGINA = {
  "admin.html": ["administrador"],

  "publicar-mascota.html": ["rescatista", "refugio", "administrador"],
  "solicitudes.html": ["rescatista", "refugio", "administrador"],
  "seguimiento.html": ["rescatista", "refugio", "administrador"],
  "historial-seguimiento.html": ["rescatista", "refugio", "administrador"],

  "reportar-perdida.html": ["ciudadano", "rescatista", "refugio", "administrador"],
  "reportar-encontrada.html": ["ciudadano", "rescatista", "refugio", "administrador"],
  "solicitud-adopcion.html": ["ciudadano", "rescatista", "refugio", "administrador"],

  "dashboard.html": ["ciudadano", "rescatista", "refugio", "administrador"]
};

// OBTENER PERFIL ACTUAL DESDE SUPABASE
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

// GUARDAR PERFIL EN LOCALSTORAGE
function guardarPerfilLocal(perfil) {
  if (!perfil) return;

  localStorage.setItem("huellinkCorreo", perfil.correo || "");
  localStorage.setItem("huellinkRol", perfil.rol || "");
  localStorage.setItem("huellinkNombre", perfil.nombre || "");
}

// LIMPIAR SESIÓN LOCAL
function limpiarSesionLocal() {
  localStorage.removeItem("huellinkCorreo");
  localStorage.removeItem("huellinkRol");
  localStorage.removeItem("huellinkNombre");
}

// VERIFICAR SESIÓN Y PERMISOS
async function verificarSesionYPermisos() {
  const paginaActual = window.location.pathname.split("/").pop() || "index.html";
  const destinoActual = `${paginaActual}${window.location.search || ""}`;

  if (!AUTH_PAGINAS_PROTEGIDAS.includes(paginaActual)) {
    return;
  }

  if (typeof db === "undefined") {
    alert("Supabase no está cargado. Revisa los scripts de esta página.");
    window.location.href = "login.html";
    return;
  }

  const { data, error } = await db.auth.getSession();

  if (error) {
    console.error("Error al verificar sesión:", error);
    window.location.href = "login.html";
    return;
  }

  const session = data.session;

  if (!session) {
    alert("Debes iniciar sesión para acceder a esta página.");
    window.location.href = `login.html?redirect=${encodeURIComponent(destinoActual)}`;
    return;
  }

  const perfil = await obtenerPerfilActual(session.user.id);

  if (!perfil) {
    alert("No se encontró el perfil del usuario.");
    await db.auth.signOut();
    limpiarSesionLocal();
    window.location.href = "login.html";
    return;
  }

  guardarPerfilLocal(perfil);

  const rolesPermitidos = AUTH_PERMISOS_POR_PAGINA[paginaActual];

  if (rolesPermitidos && !rolesPermitidos.includes(perfil.rol)) {
    alert("No tienes permiso para acceder a esta página.");
    window.location.href = `dashboard.html?rol=${perfil.rol}`;
    return;
  }

  const dashboardUsuario = document.getElementById("dashboardUsuario");

  if (dashboardUsuario) {
    dashboardUsuario.textContent = `Hola, ${perfil.nombre}`;
  }
}

// CAMBIAR BOTÓN DE INICIAR SESIÓN CUANDO YA HAY SESIÓN
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

// CERRAR SESIÓN
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btn-logout")) {
    e.preventDefault();

    if (typeof db !== "undefined") {
      await db.auth.signOut();
    }

    limpiarSesionLocal();

    alert("Sesión cerrada correctamente 🐾");
    window.location.href = "login.html";
  }
});

// LOGIN
const authFormLogin = document.getElementById("formLogin");

if (authFormLogin) {
  authFormLogin.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (typeof db === "undefined") {
      alert("Supabase no está cargado. Revisa los scripts en login.html");
      return;
    }

    const correoLogin = document.getElementById("correoLogin").value.trim();
    const passwordLogin = document.getElementById("passwordLogin").value;

    const { data, error } = await db.auth.signInWithPassword({
      email: correoLogin,
      password: passwordLogin
    });

    if (error) {
      alert("Error al iniciar sesión: " + error.message);
      return;
    }

    const user = data.user;

    const perfil = await obtenerPerfilActual(user.id);

    if (!perfil) {
      alert("No se pudo cargar el perfil del usuario.");
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

// REGISTRO
const authFormRegistro = document.getElementById("formRegistro");

if (authFormRegistro) {
  authFormRegistro.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (typeof db === "undefined") {
      alert("Supabase no está cargado. Revisa los scripts en registro.html");
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
      alert("Las contraseñas no coinciden. Intenta nuevamente.");
      return;
    }

    const { data, error } = await db.auth.signUp({
      email: correo,
      password: password
    });

    if (error) {
      alert("Error al registrar usuario: " + error.message);
      return;
    }

    const user = data.user;

    if (!user) {
      alert("Usuario creado, pero falta confirmar el correo. Revisa tu email.");
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
      alert("Usuario creado, pero ocurrió un error al guardar el perfil: " + errorPerfil.message);
      return;
    }

    alert(
      `Registro creado correctamente 🐾\n\nNombre: ${nombre}\nCorreo: ${correo}\nRol: ${rol}`
    );

    authFormRegistro.reset();

    window.location.href = "login.html";
  });
}

// EJECUTAR FUNCIONES DE AUTH
verificarSesionYPermisos();
actualizarBotonesSesion();

// DEJAR FUNCIONES DISPONIBLES PARA OTROS ARCHIVOS
window.obtenerPerfilActual = obtenerPerfilActual;
window.guardarPerfilLocal = guardarPerfilLocal;
window.limpiarSesionLocal = limpiarSesionLocal;
window.verificarSesionYPermisos = verificarSesionYPermisos;
window.actualizarBotonesSesion = actualizarBotonesSesion;