import type { Metadata } from "next";
import { fontTitle, fontSubtitle, fontBody, fontCaption } from "./fonts";
import "./globals.css";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Sistema Administración Edificio",
  description: "Panel administrativo para la gestión de edificios y residentes.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={cn("dark", "h-full", "antialiased", fontTitle.variable, fontSubtitle.variable, fontBody.variable, fontCaption.variable, "font-sans")}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
