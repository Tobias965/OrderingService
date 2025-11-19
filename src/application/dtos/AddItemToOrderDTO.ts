export type AddItemToOrderInput = {
    orderId: string;
    sku: string;
    currency: "EUR" | "USD";
    qty: number;
};

export type AddItemToOrderOutput = {
    orderId: string;
    total: {
        amount: number;
        currency: string;
    }
};