import { generateId } from "@/utils/id";
import { deleteBlob, getBlob, putBlob } from "./indexedDb";

export async function saveAttachment(file: Blob): Promise<string> {
  const id = generateId();
  await putBlob(id, file);
  return id;
}

export async function readAttachmentAsDataUrl(id: string): Promise<string | undefined> {
  const blob = await getBlob(id);
  if (!blob) return undefined;
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

export async function readAttachmentAsBlob(id: string): Promise<Blob | undefined> {
  return getBlob(id);
}

export async function removeAttachment(id: string): Promise<void> {
  await deleteBlob(id);
}
