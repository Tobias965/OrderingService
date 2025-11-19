export class CurrencyMismatch extends Error {
  constructor(message = 'Currency mismatch') { super(message); this.name = 'CurrencyMismatch' }
}

export default CurrencyMismatch
