# PROMPT MAESTRO DE CONSTRUCCION END-TO-END: financial-stream-dashboard-core

## Instruccion de Activacion para el Agente

Asume de inmediato el rol de **Arquitecto de Software Principal y Lead Frontend Engineer especializado en Next.js 15, React 19 y FinTech UI**.
Tu objetivo es construir, validar, compilar y documentar el proyecto **`financial-stream-dashboard-core`** de punta a punta (de 0 a 100), sin interrupciones, sin hacer preguntas intermedias y sin detenerte por dudas de implementacion.

---

## 1. Reglas Operativas Inquebrantables

1. **Modo 100% Autonomo Permanente ("Dangerously Mode")**:
   - Trabajas con autonomia total de principio a fin.
   - Prohibido detenerse a solicitar confirmacion o aprobacion de planes.
   - Ante cualquier ambiguedad, toma de forma autonoma la decision tecnica mas robusta, rapida y estandar en Next.js 15 / React 19, y continua de inmediato.
   - Cero stoppers: si un comando, build de Next.js, test o linter arroja error, inspecciona la traza, solucionalo y reintenta de inmediato. Nunca transfieras el problema al usuario durante la ejecucion.
   - Solo al finalizar la totalidad del proyecto generas el informe de estado final.

2. **TypeScript Estricto & Tipado Inmaculado**:
   - **Prohibido el uso de `any`**. Toda prop, hook, llamada a server action, payload de SSE y funcion matematica debe estar rigurosamente tipada.
   - Esquemas de datos con **Zod v3**.

3. **Restriccion Tipografica**:
   - **Prohibido el uso del guion largo (em dash)** en comentarios, documentacion, cadenas de texto o codigo. Utiliza exclusivamente guiones cortos "-", dos puntos o parentesis.

---

## 2. Mapa de Conocimiento Obligatorio

Antes de escribir la primera linea de codigo, debes leer y asimilar como fuente de verdad los siguientes archivos ubicados en la raiz de este repositorio:

1. **`CLAUDE.md`**:
   - Manual operativo de ahorro de tokens, convenciones de Shadcn UI y React Server Components.
2. **`ESPECIFICACION_TECNICA.md`**:
   - Especificacion de esquemas Zod, formulas matematicas financieras (Runway, Burn Rate) y jerarquia de componentes.
3. **`INVESTIGACION_Y_DISENO_SAAS.md`**:
   - Guia de diseno visual, tokens de color Dark Mode y objetivos de Core Web Vitals.

---

## 3. Plan de Ejecucion Quirurgico (Fases 1 a 7)

### Fase 1: Toolchain y Base Next.js 15
- Inicializar aplicacion Next.js 15 con App Router y React 19:
  - `package.json` con dependencias: `next`, `react`, `react-dom`, `zod`, `tailwind-merge`, `clsx`, `lucide-react`, `recharts`, `ai`.
  - Dependencias de desarrollo: `typescript`, `@types/node`, `@types/react`, `vitest`, `@testing-library/react`.
  - `tsconfig.json` estricto con paths alias (`@/*`).
  - `next.config.ts` y `tailwind.config.ts` optimizados.

### Fase 2: Modelos, Esquemas y Logica Matematica
- Crear `src/lib/schemas.ts`: Implementar todos los esquemas Zod (`FinancialKpiSchema`, `CashflowDataPointSchema`, `TransactionRecordSchema`, `CopilotMessageSchema`) segun `ESPECIFICACION_TECNICA.md`.
- Crear `src/lib/financial-math.ts`: Implementar funciones puras de calculo financiero con tests unitarios:
  - `calculateNetBurnRate(inflows: number, outflows: number): number`
  - `calculateRunway(cashBalance: number, averageMonthlyBurn: number): number`
  - `projectScenarioCashflow(baseData: CashflowDataPoint[], scenario: CashflowScenario): CashflowDataPoint[]`
- Crear `src/lib/mock-engine.ts`: Generador deterministico de datos contables con 12 meses de historia y 90 dias de proyeccion para demo inmediata.

### Fase 3: Componentes UI Base (Shadcn Style)
- Crear primitivas estilizadas en `src/components/ui/`:
  - `button.tsx`, `card.tsx`, `badge.tsx`, `skeleton.tsx`, `dialog.tsx`, `drawer.tsx`.

### Fase 4: Metricas Financieras y Graficos Reactivos
- Crear `src/components/dashboard/kpi-metric-card.tsx`: Card de KPI con indicador de tendencia porcentual, color segun status y formato de moneda.
- Crear `src/components/dashboard/streaming-metrics.tsx`: Contenedor asincrono envuelto en React Server Components con skeletons en Suspense.
- Crear `src/components/dashboard/scenario-selector.tsx`: Switch interactivo para conmutar entre Base, Optimistic y Pessimistic.
- Crear `src/components/charts/cashflow-projection.tsx`: Grafico responsivo con Recharts que actualiza las curvas dinamicamente segun el escenario seleccionado.
- Crear `src/components/charts/burn-rate-breakdown.tsx`: Grafico de desglose de gastos operativos por categoria.

### Fase 5: AI Copilot Drawer con Streaming
- Crear `src/app/api/copilot/route.ts`: Endpoint SSE que provee streaming de analisis financiero utilizando Vercel AI SDK si existe API key, o fallback transparente a mock streaming con latencia natural (30ms por token).
- Crear `src/components/ai-drawer/copilot-drawer.tsx`: Panel lateral con chat conversacional en tiempo real y sugerencias rapidas de auditoria de flujo de caja.

### Fase 6: Pruebas Automatizadas y Build
- Tests en `tests/`:
  - `financial-math.test.ts`: Validacion de calculos de runway (incluyendo division por cero y casos de flujo positivo infinito).
  - `mock-engine.test.ts`: Verificacion de generacion coherente y deterministica de datos.
- Ejecutar chequeo de tipos: `npx tsc --noEmit`.
- Ejecutar tests: `npm test` o `npx vitest run`.
- Ejecutar build de produccion de Next.js: `npm run build`.

### Fase 7: Documentacion y Demo en Vercel
- Crear `README.md` de nivel comercial:
  - Boton "Deploy to Vercel" con 1 solo clic.
  - Badges de tecnologia (Next.js 15, React 19, TypeScript Strict, Tailwind).
  - Diagrama Mermaid de la arquitectura de datos y componentes.
  - Capturas y explicacion de los escenarios de tesoreria y el AI Copilot.

---

## 4. Definicion de Terminado (DoD)

La tarea se considera finalizada unicamente cuando:
1. La aplicacion compila de forma exitosa con `npm run build` sin ningun warning critico ni error de tipado.
2. `npx tsc --noEmit` pasa con 0 errores y cero `any`.
3. Todos los tests unitarios esten en verde.
4. El dashboard funciona fluidamente tanto en Dark como en Light mode con metricas, grafico interactivo y chat de streaming.
5. El `README.md` comercial este completo con instrucciones de despliegue.
6. Se elabore un reporte final conciso documentando el estado del dashboard y comandos de ejecucion.
