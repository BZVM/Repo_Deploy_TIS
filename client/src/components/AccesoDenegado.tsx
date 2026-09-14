import Link from "next/link";
import { MENSAJE_ACCESO_DENEGADO_SECCION } from "@/lib/permissions";

interface AccesoDenegadoProps {
  mensaje?: string;
}

export function AccesoDenegado({ mensaje }: AccesoDenegadoProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-1 flex-col items-center justify-center gap-4 px-6 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-danger-subtle text-destructive">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m0 3.75h.008M10.29 3.86 1.82 18a1.5 1.5 0 0 0 1.29 2.25h17.78A1.5 1.5 0 0 0 22.18 18L13.71 3.86a1.5 1.5 0 0 0-2.42 0Z"
          />
        </svg>
      </div>

      <div>
        <h2 className="font-title text-[20px] font-bold leading-[1.2] tracking-[-0.015em] text-foreground">
          Acceso denegado
        </h2>
        <p className="mt-1 max-w-sm text-[14px] leading-[1.5] text-muted-foreground">
          {mensaje ?? MENSAJE_ACCESO_DENEGADO_SECCION}
        </p>
      </div>

      <Link
        href="/admin"
        className="mt-2 flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Volver al panel principal
      </Link>
    </div>
  );
}
