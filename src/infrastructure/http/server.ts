import Fastify from "fastify"
import { OrdersController } from "./OrdersController"

export async function buildServer() {
    const app = Fastify()
    app.post("/orders", OrdersController.create)
    // DELETE not implemented yet in OrdersController — add when needed
    return app
}