import { createClient } from "./client";

export async function uploadFile(
  bucket: string,
  file: File,
  path?: string,
): Promise<string> {
  const supabase = createClient();
  const fileExt = file.name.split(".").pop();
  const fileName = `${path || crypto.randomUUID()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) throw new Error(error.message);

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

export async function deleteFile(bucket: string, url: string) {
  const supabase = createClient();
  const path = url.split("/").pop();
  if (!path) return;

  await supabase.storage.from(bucket).remove([path]);
}

export function getFileFromUrl(url: string): { bucket: string; path: string } | null {
  const match = url.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)/);
  if (!match) return null;
  return { bucket: match[1]!, path: match[2]! };
}
