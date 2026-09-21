import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { productsTableClient } from "../config/azure";
import { upload } from "../middleware/upload";
import { uploadProductImage, deleteProductImage } from "../services/blobService";

const router = Router();
const PARTITION = "product";

// GET /api/products?brand=&model=&minPrice=&maxPrice=
router.get("/", async (req, res) => {
  try {
    const { brand, model, minPrice, maxPrice } = req.query;

    const products: any[] = [];
    for await (const entity of productsTableClient.listEntities()) {
      products.push(entity);
    }

    let filtered = products;
    if (brand) {
      filtered = filtered.filter((p) =>
        String(p.brand).toLowerCase().includes(String(brand).toLowerCase())
      );
    }
    if (model) {
      filtered = filtered.filter((p) =>
        String(p.model).toLowerCase().includes(String(model).toLowerCase())
      );
    }
    if (minPrice) {
      filtered = filtered.filter((p) => Number(p.price) >= Number(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter((p) => Number(p.price) <= Number(maxPrice));
    }

    res.json(filtered);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar produtos" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const entity = await productsTableClient.getEntity(PARTITION, req.params.id);
    res.json(entity);
  } catch (err) {
    res.status(404).json({ error: "Produto não encontrado" });
  }
});

router.post("/", upload.single("photo"), async (req, res) => {
  try {
    const { brand, model, price, quantity, description } = req.body;

    if (!brand || !model || price === undefined || quantity === undefined) {
      return res.status(400).json({
        error: "Campos obrigatórios: brand, model, price, quantity",
      });
    }

    let photoUrl = "";
    if (req.file) {
      photoUrl = await uploadProductImage(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );
    }

    const entity = {
      partitionKey: PARTITION,
      rowKey: uuidv4(),
      brand,
      model,
      price: Number(price),
      quantity: Number(quantity),
      description: description || "",
      photoUrl,
    };

    await productsTableClient.createEntity(entity);
    res.status(201).json(entity);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar produto" });
  }
});

router.put("/:id", upload.single("photo"), async (req, res) => {
  try {
    const existing: any = await productsTableClient.getEntity(
      PARTITION,
      req.params.id
    );
    const { brand, model, price, quantity, description } = req.body;

    let photoUrl = existing.photoUrl as string;
    if (req.file) {
      if (photoUrl) await deleteProductImage(photoUrl);
      photoUrl = await uploadProductImage(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );
    }

    const entity = {
      partitionKey: PARTITION,
      rowKey: req.params.id,
      brand: brand ?? existing.brand,
      model: model ?? existing.model,
      price: price !== undefined ? Number(price) : existing.price,
      quantity: quantity !== undefined ? Number(quantity) : existing.quantity,
      description: description ?? existing.description,
      photoUrl,
    };

    await productsTableClient.updateEntity(entity, "Replace");
    res.json(entity);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar produto" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const existing: any = await productsTableClient.getEntity(
      PARTITION,
      req.params.id
    );
    if (existing.photoUrl) await deleteProductImage(existing.photoUrl);
    await productsTableClient.deleteEntity(PARTITION, req.params.id);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao excluir produto" });
  }
});

export default router;
