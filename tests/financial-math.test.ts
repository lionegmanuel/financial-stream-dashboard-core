import { describe, expect, it } from "vitest";

import {
  calculateAverageMonthlyBurn,
  calculateMoM,
  calculateNetBurnRate,
  calculateRunway,
  formatCurrency,
  formatRunwayMonths,
  projectScenarioCashflow
} from "@/lib/financial-math";
import type { CashflowDataPoint } from "@/lib/schemas";

describe("calculateNetBurnRate", () => {
  it("returns the difference between outflows and inflows when expenses exceed income", () => {
    expect(calculateNetBurnRate(10000, 15000)).toBe(5000);
  });

  it("returns zero when income covers or exceeds expenses", () => {
    expect(calculateNetBurnRate(20000, 15000)).toBe(0);
    expect(calculateNetBurnRate(15000, 15000)).toBe(0);
  });
});

describe("calculateRunway", () => {
  it("returns Infinity when the average burn is zero or negative", () => {
    expect(calculateRunway(50000, 0)).toBe(Infinity);
    expect(calculateRunway(50000, -1000)).toBe(Infinity);
  });

  it("returns zero when cash balance is zero or negative", () => {
    expect(calculateRunway(0, 5000)).toBe(0);
    expect(calculateRunway(-100, 5000)).toBe(0);
  });

  it("divides cash balance by average monthly burn", () => {
    expect(calculateRunway(100000, 25000)).toBe(4);
  });
});

describe("calculateAverageMonthlyBurn", () => {
  it("returns zero for an empty array", () => {
    expect(calculateAverageMonthlyBurn([])).toBe(0);
  });

  it("averages the provided monthly burn values", () => {
    expect(calculateAverageMonthlyBurn([1000, 2000, 3000])).toBe(2000);
  });
});

describe("calculateMoM", () => {
  it("returns 0 when both current and previous are zero", () => {
    expect(calculateMoM(0, 0)).toBe(0);
  });

  it("returns 100 when previous is zero and current is nonzero", () => {
    expect(calculateMoM(500, 0)).toBe(100);
  });

  it("calculates the percentage change relative to the previous value", () => {
    expect(calculateMoM(150, 100)).toBe(50);
    expect(calculateMoM(50, 100)).toBe(-50);
  });
});

describe("projectScenarioCashflow", () => {
  const baseData: CashflowDataPoint[] = [
    { date: "2026-01-01", inflows: 1000, outflows: 800, netCashflow: 200, closingBalance: 10200, scenario: "base" },
    { date: "2026-01-02", inflows: 1000, outflows: 800, netCashflow: 200, closingBalance: 10400, scenario: "base" }
  ];

  it("keeps values unchanged for the base scenario", () => {
    const result = projectScenarioCashflow(baseData, "base");
    expect(result[0]!.inflows).toBe(1000);
    expect(result[0]!.outflows).toBe(800);
    expect(result.every((point) => point.scenario === "base")).toBe(true);
  });

  it("increases inflows for the optimistic scenario", () => {
    const result = projectScenarioCashflow(baseData, "optimistic");
    expect(result[0]!.inflows).toBe(1200);
    expect(result.every((point) => point.scenario === "optimistic")).toBe(true);
  });

  it("reduces inflows and increases outflows for the pessimistic scenario", () => {
    const result = projectScenarioCashflow(baseData, "pessimistic");
    expect(result[0]!.inflows).toBe(750);
    expect(result[0]!.outflows).toBe(880);
    expect(result.every((point) => point.scenario === "pessimistic")).toBe(true);
  });
});

describe("formatCurrency", () => {
  it("formats USD values with the correct symbol", () => {
    expect(formatCurrency(1500, "USD")).toContain("$");
  });
});

describe("formatRunwayMonths", () => {
  it("returns Infinito for non-finite values", () => {
    expect(formatRunwayMonths(Infinity)).toBe("Infinito");
  });

  it("caps large values at 120+ meses", () => {
    expect(formatRunwayMonths(500)).toBe("120+ meses");
  });

  it("formats finite values with one decimal", () => {
    expect(formatRunwayMonths(6.25)).toBe("6.3 meses");
  });
});
