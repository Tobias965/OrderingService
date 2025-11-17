import { describe, it, expect } from 'vitest'
import { sum, greet } from './index'

describe('basic functions', () => {
  it('sums numbers', () => {
    expect(sum(1, 2)).toBe(3)
  })

  it('greets correctly', () => {
    expect(greet('Tobia')).toBe('Hello, Tobia')
  })
})
