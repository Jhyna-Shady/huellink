console.log("main.js cargado correctamente 🐾");

// BOTONES DE MASCOTAS: VER DETALLE Y SOLICITAR ADOPCIÓN
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-detalle")) {
    const tarjetaMascota = e.target.closest(".pet-card");
    if (!tarjetaMascota) return;

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
    if (!tarjetaMascota) return;

    const idMascota = tarjetaMascota.dataset.id;
    const nombreMascota = tarjetaMascota.querySelector("h3").textContent;

    if (idMascota) {
      window.location.href = `solicitud-adopcion.html?id=${idMascota}&mascota=${encodeURIComponent(nombreMascota)}`;
    } else {
      window.location.href = `solicitud-adopcion.html?mascota=${encodeURIComponent(nombreMascota)}`;
    }
  }
});

// FILTROS DE MASCOTAS
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

// REGISTRO DE REFUGIO O RESCATISTA
const formAliado = document.getElementById("formAliado");

if (formAliado) {
  formAliado.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (typeof db === "undefined") {
      alert("Supabase no está cargado. Revisa los scripts en refugios.html");
      return;
    }

    const nuevoAliado = {
      tipo_aliado: document.getElementById("tipoAliado").value,
      nombre_aliado: document.getElementById("nombreAliado").value,
      responsable: document.getElementById("responsableAliado").value,
      correo: document.getElementById("correoAliado").value,
      telefono: document.getElementById("telefonoAliado").value,
      ciudad: document.getElementById("ciudadAliado").value,
      distrito: document.getElementById("distritoAliado").value,
      direccion_zona: document.getElementById("direccionAliado").value,
      redes: document.getElementById("redesAliado").value,
      cantidad_mascotas: document.getElementById("cantidadMascotas").value || null,
      experiencia_anios: document.getElementById("experienciaAliado").value || null,
      descripcion: document.getElementById("descripcionAliado").value,
      estado_validacion: "pendiente"
    };

    const { data, error } = await db
      .from("aliados")
      .insert([nuevoAliado])
      .select();

    console.log("Aliado registrado:", data);
    console.log("Error aliado:", error);

    if (error) {
      alert("Error al registrar aliado: " + error.message);
      return;
    }

    alert(
      `Solicitud enviada correctamente 🐾\n\nTipo: ${nuevoAliado.tipo_aliado}\nNombre: ${nuevoAliado.nombre_aliado}\nCiudad: ${nuevoAliado.ciudad}\n\nTu registro quedó pendiente de validación por el administrador.`
    );

    formAliado.reset();
    window.location.href = "index.html";
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
        },
        {
          icono: "📁",
          titulo: "Mis reportes",
          texto: "Consulta los reportes de mascotas perdidas o encontradas que publicaste.",
          link: "mis-reportes.html",
          boton: "Ver mis reportes"
        },
        {
          icono: "📋",
          titulo: "Mis solicitudes",
          texto: "Revisa si tus solicitudes de adopción están pendientes, en revisión, aprobadas o rechazadas.",
          link: "mis-solicitudes.html",
          boton: "Ver mis solicitudes"
        }
      ],
      
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
        },
        {
          icono: "📁",
          titulo: "Historial de seguimiento",
          texto: "Consulta los controles registrados después de las adopciones.",
          link: "historial-seguimiento.html",
          boton: "Ver historial"
        }
      ],
      
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
        },
        {
          icono: "📁",
          titulo: "Historial de seguimiento",
          texto: "Revisa los seguimientos registrados por el refugio.",
          link: "historial-seguimiento.html",
          boton: "Ver historial"
        }
      ],
      
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

  function obtenerIconoDashboard(titulo, iconoFallback) {
  const tituloNormalizado = titulo.toLowerCase();

  if (
    tituloNormalizado.includes("buscar mascotas") ||
    tituloNormalizado.includes("gestionar mascotas") ||
    tituloNormalizado.includes("publicar mascota")
  ) {
    return `<img src="img/icons/explorar-mascotas.png" alt="${titulo}" class="dashboard-icon-img">`;
  }

  if (
    tituloNormalizado.includes("solicitudes") ||
    tituloNormalizado.includes("revisar solicitudes")
  ) {
    return `<img src="img/icons/enviar-una-solicitud.png" alt="${titulo}" class="dashboard-icon-img">`;
  }

  if (
    tituloNormalizado.includes("reportar mascota perdida") ||
    tituloNormalizado.includes("perdida")
  ) {
    return `<img src="img/icons/mascotas-perdidas.png" alt="${titulo}" class="dashboard-icon-img">`;
  }

  if (
    tituloNormalizado.includes("reportar mascota encontrada") ||
    tituloNormalizado.includes("encontrada")
  ) {
    return `<img src="img/icons/mascotas-encontradas.png" alt="${titulo}" class="dashboard-icon-img">`;
  }

  if (
    tituloNormalizado.includes("seguimiento") ||
    tituloNormalizado.includes("historial")
  ) {
    return `<img src="img/icons/adopta-responsablemente.png" alt="${titulo}" class="dashboard-icon-img">`;
  }

  if (
    tituloNormalizado.includes("validar aliados") ||
    tituloNormalizado.includes("aliados")
  ) {
    return `<img src="img/icons/aliado-refugio.png" alt="${titulo}" class="dashboard-icon-img">`;
  }

  if (
    tituloNormalizado.includes("estadísticas") ||
    tituloNormalizado.includes("estadisticas")
  ) {
    return `<img src="img/icons/organiza-la-informacion.png" alt="${titulo}" class="dashboard-icon-img">`;
  }

  if (
    tituloNormalizado.includes("publicaciones") ||
    tituloNormalizado.includes("controlar")
  ) {
    return `<img src="img/icons/publica-reportes.png" alt="${titulo}" class="dashboard-icon-img">`;
  }

  return `<span>${iconoFallback || "🐾"}</span>`;
}

accionesDashboard.innerHTML = "";

datos.acciones.forEach((accion) => {
  accionesDashboard.innerHTML += `
    <div class="dashboard-action-card">
      <div class="action-icon dashboard-action-image">
        ${obtenerIconoDashboard(accion.titulo, accion.icono)}
      </div>
      <h3>${accion.titulo}</h3>
      <p>${accion.texto}</p>
      <a href="${accion.link}">${accion.boton}</a>
    </div>
  `;
});

;

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
// SUBIR FOTO DE MASCOTA EN ADOPCIÓN
async function subirFotoMascotaAdopcion(inputId) {
  const input = document.getElementById(inputId);

  if (!input || !input.files || input.files.length === 0) {
    return null;
  }

  const archivo = input.files[0];

  const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];
  const pesoMaximo = 5 * 1024 * 1024;

  if (!tiposPermitidos.includes(archivo.type)) {
    throw new Error("Solo se permiten imágenes JPG, PNG o WEBP.");
  }

  if (archivo.size > pesoMaximo) {
    throw new Error("La imagen no debe superar los 5 MB.");
  }

  const { data: sesionData } = await db.auth.getSession();
  const usuarioId = sesionData.session?.user?.id;

  if (!usuarioId) {
    throw new Error("Debes iniciar sesión para subir una foto.");
  }

  const extension = archivo.name.split(".").pop().toLowerCase();
  const nombreArchivo = `mascotas/${usuarioId}-${Date.now()}.${extension}`;

  const { error: uploadError } = await db.storage
    .from("mascotas-adopcion")
    .upload(nombreArchivo, archivo, {
      cacheControl: "3600",
      upsert: false
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = db.storage
    .from("mascotas-adopcion")
    .getPublicUrl(nombreArchivo);

  return data.publicUrl;
}
// PUBLICAR MASCOTA
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

    if (tipo === "perro") icono = "🐶";
    if (tipo === "gato") icono = "🐱";

    let fotoUrl = null;

    try {
      fotoUrl = await subirFotoMascotaAdopcion("fotoMascotaAdopcion");
    } catch (error) {
      alert(error.message || "No se pudo subir la foto de la mascota.");
      return;
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
      foto_url: fotoUrl,
      estado_publicacion: "pendiente"
    };

    const { data, error } = await db
      .from("mascotas")
      .insert([nuevaMascota])
      .select();

    console.log("Mascota registrada:", data);
    console.log("Error mascota:", error);

    if (error) {
      alert("Error al registrar mascota: " + error.message);
      return;
    }

    alert(
      `Mascota registrada correctamente 🐾\n\nNombre: ${nombre}\nTipo: ${tipo}\nCiudad: ${ciudad}`
    );

    formPublicarMascota.reset();
  });
}
// SEGUIMIENTO POST ADOPCIÓN
const formSeguimiento = document.getElementById("formSeguimiento");

if (formSeguimiento) {
  formSeguimiento.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (typeof db === "undefined") {
      alert("Supabase no está cargado. Revisa los scripts en seguimiento.html");
      return;
    }

    const nuevoSeguimiento = {
      mascota_nombre: document.getElementById("mascotaSeguimiento").value,
      adoptante_nombre: document.getElementById("adoptanteSeguimiento").value,
      fecha_adopcion: document.getElementById("fechaAdopcion").value,
      fecha_seguimiento: document.getElementById("fechaSeguimiento").value,
      tipo_seguimiento: document.getElementById("tipoSeguimiento").value,
      estado_mascota: document.getElementById("estadoMascota").value,
      alimentacion: document.getElementById("alimentacionSeguimiento").value,
      salud: document.getElementById("saludSeguimiento").value,
      adaptacion: document.getElementById("adaptacionSeguimiento").value,
      observaciones: document.getElementById("observacionesSeguimiento").value,
      proxima_revision: document.getElementById("proximaRevision").value || null,
      estado_registro: "registrado"
    };

    const { data, error } = await db
      .from("seguimientos_adopcion")
      .insert([nuevoSeguimiento])
      .select();

    console.log("Seguimiento guardado:", data);
    console.log("Error seguimiento:", error);

    if (error) {
      alert("Error al registrar seguimiento: " + error.message);
      return;
    }

    alert(
      `Seguimiento registrado correctamente 🐾\n\nMascota: ${nuevoSeguimiento.mascota_nombre}\nAdoptante: ${nuevoSeguimiento.adoptante_nombre}\nEstado: ${nuevoSeguimiento.estado_mascota}`
    );

    formSeguimiento.reset();
  });
}

// DETALLE DE MASCOTA
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
    const detalleIcono = document.getElementById("detalleIcono");

      if (detalleIcono) {
        if (mascota.foto_url) {
          detalleIcono.innerHTML = `
            <img src="${mascota.foto_url}" alt="Foto de ${mascota.nombre}" class="detalle-mascota-foto">
          `;
        } else {
          detalleIcono.textContent = mascota.icono || "🐾";
        }
      }
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
        window.location.href = `solicitud-adopcion.html?id=${mascota.id}&mascota=${encodeURIComponent(mascota.nombre)}`;
      });
    }
  }

  cargarDetalleMascota();
}

// CARGAR MASCOTAS EN ADOPTAR
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

        ${
            mascota.foto_url
              ? `<img src="${mascota.foto_url}" alt="Foto de ${mascota.nombre}" class="mascota-foto">`
              : `<div class="pet-photo">${mascota.icono || "🐾"}</div>`
          }
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

// ALIADOS EN ADMIN
const contenedorAliados = document.getElementById("contenedorAliados");

function formatearEstadoAliado(estado) {
  if (estado === "aprobado") return "Aprobado";
  if (estado === "rechazado") return "Rechazado";
  return "Pendiente";
}

async function cargarAliadosDesdeBD() {
  if (!contenedorAliados) return;

  if (typeof db === "undefined") {
    alert("Supabase no está cargado. Revisa los scripts en admin.html");
    return;
  }

  const { data: aliadosBD, error } = await db
    .from("aliados")
    .select("*")
    .order("created_at", { ascending: false });

  console.log("Aliados desde Supabase:", aliadosBD);
  console.log("Error aliados:", error);

  if (error) {
    alert("No se pudieron cargar los aliados: " + error.message);
    return;
  }

  contenedorAliados.innerHTML = "";

  if (!aliadosBD || aliadosBD.length === 0) {
    contenedorAliados.innerHTML = `
      <div class="no-results" style="display: block;">
        <h3>Aún no hay aliados registrados 🐾</h3>
        <p>Cuando un refugio o rescatista se registre, aparecerá aquí.</p>
      </div>
    `;
    return;
  }

  aliadosBD.forEach((aliado) => {
    const estado = aliado.estado_validacion || "pendiente";

    contenedorAliados.innerHTML += `
      <div class="admin-card aliado-card ${estado}" data-id="${aliado.id}">
        <div>
          <h3>${aliado.nombre_aliado}</h3>
          <p><strong>Tipo:</strong> ${aliado.tipo_aliado}</p>
          <p><strong>Responsable:</strong> ${aliado.responsable}</p>
          <p><strong>Correo:</strong> ${aliado.correo}</p>
          <p><strong>Celular:</strong> ${aliado.telefono}</p>
          <p><strong>Ciudad:</strong> ${aliado.ciudad}</p>
          <p><strong>Distrito:</strong> ${aliado.distrito}</p>
          <p><strong>Zona:</strong> ${aliado.direccion_zona || "No especificada"}</p>
          <p><strong>Redes:</strong> ${aliado.redes || "No registradas"}</p>
          <p><strong>Mascotas a cargo:</strong> ${aliado.cantidad_mascotas || "No especificado"}</p>
          <p><strong>Años de experiencia:</strong> ${aliado.experiencia_anios || "No especificado"}</p>
          <p><strong>Descripción:</strong> ${aliado.descripcion}</p>
          <p><strong>Estado:</strong> <span class="estado-aliado">${formatearEstadoAliado(estado)}</span></p>
        </div>

        <div class="admin-actions">
          <button class="btn-approve btn-aprobar-aliado">Aprobar</button>
          <button class="btn-reject btn-rechazar-aliado">Rechazar</button>
        </div>
      </div>
    `;
  });
}

cargarAliadosDesdeBD();

document.addEventListener("click", async (e) => {
  if (
    e.target.classList.contains("btn-aprobar-aliado") ||
    e.target.classList.contains("btn-rechazar-aliado")
  ) {
    const tarjeta = e.target.closest(".aliado-card");
    if (!tarjeta) return;

    const idAliado = tarjeta.dataset.id;

    let nuevoEstado = "pendiente";

    if (e.target.classList.contains("btn-aprobar-aliado")) {
      nuevoEstado = "aprobado";
    }

    if (e.target.classList.contains("btn-rechazar-aliado")) {
      nuevoEstado = "rechazado";
    }

    const { error } = await db
      .from("aliados")
      .update({ estado_validacion: nuevoEstado })
      .eq("id", idAliado);

    if (error) {
      alert("No se pudo actualizar el aliado: " + error.message);
      return;
    }

    const estadoTexto = tarjeta.querySelector(".estado-aliado");

    tarjeta.classList.remove("pendiente", "aprobado", "rechazado");
    tarjeta.classList.add(nuevoEstado);

    estadoTexto.textContent = formatearEstadoAliado(nuevoEstado);

    alert(`Aliado ${formatearEstadoAliado(nuevoEstado).toLowerCase()} correctamente ✅`);
  }
});

// HISTORIAL DE SEGUIMIENTO
const contenedorHistorialSeguimiento = document.getElementById("contenedorHistorialSeguimiento");

const totalSeguimientos = document.getElementById("totalSeguimientos");
const seguimientosBuenos = document.getElementById("seguimientosBuenos");
const seguimientosAtencion = document.getElementById("seguimientosAtencion");
const proximasRevisiones = document.getElementById("proximasRevisiones");

async function cargarHistorialSeguimiento() {
  if (!contenedorHistorialSeguimiento) return;

  if (typeof db === "undefined") {
    alert("Supabase no está cargado. Revisa los scripts en historial-seguimiento.html");
    return;
  }

  const { data: seguimientos, error } = await db
    .from("seguimientos_adopcion")
    .select("*")
    .order("created_at", { ascending: false });

  console.log("Seguimientos desde Supabase:", seguimientos);
  console.log("Error seguimientos:", error);

  if (error) {
    alert("No se pudieron cargar los seguimientos: " + error.message);
    return;
  }

  contenedorHistorialSeguimiento.innerHTML = "";

  if (!seguimientos || seguimientos.length === 0) {
    contenedorHistorialSeguimiento.innerHTML = `
      <div class="no-results" style="display: block;">
        <h3>Aún no hay seguimientos registrados 🐾</h3>
        <p>Cuando registres un seguimiento post adopción, aparecerá aquí.</p>
      </div>
    `;

    if (totalSeguimientos) totalSeguimientos.textContent = "0";
    if (seguimientosBuenos) seguimientosBuenos.textContent = "0";
    if (seguimientosAtencion) seguimientosAtencion.textContent = "0";
    if (proximasRevisiones) proximasRevisiones.textContent = "0";

    return;
  }

  const total = seguimientos.length;

  const buenos = seguimientos.filter((item) =>
    item.estado_mascota === "bueno" || item.estado_mascota === "excelente"
  ).length;

  const atencion = seguimientos.filter((item) =>
    item.estado_mascota === "requiere-atencion" || item.estado_mascota === "riesgo"
  ).length;

  const conProximaRevision = seguimientos.filter((item) =>
    item.proxima_revision
  ).length;

  if (totalSeguimientos) totalSeguimientos.textContent = total;
  if (seguimientosBuenos) seguimientosBuenos.textContent = buenos;
  if (seguimientosAtencion) seguimientosAtencion.textContent = atencion;
  if (proximasRevisiones) proximasRevisiones.textContent = conProximaRevision;

  seguimientos.forEach((item) => {
    contenedorHistorialSeguimiento.innerHTML += `
      <div class="admin-card">
        <div>
          <h3>Seguimiento de ${item.mascota_nombre}</h3>
          <p><strong>Adoptante:</strong> ${item.adoptante_nombre}</p>
          <p><strong>Fecha de adopción:</strong> ${item.fecha_adopcion}</p>
          <p><strong>Fecha de seguimiento:</strong> ${item.fecha_seguimiento}</p>
          <p><strong>Tipo de seguimiento:</strong> ${item.tipo_seguimiento}</p>
          <p><strong>Estado de la mascota:</strong> ${item.estado_mascota}</p>
          <p><strong>Alimentación:</strong> ${item.alimentacion}</p>
          <p><strong>Salud:</strong> ${item.salud}</p>
          <p><strong>Adaptación:</strong> ${item.adaptacion}</p>
          <p><strong>Observaciones:</strong> ${item.observaciones}</p>
          <p><strong>Próxima revisión:</strong> ${item.proxima_revision || "No definida"}</p>
          <p><strong>Estado del registro:</strong> ${item.estado_registro}</p>
        </div>

        <div class="admin-actions">
          <a href="seguimiento.html" class="btn-primary">Nuevo control</a>
        </div>
      </div>
    `;
  });
}

cargarHistorialSeguimiento();

// ESTADÍSTICAS DEL DASHBOARD
async function obtenerConteo(tabla, filtroCampo = null, filtroValor = null) {
  let consulta = db
    .from(tabla)
    .select("*", { count: "exact", head: true });

  if (filtroCampo && filtroValor) {
    consulta = consulta.eq(filtroCampo, filtroValor);
  }

  const { count, error } = await consulta;

  if (error) {
    console.error(`Error contando ${tabla}:`, error);
    return 0;
  }

  return count || 0;
}

async function cargarEstadisticasDashboard() {
  if (!document.getElementById("stat1")) return;

  if (typeof db === "undefined") {
    console.warn("Supabase no está cargado para estadísticas.");
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const rolUrl = params.get("rol");
  const rolGuardado = localStorage.getItem("huellinkRol");
  const rol = rolUrl || rolGuardado || "ciudadano";

  const totalMascotas = await obtenerConteo("mascotas");
  const totalSolicitudes = await obtenerConteo("solicitudes_adopcion");
  const solicitudesPendientes = await obtenerConteo("solicitudes_adopcion", "estado_solicitud", "pendiente");
  const solicitudesAprobadas = await obtenerConteo("solicitudes_adopcion", "estado_solicitud", "aprobada");

  const totalReportes = await obtenerConteo("reportes_mascotas");
  const reportesPerdidos = await obtenerConteo("reportes_mascotas", "tipo_reporte", "perdida");
  const reportesEncontrados = await obtenerConteo("reportes_mascotas", "tipo_reporte", "encontrada");

  const totalAliados = await obtenerConteo("aliados");
  const aliadosPendientes = await obtenerConteo("aliados", "estado_validacion", "pendiente");

  const totalSeguimientos = await obtenerConteo("seguimientos_adopcion");

  if (rol === "ciudadano") {
    stat1.textContent = totalSolicitudes;
    stat1Text.textContent = "Solicitudes";

    stat2.textContent = totalReportes;
    stat2Text.textContent = "Reportes";

    stat3.textContent = reportesEncontrados;
    stat3Text.textContent = "Encontradas";

    stat4.textContent = reportesPerdidos;
    stat4Text.textContent = "Perdidas";
  }

  if (rol === "rescatista") {
    stat1.textContent = totalMascotas;
    stat1Text.textContent = "Mascotas";

    stat2.textContent = totalSolicitudes;
    stat2Text.textContent = "Solicitudes";

    stat3.textContent = totalSeguimientos;
    stat3Text.textContent = "Seguimientos";

    stat4.textContent = totalReportes;
    stat4Text.textContent = "Reportes";
  }

  if (rol === "refugio") {
    stat1.textContent = totalMascotas;
    stat1Text.textContent = "Mascotas";

    stat2.textContent = solicitudesPendientes;
    stat2Text.textContent = "Solicitudes pendientes";

    stat3.textContent = solicitudesAprobadas;
    stat3Text.textContent = "Adopciones aprobadas";

    stat4.textContent = totalReportes;
    stat4Text.textContent = "Reportes";
  }

  if (rol === "administrador") {
    stat1.textContent = aliadosPendientes;
    stat1Text.textContent = "Validaciones pendientes";

    stat2.textContent = totalAliados;
    stat2Text.textContent = "Aliados registrados";

    stat3.textContent = totalMascotas;
    stat3Text.textContent = "Mascotas publicadas";

    stat4.textContent = totalReportes;
    stat4Text.textContent = "Reportes";
  }
}

cargarEstadisticasDashboard();

// PUBLICACIONES DE MASCOTAS EN ADMIN
const contenedorPublicaciones = document.getElementById("contenedorPublicaciones");

function formatearEstadoPublicacion(estado) {
  if (estado === "aprobada") return "Aprobada";
  if (estado === "rechazada") return "Rechazada";
  return "Pendiente";
}

async function cargarPublicacionesMascotas() {
  if (!contenedorPublicaciones) return;

  if (typeof db === "undefined") {
    alert("Supabase no está cargado. Revisa los scripts en admin.html");
    return;
  }

  const { data: mascotasBD, error } = await db
    .from("mascotas")
    .select("*")
    .order("created_at", { ascending: false });

  console.log("Publicaciones de mascotas:", mascotasBD);
  console.log("Error publicaciones:", error);

  if (error) {
    alert("No se pudieron cargar las publicaciones: " + error.message);
    return;
  }

  contenedorPublicaciones.innerHTML = "";

  if (!mascotasBD || mascotasBD.length === 0) {
    contenedorPublicaciones.innerHTML = `
      <div class="no-results" style="display: block;">
        <h3>Aún no hay mascotas publicadas 🐾</h3>
        <p>Cuando un refugio o rescatista publique una mascota, aparecerá aquí.</p>
      </div>
    `;
    return;
  }

  mascotasBD.forEach((mascota) => {
    const estadoPublicacion = mascota.estado_publicacion || "pendiente";

    contenedorPublicaciones.innerHTML += `
      <div class="admin-card mascota-admin-card ${estadoPublicacion}" data-id="${mascota.id}">
        <div>
          <h3>${mascota.icono || "🐾"} ${mascota.nombre}</h3>
          <p><strong>Tipo:</strong> ${mascota.tipo}</p>
          <p><strong>Edad:</strong> ${mascota.edad}</p>
          <p><strong>Tamaño:</strong> ${mascota.tamano}</p>
          <p><strong>Sexo:</strong> ${mascota.sexo || "No especificado"}</p>
          <p><strong>Ciudad:</strong> ${mascota.ciudad}</p>
          <p><strong>Zona:</strong> ${mascota.zona || "No especificada"}</p>
          <p><strong>Vacunas:</strong> ${mascota.vacunas || "Sin información"}</p>
          <p><strong>Salud:</strong> ${mascota.salud || "Sin información"}</p>
          <p><strong>Comportamiento:</strong> ${mascota.comportamiento || "Sin descripción"}</p>
          <p><strong>Responsable:</strong> ${mascota.responsable || "No especificado"}</p>
          <p><strong>Estado de publicación:</strong> <span class="estado-publicacion">${formatearEstadoPublicacion(estadoPublicacion)}</span></p>
        </div>

        <div class="admin-actions">
          <button class="btn-approve btn-aprobar-mascota">Aprobar</button>
          <button class="btn-reject btn-rechazar-mascota">Rechazar</button>
        </div>
      </div>
    `;
  });
}

cargarPublicacionesMascotas();

document.addEventListener("click", async (e) => {
  if (
    e.target.classList.contains("btn-aprobar-mascota") ||
    e.target.classList.contains("btn-rechazar-mascota")
  ) {
    const tarjeta = e.target.closest(".mascota-admin-card");
    if (!tarjeta) return;

    const idMascota = tarjeta.dataset.id;

    let nuevoEstado = "pendiente";

    if (e.target.classList.contains("btn-aprobar-mascota")) {
      nuevoEstado = "aprobada";
    }

    if (e.target.classList.contains("btn-rechazar-mascota")) {
      nuevoEstado = "rechazada";
    }

    const { error } = await db
      .from("mascotas")
      .update({ estado_publicacion: nuevoEstado })
      .eq("id", idMascota);

    if (error) {
      alert("No se pudo actualizar la publicación: " + error.message);
      return;
    }

    const estadoTexto = tarjeta.querySelector(".estado-publicacion");

    tarjeta.classList.remove("pendiente", "aprobada", "rechazada");
    tarjeta.classList.add(nuevoEstado);

    estadoTexto.textContent = formatearEstadoPublicacion(nuevoEstado);

    alert(`Publicación ${formatearEstadoPublicacion(nuevoEstado).toLowerCase()} correctamente 🐾`);
  }
});

// ESTADÍSTICAS DEL INICIO
async function obtenerConteoHome(tabla, filtroCampo = null, filtroValor = null) {
  if (typeof db === "undefined") {
    console.warn("Supabase no está cargado en index.html");
    return 0;
  }

  let consulta = db
    .from(tabla)
    .select("id", { count: "exact", head: true });

  if (filtroCampo && filtroValor) {
    consulta = consulta.eq(filtroCampo, filtroValor);
  }

  const { count, error } = await consulta;

  console.log(`Conteo ${tabla}:`, count);
  console.log(`Error ${tabla}:`, error);

  if (error) {
    console.error(`Error contando ${tabla}:`, error);
    return 0;
  }

  return count || 0;
}

async function cargarEstadisticasInicio() {
  const homeTotalMascotas = document.getElementById("homeTotalMascotas");
  const homeAdopciones = document.getElementById("homeAdopciones");
  const homeReportes = document.getElementById("homeReportes");
  const homeAliados = document.getElementById("homeAliados");

  if (!homeTotalMascotas || !homeAdopciones || !homeReportes || !homeAliados) {
    return;
  }

  const totalMascotas = await obtenerConteoHome("mascotas", "estado_publicacion", "aprobada");
  const adopcionesLogradas = await obtenerConteoHome("solicitudes_adopcion", "estado_solicitud", "aprobada");
  const reportesAtendidos = await obtenerConteoHome("reportes_mascotas");
  const aliadosAprobados = await obtenerConteoHome("aliados", "estado_validacion", "aprobado");

  homeTotalMascotas.textContent = `+${totalMascotas}`;
  homeAdopciones.textContent = `+${adopcionesLogradas}`;
  homeReportes.textContent = `+${reportesAtendidos}`;
  homeAliados.textContent = `+${aliadosAprobados}`;
}

cargarEstadisticasInicio();

// MASCOTAS DESTACADAS EN INICIO
const mascotasInicio = document.getElementById("mascotasInicio");

async function cargarMascotasInicio() {
  if (!mascotasInicio) return;

  if (typeof db === "undefined") {
    console.warn("Supabase no está cargado en index.html");
    return;
  }

  const { data: mascotas, error } = await db
    .from("mascotas")
    .select("*")
    .eq("estado_publicacion", "aprobada")
    .order("created_at", { ascending: false })
    .limit(3);

  console.log("Mascotas inicio:", mascotas);
  console.log("Error mascotas inicio:", error);

  if (error) {
    mascotasInicio.innerHTML = `
      <div class="no-results" style="display: block;">
        <h3>No se pudieron cargar las mascotas 🐾</h3>
        <p>Intenta nuevamente más tarde.</p>
      </div>
    `;
    return;
  }

  mascotasInicio.innerHTML = "";

  if (!mascotas || mascotas.length === 0) {
    mascotasInicio.innerHTML = `
      <div class="no-results" style="display: block;">
        <h3>Aún no hay mascotas aprobadas 🐾</h3>
        <p>Cuando el administrador apruebe publicaciones, aparecerán aquí.</p>
      </div>
    `;
    return;
  }

  mascotas.forEach((mascota) => {
    mascotasInicio.innerHTML += `
      <div class="pet-card mascota"
        data-id="${mascota.id}"
        data-tipo="${mascota.tipo}"
        data-ciudad="${mascota.ciudad}"
        data-tamano="${mascota.tamano}">

        ${
            mascota.foto_url
              ? `<img src="${mascota.foto_url}" alt="Foto de ${mascota.nombre}" class="mascota-foto">`
              : `<div class="pet-photo">${mascota.icono || "🐾"}</div>`
          }
        <h3>${mascota.nombre}</h3>
        <p>${mascota.tipo} · ${mascota.edad} · ${mascota.ciudad}</p>
        <span>${mascota.vacunas || "Sin información"}</span>
        <button class="btn-detalle">Ver detalle</button>
      </div>
    `;
  });
}

cargarMascotasInicio();

// CARRUSEL HERO
const mascotaHero = document.getElementById("mascotaHero");
const btnMascotaAnterior = document.getElementById("btnMascotaAnterior");
const btnMascotaSiguiente = document.getElementById("btnMascotaSiguiente");
const heroDots = document.getElementById("heroDots");

let mascotasHero = [];
let indiceMascotaHero = 0;
let intervaloMascotaHero = null;

async function cargarCarruselMascotasHero() {
  if (!mascotaHero) return;

  if (typeof db === "undefined") {
    console.warn("Supabase no está cargado en index.html");
    return;
  }

  const { data: mascotas, error } = await db
    .from("mascotas")
    .select("*")
    .eq("estado_publicacion", "aprobada")
    .order("created_at", { ascending: false })
    .limit(5);

  console.log("Mascotas carrusel hero:", mascotas);
  console.log("Error carrusel hero:", error);

  if (error) {
    const heroIcono = document.getElementById("heroIcono");
    const heroNombre = document.getElementById("heroNombre");
    const heroDescripcion = document.getElementById("heroDescripcion");
    const heroEstado = document.getElementById("heroEstado");

    if (heroIcono) heroIcono.innerHTML = "🐾";
    if (heroNombre) heroNombre.textContent = "Mascota busca hogar";
    if (heroDescripcion) heroDescripcion.textContent = "No se pudo cargar la información.";
    if (heroEstado) heroEstado.textContent = "Disponible para adopción";

    return;
  }

  if (!mascotas || mascotas.length === 0) {
    const heroIcono = document.getElementById("heroIcono");
    const heroNombre = document.getElementById("heroNombre");
    const heroDescripcion = document.getElementById("heroDescripcion");
    const heroEstado = document.getElementById("heroEstado");

    if (heroIcono) heroIcono.innerHTML = "🐾";
    if (heroNombre) heroNombre.textContent = "Mascota busca hogar";
    if (heroDescripcion) heroDescripcion.textContent = "Pronto mostraremos mascotas disponibles.";
    if (heroEstado) heroEstado.textContent = "Pendiente de publicación";

    if (btnMascotaAnterior) btnMascotaAnterior.style.display = "none";
    if (btnMascotaSiguiente) btnMascotaSiguiente.style.display = "none";
    if (heroDots) heroDots.innerHTML = "";

    return;
  }

  mascotasHero = mascotas;
  indiceMascotaHero = 0;

  pintarMascotaHero();
  crearDotsHero();

  if (mascotasHero.length <= 1) {
    if (btnMascotaAnterior) btnMascotaAnterior.style.display = "none";
    if (btnMascotaSiguiente) btnMascotaSiguiente.style.display = "none";
  } else {
    if (btnMascotaAnterior) btnMascotaAnterior.style.display = "flex";
    if (btnMascotaSiguiente) btnMascotaSiguiente.style.display = "flex";
  }

  iniciarAutoCarruselHero();
}

function pintarMascotaHero() {
  if (!mascotasHero.length) return;

  const mascota = mascotasHero[indiceMascotaHero];

  const heroIcono = document.getElementById("heroIcono");
  const heroNombre = document.getElementById("heroNombre");
  const heroDescripcion = document.getElementById("heroDescripcion");
  const heroEstado = document.getElementById("heroEstado");

  if (heroIcono) {
    if (mascota.foto_url) {
      heroIcono.innerHTML = `
        <img 
          src="${mascota.foto_url}" 
          alt="Foto de ${mascota.nombre}" 
          class="hero-mascota-foto"
        >
      `;
    } else {
      heroIcono.innerHTML = mascota.icono || "🐾";
    }
  }

  if (heroNombre) {
    heroNombre.textContent = `${mascota.nombre} busca hogar`;
  }

  if (heroDescripcion) {
    heroDescripcion.textContent =
      `${mascota.edad || "Edad no registrada"} · ${mascota.vacunas || "Sin información"} · ${mascota.ciudad || "Ciudad no registrada"}`;
  }

  if (heroEstado) {
    heroEstado.textContent = "Disponible para adopción";
  }

  actualizarDotsHero();
}

function mostrarMascotaAnterior() {
  if (!mascotasHero.length) return;

  indiceMascotaHero--;

  if (indiceMascotaHero < 0) {
    indiceMascotaHero = mascotasHero.length - 1;
  }

  pintarMascotaHero();
  reiniciarAutoCarruselHero();
}

function mostrarMascotaSiguiente() {
  if (!mascotasHero.length) return;

  indiceMascotaHero++;

  if (indiceMascotaHero >= mascotasHero.length) {
    indiceMascotaHero = 0;
  }

  pintarMascotaHero();
  reiniciarAutoCarruselHero();
}

function crearDotsHero() {
  if (!heroDots) return;

  heroDots.innerHTML = "";

  mascotasHero.forEach((_, index) => {
    heroDots.innerHTML += `
      <span class="carousel-dot" data-index="${index}"></span>
    `;
  });

  actualizarDotsHero();
}

function actualizarDotsHero() {
  if (!heroDots) return;

  const dots = heroDots.querySelectorAll(".carousel-dot");

  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === indiceMascotaHero);
  });
}

function iniciarAutoCarruselHero() {
  if (mascotasHero.length <= 1) return;

  if (intervaloMascotaHero) {
    clearInterval(intervaloMascotaHero);
  }

  intervaloMascotaHero = setInterval(() => {
    mostrarMascotaSiguiente();
  }, 5000);
}

function reiniciarAutoCarruselHero() {
  if (intervaloMascotaHero) {
    clearInterval(intervaloMascotaHero);
  }

  iniciarAutoCarruselHero();
}

if (btnMascotaAnterior) {
  btnMascotaAnterior.addEventListener("click", (e) => {
    e.stopPropagation();
    mostrarMascotaAnterior();
  });
}

if (btnMascotaSiguiente) {
  btnMascotaSiguiente.addEventListener("click", (e) => {
    e.stopPropagation();
    mostrarMascotaSiguiente();
  });
}

if (heroDots) {
  heroDots.addEventListener("click", (e) => {
    if (e.target.classList.contains("carousel-dot")) {
      indiceMascotaHero = Number(e.target.dataset.index);
      pintarMascotaHero();
      reiniciarAutoCarruselHero();
    }
  });
}

if (mascotaHero) {
  mascotaHero.addEventListener("click", () => {
    if (!mascotasHero.length) return;

    const mascota = mascotasHero[indiceMascotaHero];
    window.location.href = `detalle-mascota.html?id=${mascota.id}`;
  });
}

cargarCarruselMascotasHero();