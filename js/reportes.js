console.log("reportes.js cargado correctamente 📍🐾");

// SUBIR FOTO DE REPORTE A SUPABASE STORAGE
async function subirFotoReporte(inputId, carpeta) {
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
  const nombreArchivo = `${carpeta}/${usuarioId}-${Date.now()}.${extension}`;

  const { error: uploadError } = await db.storage
    .from("reportes-mascotas")
    .upload(nombreArchivo, archivo, {
      cacheControl: "3600",
      upsert: false
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = db.storage
    .from("reportes-mascotas")
    .getPublicUrl(nombreArchivo);

  return data.publicUrl;
}

// FORMULARIO DE MASCOTA PERDIDA
const formPerdida = document.getElementById("formPerdida");

if (formPerdida) {
  formPerdida.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      if (typeof db === "undefined") {
        alert("Supabase no está cargado. Revisa los scripts en reportar-perdida.html");
        return;
      }

      const { data: sesionData } = await db.auth.getSession();
      const usuarioId = sesionData.session?.user?.id;

      if (!usuarioId) {
        alert("Debes iniciar sesión para publicar un reporte.");
        window.location.href = "login.html?redirect=reportar-perdida.html";
        return;
      }

      const fotoUrl = await subirFotoReporte("fotoMascota", "perdidas");

      const nuevoReporte = {
        tipo_reporte: "perdida",
        nombre_mascota: document.getElementById("nombreMascota").value.trim(),
        tipo_mascota: document.getElementById("tipoMascota").value,
        color: document.getElementById("colorMascota").value.trim(),
        tamano: document.getElementById("tamanoMascota").value,
        sexo: document.getElementById("sexoMascota").value,
        fecha_reporte: document.getElementById("fechaPerdida").value,
        zona: document.getElementById("zonaPerdida").value.trim(),
        referencia: document.getElementById("referenciaPerdida").value.trim(),
        descripcion: document.getElementById("descripcionMascota").value.trim(),
        contacto_nombre: document.getElementById("nombreContacto").value.trim(),
        contacto_telefono: document.getElementById("telefonoContacto").value.trim(),
        estado_fisico: "",
        collar_identificacion: "",
        estado_reporte: "activo",
        foto_url: fotoUrl,
        usuario_id: usuarioId
      };

      const { data, error } = await db
        .from("reportes_mascotas")
        .insert([nuevoReporte])
        .select();

      console.log("Reporte perdido guardado:", data);
      console.log("Error reporte perdido:", error);

      if (error) {
        alert("Error al registrar reporte: " + error.message);
        return;
      }

      alert(
        `Reporte registrado correctamente 🐾\n\nMascota: ${nuevoReporte.nombre_mascota}\nZona: ${nuevoReporte.zona}\n\nEl reporte quedó publicado como mascota perdida.`
      );

      formPerdida.reset();
      window.location.href = "reportes.html";

    } catch (error) {
      console.error("Error al subir o registrar reporte perdido:", error);
      alert(error.message || "Ocurrió un error al publicar el reporte.");
    }
  });
}

// FORMULARIO DE MASCOTA ENCONTRADA
const formEncontrada = document.getElementById("formEncontrada");

if (formEncontrada) {
  formEncontrada.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      if (typeof db === "undefined") {
        alert("Supabase no está cargado. Revisa los scripts en reportar-encontrada.html");
        return;
      }

      const { data: sesionData } = await db.auth.getSession();
      const usuarioId = sesionData.session?.user?.id;

      if (!usuarioId) {
        alert("Debes iniciar sesión para publicar un reporte.");
        window.location.href = "login.html?redirect=reportar-encontrada.html";
        return;
      }

      const fotoUrl = await subirFotoReporte("fotoEncontrada", "encontradas");

      const nuevoReporte = {
        tipo_reporte: "encontrada",
        nombre_mascota: "Mascota encontrada",
        tipo_mascota: document.getElementById("tipoEncontrada").value,
        color: document.getElementById("colorEncontrada").value.trim(),
        tamano: document.getElementById("tamanoEncontrada").value,
        sexo: document.getElementById("sexoEncontrada").value,
        estado_fisico: document.getElementById("estadoEncontrada").value,
        fecha_reporte: document.getElementById("fechaEncontrada").value,
        collar_identificacion: document.getElementById("collarEncontrada").value,
        zona: document.getElementById("zonaEncontrada").value.trim(),
        referencia: document.getElementById("referenciaEncontrada").value.trim(),
        descripcion: document.getElementById("descripcionEncontrada").value.trim(),
        contacto_nombre: document.getElementById("nombreReportante").value.trim(),
        contacto_telefono: document.getElementById("telefonoReportante").value.trim(),
        estado_reporte: "activo",
        foto_url: fotoUrl,
        usuario_id: usuarioId
      };

      const { data, error } = await db
        .from("reportes_mascotas")
        .insert([nuevoReporte])
        .select();

      console.log("Reporte encontrado guardado:", data);
      console.log("Error reporte encontrado:", error);

      if (error) {
        alert("Error al registrar reporte: " + error.message);
        return;
      }

      alert(
        `Reporte registrado correctamente 🐾\n\nTipo: ${nuevoReporte.tipo_mascota}\nZona: ${nuevoReporte.zona}\n\nEl reporte quedó publicado como mascota encontrada.`
      );

      formEncontrada.reset();
      window.location.href = "reportes.html";

    } catch (error) {
      console.error("Error al subir o registrar reporte encontrado:", error);
      alert(error.message || "Ocurrió un error al publicar el reporte.");
    }
  });
}

// FILTROS DE REPORTES
const filtroReporteTipo = document.getElementById("filtroReporteTipo");
const filtroReporteEstado = document.getElementById("filtroReporteEstado");
const filtroReporteCiudad = document.getElementById("filtroReporteCiudad");
const limpiarFiltrosReportes = document.getElementById("limpiarFiltrosReportes");
const noResultsReportes = document.getElementById("noResultsReportes");
const contenedorReportes = document.getElementById("contenedorReportes");

function filtrarReportes() {
  if (!filtroReporteTipo || !filtroReporteEstado || !filtroReporteCiudad) {
    return;
  }

  const reportes = document.querySelectorAll(".reporte");

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

// FUNCIONES AUXILIARES DE REPORTES
function obtenerCiudadDesdeZona(zona) {
  const zonaTexto = zona ? zona.toLowerCase() : "";

  if (zonaTexto.includes("juliaca")) {
    return "juliaca";
  }

  if (zonaTexto.includes("puno")) {
    return "puno";
  }

  return "";
}

function obtenerIconoReporte(tipoMascota) {
  if (tipoMascota === "perro") {
    return "🐶";
  }

  if (tipoMascota === "gato") {
    return "🐱";
  }

  return "🐾";
}

function obtenerBadgeReporte(tipoReporte, estadoReporte) {
  if (estadoReporte === "reunida") {
    return `<span class="report-badge badge-reunited">Reunida</span>`;
  }

  if (tipoReporte === "perdida") {
    return `<span class="report-badge badge-lost">Perdida</span>`;
  }

  if (tipoReporte === "encontrada") {
    return `<span class="report-badge badge-found">Encontrada</span>`;
  }

  return `<span class="report-badge badge-match">Reporte</span>`;
}

// CARGAR REPORTES DESDE SUPABASE
async function cargarReportesDesdeBD() {
  if (!contenedorReportes) return;

  if (typeof db === "undefined") {
    alert("Supabase no está cargado. Revisa los scripts en reportes.html");
    return;
  }

  const { data: reportesBD, error } = await db
    .from("reportes_mascotas")
    .select("*")
    .order("created_at", { ascending: false });

  console.log("Reportes desde Supabase:", reportesBD);
  console.log("Error reportes:", error);

  if (error) {
    alert("No se pudieron cargar los reportes: " + error.message);
    return;
  }

  contenedorReportes.innerHTML = "";

  if (!reportesBD || reportesBD.length === 0) {
    contenedorReportes.innerHTML = `
      <div class="no-results" style="display: block;">
        <h3>Aún no hay reportes registrados 🐾</h3>
        <p>Cuando se reporte una mascota perdida o encontrada, aparecerá aquí.</p>
      </div>
    `;
    return;
  }

  reportesBD.forEach((reporte) => {
    const tipoMascota = reporte.tipo_mascota ? reporte.tipo_mascota.toLowerCase() : "";
    const tipoReporte = reporte.tipo_reporte ? reporte.tipo_reporte.toLowerCase() : "";
    const ciudadFiltro = obtenerCiudadDesdeZona(reporte.zona);
    const estadoFiltro = reporte.estado_reporte === "reunida" ? "reunida" : tipoReporte;

    const nombreVisible =
      tipoReporte === "perdida"
        ? reporte.nombre_mascota || "Mascota perdida"
        : "Mascota encontrada";

    const botonTexto =
      tipoReporte === "perdida"
        ? "Buscar coincidencias"
        : "Ver posibles dueños";

    contenedorReportes.innerHTML += `
      <div class="report-item-card reporte"
        data-id="${reporte.id}"
        data-tipo="${tipoMascota}"
        data-estado="${estadoFiltro}"
        data-ciudad="${ciudadFiltro}">

        ${
          reporte.foto_url
            ? `<img src="${reporte.foto_url}" alt="Foto de mascota reportada" class="reporte-foto">`
            : `<div class="report-pet-icon">${obtenerIconoReporte(tipoMascota)}</div>`
        }

        <div class="report-content">
          <div class="report-header">
            <h3>${nombreVisible}</h3>
            ${obtenerBadgeReporte(tipoReporte, reporte.estado_reporte)}
          </div>

          <p><strong>Tipo:</strong> ${reporte.tipo_mascota} · ${reporte.tamano} · ${reporte.color}</p>
          <p><strong>Zona:</strong> ${reporte.zona}</p>
          <p><strong>Referencia:</strong> ${reporte.referencia || "Sin referencia"}</p>
          <p><strong>Fecha:</strong> ${reporte.fecha_reporte}</p>
          <p><strong>Descripción:</strong> ${reporte.descripcion}</p>
          <p><strong>Contacto:</strong> ${reporte.contacto_nombre} · ${reporte.contacto_telefono}</p>

          ${
            reporte.estado_fisico
              ? `<p><strong>Estado físico:</strong> ${reporte.estado_fisico}</p>`
              : ""
          }

          ${
            reporte.collar_identificacion
              ? `<p><strong>Collar/identificación:</strong> ${reporte.collar_identificacion}</p>`
              : ""
          }

          <button class="btn-match">${botonTexto}</button>
        </div>
      </div>
    `;
  });

  filtrarReportes();
}

cargarReportesDesdeBD();

// BOTÓN PARA BUSCAR COINCIDENCIAS
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-match")) {
    const tarjetaReporte = e.target.closest(".reporte");
    if (!tarjetaReporte) return;

    const idReporte = tarjetaReporte.dataset.id;
    buscarCoincidenciasReporte(idReporte);
  }
});

// BUSCAR COINCIDENCIAS BÁSICAS ENTRE REPORTES
async function buscarCoincidenciasReporte(idReporte) {
  if (typeof db === "undefined") {
    alert("Supabase no está cargado.");
    return;
  }

  const { data: reporteBase, error: errorBase } = await db
    .from("reportes_mascotas")
    .select("*")
    .eq("id", idReporte)
    .single();

  if (errorBase) {
    alert("No se pudo obtener el reporte seleccionado: " + errorBase.message);
    return;
  }

  const tipoContrario =
    reporteBase.tipo_reporte === "perdida" ? "encontrada" : "perdida";

  const { data: posibles, error } = await db
    .from("reportes_mascotas")
    .select("*")
    .eq("tipo_reporte", tipoContrario)
    .eq("tipo_mascota", reporteBase.tipo_mascota)
    .eq("tamano", reporteBase.tamano);

  if (error) {
    alert("No se pudieron buscar coincidencias: " + error.message);
    return;
  }

  const coincidencias = posibles.filter((reporte) => {
    const colorBase = reporteBase.color.toLowerCase();
    const colorComparado = reporte.color.toLowerCase();

    const zonaBase = reporteBase.zona.toLowerCase();
    const zonaComparada = reporte.zona.toLowerCase();

    const coincideColor =
      colorBase.includes(colorComparado) ||
      colorComparado.includes(colorBase) ||
      colorBase.split(" ").some((palabra) => colorComparado.includes(palabra));

    const coincideZona =
      (zonaBase.includes("puno") && zonaComparada.includes("puno")) ||
      (zonaBase.includes("juliaca") && zonaComparada.includes("juliaca"));

    return coincideColor || coincideZona;
  });

  if (coincidencias.length === 0) {
    alert("No se encontraron coincidencias cercanas para este reporte 🐾");
    return;
  }

  let mensaje = `Se encontraron ${coincidencias.length} posible(s) coincidencia(s):\n\n`;

  coincidencias.forEach((item, index) => {
    mensaje += `${index + 1}. ${item.nombre_mascota || "Mascota encontrada"}\n`;
    mensaje += `Tipo: ${item.tipo_mascota}\n`;
    mensaje += `Color: ${item.color}\n`;
    mensaje += `Tamaño: ${item.tamano}\n`;
    mensaje += `Zona: ${item.zona}\n`;
    mensaje += `Fecha: ${item.fecha_reporte}\n\n`;
  });

  alert(mensaje);
}

// DISPONIBLE PARA OTROS ARCHIVOS SI SE NECESITA
window.subirFotoReporte = subirFotoReporte;
window.cargarReportesDesdeBD = cargarReportesDesdeBD;
window.buscarCoincidenciasReporte = buscarCoincidenciasReporte;