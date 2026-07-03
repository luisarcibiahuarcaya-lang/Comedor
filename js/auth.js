/* ============================================================
   auth.js
   Rama: TEST
   Responsabilidad: inicializar usuarios (administrador y
   colaborador) y resolver el login del sistema COMEDOR-TECH.
   ============================================================ */

const DB_USUARIOS = "ct_usuarios";
const DB_SESION = "ct_sesion";

/**
 * Crea la base de usuarios por defecto si todavía no existe.
 * Se generan dos roles: administrador y colaborador, además
 * de un usuario de prueba tipo "estudiante".
 */
function inicializarUsuarios() {
  if (localStorage.getItem(DB_USUARIOS)) return;

  const usuariosSemilla = [
    {
      codigo: "admin",
      correo: "admin@unamba.edu.pe",
      password: "admin123",
      rol: "administrador",
      nombre: "Administrador Comedor"
    },
    {
      codigo: "colab01",
      correo: "colaborador01@unamba.edu.pe",
      password: "colab123",
      rol: "colaborador",
      nombre: "Colaborador de Turno"
    },
    {
      codigo: "221045",
      correo: "221045@unamba.edu.pe",
      password: "221045",
      rol: "estudiante",
      nombre: "Julio Cesar Lloclli",
      estado: "Apto (Regular)"
    }
  ];

  localStorage.setItem(DB_USUARIOS, JSON.stringify(usuariosSemilla));
}

function obtenerUsuarios() {
  return JSON.parse(localStorage.getItem(DB_USUARIOS) || "[]");
}

/**
 * Valida credenciales contra la base de usuarios.
 * Acepta código institucional o correo institucional.
 */
function login(identificador, password) {
  const usuarios = obtenerUsuarios();
  const usuario = usuarios.find(u =>
    (u.codigo === identificador || u.correo === identificador) &&
    u.password === password
  );

  if (!usuario) {
    return { ok: false, mensaje: "Código o contraseña incorrectos." };
  }

  localStorage.setItem(DB_SESION, JSON.stringify(usuario));
  return { ok: true, usuario };
}

function cerrarSesion() {
  localStorage.removeItem(DB_SESION);
}

function sesionActual() {
  return JSON.parse(localStorage.getItem(DB_SESION) || "null");
}

/** Protege una página: si no hay sesión, redirige al login. */
function requerirSesion(redirectA = "index.html") {
  const sesion = sesionActual();
  if (!sesion) {
    window.location.href = redirectA;
  }
  return sesion;
}

document.addEventListener("DOMContentLoaded", inicializarUsuarios);
