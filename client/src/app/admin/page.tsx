"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
}

const navItems = [
  { label: "Panel principal", active: true },
  { label: "Edificios", active: false },
  { label: "Residentes", active: false },
  { label: "Pagos", active: false },
  { label: "Mantenimiento", active: false },
  { label: "Configuración", active: false },
];

const kpis = [
  { label: "Edificios activos", value: "12", trend: "+2 este mes", trendType: "success" as const },
  {
    label: "Residentes registrados",
    value: "1,284",
    trend: "+48 este mes",
    trendType: "success" as const,
    accent: "secondary" as const,
  },
  { label: "Ingresos del mes", value: "$48,920.00", trend: "+8.4% vs. anterior", trendType: "success" as const },
  { label: "Pagos pendientes", value: "36", trend: "-6 esta semana", trendType: "danger" as const },
];

const recentPayments = [
  {
    resident: "María Fernanda Rojas",
    unit: "Torre Norte · 4B",
    amount: "$450.00",
    status: "Pagado",
    date: "10 sep 2026",
  },
  {
    resident: "Carlos Iván Suárez",
    unit: "Torre Sur · 12A",
    amount: "$380.00",
    status: "Pendiente",
    date: "09 sep 2026",
  },
  {
    resident: "Lucía Andrea Paz",
    unit: "Torre Norte · 7C",
    amount: "$450.00",
    status: "Pagado",
    date: "09 sep 2026",
  },
  {
    resident: "Jorge Alejandro Quispe",
    unit: "Torre Este · 3D",
    amount: "$410.00",
    status: "Vencido",
    date: "05 sep 2026",
  },
  {
    resident: "Daniela Ibáñez",
    unit: "Torre Sur · 9B",
    amount: "$450.00",
    status: "Pagado",
    date: "04 sep 2026",
  },
];

const statusStyles: Record<string, string> = {
  Pagado: "bg-success-subtle text-success",
  Pendiente: "bg-muted text-muted-foreground",
  Vencido: "bg-danger-subtle text-destructive",
};

function formatRol(strRol: string) {
  switch (strRol) {
    case "ROL_1":
    case "ADMINISTRADOR":
      return "Administrador";

    case "DIRECTORIO":
      return "Directorio";

    case "CONSULTA":
      return "Consulta";

    default:
      return strRol;
  }
}

/**
 * Obtiene el usuario almacenado en localStorage.
 */
function getUsuarioSnapshot(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("usuario");
}

/**
 * Snapshot utilizado durante el renderizado del servidor.
 */
function getUsuarioServerSnapshot(): string | null {
  return null;
}

/**
 * Permite detectar cambios realizados en localStorage.
 */
function subscribeToStorage(
  callback: () => void
): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener("storage", callback);
  };
}

export default function AdminPanelPage() {
  const router = useRouter();

  const strUsuario = useSyncExternalStore(
    subscribeToStorage,
    getUsuarioSnapshot,
    getUsuarioServerSnapshot
  );

  let objUsuario: Usuario | null = null;

  if (strUsuario) {
    try {
      objUsuario = JSON.parse(strUsuario) as Usuario;
    } catch (error: unknown) {
      console.error(
        "Error al leer los datos del usuario:",
        error
      );
    }
  }

  useEffect(() => {
    const strToken = localStorage.getItem("token");

    if (!strToken || !strUsuario) {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");

      router.replace("/login");
    }
  }, [strUsuario, router]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    router.replace("/login");
  }

  if (!objUsuario) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-[14px] text-muted-foreground">
          Cargando panel...
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col justify-between border-r border-sidebar-border bg-sidebar px-4 py-6 lg:flex">
        <div>
          {/* Marca */}
          <div className="mb-8 flex items-center gap-2.5 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-[13px] font-bold text-sidebar-primary-foreground">
              E
            </div>
            <span className="font-subtitle text-[14px] font-semibold leading-[1.3] tracking-[-0.005em] text-sidebar-foreground">
              Edificio Admin
            </span>
          </div>

          {/* Navegación */}
          <nav className="flex flex-col gap-0.5">
            {navItems.map((item) => (
              <a
                key={item.label}
                href="#"
                className={`font-subtitle flex h-9 items-center rounded-lg px-3 text-[14px] font-medium leading-[1.3] tracking-[-0.005em] transition-colors ${
                  item.active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="rounded-lg border border-sidebar-border px-2.5 py-2">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 shrink-0 rounded-full bg-sidebar-accent" />
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium leading-[1.3] text-sidebar-foreground">
                {objUsuario.nombre} {objUsuario.apellido}
              </p>
              <p className="font-caption truncate text-[11px] leading-[1.3] tracking-[0.01em] text-sidebar-foreground/60">
                {formatRol(objUsuario.rol)}
              </p>
            </div>
          </div>

          {/* Cerrar sesión */}
          <button
            type="button"
            onClick={handleLogout}
            className="mt-2 flex h-9 w-full items-center justify-center rounded-lg border border-sidebar-border text-[13px] font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="flex flex-1 flex-col">
        {/* Topbar */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
          <h1 className="font-title text-[20px] font-bold leading-[1.2] tracking-[-0.015em] text-foreground">
            Panel principal
          </h1>

          <div className="flex items-center gap-3">
            <input
              type="search"
              placeholder="Buscar..."
              className="hidden h-9 w-56 rounded-lg border border-input bg-background px-3 text-[13px] text-foreground outline-none placeholder:text-muted-foreground focus:border-primary sm:block"
            />

            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-muted"
              aria-label="Notificaciones"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.73 21a2 2 0 0 1-3.46 0"
                />
              </svg>
            </button>
            <div className="h-9 w-9 rounded-full bg-muted" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-6">
          <p className="mb-6 text-[13px] leading-[1.45] text-muted-foreground">
            Resumen general de la operación del sistema.
          </p>

          {/* KPI cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="rounded-2xl border border-border bg-card p-5">
                <p className="font-caption text-[11px] font-medium uppercase leading-[1.3] tracking-[0.01em] text-muted-foreground">
                  {kpi.label}
                </p>
                <p
                  className={`font-title mt-2 text-[26px] font-bold leading-[1.2] tracking-[-0.015em] tabular-nums ${
                    kpi.accent === "secondary" ? "text-accent-secondary" : "text-foreground"
                  }`}
                >
                  {kpi.value}
                </p>

                <p
                  className={`font-caption mt-1 text-[12px] font-medium leading-[1.3] ${
                    kpi.trendType === "success" ? "text-success" : "text-destructive"
                  }`}
                >
                  {kpi.trend}
                </p>
              </div>
            ))}
          </div>

          {/* Tabla */}
          <div className="mt-6 rounded-2xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="font-subtitle text-[15px] font-semibold leading-[1.3] tracking-[-0.005em] text-foreground">
                Pagos recientes
              </h2>

              <a
                href="#"
                className="font-caption text-[12px] font-medium leading-[1.3] tracking-[0.01em] text-primary hover:text-primary/80"
              >
                Ver todos
              </a>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="font-caption px-5 py-2.5 text-left text-[11px] font-medium uppercase leading-[1.3] tracking-[0.01em] text-muted-foreground">
                      Residente
                    </th>
                    <th className="font-caption px-5 py-2.5 text-left text-[11px] font-medium uppercase leading-[1.3] tracking-[0.01em] text-muted-foreground">
                      Unidad
                    </th>
                    <th className="font-caption px-5 py-2.5 text-left text-[11px] font-medium uppercase leading-[1.3] tracking-[0.01em] text-muted-foreground">
                      Monto
                    </th>
                    <th className="font-caption px-5 py-2.5 text-left text-[11px] font-medium uppercase leading-[1.3] tracking-[0.01em] text-muted-foreground">
                      Estado
                    </th>
                    <th className="font-caption px-5 py-2.5 text-left text-[11px] font-medium uppercase leading-[1.3] tracking-[0.01em] text-muted-foreground">
                      Fecha
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {recentPayments.map((row) => (
                    <tr key={row.resident} className="border-b border-border last:border-0">
                      <td className="px-5 py-3 text-[13px] leading-[1.45] text-foreground">{row.resident}</td>
                      <td className="px-5 py-3 text-[13px] leading-[1.45] text-muted-foreground">{row.unit}</td>
                      <td className="px-5 py-3 text-[13px] leading-[1.45] text-foreground tabular-nums">
                        {row.amount}
                      </td>

                      <td className="px-5 py-3">
                        <span
                          className={`font-caption inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium leading-[1.3] ${
                            statusStyles[row.status]
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="font-caption px-5 py-3 text-[12px] leading-[1.3] tracking-[0.01em] text-muted-foreground">
                        {row.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}