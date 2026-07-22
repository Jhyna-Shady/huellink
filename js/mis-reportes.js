console.log("mis-reportes.js cargado correctamente 🐾");

const contenedorMisReportes = document.getElementById("contenedorMisReportes");
const noResultsMisReportes = document.getElementById("noResultsMisReportes");

const filtroMisReportesTipo = document.getElementById("filtroMisReportesTipo");
const filtroMisReportesEstado = document.getElementById("filtroMisReportesEstado");
const limpiarFiltrosMisReportes = document.getElementById("limpiarFiltrosMisReportes");

function obtenerIconoMisReporte(tipoMascota) {
  if (tipoMascota === "perro") return "🐶";
  if (tipoMascota === "gato") return "🐱";
  return "🐾";
}

function obtenerBadgeMisReporte(tipoReporte, estadoReporte) {
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

function filtrarMisReportes() {
  const reportes = document.querySelectorAll(".mi-reporte");

  if (!reportes.length) return;

  const tipo = filtroMisReportesTipo.value;
  const estado = filtroMisReportesEstado.value;

  let visibles = 0;

  reportes.forEach((reporte) => {
    const coincideTipo = tipo === "todos" || reporte.dataset.tipo === tipo;
    const coincideEstado = estado === "todos" || reporte.dataset.estado === estado;

    if (coincideTipo && coincideEstado) {
      reporte.style.display = "grid";
      visibles++;
    } else {
      reporte.style.display = "none";
    }
  });

  if (noResultsMisReportes) {
    noResultsMisReportes.style.display = visibles === 0 ? "block" : "none";
  }
}

async function cargarMisReportes() {
  if (!contenedorMisReportes) return;

  if (typeof db === "undefined") {
    alert("Supabase no está cargado. Revisa los scripts en mis-reportes.html");
    return;
  }

  const { data: sesionData, error: errorSesion } = await db.auth.getSession();

  if (errorSesion) {
    alert("No se pudo verificar la sesión: " + errorSesion.message);
    return;
  }

  const usuario = sesionData.session?.user;

  if (!usuario) {
    alert("Debes iniciar sesión para ver tus reportes.");
    window.location.href = "login.html?redirect=mis-reportes.html";
    return;
  }

  const { data: reportes, error } = await db
    .from("reportes_mascotas")
    .select("*")
    .eq("usuario_id", usuario.id)
    .order("created_at", { ascending: false });

  console.log("Mis reportes:", reportes);
  console.log("Error mis reportes:", error);

  if (error) {
    alert("No se pudieron cargar tus reportes: " + error.message);
    return;
  }

  contenedorMisReportes.innerHTML = "";

  if (!reportes || reportes.length === 0) {
    contenedorMisReportes.innerHTML = `
      <div class="no-results" style="display: block;">
        <h3>Aún no tienes reportes registrados 🐾</h3>
        <p>Cuando reportes una mascota perdida o encontrada, aparecerá aquí.</p>
        <div class="form-actions">
          <a href="reportar-perdida.html" class="btn-primary">Reportar pérdida</a>
          <a href="reportar-encontrada.html" class="btn-secondary">Reportar encontrada</a>
        </div>
      </div>
    `;
    return;
  }

  reportes.forEach((reporte) => {
    const tipoMascota = reporte.tipo_mascota ? reporte.tipo_mascota.toLowerCase() : "";
    const tipoReporte = reporte.tipo_reporte ? reporte.tipo_reporte.toLowerCase() : "";
    const estadoReporte = reporte.estado_reporte || "activo";

    const estadoFiltro = estadoReporte === "reunida" ? "reunida" : tipoReporte;

    const nombreVisible =
      tipoReporte === "perdida"
        ? reporte.nombre_mascota || "Mascota perdida"
        : "Mascota encontrada";

    contenedorMisReportes.innerHTML += `
      <div class="report-item-card mi-reporte"
        data-id="${reporte.id}"
        data-tipo="${tipoMascota}"
        data-estado="${estadoFiltro}">

        ${
          reporte.foto_url
            ? `<img src="${reporte.foto_url}" alt="Foto de mascota reportada" class="reporte-foto">`
            : `<div class="report-pet-icon">${obtenerIconoMisReporte(tipoMascota)}</div>`
        }

        <div class="report-content">
          <div class="report-header">
            <h3>${nombreVisible}</h3>
            ${obtenerBadgeMisReporte(tipoReporte, estadoReporte)}
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

          <button class="btn-match btn-marcar-reunida">Marcar como reunida</button>
        </div>
      </div>
    `;
  });

  filtrarMisReportes();
}

if (filtroMisReportesTipo && filtroMisReportesEstado) {
  filtroMisReportesTipo.addEventListener("change", filtrarMisReportes);
  filtroMisReportesEstado.addEventListener("change", filtrarMisReportes);
}

if (limpiarFiltrosMisReportes) {
  limpiarFiltrosMisReportes.addEventListener("click", () => {
    filtroMisReportesTipo.value = "todos";
    filtroMisReportesEstado.value = "todos";
    filtrarMisReportes();
  });
}

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btn-marcar-reunida")) {
    const tarjeta = e.target.closest(".mi-reporte");

    if (!tarjeta) return;

    const idReporte = tarjeta.dataset.id;

    const confirmar = confirm("¿Deseas marcar este reporte como reunido?");

    if (!confirmar) return;

    const { error } = await db
      .from("reportes_mascotas")
      .update({ estado_reporte: "reunida" })
      .eq("id", idReporte);

    if (error) {
      alert("No se pudo actualizar el reporte: " + error.message);
      return;
    }

    alert("Reporte marcado como reunido correctamente 🐾");
    cargarMisReportes();
  }
});

cargarMisReportes();