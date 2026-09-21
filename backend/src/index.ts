import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import { ensureAzureResourcesExist } from "./config/azure";
import productsRouter from "./routes/products";
import customersRouter from "./routes/customers";
import ordersRouter from "./routes/orders";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/products", productsRouter);
app.use("/api/customers", customersRouter);
app.use("/api/orders", ordersRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 4000;

ensureAzureResourcesExist()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
      console.log(`✅ Container e tabelas do Azure verificados/criados`);
    });
  })
  .catch((err) => {
    console.error("Erro ao inicializar recursos do Azure:", err);
    app.listen(PORT, () => {
      console.log(`⚠️  Servidor rodando em http://localhost:${PORT} (sem verificação inicial do Azure)`);
    });
  });
