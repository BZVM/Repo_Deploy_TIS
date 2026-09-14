"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { api } from "@/lib/api";

interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
}

interface LoginResponse {
  token: string;
  usuario: Usuario;
}

export default function LoginPage() {
  const router = useRouter();

  const [strEmail, setStrEmail] = useState("");
  const [strPassword, setStrPassword] = useState("");
  const [strError, setStrError] = useState("");
  const [bolLoading, setBolLoading] = useState(false);
  const [bolShowPassword, setBolShowPassword] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setStrError("");
    setBolLoading(true);

    try {
      const response = await api.post<LoginResponse>(
        "/auth/login",
        {
        email: strEmail,
        password: strPassword,
      }
    );

      const { token, usuario } = response.data;

      // Guardamos el JWT
      localStorage.setItem("token", token);

      // Guardamos los datos del usuario
      localStorage.setItem(
        "usuario",
        JSON.stringify(usuario)
      );

      // La verificación en dos pasos queda deshabilitada temporalmente: aún no
      // hay backend/API para 2FA. Login correcto va directo al panel.
      router.push("/admin");
    } catch (error: unknown) {
      console.error("Error al iniciar sesión:", error);

      if (axios.isAxiosError(error)) {
        const intStatus = error.response?.status;

        if (intStatus === 401) {
          setStrError("Correo o contraseña incorrectos.");
        } else if (intStatus === 403) {
          setStrError("Tu usuario no tiene acceso al sistema.");
        } else if (intStatus === 500) {
          setStrError(
            "Error del servidor. Puede ser un problema de conexión con la base de datos — avisa al equipo de backend."
          );
        } else {
          setStrError(
            "No se pudo conectar con el servidor. Verifica que el backend esté funcionando."
          );
        }
      } else {
        setStrError(
          "Ocurrió un error inesperado. Intenta nuevamente."
        );
      }
    } finally {
      setBolLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Panel de marca — placeholder animado. Cuando lleguen el logo definitivo
          y la imagen/ilustración de fondo, reemplazan el bloque "E" y los blobs
          de gradiente sin tocar la estructura del layout. */}
      <div className="relative hidden w-1/2 shrink-0 overflow-hidden bg-linear-to-br from-primary/15 via-background to-accent-secondary/15 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-blob absolute -left-24 -top-24 h-96 w-96 rounded-full bg-primary/25 blur-3xl" />
          <div className="animate-blob absolute -right-16 top-1/3 h-80 w-80 rounded-full bg-accent-secondary/20 blur-3xl [animation-delay:4s]" />
          <div className="animate-blob absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-primary/15 blur-3xl [animation-delay:8s]" />
        </div>

        <div className="relative z-10 flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-[16px] font-bold text-primary-foreground shadow-lg shadow-primary/30">
            E
          </div>
          <span className="font-subtitle text-[15px] font-semibold leading-[1.3] tracking-[-0.005em] text-foreground">
            Edificio Admin
          </span>
        </div>

        <div className="relative z-10 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="font-title text-[34px] font-bold leading-[1.15] tracking-[-0.02em] text-foreground">
            Gestiona tu edificio desde un solo lugar
          </h2>
          <p className="mt-4 text-[15px] leading-[1.6] text-muted-foreground">
            Residentes, pagos y mantenimiento centralizados en un panel diseñado para administradores exigentes.
          </p>
        </div>

        <p className="font-caption relative z-10 text-[11px] uppercase leading-[1.3] tracking-[0.08em] text-muted-foreground">
          © 2026 Sistema Administración Edificio
        </p>
      </div>

      {/* Formulario */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Marca (solo en mobile/tablet, donde el panel izquierdo está oculto) */}
          <div className="mb-8 flex flex-col items-center gap-3 text-center lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-[15px] font-bold text-primary-foreground shadow-lg shadow-primary/30">
              E
            </div>
          </div>

          <div className="mb-8 text-center lg:text-left">
            <h1 className="font-title text-[22px] font-bold leading-[1.2] tracking-[-0.015em] text-foreground">
              Bienvenido de nuevo
            </h1>
            <p className="font-subtitle mt-1 text-[14px] font-semibold leading-[1.3] tracking-[-0.005em] text-muted-foreground">
              Ingresa tus credenciales para acceder al panel
            </p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-border bg-card p-8 shadow-xl shadow-black/4">
            <form className="flex flex-col gap-5" onSubmit={handleLogin}>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className="text-[13px] font-medium leading-[1.3] tracking-[-0.005em] text-foreground"
                >
                  Correo electrónico
                </label>

                <div className="relative">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 7.5 11.25 13a1.5 1.5 0 0 0 1.5 0L21 7.5M4.5 5.25h15A1.5 1.5 0 0 1 21 6.75v10.5a1.5 1.5 0 0 1-1.5 1.5h-15a1.5 1.5 0 0 1-1.5-1.5V6.75a1.5 1.5 0 0 1 1.5-1.5Z"
                    />
                  </svg>

                  <input
                    id="email"
                    type="email"
                    placeholder="nombre@empresa.com"
                    value={strEmail}
                    onChange={(event) => setStrEmail(event.target.value)}
                    required
                    className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-3.5 text-[14px] text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-primary focus:ring-4 focus:ring-primary/15"
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-[13px] font-medium leading-[1.3] tracking-[-0.005em] text-foreground"
                  >
                    Contraseña
                  </label>

                  <Link
                    href="/recuperar-password"
                    className="font-caption text-[12px] leading-[1.3] tracking-[0.01em] text-primary hover:text-primary/80"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                <div className="relative">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V7.5a4.5 4.5 0 1 0-9 0v3M6.75 10.5h10.5a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 1-1.5 1.5H6.75a1.5 1.5 0 0 1-1.5-1.5v-6a1.5 1.5 0 0 1 1.5-1.5Z"
                    />
                  </svg>

                  <input
                    id="password"
                    type={bolShowPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={strPassword}
                    onChange={(event) => setStrPassword(event.target.value)}
                    required
                    className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-10 text-[14px] text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-primary focus:ring-4 focus:ring-primary/15"
                  />

                  <button
                    type="button"
                    onClick={() => setBolShowPassword((bolValue) => !bolValue)}
                    aria-label={bolShowPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {bolShowPassword ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-4 w-4">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 0 0 1.5 12s3.75 7.5 10.5 7.5c1.61 0 3.09-.343 4.396-.94M6.228 6.228A10.45 10.45 0 0 1 12 4.5c6.75 0 10.5 7.5 10.5 7.5a10.522 10.522 0 0 1-4.293 4.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-4 w-4">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                        />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Recordarme */}
              <label className="flex items-center gap-2 text-[13px] leading-[1.4] text-foreground">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                />

                Recordarme en este dispositivo
              </label>

              {/* Error */}
              {strError && (
                <div className="animate-in fade-in slide-in-from-top-1 duration-300 rounded-lg border border-destructive/20 bg-danger-subtle px-3 py-2 text-[13px] text-destructive">
                  {strError}
                </div>
              )}

              {/* Botón login */}
              <button
                type="submit"
                disabled={bolLoading}
                className="mt-1 flex h-11 items-center justify-center gap-2 rounded-lg bg-primary text-[14px] font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-primary/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
              >
                {bolLoading && (
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 animate-spin">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={2.5} className="opacity-25" />
                    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" />
                  </svg>
                )}
                {bolLoading ? "Iniciando sesión..." : "Iniciar sesión"}
              </button>
            </form>
          </div>

          {/* Registro */}
          <p className="font-caption mt-6 text-center text-[12px] leading-[1.3] tracking-[0.01em] text-muted-foreground">
            ¿No tienes una cuenta?{" "}
            <a
              href="#"
              className="font-medium text-primary hover:text-primary/80"
            >
              Contacta a tu administrador
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
