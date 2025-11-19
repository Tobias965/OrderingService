import { Result, ok, fail } from "@shared/result";
import { AppError, ValidationError, NotFoundError, ConflictError } from "@shared/errors";
import { OrderRepository } from "@application/ports/OrderRepository";
import { PricingService } from "@application/ports/PricingService";
import { EventBus } from "@application/ports/EventBus";
import { Clock } from "@application/ports/Clock";
import { AddItemToOrderInput, AddItemToOrderOutput } from "@application/dtos/AddItemToOrderDTO";    
import { Order } from "@domain/entities/Order";
import { SKU } from "@domain/value-objects/SKU";
import { Price } from "@domain/value-objects/Price";
import { Quantity } from "@domain/value-objects/Quantity";
import { CurrencyMismatch } from "@domain/errors/CurrencyMismatch";

export class AddItemToOrder {
    constructor(
        private readonly repo: OrderRepository,
        private readonly pricing: PricingService,
        private readonly events: EventBus,
        private readonly clock: Clock
    ) {}

    async execute(input: AddItemToOrderInput): Promise<Result<AddItemToOrderOutput, AppError>> {
        const v = this.validate(input)
        if (!v.ok) return v

        const order = await this.repo.findById(input.orderId)
        if (!order) {
            const err: NotFoundError = { type: "not_found", resource: "Order", id: input.orderId }
            return fail(err)
        }

        const sku = SKU.create(input.sku)
        const qty = Quantity.create(input.qty)
        const price = await this.pricing.getCurrentPrice(sku, input.currency)
        if (!price) {
            const err: ValidationError = { type: "validation", message: "Unkown SKU", details: { sku: input.sku } }
            return fail(err)
        }

        try {
            order.addItem(sku, price, qty)

            await this.repo.save(order)
            const events = order.pullDomainEvents()
            await this.events.publish(events)
            const total = order.total()
            return ok({
                orderId: order.id,
                total: { amount: total.amount, currency: total.currency }
            })
        } catch (e) {
            if (e instanceof CurrencyMismatch) {
                const err: ConflictError = { type: "conflict", message: "Currency mismatch in order" }
                return fail(err)
            }

            const err: ValidationError = { type: "validation", message: (e as Error).message }
            return fail(err)
        }
    }

    private validate(input: AddItemToOrderInput): Result<AddItemToOrderInput, ValidationError> {
        const errors: Record<string, string> = {}
        if (!input.orderId) errors.orderId = "Required"
        if (!/^[A-Za-z0-9-]{3,30}$/.test(input.sku)) errors.sku = "Invalid format"
        if (!Number.isInteger(input.qty) || input.qty <= 0) errors.qty = "Must be a positive integer"
        if (!["EUR", "USD"].includes(input.currency)) errors.currency = "Unsupported"
        return Object.keys(errors).length ? fail({ type: "validation", message: "Invalid input", details: errors }) : ok(input)
    }

}