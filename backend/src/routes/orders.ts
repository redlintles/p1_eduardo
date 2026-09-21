import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { ordersTableClient, productsTableClient } from "../config/azure";

const router = Router();
const PARTITION = "order";

router.get("/", async (_req, res) => {
  try {
    const orders: any[] = [];
    for await (const entity of ordersTableClient.listEntities()) {
      orders.push({ ...entity, items: JSON.parse(entity.items as string) });
    }
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar pedidos" });
  }
});

// Checkout: valida preço/quantidade, escolhe pagamento/entrega e cria o pedido
router.post("/checkout", async (req, res) => {
  try {
    const { customerId, items, paymentMethod, deliveryMethod } = req.body as {
      customerId: string;
      items: { productId: string; quantity: number }[];
      paymentMethod: string;
      deliveryMethod: string;
    };

    if (!customerId || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ error: "customerId e items são obrigatórios" });
    }
    if (!paymentMethod || !deliveryMethod) {
      return res
        .status(400)
        .json({ error: "Método de pagamento e método de entrega são obrigatórios" });
    }

    let total = 0;
    const validatedItems = [];

    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({ error: "Item de pedido inválido" });
      }

      const product: any = await productsTableClient.getEntity(
        "product",
        item.productId
      );

      const availableQty = Number(product.quantity);
      const price = Number(product.price);

      if (item.quantity > availableQty) {
        return res.status(400).json({
          error: `Quantidade indisponível para ${product.brand} ${product.model}. Disponível: ${availableQty}`,
        });
      }

      total += price * item.quantity;
      validatedItems.push({
        productId: item.productId,
        brand: product.brand,
        model: product.model,
        price,
        quantity: item.quantity,
      });

      // Atualiza o estoque do produto
      await productsTableClient.updateEntity(
        {
          partitionKey: "product",
          rowKey: item.productId,
          quantity: availableQty - item.quantity,
        },
        "Merge"
      );
    }

    const order = {
      partitionKey: PARTITION,
      rowKey: uuidv4(),
      customerId,
      items: JSON.stringify(validatedItems),
      total,
      paymentMethod,
      deliveryMethod,
      status: "confirmado",
      createdAt: new Date().toISOString(),
    };

    await ordersTableClient.createEntity(order);
    res.status(201).json({ ...order, items: validatedItems });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao processar o checkout" });
  }
});

export default router;
