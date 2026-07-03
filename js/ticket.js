/* ============================================================
   ticket.js
   Responsabilidad: generar tickets de comedor (reserva.html) y
   validarlos / marcarlos como atendidos (acceso.html).
   ============================================================ */

const DB_TICKETS = "ct_tickets";

function obtenerTickets() {
  return JSON.parse(localStorage.getItem(DB_TICKETS) || "[]");
}

function guardarTickets(tickets) {
  localStorage.setItem(DB_TICKETS, JSON.stringify(tickets));
}

const TURNOS = {
  1: "Turno 1 (11:30 AM - 12:15 PM)",
  2: "Turno 2 (12:15 PM - 01:00 PM)",
  3: "Turno 3 (01:00 PM - 01:45 PM)"
};

/**
 * Genera un ticket para el código de estudiante indicado.
 * Formato: TICKET-<codigo>-<año>
 */
function generarTicket(codigo, nombre, turnoId, dietaEspecial) {
  const anio = new Date().getFullYear();
  const codigoTicket = `TICKET-${codigo}-${anio}`;

  const tickets = obtenerTickets();

  const ticket = {
    codigoTicket,
    codigoEstudiante: codigo,
    nombre,
    turno: TURNOS[turnoId] || TURNOS[1],
    dietaEspecial: !!dietaEspecial,
    estado: "VALIDO_SIN_SERVIR",
    creadoEn: new Date().toISOString()
  };

  const idx = tickets.findIndex(t => t.codigoTicket === codigoTicket);
  if (idx >= 0) {
    tickets[idx] = ticket;
  } else {
    tickets.push(ticket);
  }

  guardarTickets(tickets);
  return ticket;
}

function buscarTicket(codigoTicket) {
  return obtenerTickets().find(t => t.codigoTicket === codigoTicket) || null;
}

/** Marca un ticket como atendido / servido. */
function marcarComoServido(codigoTicket) {
  const tickets = obtenerTickets();
  const idx = tickets.findIndex(t => t.codigoTicket === codigoTicket);
  if (idx === -1) return null;

  tickets[idx].estado = "SERVIDO";
  guardarTickets(tickets);
  return tickets[idx];
}

function etiquetaEstado(estado) {
  switch (estado) {
    case "VALIDO_SIN_SERVIR": return { texto: "✓ VÁLIDO - SIN SERVIR", clase: "valido" };
    case "SERVIDO": return { texto: "✓ SERVIDO", clase: "servido" };
    default: return { texto: "✕ NO VÁLIDO", clase: "invalido" };
  }
}
