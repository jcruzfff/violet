// @ts-ignore
import { api } from "@/lib/config";

// ==== Types ====

export interface RiskProfile {
  category: "Conservative" | "Moderate" | "Aggressive";
  score: number;
}

export interface Holding {
  symbol: string;
  amount: number;
  currentPrice: number;
  value: number;
  percentage: number;
  targetPercentage: number;
}

export interface Portfolio {
  id: string;
  userId: string;
  name: string;
  riskProfile: RiskProfile;
  holdings: Holding[];
  totalValue: number;
  createdAt: string;
  updatedAt: string;
}

export interface RebalanceRecommendation {
  symbol: string;
  action: "buy" | "sell";
  amount: number;
  value: number;
  reason: string;
}

export interface APIResponse<T> {
  success: boolean;
  data: T | null;
  error?: {
    message: string;
    code?: string;
    details?: Record<string, unknown>;
  };
}

// ==== Actions ====

export async function createPortfolio(payload: {
  userId: string;
  name: string;
  riskProfile: RiskProfile;
  initialCapital: number;
}): Promise<APIResponse<Portfolio>> {
  const res = await fetch(api.portfolios.create, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function getUserPortfolios(userId: string): Promise<APIResponse<Portfolio[]>> {
  const res = await fetch(api.portfolios.getByUser(userId));
  return res.json();
}

export async function getPortfolio(id: string): Promise<APIResponse<Portfolio>> {
  const res = await fetch(api.portfolios.getById(id));
  return res.json();
}

export async function updateHoldings(id: string, holdings: { symbol: string; amount: number }[]): Promise<APIResponse<Portfolio>> {
  const res = await fetch(api.portfolios.updateHoldings(id), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ holdings }),
  });
  return res.json();
}

export async function getPortfolioPerformance(id: string): Promise<APIResponse<any>> {
  const res = await fetch(api.portfolios.performance(id));
  return res.json();
}

export async function getRebalanceRecommendation(id: string): Promise<APIResponse<{
  needsRebalancing: boolean;
  recommendations: RebalanceRecommendation[];
  totalRebalanceValue: number;
  sentiment: any;
}>> {
  const res = await fetch(api.portfolios.rebalance(id));
  return res.json();
}

export async function deletePortfolio(id: string): Promise<APIResponse<{ id: string }>> {
  const res = await fetch(api.portfolios.delete(id), {
    method: "DELETE",
  });
  return res.json();
}

export async function getRecommendation(payload: {
  investmentHorizonYears: number;
  maxDrawdownTolerancePct: number;
  primaryGoal: string;
  startingCapital: number;
  symbols: string[];
}): Promise<APIResponse<any>> {
  const res = await fetch(api.recommendations, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function getFearGreedIndex(): Promise<APIResponse<any>> {
  const res = await fetch(api.sentiment.current);
  return res.json();
}

export async function getFearGreedHistory(): Promise<APIResponse<any>> {
  const res = await fetch(api.sentiment.history);
  return res.json();
}

export async function calculateRiskProfile(payload: {
  investmentHorizonYears: number;
  maxDrawdownTolerancePct: number;
  primaryGoal: string;
}): Promise<APIResponse<RiskProfile>> {
  const res = await fetch(api.utility.riskProfile, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function suggestPortfolio(payload: {
  category: RiskProfile["category"];
  score: number;
  startingCapital: number;
}): Promise<APIResponse<any>> {
  const res = await fetch(api.utility.suggestPortfolio, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function getOraclePriceFeed(): Promise<APIResponse<any>> {
  const res = await fetch(api.utility.priceFeed, {
    method: "POST" // adjust if it's GET in your server
  });
  return res.json();
}
