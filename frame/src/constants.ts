import { Fetcher } from '@cloudflare/workers-types'
import { Env } from 'hono'

export interface CloudflareEnv extends Record<string, any> {
  // WAIFU_DB: D1Database;
  NFT_STORAGE: Fetcher
  CAPTURE: Fetcher
  // HYPER_MARCK: string
}

export interface HonoEnv extends Env {
  Bindings: CloudflareEnv
}

export type ChainNamespace = 'eip155'

/**
 * Current supported chain IDs:
 * - 1: Ethereum
 * - 10: Optimism
 * - 8453: Base
 * - 84532: Base Sepolia
 * - 7777777: Zora
 */
export type ChainIdEip155 = 1 | 10 | 8453 | 84532 | 7777777

type Chain = 'BASE' | 'BASE_TEST'

// https://docs.simplehash.com/reference/supported-chains-testnets
export const CHAIN_ID: Record<Chain, `${ChainNamespace}:${ChainIdEip155}`> = {
  BASE: 'eip155:8453',
  BASE_TEST: 'eip155:84532',
}

export const CHAIN = 'base' // 'base'
export const MINT_PRICE = '0.002'
export const TOKEN_SYMBOL = 'HIGHER'