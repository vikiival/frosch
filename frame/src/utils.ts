export function kodaUrl(chain: string, collection: string, token?: string): string {
  const base = `https://kodadot.xyz/${chain}/`
  const path = token ? `gallery/${collection}-${token}` : `collection/${collection}`
  return base + path
}


export function baseTxUrl(tx: string, chain = 'base'): string {
  const BASESCAN = chain === 'base' ? 'https://basescan.org' : 'https://sepolia.basescan.org'
  return `${BASESCAN}/tx/${tx}`
}