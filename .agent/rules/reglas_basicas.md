# Reglas de Proyecto · Arquitectura y Estándares Técnicos

> **Ámbito:** Reglas locales de proyecto para Google Antigravity en `financial-stream-dashboard-core`.

---

## 1. Stack Tecnológico Mandatorio

- **Framework:** Next.js 15 con App Router (React 19).
- **Lenguaje:** TypeScript 5 en modo estricto (`strict: true`, prohibido el uso de tipo `any`).
- **Estilos:** Tailwind CSS v3 con directivas de Dark Mode persistente.
- **Iconografía:** Lucide React exclusivamente.
- **Gráficos:** Recharts con animaciones optimizadas.

---

## 2. Convenciones de Código y Arquitectura

1. **Estructura de Componentes:**
   - Server Components por defecto en `src/app/`.
   - Client Components marcados con `'use client'` únicamente cuando requieran estado o eventos interactivos.
2. **Diseño Visual:**
   - Obligatorio consultar `design.md` y las capturas de `design_inspo/` antes de crear o editar cualquier componente visual.
   - Prohibido introducir frameworks CSS externos o estilos inline arbitrarios.
3. **Manejo de Estados y Datos:**
   - Validar contratos de datos siempre con esquemas Zod en `src/lib/schemas/`.
   - Conexiones a backend ejecutadas mediante endpoints seguros o consultas Supabase vía MCP.

---

## 3. Comportamiento en Consola y Ejecución

- Ejecutar siempre comandos en modo no interactivo (`-y`, `--yes`).
- Antes de declarar completada una tarea, verificar que `npx tsc --noEmit` o los tests pasen sin advertencias.
- Prohibido el uso del guion largo en comentarios o documentación técnica; usar siempre guion corto "-", dos puntos o comas.
