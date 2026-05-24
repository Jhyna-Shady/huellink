console.log("Huellink cargado correctamente 🐾");


// BOTONES DE MASCOTAS: VER DETALLE Y SOLICITAR ADOPCIÓN
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-detalle")) {
    const tarjetaMascota = e.target.closest(".pet-card");
    const idMascota = tarjetaMascota.dataset.id;
    const nombreMascota = tarjetaMascota.querySelector("h3").textContent;

    if (idMascota) {
      window.location.href = `detalle-mascota.html?id=${idMascota}`;
    } else {
      window.location.href = `detalle-mascota.html?mascota=${encodeURIComponent(nombreMascota)}`;
    }
  }

  if (e.target.classList.contains("btn-adoptar")) {
    const tarjetaMascota = e.target.closest(".pet-card");
    const nombreMascota = tarjetaMascota.querySelector("h3").textContent;

    window.location.href = `solicitud-adopcion.html?mascota=${encodeURIComponent(nombreMascota)}`;
  }
});


/// FILTROS DE MASCOTAS
const filtroTipo = document.getElementById("tipo");
const filtroCiudad = document.getElementById("ciudad");
const filtroTamano = document.getElementById("tamano");
const filtroEdad = document.getElementById("edad");
const limpiarFiltros = document.getElementById("limpiarFiltros");
const noResults = document.getElementById("noResults");

function filtrarMascotas() {
  if (!filtroTipo || !filtroCiudad || !filtroTamano || !filtroEdad) {
    return;
  }

  const mascotas = document.querySelectorAll(".mascota");

  const tipo = filtroTipo.value;
  const ciudad = filtroCiudad.value;
  const tamano = filtroTamano.value;
  const edad = filtroEdad.value;

  let visibles = 0;

  mascotas.forEach((mascota) => {
    const coincideTipo = tipo === "todos" || mascota.dataset.tipo === tipo;
    const coincideCiudad = ciudad === "todos" || mascota.dataset.ciudad === ciudad;
    const coincideTamano = tamano === "todos" || mascota.dataset.tamano === tamano;
    const coincideEdad = edad === "todos" || mascota.dataset.edad === edad;

    if (coincideTipo && coincideCiudad && coincideTamano && coincideEdad) {
      mascota.style.display = "block";
      visibles++;
    } else {
      mascota.style.display = "none";
    }
  });

  if (noResults) {
    noResults.style.display = visibles === 0 ? "block" : "none";
  }
}

if (filtroTipo && filtroCiudad && filtroTamano && filtroEdad) {
  filtroTipo.addEventListener("change", filtrarMascotas);
  filtroCiudad.addEventListener("change", filtrarMascotas);
  filtroTamano.addEventListener("change", filtrarMascotas);
  filtroEdad.addEventListener("change", filtrarMascotas);
}

if (limpiarFiltros) {
  limpiarFiltros.addEventListener("click", () => {
    filtroTipo.value = "todos";
    filtroCiudad.value = "todos";
    filtroTamano.value = "todos";
    filtroEdad.value = "todos";
    filtrarMascotas();
  });
}

// FORMULARIO DE MASCOTA PERDIDA
const formPerdida = document.getElementById("formPerdida");

if (formPerdida) {
  formPerdida.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombreMascota = document.getElementById("nombreMascota").value;
    const zonaPerdida = document.getElementById("zonaPerdida").value;

    alert(
      `Reporte registrado correctamente 🐾\n\nMascota: ${nombreMascota}\nZona: ${zonaPerdida}\n\nEste reporte quedará pendiente de revisión.`
    );

    formPerdida.reset();
  });
}

// FORMULARIO DE MASCOTA ENCONTRADA
const formEncontrada = document.getElementById("formEncontrada");

if (formEncontrada) {
  formEncontrada.addEventListener("submit", (e) => {
    e.preventDefault();

    const tipoEncontrada = document.getElementById("tipoEncontrada").value;
    const zonaEncontrada = document.getElementById("zonaEncontrada").value;

    alert(
      `Reporte registrado correctamente 🐾\n\nTipo: ${tipoEncontrada}\nZona: ${zonaEncontrada}\n\nEste reporte quedará pendiente de revisión.`
    );

    formEncontrada.reset();
  });
}

// FORMULARIO DE REGISTRO DE REFUGIO O RESCATISTA
const formAliado = document.getElementById("formAliado");

if (formAliado) {
  formAliado.addEventListener("submit", (e) => {
    e.preventDefault();

    const tipoAliado = document.getElementById("tipoAliado").value;
    const nombreAliado = document.getElementById("nombreAliado").value;
    const ciudadAliado = document.getElementById("ciudadAliado").value;

    alert(
      `Solicitud enviada correctamente 🐾\n\nTipo: ${tipoAliado}\nNombre: ${nombreAliado}\nCiudad: ${ciudadAliado}\n\nTu registro quedará pendiente de validación por el administrador.`
    );

    formAliado.reset();
  });
}
// FORMULARIO LOGIN
const formLogin = document.getElementById("formLogin");

if (formLogin) {
  formLogin.addEventListener("submit", (e) => {
    e.preventDefault();

    const correoLogin = document.getElementById("correoLogin").value;
    const rolLogin = document.getElementById("rolLogin").value;

    localStorage.setItem("huellinkCorreo", correoLogin);
    localStorage.setItem("huellinkRol", rolLogin);

    window.location.href = `dashboard.html?rol=${rolLogin}`;
  });
}
// FORMULARIO REGISTRO
const formRegistro = document.getElementById("formRegistro");

if (formRegistro) {
  formRegistro.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombreRegistro = document.getElementById("nombreRegistro").value;
    const correoRegistro = document.getElementById("correoRegistro").value;
    const rolRegistro = document.getElementById("rolRegistro").value;
    const passwordRegistro = document.getElementById("passwordRegistro").value;
    const confirmarPassword = document.getElementById("confirmarPassword").value;

    if (passwordRegistro !== confirmarPassword) {
      alert("Las contraseñas no coinciden. Intenta nuevamente.");
      return;
    }

    alert(
      `Registro creado correctamente 🐾\n\nNombre: ${nombreRegistro}\nCorreo: ${correoRegistro}\nRol: ${rolRegistro}\n\nTu cuenta fue registrada de manera simulada.`
    );

    formRegistro.reset();
  });
}

// DASHBOARD SEGÚN ROL
const accionesDashboard = document.getElementById("accionesDashboard");
const actividadDashboard = document.getElementById("actividadDashboard");

const dashboardTitulo = document.getElementById("dashboardTitulo");
const dashboardDescripcion = document.getElementById("dashboardDescripcion");
const dashboardRol = document.getElementById("dashboardRol");

const stat1 = document.getElementById("stat1");
const stat2 = document.getElementById("stat2");
const stat3 = document.getElementById("stat3");
const stat4 = document.getElementById("stat4");

const stat1Text = document.getElementById("stat1Text");
const stat2Text = document.getElementById("stat2Text");
const stat3Text = document.getElementById("stat3Text");
const stat4Text = document.getElementById("stat4Text");

if (accionesDashboard && actividadDashboard) {
  const params = new URLSearchParams(window.location.search);
  const rolUrl = params.get("rol");
  const rolGuardado = localStorage.getItem("huellinkRol");

  const rol = rolUrl || rolGuardado || "ciudadano";

  const paneles = {
    ciudadano: {
      titulo: "Panel del ciudadano",
      descripcion: "Busca mascotas, solicita adopciones y reporta mascotas perdidas o encontradas.",
      rolTexto: "Adoptante / Ciudadano",
      stats: ["2", "Solicitudes", "3", "Reportes", "1", "Coincidencias", "4", "Notificaciones"],
      acciones: [
        {
          icono: "🐶",
          titulo: "Buscar mascotas",
          texto: "Explora perros y gatos disponibles para adopción responsable.",
          link: "adoptar.html",
          boton: "Ver mascotas"
        },
        {
          icono: "📍",
          titulo: "Reportar mascota perdida",
          texto: "Registra una mascota extraviada con foto, zona y descripción.",
          link: "reportar-perdida.html",
          boton: "Reportar perdida"
        },
        {
          icono: "🔎",
          titulo: "Reportar mascota encontrada",
          texto: "Publica un reporte para ayudar a reunirla con su familia.",
          link: "reportar-encontrada.html",
          boton: "Reportar encontrada"
        }
      ],
      actividad: [
        ["📋", "Solicitud enviada", "Tu solicitud para adoptar a Luna está en revisión."],
        ["📍", "Reporte publicado", "Registraste una mascota perdida en Cajamarca."],
        ["🔔", "Posible coincidencia", "Hay una mascota encontrada parecida a tu reporte."]
      ]
    },

    rescatista: {
      titulo: "Panel del rescatista",
      descripcion: "Gestiona mascotas rescatadas, solicitudes de adopción y seguimiento post adopción.",
      rolTexto: "Rescatista",
      stats: ["6", "Mascotas", "4", "Solicitudes", "2", "Seguimientos", "5", "Reportes cercanos"],
      acciones: [
        {
          icono: "🐾",
          titulo: "Publicar mascota rescatada",
          texto: "Registra una mascota rescatada para iniciar su proceso de adopción.",
          link: "publicar-mascota.html",
          boton: "Publicar"
        },
        {
          icono: "📋",
          titulo: "Revisar solicitudes",
          texto: "Evalúa solicitudes enviadas por posibles adoptantes.",
          link: "solicitudes.html",
          boton: "Ver solicitudes"
        },
        {
          icono: "✅",
          titulo: "Seguimiento post adopción",
          texto: "Registra controles, fotos y observaciones después de la adopción.",
          link: "seguimiento.html",
          boton: "Dar seguimiento"
        }
      ],
      actividad: [
        ["🐶", "Mascota publicada", "Publicaste a Toby como disponible para adopción."],
        ["📋", "Nueva solicitud", "Un ciudadano solicitó adoptar a Max."],
        ["✅", "Seguimiento pendiente", "Debes registrar el control de primera semana."]
      ]
    },
    refugio: {
    titulo: "Panel del refugio",
    descripcion: "Administra mascotas, solicitudes, reportes recibidos y adopciones desde tu refugio.",
    rolTexto: "Refugio",
    stats: ["18", "Mascotas", "9", "Solicitudes", "7", "Adopciones", "4", "Reportes"],

    acciones: [
        {
        icono: "🐕",
        titulo: "Gestionar mascotas",
        texto: "Administra las mascotas publicadas por el refugio.",
        link: "publicar-mascota.html",
        boton: "Gestionar"
        },
        {
        icono: "📋",
        titulo: "Solicitudes de adopción",
        texto: "Revisa, aprueba o rechaza solicitudes recibidas.",
        link: "solicitudes.html",
        boton: "Revisar"
        },
        {
        icono: "📍",
        titulo: "Reportes cercanos",
        texto: "Consulta mascotas perdidas o encontradas en tu zona.",
        link: "reportes.html",
        boton: "Ver reportes"
        },
        {
        icono: "✅",
        titulo: "Seguimiento post adopción",
        texto: "Registra controles de bienestar después de una adopción.",
        link: "seguimiento.html",
        boton: "Registrar seguimiento"
        }
    ],

    actividad: [
        ["🐾", "Nueva mascota registrada", "Se agregó una nueva mascota al refugio."],
        ["📋", "Solicitud aprobada", "Una solicitud de adopción fue aprobada."],
        ["📊", "Estadística actualizada", "El refugio registra 7 adopciones logradas."]
    ]
    },

    administrador: {
      titulo: "Panel del administrador",
      descripcion: "Valida usuarios, controla publicaciones, revisa reportes y consulta estadísticas generales.",
      rolTexto: "Administrador",
      stats: ["12", "Validaciones", "35", "Usuarios", "24", "Publicaciones", "8", "Alertas"],
      acciones: [
        {
          icono: "✅",
          titulo: "Validar aliados",
          texto: "Aprueba o rechaza registros de refugios y rescatistas.",
          link: "admin.html",
          boton: "Validar"
        },
        {
          icono: "🛡️",
          titulo: "Controlar publicaciones",
          texto: "Revisa reportes, publicaciones sospechosas y contenido falso.",
          link: "admin.html",
          boton: "Revisar"
        },
        {
          icono: "📊",
          titulo: "Ver estadísticas",
          texto: "Consulta datos generales de adopciones, reportes y usuarios.",
          link: "admin.html",
          boton: "Ver estadísticas"
        }
      ],
      actividad: [
        ["✅", "Registro pendiente", "Hay 3 refugios pendientes de validación."],
        ["⚠️", "Publicación reportada", "Un usuario reportó contenido sospechoso."],
        ["📊", "Resumen actualizado", "Las estadísticas generales fueron actualizadas."]
      ]
    }
  };

  const datos = paneles[rol] || paneles.ciudadano;

  dashboardTitulo.textContent = datos.titulo;
  dashboardDescripcion.textContent = datos.descripcion;
  dashboardRol.textContent = datos.rolTexto;

  stat1.textContent = datos.stats[0];
  stat1Text.textContent = datos.stats[1];

  stat2.textContent = datos.stats[2];
  stat2Text.textContent = datos.stats[3];

  stat3.textContent = datos.stats[4];
  stat3Text.textContent = datos.stats[5];

  stat4.textContent = datos.stats[6];
  stat4Text.textContent = datos.stats[7];

  accionesDashboard.innerHTML = "";

  datos.acciones.forEach((accion) => {
    accionesDashboard.innerHTML += `
      <div class="dashboard-action-card">
        <div class="action-icon">${accion.icono}</div>
        <h3>${accion.titulo}</h3>
        <p>${accion.texto}</p>
        <a href="${accion.link}">${accion.boton}</a>
      </div>
    `;
  });

  actividadDashboard.innerHTML = "";

  datos.actividad.forEach((item) => {
    actividadDashboard.innerHTML += `
      <div class="activity-item">
        <div class="activity-icon">${item[0]}</div>
        <div>
          <h3>${item[1]}</h3>
          <p>${item[2]}</p>
        </div>
      </div>
    `;
  });
}

// FORMULARIO PARA PUBLICAR MASCOTA EN SUPABASE
const formPublicarMascota = document.getElementById("formPublicarMascota");

if (formPublicarMascota) {
  formPublicarMascota.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombrePublicar").value;
    const tipo = document.getElementById("tipoPublicar").value;
    const edad = document.getElementById("edadPublicar").value;
    const tamano = document.getElementById("tamanoPublicar").value;
    const sexo = document.getElementById("sexoPublicar").value;
    const estado = document.getElementById("estadoPublicar").value;
    const vacunas = document.getElementById("vacunasPublicar").value;
    const salud = document.getElementById("saludPublicar").value;
    const comportamiento = document.getElementById("comportamientoPublicar").value;
    const historia = document.getElementById("historiaPublicar").value;
    const ciudad = document.getElementById("ciudadPublicar").value;
    const zona = document.getElementById("zonaPublicar").value;
    const responsable = document.getElementById("responsablePublicar").value;

    let icono = "🐾";

    if (tipo === "perro") {
      icono = "🐶";
    } else if (tipo === "gato") {
      icono = "🐱";
    }

    const nuevaMascota = {
      nombre,
      tipo,
      edad,
      tamano,
      sexo,
      estado,
      vacunas,
      salud,
      comportamiento,
      historia,
      ciudad,
      zona,
      responsable,
      icono,
      estado_publicacion: "aprobada"
    };

    const { data, error } = await db
      .from("mascotas")
      .insert([nuevaMascota])
      .select();

    if (error) {
   console.error("Error Supabase:", error);
    alert("Error al registrar mascota: " + error.message);
    return;
    }

    alert(
      `Mascota registrada correctamente 🐾\n\nNombre: ${nombre}\nTipo: ${tipo}\nCiudad: ${ciudad}`
    );

    formPublicarMascota.reset();
  });
}
// FORMULARIO DE SEGUIMIENTO POST ADOPCIÓN
const formSeguimiento = document.getElementById("formSeguimiento");

if (formSeguimiento) {
  formSeguimiento.addEventListener("submit", (e) => {
    e.preventDefault();

    const mascota = document.getElementById("mascotaSeguimiento").value;
    const adoptante = document.getElementById("adoptanteSeguimiento").value;
    const estado = document.getElementById("estadoMascota").value;
    const proximaRevision = document.getElementById("proximaRevision").value;

    alert(
      `Seguimiento registrado correctamente 🐾\n\nMascota: ${mascota}\nAdoptante: ${adoptante}\nEstado: ${estado}\nPróxima revisión: ${proximaRevision || "No definida"}\n\nEl registro quedó guardado de forma simulada.`
    );

    formSeguimiento.reset();
  });
}
// FILTROS DE REPORTES
const filtroReporteTipo = document.getElementById("filtroReporteTipo");
const filtroReporteEstado = document.getElementById("filtroReporteEstado");
const filtroReporteCiudad = document.getElementById("filtroReporteCiudad");
const limpiarFiltrosReportes = document.getElementById("limpiarFiltrosReportes");
const reportes = document.querySelectorAll(".reporte");
const noResultsReportes = document.getElementById("noResultsReportes");

function filtrarReportes() {
  if (!filtroReporteTipo || !filtroReporteEstado || !filtroReporteCiudad) {
    return;
  }

  const tipo = filtroReporteTipo.value;
  const estado = filtroReporteEstado.value;
  const ciudad = filtroReporteCiudad.value;

  let visibles = 0;

  reportes.forEach((reporte) => {
    const coincideTipo = tipo === "todos" || reporte.dataset.tipo === tipo;
    const coincideEstado = estado === "todos" || reporte.dataset.estado === estado;
    const coincideCiudad = ciudad === "todos" || reporte.dataset.ciudad === ciudad;

    if (coincideTipo && coincideEstado && coincideCiudad) {
      reporte.style.display = "grid";
      visibles++;
    } else {
      reporte.style.display = "none";
    }
  });

  if (noResultsReportes) {
    noResultsReportes.style.display = visibles === 0 ? "block" : "none";
  }
}

if (filtroReporteTipo && filtroReporteEstado && filtroReporteCiudad) {
  filtroReporteTipo.addEventListener("change", filtrarReportes);
  filtroReporteEstado.addEventListener("change", filtrarReportes);
  filtroReporteCiudad.addEventListener("change", filtrarReportes);
}

if (limpiarFiltrosReportes) {
  limpiarFiltrosReportes.addEventListener("click", () => {
    filtroReporteTipo.value = "todos";
    filtroReporteEstado.value = "todos";
    filtroReporteCiudad.value = "todos";
    filtrarReportes();
  });
}

// BOTONES DE COINCIDENCIA
const botonesMatch = document.querySelectorAll(".btn-match");

botonesMatch.forEach((boton) => {
  boton.addEventListener("click", () => {
    alert(
      "Huellink analizará características como tipo, color, tamaño, zona y fecha para sugerir posibles coincidencias 🐾"
    );
  });
});

// BOTONES DEL PANEL ADMINISTRADOR
const botonesAprobar = document.querySelectorAll(".btn-approve");
const botonesRechazar = document.querySelectorAll(".btn-reject");

botonesAprobar.forEach((boton) => {
  boton.addEventListener("click", () => {
    const tarjeta = boton.closest(".admin-card");
    tarjeta.style.opacity = "0.6";

    alert("Acción aprobada correctamente por el administrador ✅");
  });
});

botonesRechazar.forEach((boton) => {
  boton.addEventListener("click", () => {
    const tarjeta = boton.closest(".admin-card");
    tarjeta.style.opacity = "0.6";

    alert("Acción rechazada o eliminada por el administrador ⚠️");
  });
});

// FILTROS DE SOLICITUDES
const filtroSolicitudEstado = document.getElementById("filtroSolicitudEstado");
const filtroSolicitudMascota = document.getElementById("filtroSolicitudMascota");
const limpiarFiltrosSolicitudes = document.getElementById("limpiarFiltrosSolicitudes");
const solicitudes = document.querySelectorAll(".solicitud-card");
const noResultsSolicitudes = document.getElementById("noResultsSolicitudes");

function filtrarSolicitudes() {
  if (!filtroSolicitudEstado || !filtroSolicitudMascota) {
    return;
  }

  const estado = filtroSolicitudEstado.value;
  const mascota = filtroSolicitudMascota.value;

  let visibles = 0;

  solicitudes.forEach((solicitud) => {
    const coincideEstado = estado === "todos" || solicitud.dataset.estado === estado;
    const coincideMascota = mascota === "todos" || solicitud.dataset.mascota === mascota;

    if (coincideEstado && coincideMascota) {
      solicitud.style.display = "grid";
      visibles++;
    } else {
      solicitud.style.display = "none";
    }
  });

  if (noResultsSolicitudes) {
    noResultsSolicitudes.style.display = visibles === 0 ? "block" : "none";
  }
}

if (filtroSolicitudEstado && filtroSolicitudMascota) {
  filtroSolicitudEstado.addEventListener("change", filtrarSolicitudes);
  filtroSolicitudMascota.addEventListener("change", filtrarSolicitudes);
}

if (limpiarFiltrosSolicitudes) {
  limpiarFiltrosSolicitudes.addEventListener("click", () => {
    filtroSolicitudEstado.value = "todos";
    filtroSolicitudMascota.value = "todos";
    filtrarSolicitudes();
  });
}

// BOTONES DE SOLICITUDES
const botonesRevision = document.querySelectorAll(".btn-review");

botonesRevision.forEach((boton) => {
  boton.addEventListener("click", () => {
    const tarjeta = boton.closest(".solicitud-card");
    const estadoTexto = tarjeta.querySelector(".estado-texto");

    tarjeta.dataset.estado = "revision";
    tarjeta.classList.remove("aprobada", "rechazada");
    tarjeta.classList.add("revision");

    estadoTexto.textContent = "En revisión";

    alert("La solicitud fue marcada como en revisión 📋");
  });
});

botonesAprobar.forEach((boton) => {
  boton.addEventListener("click", () => {
    const tarjeta = boton.closest(".solicitud-card");

    if (!tarjeta) return;

    const estadoTexto = tarjeta.querySelector(".estado-texto");

    tarjeta.dataset.estado = "aprobada";
    tarjeta.classList.remove("revision", "rechazada");
    tarjeta.classList.add("aprobada");

    estadoTexto.textContent = "Aprobada";

    alert("Solicitud aprobada correctamente ✅");
  });
});

botonesRechazar.forEach((boton) => {
  boton.addEventListener("click", () => {
    const tarjeta = boton.closest(".solicitud-card");

    if (!tarjeta) return;

    const estadoTexto = tarjeta.querySelector(".estado-texto");

    tarjeta.dataset.estado = "rechazada";
    tarjeta.classList.remove("revision", "aprobada");
    tarjeta.classList.add("rechazada");

    estadoTexto.textContent = "Rechazada";

    alert("Solicitud rechazada correctamente ⚠️");
  });
});

// DETALLE DE MASCOTA DESDE SUPABASE
const detalleNombre = document.getElementById("detalleNombre");

if (detalleNombre) {
  const params = new URLSearchParams(window.location.search);
  const mascotaId = params.get("id");
  const mascotaNombre = params.get("mascota");

  async function cargarDetalleMascota() {
    if (typeof db === "undefined") {
      alert("Supabase no está cargado. Revisa los scripts en detalle-mascota.html");
      return;
    }

    let consulta;

    if (mascotaId) {
      consulta = db
        .from("mascotas")
        .select("*")
        .eq("id", mascotaId)
        .single();
    } else if (mascotaNombre) {
      consulta = db
        .from("mascotas")
        .select("*")
        .eq("nombre", mascotaNombre)
        .limit(1)
        .single();
    } else {
      alert("No se recibió información de la mascota.");
      return;
    }

    const { data: mascota, error } = await consulta;

    console.log("Detalle mascota:", mascota);
    console.log("Error detalle:", error);

    if (error) {
      alert("No se pudo cargar el detalle de la mascota: " + error.message);
      return;
    }

    pintarDetalleMascota(mascota);
  }

  function pintarDetalleMascota(mascota) {
    document.getElementById("detalleIcono").textContent = mascota.icono || "🐾";
    document.getElementById("detalleNombre").textContent = mascota.nombre || "Mascota sin nombre";

    document.getElementById("detalleResumen").textContent =
      mascota.historia || "Mascota registrada en Huellink para iniciar un proceso de adopción responsable.";

    document.getElementById("detalleEstado").textContent =
      mascota.estado || mascota.estado_publicacion || "Disponible";

    document.getElementById("detalleTipo").textContent = mascota.tipo || "-";
    document.getElementById("detalleEdad").textContent = mascota.edad || "-";
    document.getElementById("detalleTamano").textContent = mascota.tamano || "-";
    document.getElementById("detalleSexo").textContent = mascota.sexo || "-";
    document.getElementById("detalleCiudad").textContent = mascota.ciudad || "-";
    document.getElementById("detalleVacunas").textContent = mascota.vacunas || "Sin información";

    document.getElementById("detallePersonalidad").textContent =
      mascota.comportamiento || "No se registró información sobre su personalidad.";

    document.getElementById("detalleHistoria").textContent =
      mascota.historia || "No se registró una historia detallada de la mascota.";

    document.getElementById("detalleResponsable").textContent =
      mascota.responsable || "Responsable no especificado.";

    const btnSolicitarDetalle = document.getElementById("btnSolicitarDetalle");

    if (btnSolicitarDetalle) {
      btnSolicitarDetalle.addEventListener("click", () => {
        window.location.href = `solicitud-adopcion.html?mascota=${encodeURIComponent(mascota.nombre)}`;
      });
    }
  }

  cargarDetalleMascota();
}
// CARGAR MASCOTAS DESDE SUPABASE EN adoptar.html
const contenedorMascotas = document.getElementById("contenedorMascotas");

async function cargarMascotasDesdeBD() {
  if (!contenedorMascotas) return;

  const { data: mascotas, error } = await db
    .from("mascotas")
    .select("*")
    .eq("estado_publicacion", "aprobada")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error al cargar mascotas:", error);
    alert("No se pudieron cargar las mascotas desde la base de datos.");
    return;
  }

  contenedorMascotas.innerHTML = "";

  if (!mascotas || mascotas.length === 0) {
    contenedorMascotas.innerHTML = `
      <div class="no-results" style="display: block;">
        <h3>Aún no hay mascotas registradas 🐾</h3>
        <p>Publica una mascota desde el panel de refugio o rescatista.</p>
      </div>
    `;
    return;
  }

  mascotas.forEach((mascota) => {
    const edadTexto = mascota.edad ? mascota.edad.toLowerCase() : "";
    const edadFiltro = edadTexto.includes("mes") || edadTexto.includes("cachorro")
      ? "cachorro"
      : "adulto";

    contenedorMascotas.innerHTML += `
      <div class="pet-card mascota"
       data-id="${mascota.id}"
       data-tipo="${mascota.tipo}"
       data-ciudad="${mascota.ciudad}"
       data-tamano="${mascota.tamano}"
       data-edad="${edadFiltro}">

        <div class="pet-photo">${mascota.icono || "🐾"}</div>

        <h3>${mascota.nombre}</h3>

        <p>${mascota.tipo} · ${mascota.edad} · ${mascota.ciudad}</p>

        <span>${mascota.vacunas || "Sin información"}</span>

        <div class="pet-info">
          <small>${mascota.tamano} · ${mascota.comportamiento || "Sin descripción"}</small>
        </div>

        <button class="btn-detalle">Ver detalle</button>
        <button class="btn-adoptar">Solicitar adopción</button>
      </div>
    `;
  });

  filtrarMascotas();
}

cargarMascotasDesdeBD();