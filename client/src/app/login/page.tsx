"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
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

  function handleTestAdminLogin() {
    localStorage.setItem("token", "token-test-local");
    localStorage.setItem(
      "usuario",
      JSON.stringify({
        id: "test-admin",
        nombre: "Admin",
        apellido: "Test",
        email: "admin.test@local.dev",
        rol: "ADMINISTRADOR",
      } satisfies Usuario)
    );

    router.push("/admin");
  }

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

      // Redirigimos al dashboard
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
            "Tu usuario no tiene acceso al sistema."
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
    <div className="flex min-h-screen flex-1 items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm">

        {/* Marca */}
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-[15px] font-bold text-primary-foreground">
            E
          </div>

          <div>
            <h1 className="font-title text-[22px] font-bold leading-[1.2] tracking-[-0.015em] text-foreground">
              Bienvenido de nuevo
            </h1>
            <p className="font-subtitle mt-1 text-[14px] font-semibold leading-[1.3] tracking-[-0.005em] text-muted-foreground">
              Ingresa tus credenciales para acceder al panel
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border bg-card p-8">
          <form className="flex flex-col gap-5" onSubmit={handleLogin}>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-[13px] font-medium leading-[1.3] tracking-[-0.005em] text-foreground"
              >
                Correo electrónico
              </label>

              <input
                id="email"
                type="email"
                placeholder="nombre@empresa.com"
                value={strEmail}
                onChange={(event) => setStrEmail(event.target.value)}
                required
                className="h-11 rounded-lg border border-input bg-background px-3.5 text-[14px] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/15"
              />
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

                <a
                  href="#"
                  className="font-caption text-[12px] leading-[1.3] tracking-[0.01em] text-primary hover:text-primary/80"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={strPassword}
                onChange={(event) => setStrPassword(event.target.value)}
                required
                className="h-11 rounded-lg border border-input bg-background px-3.5 text-[14px] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/15"
              />
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
              <div className="rounded-lg border border-destructive/20 bg-danger-subtle px-3 py-2 text-[13px] text-destructive">
                {strError}
              </div>
            )}

            {/* Botón login */}
            <button
              type="submit"
              disabled={bolLoading}
              className="mt-1 flex h-11 items-center justify-center rounded-lg bg-primary text-[14px] font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {bolLoading
                ? "Iniciando sesión..."
                : "Iniciar sesión"}
            </button>
          </form>

          {/* Separador */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />

            <span className="font-caption text-[11px] uppercase leading-[1.3] tracking-[0.01em] text-muted-foreground">
              o continúa con
            </span>

            <div className="h-px flex-1 bg-border" />
          </div>

          {/* SSO */}
          <button
            type="button"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-input text-[14px] font-medium text-foreground transition-colors hover:bg-muted"
          >
            Continuar con SSO corporativo
          </button>

          {/* Acceso provisional para desarrollo local — no se muestra en producción */}
          {process.env.NODE_ENV !== "production" && (
            <div className="mt-4 rounded-lg border border-dashed border-muted-foreground/30 p-3">
              <p className="font-caption mb-2 text-center text-[11px] uppercase leading-[1.3] tracking-[0.01em] text-muted-foreground">
                Solo desarrollo local
              </p>
              <button
                type="button"
                onClick={handleTestAdminLogin}
                className="flex h-10 w-full items-center justify-center rounded-lg border border-muted-foreground/30 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-muted"
              >
                Ingresar como admin TEST
              </button>
            </div>
          )}
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
  );
}