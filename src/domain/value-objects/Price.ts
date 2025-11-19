export class Price {
    private constructor(readonly amount: number, readonly currency: "EUR" | "USD") {}

    static create(amount: number, currency: "EUR" | "USD"): Price {
        if (typeof amount !== 'number' || !Number.isFinite(amount) || amount < 0) {
            throw new Error("Invalid amount for Price");
        }
        if (currency !== 'EUR' && currency !== 'USD') throw new Error('Invalid currency')
        const rounder = Math.round(amount * 100) / 100;
        return new Price(rounder, currency);
    }

    add(other: Price): Price {
        if (this.currency !== other.currency) throw new Error('Currency mismatch')
        return new Price(Math.round((this.amount + other.amount) * 100) / 100, this.currency)
    }

    multiply(mult: number): Price {
        if (typeof mult !== 'number' || !Number.isFinite(mult)) throw new Error('Invalid multiplier')
        return Price.create(this.amount * mult, this.currency)
    }
}