"use client";

import { useSyncExternalStore } from "react";

export interface UsuarioSesion {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
}

function getUsuarioSnapshot(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("usuario");
}

function getTokenSnapshot(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("token");
}

function getServerSnapshot(): string | null {
  return null;
}

function subscribeToStorage(callback: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener("storage", callback);
  };
}

export function useSesionActual(): { usuario: UsuarioSesion | null; strToken: string | null } {
  const strUsuarioRaw = useSyncExternalStore(subscribeToStorage, getUsuarioSnapshot, getServerSnapshot);
  const strToken = useSyncExternalStore(subscribeToStorage, getTokenSnapshot, getServerSnapshot);

  let usuario: UsuarioSesion | null = null;

  if (strUsuarioRaw) {
    try {
      usuario = JSON.parse(strUsuarioRaw) as UsuarioSesion;
    } catch (error: unknown) {
      console.error("Error al leer los datos del usuario:", error);
    }
  }

  return { usuario, strToken };
}

export function cerrarSesion() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
}
