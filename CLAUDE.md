# CLAUDE.md: financial-stream-dashboard-core

Este archivo es el manual operativo central que Claude lee al iniciar cualquier sesion en este repositorio. Define las reglas de ejecucion, estandares de ingenieria y directivas de ahorro maximo de tokens para este dashboard financiero de alto rendimiento.

---

## 1. Directivas Globales de Ejecucion ("Dangerously Mode")

1. **Modo 100% Autonomo Permanente**:
   - Trabajar de forma continua y sin interrupciones de 0 a 100 hasta completar la aplicacion y sus componentes.
   - Prohibido detenerse a pedir confirmaciones, aclaraciones, aprobaciones o permisos intermedios.
   - Resolver cualquier ambiguedad tecnica tomando de forma autonoma la decision estandar mas robusta y continuar de inmediato.
   - No narrar planes antes de ejecutar: ejecutar directamente las tool calls.

2. **Cero Stoppers e Interrupciones**:
   - Ante errores de TypeScript, linter, Tailwind o build de Next.js: inspeccionar la traza de error, corregir el codigo y reintentar de forma autonoma.
   - El agente nunca interrumpe el flujo. Solo al finalizar la ejecucion completa se documenta el estado final, los resultados y comandos de despliegue.

3. **Reglas Tipograficas y de Codigo Inquebrantables**:
   - **Prohibido el uso del guion largo (em dash)**: En todo comentario, texto, documentacion o codigo, utilizar unicamente guiones cortos "-", dos puntos o parentesis.
   - **TypeScript Estricto**: Cero uso de `any`. Toda prop de componente, hook, esquema de datos y server action debe estar tipada rigurosamente con Zod o tipos TypeScript exactos.
   - Usar `unknown`, tipos genericos o interfaces exactas en lugar de `any`.

---

## 2. Reglas de Ahorro Maximo de Tokens & Eficiencia

1. **Contexto y Lectura**:
   - Antes de modificar codigo: inspeccionar `package.json`, `tailwind.config.ts`, `components.json` y la estructura de componentes.
   - Leer solo lo estrictamente necesario con rangos de linea en archivos extensos.
   - No releer archivos que ya se leyeron en la sesion salvo que hayan cambiado.
   - Paralelizar tool calls independientes.

2. **Edicion Quirurgica**:
   - Modificar bloques precisos sobre reescritura masiva de paginas enteras.
   - Minimalismo: tres lineas repetidas es preferible a una abstraccion prematura.
   - Respetar la convencion de componentes de Shadcn UI y React Server Components (RSC).

3. **Comunicacion Directa (Cero Fluff)**:
   - Cero charla aduladora ("Excelente pregunta", "Entendido", "A continuacion presento").
   - Respuestas concisas, tecnicas y orientadas a resultados.
   - No imprimir fragmentos extensos de codigo en la conversacion si ya fueron aplicados al disco.

4. **Validacion Autonoma en Consola**:
   - Tras modificar codigo: ejecutar chequeos de tipos (`npx tsc --noEmit`) y build de produccion (`npm run build`) antes de dar por finalizada la tarea.
   - Correr comandos siempre en modo no interactivo (`-y`, `--yes`).

---

## 3. Arquitectura y Stack Tecnologico

- **Framework**: Next.js 15 (App Router) y React 19.
- **Lenguaje**: TypeScript 5.x (`strict: true`).
- **Estilos & UI**: Tailwind CSS v3/v4, Shadcn UI (Radix Primitives) y Lucide React.
- **Graficos**: Recharts / Tremor estilizado para streaming y escenarios interactivos.
- **IA & Streaming**: Server-Sent Events (SSE) y Vercel AI SDK (`ai/react`).
- **Validacion de Esquemas**: Zod v3.
- **Testing**: Vitest con React Testing Library.

---

## 4. Estructura de Directorios Estandar

```text
financial-stream-dashboard-core/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── copilot/
│   │   │       └── route.ts          # Endpoint SSE para streaming con Vercel AI SDK
│   │   ├── layout.tsx                # Root layout con proveedores de tema (Dark/Light)
│   │   ├── page.tsx                  # Dashboard principal con RSC y Suspense
│   │   └── globals.css
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── kpi-metric-card.tsx   # Card individual de KPI financiero
│   │   │   ├── streaming-metrics.tsx # Contenedor asincrono de metricas
│   │   │   ├── date-range-filter.tsx # Selector interactivo de periodo
│   │   │   └── scenario-selector.tsx # Switch entre Best, Base y Worst case
│   │   ├── charts/
│   │   │   ├── cashflow-projection.tsx # Grafico interactivo Recharts a 30/60/90 dias
│   │   │   └── burn-rate-breakdown.tsx # Desglose por categorias operativas
│   │   ├── ai-drawer/
│   │   │   ├── copilot-drawer.tsx    # Drawer lateral desplegable
│   │   │   ├── copilot-chat.tsx      # Chat con streaming progresivo de texto
│   │   │   └── anomaly-badge.tsx     # Alerta clickeable de anomalia financiera
│   │   └── ui/                       # Primitivas de Shadcn (button, card, dialog, drawer, etc.)
│   ├── lib/
│   │   ├── schemas.ts                # Esquemas Zod (KPIs, Cashflow, Transacciones)
│   │   ├── mock-engine.ts            # Generador deterministico de datos financieros
│   │   ├── financial-math.ts         # Calculo de runway, burn rate neto y proyecciones
│   │   └── utils.ts                  # Utilidades (cn para clases Tailwind)
│   └── types/
│       └── index.ts                  # Tipos TypeScript exportables
├── tests/
│   ├── financial-math.test.ts
│   ├── mock-engine.test.ts
│   └── kpi-metric-card.test.ts
├── CLAUDE.md                         # Manual operativo
├── PROMPT_CONSTRUCCION_END_TO_END.md # Prompt para desarrollo integral
├── ESPECIFICACION_TECNICA.md         # Blueprint tecnico y esquemas Zod
├── INVESTIGACION_Y_DISENO_SAAS.md    # Diseno UI/UX y benchmark SaaS
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md                         # Documentacion con demo en Vercel
```
