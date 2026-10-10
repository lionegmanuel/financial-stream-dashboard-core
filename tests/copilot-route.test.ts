import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";

import { POST } from "@/app/api/copilot/route";
import {
  CashflowDataPointSchema,
  CopilotRequestSchema,
  CopilotStreamEventSchema,
  FinancialKpiSchema,
  TransactionRecordSchema
} from "@/lib/schemas";
import { generateDashboardSnapshot } from "@/lib/mock-engine";

describe("Copilot Route Handler & SSE Streaming", () => {
  const { kpis } = generateDashboardSnapshot();

  it("rechaza solicitudes que no sean JSON valido con status 400", async () => {
    const request = new NextRequest("http://localhost:3000/api/copilot", {
      method: "POST",
      body: "esto-no-es-un-json",
      headers: { "Content-Type": "application/json" }
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const body = await response.json();
    expect(body.error).toContain("El cuerpo de la solicitud debe ser JSON valido");
  });

  it("rechaza payloads con esquema Zod invalido con status 400 y detalles", async () => {
    const invalidPayload = {
      messages: [{ id: "1", role: "user", content: "Hola" }],
      currentMetrics: "esto-deberia-ser-un-array",
      selectedScenario: "escenario_inexistente"
    };

    const request = new NextRequest("http://localhost:3000/api/copilot", {
      method: "POST",
      body: JSON.stringify(invalidPayload),
      headers: { "Content-Type": "application/json" }
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const body = await response.json();
    expect(body.error).toBe("Payload invalido para el copiloto financiero.");
    expect(body.details).toBeDefined();
    expect(Array.isArray(body.details)).toBe(true);
  });

  it("responde exitosamente con SSE (status 200 y headers correctos) ante un payload valido", async () => {
    const validPayload = {
      messages: [{ id: "msg-1", role: "user", content: "Como esta el runway?" }],
      currentMetrics: kpis,
      selectedScenario: "base"
    };

    // Validacion previa con Zod
    const schemaCheck = CopilotRequestSchema.safeParse(validPayload);
    expect(schemaCheck.success).toBe(true);

    const request = new NextRequest("http://localhost:3000/api/copilot", {
      method: "POST",
      body: JSON.stringify(validPayload),
      headers: { "Content-Type": "application/json" }
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("text/event-stream; charset=utf-8");
    expect(response.headers.get("Cache-Control")).toBe("no-cache, no-transform");
    expect(response.headers.get("Connection")).toBe("keep-alive");
    expect(response.headers.get("X-Accel-Buffering")).toBe("no");
    expect(response.body).toBeDefined();

    // Consumir el reader del stream
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let streamText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      streamText += decoder.decode(value, { stream: true });
    }

    expect(streamText.length).toBeGreaterThan(0);
    expect(streamText).toContain("data: ");
    expect(streamText).toContain('{"done":true}');

    // Validar cada evento emitido con CopilotStreamEventSchema
    const rawEvents = streamText.split("\n\n").filter((e) => e.trim().startsWith("data: "));
    expect(rawEvents.length).toBeGreaterThan(1);

    for (const rawEvent of rawEvents) {
      const jsonStr = rawEvent.replace(/^data:\s*/, "").trim();
      const parsedJson = JSON.parse(jsonStr);
      const validation = CopilotStreamEventSchema.safeParse(parsedJson);
      expect(validation.success).toBe(true);
    }
  });
});

describe("Contratos Financieros con Zod (lib/schemas)", () => {
  it("valida correctamente FinancialKpiSchema ante un KPI valido", () => {
    const validKpi = {
      id: "mrr",
      title: "MRR",
      currentValue: 45000,
      formattedValue: "$45,000",
      currency: "USD",
      trend: {
        percentageChange: 8.5,
        isPositive: true,
        timeframeLabel: "vs mes anterior"
      },
      status: "healthy",
      description: "Ingresos recurrentes mensuales."
    };

    const result = FinancialKpiSchema.safeParse(validKpi);
    expect(result.success).toBe(true);
  });

  it("rechaza FinancialKpiSchema si el estado o la moneda son invalidos", () => {
    const invalidKpi = {
      id: "mrr",
      title: "MRR",
      currentValue: 45000,
      formattedValue: "$45,000",
      currency: "MONEDA_INVALIDA",
      trend: {
        percentageChange: 8.5,
        isPositive: true,
        timeframeLabel: "vs mes anterior"
      },
      status: "estado_invalido",
      description: "Test"
    };

    const result = FinancialKpiSchema.safeParse(invalidKpi);
    expect(result.success).toBe(false);
  });

  it("rechaza CashflowDataPointSchema con montos negativos en inflows u outflows", () => {
    const invalidDataPoint = {
      date: "2026-10-01",
      inflows: -100, // No permitido
      outflows: 50,
      netCashflow: -150,
      closingBalance: 1000,
      scenario: "base"
    };

    const result = CashflowDataPointSchema.safeParse(invalidDataPoint);
    expect(result.success).toBe(false);
  });

  it("valida TransactionRecordSchema con UUID y categorias correctas", () => {
    const validTx = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      date: "2026-10-01",
      description: "Pago de nomina",
      category: "payroll",
      amount: 15000,
      type: "expense",
      currency: "USD",
      isRecurring: true,
      counterparty: "Empleados"
    };

    const result = TransactionRecordSchema.safeParse(validTx);
    expect(result.success).toBe(true);
  });
});
