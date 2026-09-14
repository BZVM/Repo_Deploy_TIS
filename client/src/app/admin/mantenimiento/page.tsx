"use client";

import { GestorSeccion } from "@/components/GestorSeccion";
import { useSesionActual } from "@/lib/session";
import { normalizarRol } from "@/lib/permissions";

const CAMPOS = [
  { key: "titulo", label: "Solicitud", placeholder: "Fuga de agua" },
  { key: "unidad", label: "Unidad", placeholder: "Torre Sur · 9B" },
  { key: "estado", label: "Estado", placeholder: "Pendiente" },
];

const REGISTROS_INICIALES = [
  { id: "1", titulo: "Fuga de agua", unidad: "Torre Sur · 9B", estado: "En proceso" },
  { id: "2", titulo: "Ascensor fuera de servicio", unidad: "Torre Norte", estado: "Pendiente" },
  { id: "3", titulo: "Luminaria del pasillo", unidad: "Torre Este · 3D", estado: "Resuelto" },
];

export default function MantenimientoPage() {
  const { usuario } = useSesionActual();
  const rol = normalizarRol(usuario?.rol ?? "CONSULTA");

  return (
    <div className="px-6 py-6">
      <p className="mb-6 text-[13px] leading-[1.45] text-muted-foreground">
        Solicitudes de mantenimiento reportadas.
      </p>

      <GestorSeccion rol={rol} seccion="mantenimiento" campos={CAMPOS} registrosIniciales={REGISTROS_INICIALES} />
    </div>
  );
}
