import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { customersTableClient, ordersTableClient } from "../config/azure";

const router = Router();
const PARTITION = "customer";

router.get("/", async (_req, res) => {
  try {
    const customers: any[] = [];
    for await (const entity of customersTableClient.listEntities()) {
      customers.push(entity);
    }
    res.json(customers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar clientes" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const entity = await customersTableClient.getEntity(PARTITION, req.params.id);
    res.json(entity);
  } catch (err) {
    res.status(404).json({ error: "Cliente não encontrado" });
  }
});

// Histórico de locações/pedidos do cliente
router.get("/:id/orders", async (req, res) => {
  try {
    const orders: any[] = [];
    for await (const entity of ordersTableClient.listEntities({
      queryOptions: { filter: `customerId eq '${req.params.id}'` },
    })) {
      orders.push({ ...entity, items: JSON.parse(entity.items as string) });
    }
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar histórico de pedidos" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Campos obrigatórios: name, email" });
    }

    const entity = {
      partitionKey: PARTITION,
      rowKey: uuidv4(),
      name,
      email,
      phone: phone || "",
      address: address || "",
    };

    await customersTableClient.createEntity(entity);
    res.status(201).json(entity);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar cliente" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const existing: any = await customersTableClient.getEntity(
      PARTITION,
      req.params.id
    );
    const { name, email, phone, address } = req.body;

    const entity = {
      partitionKey: PARTITION,
      rowKey: req.params.id,
      name: name ?? existing.name,
      email: email ?? existing.email,
      phone: phone ?? existing.phone,
      address: address ?? existing.address,
    };

    await customersTableClient.updateEntity(entity, "Replace");
    res.json(entity);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar cliente" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await customersTableClient.deleteEntity(PARTITION, req.params.id);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao excluir cliente" });
  }
});

export default router;
