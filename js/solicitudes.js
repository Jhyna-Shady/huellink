console.log("solicitudes.js cargado correctamente 📋🐾");

// FORMULARIO DE SOLICITUD DE ADOPCIÓN EN SUPABASE
const formSolicitudAdopcion = document.getElementById("formSolicitudAdopcion");
const mascotaSolicitud = document.getElementById("mascotaSolicitud");

let mascotaIdSolicitud = null;

if (mascotaSolicitud) {
  const params = new URLSearchParams(window.location.search);
  const mascota = params.get("mascota");
  const id = params.get("id");

  if (mascota) {
    mascotaSolicitud.value = mascota;
  }

  if (id) {
    mascotaIdSolicitud = Number(id);
  }
}

if (formSolicitudAdopcion) {
  formSolicitudAdopcion.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (typeof db === "undefined") {
      alert("Supabase no está cargado. Revisa los scripts en solicitud-adopcion.html");
      return;
    }

    const nuevaSolicitud = {
      mascota_id: mascotaIdSolicitud,
      mascota_nombre: document.getElementById("mascotaSolicitud").value,
      nombre_adoptante: document.getElementById("nombreAdoptante").value,
      dni: document.getElementById("dniAdoptante").value,
      correo: document.getElementById("correoAdoptante").value,
      telefono: document.getElementById("telefonoAdoptante").value,
      ciudad: document.getElementById("ciudadAdoptante").value,
      distrito: document.getElementById("distritoAdoptante").value,
      tipo_vivienda: document.getElementById("tipoVivienda").value,
      vivienda_propiedad: document.getElementById("viviendaPropia").value,
      otras_mascotas: document.getElementById("otrasMascotas").value,
      experiencia: document.getElementById("experienciaMascotas").value,
      motivo: document.getElementById("motivoAdopcion").value,
      tiempo_disponible: document.getElementById("tiempoDisponible").value,
      compromiso_cuidado: document.getElementById("compromisoCuidado").checked,
      acepta_seguimiento: document.getElementById("aceptaSeguimiento").checked,
      estado_solicitud: "pendiente"
    };

    const { data, error } = await db
      .from("solicitudes_adopcion")
      .insert([nuevaSolicitud])
      .select();

    console.log("Solicitud guardada:", data);
    console.log("Error solicitud:", error);

    if (error) {
      alert("Error al registrar solicitud: " + error.message);
      return;
    }

    alert(
      `Solicitud enviada correctamente 🐾\n\nMascota: ${nuevaSolicitud.mascota_nombre}\nAdoptante: ${nuevaSolicitud.nombre_adoptante}\nCiudad: ${nuevaSolicitud.ciudad}\n\nTu solicitud quedó pendiente de revisión.`
    );

    formSolicitudAdopcion.reset();

    window.location.href = "adoptar.html";
  });
}

// FILTROS DE SOLICITUDES
const filtroSolicitudEstado = document.getElementById("filtroSolicitudEstado");
const filtroSolicitudMascota = document.getElementById("filtroSolicitudMascota");
const limpiarFiltrosSolicitudes = document.getElementById("limpiarFiltrosSolicitudes");
const noResultsSolicitudes = document.getElementById("noResultsSolicitudes");

function filtrarSolicitudes() {
  if (!filtroSolicitudEstado || !filtroSolicitudMascota) {
    return;
  }

  const solicitudes = document.querySelectorAll(".solicitud-card");

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

// FORMATEAR ESTADO DE SOLICITUD
function formatearEstadoSolicitud(estado) {
  if (estado === "revision") return "En revisión";
  if (estado === "aprobada") return "Aprobada";
  if (estado === "rechazada") return "Rechazada";
  return "Pendiente";
}

// CARGAR SOLICITUDES DESDE SUPABASE
const contenedorSolicitudes = document.getElementById("contenedorSolicitudes");

async function cargarSolicitudesDesdeBD() {
  if (!contenedorSolicitudes) return;

  if (typeof db === "undefined") {
    alert("Supabase no está cargado. Revisa los scripts en solicitudes.html");
    return;
  }

  const { data: solicitudesBD, error } = await db
    .from("solicitudes_adopcion")
    .select("*")
    .order("created_at", { ascending: false });

  console.log("Solicitudes desde Supabase:", solicitudesBD);
  console.log("Error solicitudes:", error);

  if (error) {
    alert("No se pudieron cargar las solicitudes: " + error.message);
    return;
  }

  contenedorSolicitudes.innerHTML = "";

  if (!solicitudesBD || solicitudesBD.length === 0) {
    contenedorSolicitudes.innerHTML = `
      <div class="no-results" style="display: block;">
        <h3>Aún no hay solicitudes registradas 🐾</h3>
        <p>Cuando un usuario solicite adoptar una mascota, aparecerá aquí.</p>
      </div>
    `;
    return;
  }

  solicitudesBD.forEach((solicitud) => {
    const estado = solicitud.estado_solicitud || "pendiente";

    const mascotaFiltro = solicitud.mascota_nombre
      ? solicitud.mascota_nombre.toLowerCase()
      : "";

    contenedorSolicitudes.innerHTML += `
      <div class="admin-card solicitud-card ${estado}" 
        data-id="${solicitud.id}"
        data-estado="${estado}" 
        data-mascota="${mascotaFiltro}">

        <div>
          <h3>Solicitud para adoptar a ${solicitud.mascota_nombre}</h3>
          <p><strong>Adoptante:</strong> ${solicitud.nombre_adoptante}</p>
          <p><strong>DNI:</strong> ${solicitud.dni}</p>
          <p><strong>Correo:</strong> ${solicitud.correo}</p>
          <p><strong>Celular:</strong> ${solicitud.telefono}</p>
          <p><strong>Ciudad:</strong> ${solicitud.ciudad}</p>
          <p><strong>Distrito:</strong> ${solicitud.distrito}</p>
          <p><strong>Tipo de vivienda:</strong> ${solicitud.tipo_vivienda}</p>
          <p><strong>Vivienda:</strong> ${solicitud.vivienda_propiedad}</p>
          <p><strong>Otras mascotas:</strong> ${solicitud.otras_mascotas}</p>
          <p><strong>Experiencia:</strong> ${solicitud.experiencia}</p>
          <p><strong>Motivo:</strong> ${solicitud.motivo}</p>
          <p><strong>Tiempo disponible:</strong> ${solicitud.tiempo_disponible}</p>
          <p><strong>Estado:</strong> <span class="estado-texto">${formatearEstadoSolicitud(estado)}</span></p>
        </div>

        <div class="admin-actions">
          <button class="btn-review">En revisión</button>
          <button class="btn-approve">Aprobar</button>
          <button class="btn-reject">Rechazar</button>
        </div>
      </div>
    `;
  });

  filtrarSolicitudes();
}

cargarSolicitudesDesdeBD();

// ACTUALIZAR ESTADO DE SOLICITUD
document.addEventListener("click", async (e) => {
  if (
    e.target.classList.contains("btn-review") ||
    e.target.classList.contains("btn-approve") ||
    e.target.classList.contains("btn-reject")
  ) {
    const tarjeta = e.target.closest(".solicitud-card");

    if (!tarjeta) return;

    let nuevoEstado = "pendiente";

    if (e.target.classList.contains("btn-review")) {
      nuevoEstado = "revision";
    }

    if (e.target.classList.contains("btn-approve")) {
      nuevoEstado = "aprobada";
    }

    if (e.target.classList.contains("btn-reject")) {
      nuevoEstado = "rechazada";
    }

    const idSolicitud = tarjeta.dataset.id;

    const { error } = await db
      .from("solicitudes_adopcion")
      .update({ estado_solicitud: nuevoEstado })
      .eq("id", idSolicitud);

    if (error) {
      alert("No se pudo actualizar la solicitud: " + error.message);
      return;
    }

    const estadoTexto = tarjeta.querySelector(".estado-texto");

    tarjeta.dataset.estado = nuevoEstado;
    tarjeta.classList.remove("revision", "aprobada", "rechazada");
    tarjeta.classList.add(nuevoEstado);

    estadoTexto.textContent = formatearEstadoSolicitud(nuevoEstado);

    alert("Estado de solicitud actualizado correctamente ✅");

    filtrarSolicitudes();
  }
});

window.cargarSolicitudesDesdeBD = cargarSolicitudesDesdeBD;
window.filtrarSolicitudes = filtrarSolicitudes;
window.formatearEstadoSolicitud = formatearEstadoSolicitud;