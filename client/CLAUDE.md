@AGENTS.md

## Tipografía — regla del proyecto

Familia oficial: **TT Interphases Pro**, autoalojada vía `next/font/local` en
[src/app/fonts.ts](src/app/fonts.ts) (archivos `.ttf` en `src/app/fonts/`). No usar otras
familias tipográficas ni pesos fuera de esta jerarquía sin actualizar ese archivo primero.

`--font-sans` (el default del body en todo el proyecto) apunta a Texto General.

| Token Tailwind | Archivo fuente | Peso | Tamaño | Line-height | Tracking | Uso |
|---|---|---|---|---|---|---|
| `font-title` | Black / Black Italic | 700 | 18-28px | 120% | -1.5% | H1 de vista activa, modales críticos, cifras de tarjetas KPI, Hero |
| `font-subtitle` | Mono Bold / Mono Italic | 600 (o 500) | 14-16px | 130% | -0.5% | Encabezados de tarjetas/widgets, agrupadores de formularios, tabs activos |
| `font-body` (= `font-sans`) | Light / Light Italic | 400 | 13-14px | 140-150% | 0% | Tablas, inputs, botones, párrafos, navegación — estilo por defecto |
| `font-caption` | Thin / Thin Italic | 500\* (o 300) | 11-12px | 130% | +1% | Headers de tabla, timestamps, texto de ayuda, badges, footer |

**Regla: `font-subtitle` siempre se ve en MAYÚSCULAS**, sin importar cómo esté escrito el
texto en el código (`text-transform: uppercase` forzado en la propia utilidad, ver
`globals.css`). No usar la clase `lowercase` ni `capitalize` para revertir esto.

**Regla de legibilidad — `font-caption`:** el corte "Thin" tiene trazos muy delgados que se
vuelven difíciles de leer en 11-12px. Por eso la utilidad fuerza `font-weight: 500`\* (el
navegador aplica negrita sintética sobre el Thin) en vez del 400 original, y `text-muted-foreground`
se ajustó de Zinc 500 a **Zinc 600** (ver tabla de colores) para subir el contraste de
~4.8:1 a ~7.7:1. No usar `font-thin`/`font-normal` para revertir el peso de `font-caption`.

Regla: solo debe existir un H1 (`font-title`) visible por pantalla.

## Colores — regla del proyecto

Sistema de color oficial, definido en [src/app/globals.css](src/app/globals.css) como variables
shadcn (`:root` / `.dark`) y tokens extra en `@theme inline`. No usar valores hexadecimales
sueltos en componentes: siempre a través de estas clases de Tailwind.

**El sistema entero se ve en modo oscuro por defecto.** La clase `dark` está fija en `<html>`
([layout.tsx](src/app/layout.tsx)) — no hay toggle claro/oscuro todavía. `:root` conserva la
paleta clara original como base/fallback para si en el futuro se agrega un selector de tema.

| Clase Tailwind | Uso | Modo claro (`:root`) | Modo oscuro (`.dark`, activo) |
|---|---|---|---|
| `bg-background` | Fondo general (canvas) | Zinc 100 `#F4F4F5` | Zinc 950 `#09090B` |
| `bg-sidebar` | Panel de navegación lateral | Zinc 900 `#18181B` | Zinc 950 `#09090B` |
| `bg-card` | Tarjetas, gráficos, celdas de tabla | White `#FFFFFF` | Zinc 900 `#18181B` (un escalón más claro que el canvas → elevación) |
| `border-border` / `border-sidebar-border` | Bordes, divisores | Zinc 200 `#E4E4E7` | Zinc 800 `#27272A` |
| `text-foreground` | Títulos, datos clave, cifras KPI | Zinc 950 `#09090B` | Zinc 50 `#FAFAFA` |
| `text-muted-foreground` | Subtítulos, labels, headers de columna | Zinc 600 `#52525B` | Zinc 300 `#D4D4D8` |
| `bg-primary` / `text-primary` / `bg-sidebar-primary` | Botones primarios, píldora del menú activo | Teal 600 `#0D9488` | Teal 600 `#0D9488` (sin cambio) |
| `text-accent-secondary` / `bg-accent-secondary` | Acento para métricas de conteo (ej. total de copropietarios) | Indigo 600 `#4F46E5` | Indigo 600 `#4F46E5` (sin cambio) |
| `text-success` + `bg-success-subtle` | Montos positivos, alzas, badge "Completado" | Emerald 600 `#059669` + Emerald 100 `#D1FAE5` | Emerald 600 `#059669` (sin cambio) + Emerald 600 al 18% de opacidad |
| `text-destructive` + `bg-danger-subtle` | Gastos, morosidad, alertas | Rose 600 `#E11D48` + Rose 100 `#FFE4E6` | **Rose 500** `#F43F5E`\*\* + Rose 500 al 18% de opacidad |

Regla: no introducir colores fuera de esta paleta sin actualizar primero esta tabla y `globals.css`.

\* Ajustado sobre el valor original (Zinc 500 `#71717A`) por un problema de legibilidad: el
corte Thin de la tipografía combinado con Zinc 500 en 11-12px daba un contraste de apenas
~4.8:1 (mínimo AA), difícil de leer. Zinc 600/Zinc 300 mantienen ~7-12:1 en ambos modos.

\*\* Rose 600 sobre el canvas oscuro (Zinc 950) da solo ~4.2:1 de contraste como texto — por
debajo del mínimo AA (4.5:1). Se usa Rose 500 en `.dark` para subir a ~5.4:1. Los badges
"sutiles" (`*-subtle`) usan el color saturado en baja opacidad en vez del pastel claro, que se
vería fuera de lugar sobre fondos oscuros.
