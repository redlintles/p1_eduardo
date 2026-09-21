import { TableClient } from "@azure/data-tables";
import { BlobServiceClient } from "@azure/storage-blob";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = process.env.BLOB_CONTAINER_NAME || "product-images";

if (!connectionString) {
  throw new Error(
    "AZURE_STORAGE_CONNECTION_STRING não configurada. Verifique o arquivo .env"
  );
}

export const blobServiceClient =
  BlobServiceClient.fromConnectionString(connectionString);
export const containerClient =
  blobServiceClient.getContainerClient(containerName);

export const productsTableClient = TableClient.fromConnectionString(
  connectionString,
  "Products"
);
export const customersTableClient = TableClient.fromConnectionString(
  connectionString,
  "Customers"
);
export const ordersTableClient = TableClient.fromConnectionString(
  connectionString,
  "Orders"
);

// Garante que o container de blobs e as tabelas existam antes da aplicação subir.
export async function ensureAzureResourcesExist(): Promise<void> {
  try {
    await containerClient.createIfNotExists({ access: "blob" });
  } catch (err) {
    console.error("Erro ao criar/verificar container de blobs:", err);
  }

  const tableClients = [
    productsTableClient,
    customersTableClient,
    ordersTableClient,
  ];

  for (const client of tableClients) {
    try {
      await client.createTable();
    } catch (err: any) {
      // 409 = tabela já existe, pode ignorar
      if (err?.statusCode !== 409) {
        console.error(`Erro ao criar tabela ${client.tableName}:`, err);
      }
    }
  }
}
