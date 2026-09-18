import { describe, expect, it } from "vitest";

import {
  generateBaseCashflowSeries,
  generateBurnRateBreakdown,
  generateFinancialKpis,
  generateTransactionHistory
} from "@/lib/mock-engine";
import { TransactionRecordSchema, CashflowDataPointSchema, FinancialKpiSchema } from "@/lib/schemas";

describe("generateTransactionHistory", () => {
  it("is deterministic for a given seed", () => {
    const first = generateTransactionHistory(1234);
    const second = generateTransactionHistory(1234);
    expect(first).toEqual(second);
  });

  it("produces different output for different seeds", () => {
    const first = generateTransactionHistory(1);
    const second = generateTransactionHistory(2);
    expect(first).not.toEqual(second);
  });

  it("produces transactions that satisfy the Zod schema", () => {
    const transactions = generateTransactionHistory(42);
    expect(transactions.length).toBeGreaterThan(0);
    for (const transaction of transactions.slice(0, 25)) {
      expect(() => TransactionRecordSchema.parse(transaction)).not.toThrow();
    }
  });

  it("only generates income transactions for revenue categories", () => {
    const transactions = generateTransactionHistory(42);
    const revenueTransactions = transactions.filter(
      (t) => t.category === "revenue_subscription" || t.category === "revenue_services"
    );
    expect(revenueTransactions.every((t) => t.type === "income")).toBe(true);
  });
});

describe("generateBaseCashflowSeries", () => {
  it("is deterministic for a given seed", () => {
    const transactions = generateTransactionHistory(42);
    const first = generateBaseCashflowSeries(transactions, 42);
    const second = generateBaseCashflowSeries(transactions, 42);
    expect(first).toEqual(second);
  });

  it("produces exactly the requested number of projection days", () => {
    const transactions = generateTransactionHistory(42);
    const series = generateBaseCashflowSeries(transactions, 42, 90);
    expect(series).toHaveLength(90);
  });

  it("produces points that satisfy the Zod schema", () => {
    const transactions = generateTransactionHistory(42);
    const series = generateBaseCashflowSeries(transactions, 42, 5);
    for (const point of series) {
      expect(() => CashflowDataPointSchema.parse(point)).not.toThrow();
    }
  });
});

describe("generateFinancialKpis", () => {
  it("produces the four core KPIs matching the schema", () => {
    const transactions = generateTransactionHistory(42);
    const cashflow = generateBaseCashflowSeries(transactions, 42);
    const kpis = generateFinancialKpis(transactions, cashflow);

    expect(kpis.map((k) => k.id)).toEqual(["mrr", "runway", "net_burn", "cash_balance"]);
    for (const kpi of kpis) {
      expect(() => FinancialKpiSchema.parse(kpi)).not.toThrow();
    }
  });
});

describe("generateBurnRateBreakdown", () => {
  it("returns percentages that sum to approximately 100", () => {
    const transactions = generateTransactionHistory(42);
    const breakdown = generateBurnRateBreakdown(transactions);
    const total = breakdown.reduce((sum, item) => sum + item.percentageOfTotal, 0);
    expect(total).toBeGreaterThan(95);
    expect(total).toBeLessThan(105);
  });
});
