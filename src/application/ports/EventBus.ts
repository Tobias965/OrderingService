export interface EventBus {
  publish(events: any[]): Promise<void>
}

export default EventBus
