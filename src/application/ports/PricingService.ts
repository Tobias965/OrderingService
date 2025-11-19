import { SKU } from "@domain/value-objects/SKU"
import { Price } from "@domain/value-objects/Price"

export interface PricingService {
  getCurrentPrice(sku: SKU, currency: "EUR" | "USD"): Promise<Price | null>
}

export default PricingService
