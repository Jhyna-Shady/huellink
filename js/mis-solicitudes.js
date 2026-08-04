console.log("mis-solicitudes.js cargado correctamente 🐾");

const contenedorMisSolicitudes = document.getElementById("contenedorMisSolicitudes");
const noMisSolicitudes = document.getElementById("noMisSolicitudes");

function formatearEstadoSolicitud(estado) {
  const estadoNormalizado = (estado || "pendiente").toLowerCase();

  const estados = {
    pendiente: {
      texto: "Pendiente",
      clase: "estado-pendiente",
      descripcion: "Tu solicitud fue enviada y está esperando revisión."
    },
    revision: {
      texto: "En revisión",
      clase: "estado-revision",
      descripcion: "El refugio o rescatista está evaluando tu solicitud."
    },
    aprobada: {
      texto: "Aprobada",
      clase: "estado-aprobada",
      descripcion: "Tu solicitud fue aprobada. Coordina los siguientes pasos con el responsable."
    },
    rechazada: {
      texto: "Rechazada",
      clase: "estado-rechazada",
      descripcion: "Tu solicitud no fue aprobada en esta ocasión."
    }
  };

  return estados[estadoNormalizado] || estados.pendiente;
}

function formatearFecha(fecha) {
  if (!fecha) return "Fecha no registrada";

  const fechaObj = new Date(fecha);

  return fechaObj.toLocaleDateString("es-PE", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

async function cargarMisSolicitudes() {
  if (!contenedorMisSolicitudes) return;

  if (typeof db === "undefined") {
    mostrarModalHuellink(
      "Supabase no está cargado. Revisa los scripts de esta página.",
      null,
      "Error de conexión"
    );
    return;
  }

  const { data: sessionData, error: sessionError } = await db.auth.getSession();

  if (sessionError || !sessionData.session) {
    mostrarModalHuellink(
      "Debes iniciar sesión para ver tus solicitudes.",
      () => {
        window.location.href = "login.html?redirect=mis-solicitudes.html";
      },
      "Acceso requerido"
    );
    return;
  }

  const usuarioId = sessionData.session.user.id;

  const { data: solicitudes, error } = await db
    .from("solicitudes_adopcion")
    .select("*")
    .eq("usuario_id", usuarioId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error al cargar mis solicitudes:", error);

    mostrarModalHuellink(
      "No se pudieron cargar tus solicitudes: " + error.message,
      null,
      "Error de carga"
    );
    return;
  }

  contenedorMisSolicitudes.innerHTML = "";

  if (!solicitudes || solicitudes.length === 0) {
    if (noMisSolicitudes) {
      noMisSolicitudes.style.display = "block";
    }
    return;
  }

  if (noMisSolicitudes) {
    noMisSolicitudes.style.display = "none";
  }

  solicitudes.forEach((solicitud) => {
    const estado = formatearEstadoSolicitud(solicitud.estado_solicitud);

    contenedorMisSolicitudes.innerHTML += `
      <article class="solicitud-card">
        <div class="solicitud-card-header">
          <div>
            <span class="tag">Solicitud de adopción</span>
            <h3>${solicitud.mascota || "Mascota solicitada"}</h3>
          </div>

          <span class="estado-solicitud ${estado.clase}">
            ${estado.texto}
          </span>
        </div>

        <p class="solicitud-estado-descripcion">
          ${estado.descripcion}
        </p>

        <div class="solicitud-info-grid">
          <p><strong>Adoptante:</strong> ${solicitud.nombre_adoptante || "-"}</p>
          <p><strong>Correo:</strong> ${solicitud.correo || "-"}</p>
          <p><strong>Teléfono:</strong> ${solicitud.telefono || "-"}</p>
          <p><strong>Ciudad:</strong> ${solicitud.ciudad || "-"}</p>
          <p><strong>Fecha de envío:</strong> ${formatearFecha(solicitud.created_at)}</p>
        </div>

        ${
          solicitud.motivo
            ? `<p><strong>Motivo de adopción:</strong> ${solicitud.motivo}</p>`
            : ""
        }
      </article>
    `;
  });
}

cargarMisSolicitudes();