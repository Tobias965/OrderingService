import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryOrderRepository } from '../../src/infrastructure/persistence/InMemoryOrderRepository'
import { AddItemToOrder } from '../../src/application/use-cases/AddItemToOrderUseCase'
import { SKU } from '../../src/domain/value-objects/SKU'
import { Price } from '../../src/domain/value-objects/Price'
import { Quantity } from '../../src/domain/value-objects/Quantity'
import { Order } from '../../src/domain/entities/Order'

class PricingStub {
  private prices = new Map<string, Price>()
  set(sku: string, price: Price) { this.prices.set(sku, price) }
  async getCurrentPrice(sku: SKU, currency: 'EUR'|'USD') { return this.prices.get(sku.value) ?? null }
}

class EventsStub {
  public published: any[] = []
  async publish(events: any[]) { this.published.push(...events) }
}

class ClockStub { now() { return new Date() } }

describe('AddItemToOrder', () => {
  let repo: InMemoryOrderRepository
  let pricing: PricingStub
  let events: EventsStub
  let clock: ClockStub

  beforeEach(() => {
    repo = new InMemoryOrderRepository()
    pricing = new PricingStub()
    events = new EventsStub()
    clock = new ClockStub()
  })

  it('adds item successfully', async () => {
    const order = Order.create('order-1', 'cust-1')
    await repo.save(order)

    pricing.set('S01', Price.create(10, 'USD'))

    const uc = new AddItemToOrder(repo as any, pricing as any, events as any, clock as any)
    const res = await uc.execute({ orderId: 'order-1', sku: 'S01', qty: 2, currency: 'USD' })
    expect(res.ok).toBe(true)
    const updated = await repo.findById('order-1')
    expect(updated).not.toBeNull()
    const total = updated!.total()
    expect(total.amount).toBe(20)
    expect(total.currency).toBe('USD')
  })

  it('returns validation error for invalid input', async () => {
    const uc = new AddItemToOrder(repo as any, pricing as any, events as any, clock as any)
    const res = await uc.execute({ orderId: '', sku: '!!', qty: 0, currency: 'EUR' })
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.error.type).toBe('validation')
  })

  it('returns validation error when SKU unknown', async () => {
    const order = Order.create('order-2', 'cust-2')
    await repo.save(order)
    const uc = new AddItemToOrder(repo as any, pricing as any, events as any, clock as any)
    const res = await uc.execute({ orderId: 'order-2', sku: 'UNKNOWN', qty: 1, currency: 'USD' })
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.error.type).toBe('validation')
  })

  it('returns conflict on currency mismatch', async () => {
    const order = Order.create('order-3', 'cust-3')
    // add initial item in USD
    order.addItem(SKU.create('S-USD'), Price.create(5, 'USD'), Quantity.create(1))
    await repo.save(order)

    pricing.set('S-EUR', Price.create(3, 'EUR'))

    const uc = new AddItemToOrder(repo as any, pricing as any, events as any, clock as any)
    const res = await uc.execute({ orderId: 'order-3', sku: 'S-EUR', qty: 1, currency: 'EUR' })
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.error.type).toBe('conflict')
  })

})
