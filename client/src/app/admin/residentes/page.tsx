"use client";

import { GestorSeccion } from "@/components/GestorSeccion";
import { useSesionActual } from "@/lib/session";
import { normalizarRol } from "@/lib/permissions";

const CAMPOS = [
  { key: "nombre", label: "Residente", placeholder: "María Fernanda Rojas" },
  { key: "unidad", label: "Unidad", placeholder: "Torre Norte · 4B" },
  { key: "contacto", label: "Contacto", placeholder: "correo o teléfono" },
];

const REGISTROS_INICIALES = [
  { id: "1", nombre: "María Fernanda Rojas", unidad: "Torre Norte · 4B", contacto: "maria.rojas@correo.com" },
  { id: "2", nombre: "Carlos Iván Suárez", unidad: "Torre Sur · 12A", contacto: "carlos.suarez@correo.com" },
  { id: "3", nombre: "Lucía Andrea Paz", unidad: "Torre Norte · 7C", contacto: "lucia.paz@correo.com" },
];


export default function ResidentesPage() {
  const { usuario } = useSesionActual();
  const rol = normalizarRol(usuario?.rol ?? "CONSULTA");

  return (
    <div className="px-6 py-6">
      <p className="mb-6 text-[13px] leading-[1.45] text-muted-foreground">
        Residentes registrados en el sistema.
      </p>

      <GestorSeccion rol={rol} seccion="residentes" campos={CAMPOS} registrosIniciales={REGISTROS_INICIALES} />
    </div>
  );
}
