interface AlertaPermisoProps {
  mensaje: string;
}

export function AlertaPermiso({ mensaje }: AlertaPermisoProps) {
  return (
    <div className="animate-in fade-in slide-in-from-top-1 duration-300 mb-4 flex items-start gap-2 rounded-lg border border-destructive/20 bg-danger-subtle px-3.5 py-2.5 text-[13px] text-destructive">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="mt-0.5 h-4 w-4 shrink-0">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m0 3.75h.008M10.29 3.86 1.82 18a1.5 1.5 0 0 0 1.29 2.25h17.78A1.5 1.5 0 0 0 22.18 18L13.71 3.86a1.5 1.5 0 0 0-2.42 0Z"
        />
      </svg>
      <span>{mensaje}</span>
    </div>
  );
}
