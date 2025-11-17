import { FastifyRequest, FastifyReply } from "fastify"
import { createOrder } from "@composition/container"

export const OrdersController = {
    async create(req: FastifyRequest, reply: FastifyReply) {
        const { orderId, customerId } = req.body as any
        if (!orderId || !customerId) {
            return reply.code(400).send({ error: 'orderId and customerId are required' })
        }
        try {
            const out = await createOrder.execute({ orderId, customerId })
            return reply.code(201).send(out)
        } catch (err: any) {
            return reply.code(500).send({ error: err?.message ?? 'internal error' })
        }
    }
}