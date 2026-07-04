/* ============================================================
   identidad.js
   Rama: MAIN
   Responsabilidad: identificar al estudiante/comensal a partir
   de su código universitario y mostrar su estado (Apto/Regular).
   ============================================================ */


// Simulación de conflicto por Colaborador B
// Validación de código vacío por Colaborador A




/**
 * Busca un estudiante por código universitario dentro de la
 * base de usuarios y devuelve su información pública.
 */
function identificarEstudiante(codigo) {
  const usuarios = obtenerUsuarios();
  const estudiante = usuarios.find(u => u.codigo === codigo && u.rol === "estudiante");

  if (!estudiante) {
    return { encontrado: false };
  }

  return {
    encontrado: true,
    codigo: estudiante.codigo,
    nombre: estudiante.nombre,
    estado: estudiante.estado || "Apto (Regular)"
  };
}

/**
 * Pinta el resultado de la identificación dentro del bloque
 * "1. Identificación del Estudiante / Comensal" de reserva.html
 */
function renderIdentificacion(datos) {
  const nombreEl = document.getElementById("idNombre");
  const codigoEl = document.getElementById("idCodigo");
  const badgeEl = document.getElementById("idEstado");

  if (!datos.encontrado) {
    nombreEl.textContent = "No encontrado";
    codigoEl.textContent = "—";
    badgeEl.textContent = "No apto";
    badgeEl.className = "badge no-apto";
    return;
  }

  nombreEl.textContent = datos.nombre;
  codigoEl.textContent = "Código: " + datos.codigo;
  badgeEl.textContent = datos.estado;
  badgeEl.className = "badge apto";
}
