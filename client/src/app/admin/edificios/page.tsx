"use client";

import { GestorSeccion } from "@/components/GestorSeccion";
import { useSesionActual } from "@/lib/session";
import { normalizarRol } from "@/lib/permissions";

const CAMPOS = [
  { key: "nombre", label: "Edificio", placeholder: "Torre Norte" },
  { key: "direccion", label: "Dirección", placeholder: "Av. Siempre Viva 742" },
  { key: "unidades", label: "Unidades", placeholder: "24" },
];

const REGISTROS_INICIALES = [
  { id: "1", nombre: "Torre Norte", direccion: "Av. Siempre Viva 742", unidades: "24" },
  { id: "2", nombre: "Torre Sur", direccion: "Calle Los Pinos 88", unidades: "18" },
  { id: "3", nombre: "Torre Este", direccion: "Av. Libertad 310", unidades: "30" },
];

export default function EdificiosPage() {
  const { usuario } = useSesionActual();
  const rol = normalizarRol(usuario?.rol ?? "CONSULTA");

  return (
    <div className="px-6 py-6">
      <p className="mb-6 text-[13px] leading-[1.45] text-muted-foreground">
        Edificios administrados por el sistema.
      </p>

      <GestorSeccion rol={rol} seccion="edificios" campos={CAMPOS} registrosIniciales={REGISTROS_INICIALES} />
    </div>
  );
}
