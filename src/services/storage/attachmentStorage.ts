import { supabase } from "@/lib/supabase/client";
import { generateId } from "@/utils/id";

const BUCKET = "attachments";

async function currentUserId(): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return user.id;
}

export async function saveAttachment(file: Blob): Promise<string> {
  const userId = await currentUserId();
  const path = `${userId}/${generateId()}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type || "application/octet-stream" });
  if (error) throw error;
  return path;
}

export async function readAttachmentAsDataUrl(path: string): Promise<string | undefined> {
  const blob = await readAttachmentAsBlob(path);
  if (!blob) return undefined;
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

export async function readAttachmentAsBlob(path: string): Promise<Blob | undefined> {
  const { data, error } = await supabase.storage.from(BUCKET).download(path);
  if (error) return undefined;
  return data;
}

export async function removeAttachment(path: string): Promise<void> {
  await supabase.storage.from(BUCKET).remove([path]);
}
