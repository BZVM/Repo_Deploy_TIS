export type RolNombre = "ADMINISTRADOR" | "DIRECTORIO" | "CONSULTA";

export type SeccionId =
  | "panel"
  | "edificios"
  | "residentes"
  | "pagos"
  | "mantenimiento"
  | "usuarios"
  | "roles";

export type Accion = "ver" | "crear" | "editar" | "eliminar";

export const MENSAJE_PERMISO_INSUFICIENTE =
  "Permiso insuficiente: Su perfil solo permite lectura de información.";

export const MENSAJE_ACCESO_DENEGADO_SECCION = "No tienes permisos para acceder a esta sección.";

/**
 * "ROL_1" es un valor heredado que solo aparece en datos de prueba del
 * frontend (ver formatRol en admin/page.tsx); el enum real del backend no
 * lo define. Un rol desconocido se trata como el más restrictivo (CONSULTA)
 * en vez de otorgar acceso por defecto.
 */
export function normalizarRol(strRol: string): RolNombre {
  if (strRol === "ROL_1") {
    return "ADMINISTRADOR";
  }

  if (strRol === "ADMINISTRADOR" || strRol === "DIRECTORIO" || strRol === "CONSULTA") {
    return strRol;
  }

  return "CONSULTA";
}

const MATRIZ_PERMISOS: Record<RolNombre, Partial<Record<SeccionId, Accion[]>>> = {
  ADMINISTRADOR: {
    panel: ["ver"],
    edificios: ["ver", "crear", "editar", "eliminar"],
    residentes: ["ver", "crear", "editar", "eliminar"],
    pagos: ["ver", "crear", "editar", "eliminar"],
    mantenimiento: ["ver", "crear", "editar", "eliminar"],
    usuarios: ["ver", "crear", "editar", "eliminar"],
    roles: ["ver", "editar"],
  },
  DIRECTORIO: {
    panel: ["ver"],
    edificios: ["ver", "crear", "editar"],
    residentes: ["ver", "crear", "editar"],
    pagos: ["ver", "crear", "editar"],
    mantenimiento: ["ver", "crear", "editar"],
    usuarios: ["ver"],
    // "roles" no aparece: la sección queda oculta y bloqueada para Directorio.
  },
  CONSULTA: {
    panel: ["ver"],
    edificios: ["ver"],
    residentes: ["ver"],
    pagos: ["ver"],
    mantenimiento: ["ver"],
    // "usuarios" y "roles" no aparecen: quedan ocultas y bloqueadas para Consulta.
  },
};

export function puedeAcceder(rol: RolNombre, seccion: SeccionId): boolean {
  return Boolean(MATRIZ_PERMISOS[rol][seccion]?.length);
}

export function puedeEjecutar(rol: RolNombre, seccion: SeccionId, accion: Accion): boolean {
  return Boolean(MATRIZ_PERMISOS[rol][seccion]?.includes(accion));
}

/**
 * Revalida el permiso justo antes de ejecutar una acción de escritura
 * (crear/editar/eliminar), sin importar si el botón correspondiente estaba
 * visible. Es una comprobación local y síncrona (no hace ninguna llamada de
 * red), por lo que responde en microsegundos.
 */
export function validarAccion(
  rol: RolNombre,
  seccion: SeccionId,
  accion: Accion
): { permitido: true } | { permitido: false; mensaje: string } {
  if (puedeEjecutar(rol, seccion, accion)) {
    return { permitido: true };
  }

  return { permitido: false, mensaje: MENSAJE_PERMISO_INSUFICIENTE };
}

export interface SeccionNav {
  id: SeccionId;
  label: string;
  href: string;
}

export const SECCIONES_NAV: SeccionNav[] = [
  { id: "panel", label: "Panel principal", href: "/admin" },
  { id: "edificios", label: "Edificios", href: "/admin/edificios" },
  { id: "residentes", label: "Residentes", href: "/admin/residentes" },
  { id: "pagos", label: "Pagos", href: "/admin/pagos" },
  { id: "mantenimiento", label: "Mantenimiento", href: "/admin/mantenimiento" },
  { id: "usuarios", label: "Usuarios", href: "/admin/usuarios" },
  { id: "roles", label: "Configurar roles", href: "/admin/roles" },
];

export function obtenerSeccionPorRuta(strPathname: string): SeccionId {
  const objCoincidencia = [...SECCIONES_NAV]
    .sort((a, b) => b.href.length - a.href.length)
    .find((seccion) => strPathname === seccion.href || strPathname.startsWith(`${seccion.href}/`));

  return objCoincidencia?.id ?? "panel";
}
