export class Quantity {
  constructor(public readonly value: number) {}

  static create(value: number): Quantity {
    if (!Number.isInteger(value) || value <= 0) throw new Error('Invalid quantity: must be positive integer')
    if (value > 10000) throw new Error('Invalid quantity: exceeds maximum allowed')
    return new Quantity(value)
  }
}

export default Quantity
