// @ts-ignore
import { NextRequest } from 'next/server'
import SupraOracleClient from 'supra-oracle-sdk'

const oracle = new SupraOracleClient({
  restAddress: 'https://rpc-testnet-dora-2.supra.com',
  chainType: 'evm'
})

export async function GET(req: NextRequest) {
  const indexesParam = req.nextUrl.searchParams.get('indexes')

  if (!indexesParam) {
    return new Response(JSON.stringify({ error: 'Missing indexes' }), { status: 400 })
  }

  const pairIndexes = indexesParam.split(',').map(i => parseInt(i.trim(), 10))

  try {
    const data = await oracle.getOracleData(pairIndexes)
    return new Response(JSON.stringify({ data }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (_error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch oracle data' }), { status: 500 })
  }
}