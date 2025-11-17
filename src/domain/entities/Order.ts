// Minimal Order entity used by the application and tests
export class Order {
  constructor(public readonly id: string, public readonly customerId: string) {}
}

export default Order
