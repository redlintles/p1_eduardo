import { v4 as uuidv4 } from "uuid";
import { containerClient } from "../config/azure";

/**
 * Faz upload de uma imagem de produto para o Azure Blob Storage
 * e retorna a URL pública de acesso ao blob.
 */
export async function uploadProductImage(
  fileBuffer: Buffer,
  originalName: string,
  mimeType: string
): Promise<string> {
  const ext = originalName.includes(".")
    ? originalName.split(".").pop()
    : "jpg";
  const blobName = `${uuidv4()}.${ext}`;

  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.uploadData(fileBuffer, {
    blobHTTPHeaders: { blobContentType: mimeType },
  });

  return blockBlobClient.url;
}

/**
 * Remove uma imagem de produto do Azure Blob Storage a partir da URL salva.
 */
export async function deleteProductImage(imageUrl: string): Promise<void> {
  try {
    const blobName = decodeURIComponent(imageUrl.split("/").pop() || "");
    if (!blobName) return;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.deleteIfExists();
  } catch (err) {
    console.error("Erro ao deletar imagem do Blob Storage:", err);
  }
}
