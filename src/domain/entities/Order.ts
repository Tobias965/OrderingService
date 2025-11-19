// Minimal Order entity used by the application and tests
import { Price } from "../value-objects/Price";
import { SKU } from "../value-objects/SKU";
import { Quantity } from "../value-objects/Quantity";
import { CurrencyMismatch } from "../errors/CurrencyMismatch";

export type OrderId = string
export type CustomerId = string

export type DomainEvent = { type: string; payload: any }

type OrderItem = Readonly<{ sku: SKU; unit: Price; qty: Quantity }>;

export class Order {
  private readonly items: OrderItem[] = [];
  private domainEvents: DomainEvent[] = [];

  constructor(readonly id: OrderId, readonly customerId: CustomerId) {}

  static create(id: OrderId, customerId: CustomerId){
    const order = new Order(id, customerId);
    order.record({ type: 'OrderCreated', payload: { orderId: id, customerId } });
    return order;
  }

  addItem(sku: SKU, unit: Price, qty: Quantity) {
    if (this.items.length > 0) {
      const currency = this.items[0].unit.currency;
      if (currency !== unit.currency) {
        throw new CurrencyMismatch();
      }
    }
    this.items.push(Object.freeze({ sku, unit, qty }));
    this.record({ type: 'ItemAdded', payload: { orderId: this.id, sku: sku.value, unit: unit.amount, qty: qty.value } });
  }

  total(): Price {
    if (this.items.length === 0) {
      return Price.create(0, "USD");
    }
    const currency = this.items[0].unit.currency;
    return this.items.reduce((acc, i) => acc.add(i.unit.multiply(i.qty.value)),
      Price.create(0, currency));
  }

  pullDomainEvents(): DomainEvent[] {
    const events = [...this.domainEvents];
    this.domainEvents = []
    return events;
  }

  private record(event: DomainEvent) {
    this.domainEvents.push(event);
  }
}

export default Order
