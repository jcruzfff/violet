import { useEffect, useState } from 'react'

export interface SupraPriceFeed {
  pairIndex: string
  price: string
  decimals: string
  timestamp: string
}

export function useSupraPrices() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const pairIndexes: number[] = [0, 1, 10, 16]
  const query = pairIndexes.join(',')

  useEffect(() => {
    const fetchPrices = async () => {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch(`/api/oracle?indexes=${query}`)
        const json = await res.json()
        if (!json.data) throw new Error(json.error || 'Failed to fetch oracle data')
        setData(json.data)
      } catch (err: any) {
        setError(err.message || 'Unexpected error')
      } finally {
        setLoading(false)
      }
    }

    fetchPrices()
  }, [query])

  return { data, loading, error }
}