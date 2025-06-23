const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export const api = {
  base: API_BASE_URL,

  portfolios: {
    create: `${API_BASE_URL}/api/portfolios`,
    getByUser: (userId: string) => `${API_BASE_URL}/api/portfolios/user/${userId}`,
    getById: (id: string) => `${API_BASE_URL}/api/portfolios/${id}`,
    updateHoldings: (id: string) => `${API_BASE_URL}/api/portfolios/${id}/holdings`,
    performance: (id: string) => `${API_BASE_URL}/api/portfolios/${id}/performance`,
    rebalance: (id: string) => `${API_BASE_URL}/api/portfolios/${id}/rebalance`,
    delete: (id: string) => `${API_BASE_URL}/api/portfolios/${id}`,
  },

  recommendations: `${API_BASE_URL}/api/recommend`,

  sentiment: {
    current: `${API_BASE_URL}/api/fear-greed?limit=1`,
    history: `${API_BASE_URL}/api/fear-greed/history?limit=30`,
  },

  utility: {
    riskProfile: `${API_BASE_URL}/risk-profile`,
    suggestPortfolio: `${API_BASE_URL}/portfolio`,
    priceFeed: `${API_BASE_URL}/price-feed`,
  },
};