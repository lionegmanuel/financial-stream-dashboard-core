# Investigacion, Diseno Visual y Benchmark de Dashboards B2B

Este documento consolida la investigacion de diseno, patrones de experiencia de usuario y benchmarks de rendimiento que sustentan a **`financial-stream-dashboard-core`**.

---

## 1. El Estado del Arte en Dashboards Financieros B2B

Los mejores productos de tecnologia financiera del mundo (Stripe Dashboard, Mercury Bank, Ramp, Brex y Zignum) comparten una filosofia visual comun:
- **Cero Elementos Inutiles**: La densidad de informacion debe ser alta pero limpia, sin bordes pesados ni sombras exageradas.
- **Tipografia y Numeros Monospaciados**: Los valores numericos utilizan fuentes tabulares (`font-mono` o `tabular-nums`) para evitar saltos visuales durante actualizaciones en tiempo real.
- **Micro-interacciones y Feedback Inmediato**: Cambiar de escenario de 30 a 90 dias debe recalcularse en el cliente de forma instantanea sin parpadeo de pantalla.

---

## 2. Paleta Visual y Tokens de Diseno

El sistema utiliza una estetica Dark Mode sofisticada (con soporte automatico para Light Mode):

| Elemento | Token Tailwind | Proposito |
| :--- | :--- | :--- |
| **Fondo Principal** | `bg-zinc-950` / `bg-white` | Contraste de alto impacto sin cansar la vista |
| **Tarjetas y Superficies** | `bg-zinc-900/50 border-zinc-800` | Elevacion sutil con bordes de 1px |
| **Metricas Positivas / Inflows** | `text-emerald-500` / `bg-emerald-500/10` | Indicar salud financiera y cobranzas |
| **Metricas de Quema / Outflows** | `text-rose-500` / `bg-rose-500/10` | Indicar burn rate, egresos y alertas |
| **Acento de Marca / Copiloto IA** | `text-indigo-400` / `bg-indigo-500/10` | Resaltar insights y el drawer de streaming |

---

## 3. Benchmark de Experiencia de Usuario (Lighthouse & Core Web Vitals)

| Metrica | Objetivo en `financial-stream-dashboard-core` | Metodo de Logro |
| :--- | :--- | :--- |
| **First Contentful Paint (FCP)** | < 0.6 segundos | React Server Components con layout pre-renderizado |
| **Largest Contentful Paint (LCP)** | < 1.2 segundos | Suspense boundaries en metricas asincronas |
| **Cumulative Layout Shift (CLS)** | 0.000 | Skeletons con dimensiones fijas identicas a las tarjetas reales |
| **Time to Interactive (TTI)** | < 1.5 segundos | Cero paquetes pesados de analitica en el cliente |
