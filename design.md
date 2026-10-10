# Sistema de Diseño Visual · Velinex UI Standard

> **Propósito:** Directivas de diseño para que el modelo de IA y el `@design-agent` generen interfaces con nivel de producto digital comercial moderno.

---

## 1. Filosofía y Estética General

- **Estilo:** Dark Mode cinematográfico de alto contraste, minimalista y limpio.
- **Atmósfera:** Inspirada en dashboards financieros y analítica SaaS moderna (estilo Dribbble / Linear / Vercel).
- **Consistencia Visual:** Seguir como referencia fotográfica y de maquetado las capturas alojadas en `design_inspo/`.

---

## 2. Paleta Cromática Oficial

| Elemento | Token / Hex | Propósito |
| :--- | :--- | :--- |
| **Background Principal** | `#0b0f17` | Fondo general de la aplicación |
| **Card / Surface Background** | `#111827` / `#0f172a` | Fondo de tarjetas y paneles con sutil gradiente |
| **Card Border** | `rgba(255, 255, 255, 0.08)` | Bordes ultra-delgados con brillo tenue |
| **Acento Primario (Call to Action)** | `#10b981` (Verde Esmeralda) | Botones primarios, indicadores positivos y métricas clave |
| **Acento Secundario** | `#38bdf8` (Azul Cielo Eléctrico) | Gráficos de proyección y estados informativos |
| **Texto Primario** | `#f8fafc` | Títulos y cifras numéricas destacadas |
| **Texto Secundario / Muted** | `#94a3b8` | Subtítulos, labels y descripciones de apoyo |
| **Alerta / Negativo** | `#ef4444` | Alertas de riesgo, pérdidas o cancelaciones |

---

## 3. Tipografía

- **Familia Primaria:** `Inter`, `system-ui`, sans-serif.
- **Títulos (Headings):** Semibold a Bold (`font-semibold` / `font-bold`), tracking levemente ajustado (`tracking-tight`).
- **Cifras de Métricas (KPIs):** Monospace o sans-serif bold de gran escala (`text-3xl font-bold tracking-tight`).
- **Cuerpo:** Regular a Medium (`text-sm text-slate-400`).

---

## 4. Componentes y Layout

- **Tarjetas (Cards):** Bordes redondeados `rounded-2xl`, padding espacioso `p-6`, fondo semitransparente con `backdrop-blur-md` y sombra sutil `shadow-lg shadow-black/40`.
- **Botones:** `rounded-xl`, transición suave `transition-all duration-200`, estados hover luminosos sin saturar.
- **Gráficos:** Curvas suaves (monotone), áreas degradadas con opacidad decreciente hacia la base.
