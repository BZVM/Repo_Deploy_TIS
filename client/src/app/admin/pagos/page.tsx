"use client";

import { GestorSeccion } from "@/components/GestorSeccion";
import { useSesionActual } from "@/lib/session";
import { normalizarRol } from "@/lib/permissions";

const CAMPOS = [
  { key: "residente", label: "Residente", placeholder: "María Fernanda Rojas" },
  { key: "unidad", label: "Unidad", placeholder: "Torre Norte · 4B" },
  { key: "monto", label: "Monto", placeholder: "$450.00" },
  { key: "estado", label: "Estado", placeholder: "Pagado" },
];

const REGISTROS_INICIALES = [
  { id: "1", residente: "María Fernanda Rojas", unidad: "Torre Norte · 4B", monto: "$450.00", estado: "Pagado" },
  { id: "2", residente: "Carlos Iván Suárez", unidad: "Torre Sur · 12A", monto: "$380.00", estado: "Pendiente" },
  { id: "3", residente: "Jorge Alejandro Quispe", unidad: "Torre Este · 3D", monto: "$410.00", estado: "Vencido" },
];


export default function PagosPage() {
  const { usuario } = useSesionActual();
  const rol = normalizarRol(usuario?.rol ?? "CONSULTA");

  return (
    <div className="px-6 py-6">
      <p className="mb-6 text-[13px] leading-[1.45] text-muted-foreground">
        Registro de pagos y cobros del sistema.
      </p>

      <GestorSeccion rol={rol} seccion="pagos" campos={CAMPOS} registrosIniciales={REGISTROS_INICIALES} />
    </div>
  );
}
