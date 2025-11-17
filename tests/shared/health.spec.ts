import { describe, it, expect } from 'vitest'
import { isHealthy } from '../../src/shared/health'

describe('shared/health', () => {
  it('returns ok status and a valid ISO timestamp', () => {
    const h = isHealthy()
    expect(h.status).toBe('ok')
    // timestamp is ISO-like and parsable to Date
    const parsed = Date.parse(h.timestamp)
    expect(Number.isNaN(parsed)).toBe(false)
  })
})
