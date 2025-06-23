declare module 'supra-oracle-sdk' {
    export default class SupraOracleClient {
      constructor(options?: {
        restAddress?: string
        chainType?: string
        history?: {
          enabled: boolean
          apiKey: string
          baseUrl?: string
        }
      })
  
      getOracleData(pairIndexes: number[]): Promise<
        {
          pairIndex: string
          price: string
          decimals: string
          timestamp: string
        }[]
      >
  
      getHistoricalPrices(options: {
        tradingPair: string
        startDate: number
        endDate: number
        interval: number
      }): Promise<{
        status: string
        data: {
          timestamp: number
          open: number
          high: number
          low: number
          close: number
          volume: number
        }[]
      }>
    }
  }