export class SKU {
  constructor(public readonly value: string) {}

  static create(value: string): SKU {
    if (typeof value !== 'string') throw new Error('Invalid SKU')
    const trimmed = value.trim()
    if (!/^[A-Za-z0-9-]{3,30}$/.test(trimmed)) throw new Error('Invalid SKU: must be 3-30 alnum or hyphen')
    return new SKU(trimmed)
  }

  toString() { return this.value }
}

export default SKU
