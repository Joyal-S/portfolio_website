"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkAdminStatus } from "@/lib/auth/admin";

async function assertAdmin() {
  const { isAdmin } = await checkAdminStatus();
  if (!isAdmin) {
    throw new Error("Unauthorized");
  }
}

// ── Projects ──

export async function createProject(data: Record<string, unknown>) {
  await assertAdmin();
  const supabase = createServerSupabase();
  const { error } = await supabase.from("projects").insert(data);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function updateProject(id: string, data: Record<string, unknown>) {
  await assertAdmin();
  const supabase = createServerSupabase();
  const { error } = await supabase.from("projects").update(data).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function deleteProject(id: string) {
  await assertAdmin();
  const supabase = createServerSupabase();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/projects");
}

// ── Certificates ──

export async function createCertificate(data: Record<string, unknown>) {
  await assertAdmin();
  const supabase = createServerSupabase();
  const { error } = await supabase.from("certificates").insert(data);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/certificates");
  redirect("/admin/certificates");
}

export async function updateCertificate(id: string, data: Record<string, unknown>) {
  await assertAdmin();
  const supabase = createServerSupabase();
  const { error } = await supabase.from("certificates").update(data).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/certificates");
  redirect("/admin/certificates");
}

export async function deleteCertificate(id: string) {
  await assertAdmin();
  const supabase = createServerSupabase();
  const { error } = await supabase.from("certificates").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/certificates");
}

// ── Achievements ──

export async function createAchievement(data: Record<string, unknown>) {
  await assertAdmin();
  const supabase = createServerSupabase();
  const { error } = await supabase.from("achievements").insert(data);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/achievements");
  redirect("/admin/achievements");
}

export async function updateAchievement(id: string, data: Record<string, unknown>) {
  await assertAdmin();
  const supabase = createServerSupabase();
  const { error } = await supabase.from("achievements").update(data).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/achievements");
  redirect("/admin/achievements");
}

export async function deleteAchievement(id: string) {
  await assertAdmin();
  const supabase = createServerSupabase();
  const { error } = await supabase.from("achievements").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/achievements");
}

// ── Blog Posts ──

export async function createPost(data: Record<string, unknown>) {
  await assertAdmin();
  const supabase = createServerSupabase();
  const { error } = await supabase.from("posts").insert(data);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function updatePost(id: string, data: Record<string, unknown>) {
  await assertAdmin();
  const supabase = createServerSupabase();
  const { error } = await supabase.from("posts").update(data).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function deletePost(id: string) {
  await assertAdmin();
  const supabase = createServerSupabase();
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/blog");
}

export async function togglePostPublish(id: string, currentStatus: string) {
  await assertAdmin();
  const supabase = createServerSupabase();
  const newStatus = currentStatus === "published" ? "draft" : "published";
  const { error } = await supabase
    .from("posts")
    .update({
      status: newStatus,
      published_at: newStatus === "published" ? new Date().toISOString() : null,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/blog");
}

// ── Messages ──

export async function toggleMessageRead(id: string, current: boolean) {
  await assertAdmin();
  const supabase = createServerSupabase();
  const { error } = await supabase
    .from("messages")
    .update({ is_read: !current })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: string) {
  await assertAdmin();
  const supabase = createServerSupabase();
  const { error } = await supabase.from("messages").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/messages");
}

// ── Site Settings ──

export async function updateSiteSettings(data: Record<string, unknown>) {
  await assertAdmin();
  const supabase = createServerSupabase();
  const { error } = await supabase.from("site_settings").update(data).eq("id", 1);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/settings");
  revalidatePath("/");
}

// ── Profile Image Upload ──

export async function ensureProfileImageBucket() {
  const admin = createAdminClient();
  const { data: buckets } = await admin.storage.listBuckets();
  if (!buckets?.some((b) => b.name === "profile")) {
    await admin.storage.createBucket("profile", {
      public: true,
      fileSizeLimit: 5 * 1024 * 1024,
      allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
    });
  }
}

export async function uploadProfileImage(formData: FormData) {
  await assertAdmin();
  const file = formData.get("file") as File | null;
  if (!file) throw new Error("No file provided");
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.type)) throw new Error("Only JPG, PNG and WEBP are accepted");
  if (file.size > 5 * 1024 * 1024) throw new Error("File must be under 5 MB");

  const supabase = createServerSupabase();
  await ensureProfileImageBucket();

  const admin = createAdminClient();
  const ext = file.type === "image/jpeg" ? "jpg" : file.type === "image/png" ? "png" : "webp";
  const path = `profile.${ext}`;

  const { error: uploadError } = await admin.storage
    .from("profile")
    .upload(path, file, {
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) throw new Error(uploadError.message);

  const { data: urlData } = admin.storage
    .from("profile")
    .getPublicUrl(path);

  const publicUrl = `${urlData.publicUrl}?v=${Date.now()}`;

  const { error: updateError } = await supabase
    .from("site_settings")
    .update({ profile_image_url: publicUrl })
    .eq("id", 1);

  if (updateError) throw new Error(updateError.message);

  revalidatePath("/admin/settings");
  revalidatePath("/");
  return { url: publicUrl };
}

export async function deleteProfileImage() {
  await assertAdmin();
  const supabase = createServerSupabase();

  for (const ext of ["jpg", "png", "webp"]) {
    const { error: removeError } = await supabase.storage.from("profile").remove([`profile.${ext}`]);
    if (removeError && !removeError.message.includes("not found")) throw new Error(removeError.message);
  }

  const { error: updateError } = await supabase
    .from("site_settings")
    .update({ profile_image_url: "" })
    .eq("id", 1);

  if (updateError) throw new Error(updateError.message);

  revalidatePath("/admin/settings");
  revalidatePath("/");
}

export async function getProfileImageInfo() {
  const supabase = createServerSupabase();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("profile_image_url")
    .eq("id", 1)
    .single();

  const url = (settings as { profile_image_url: string } | null)?.profile_image_url ?? "";
  return { url };
}

// ── Resume Upload ──

export async function ensureResumeBucket() {
  const admin = createAdminClient();
  const { data: buckets } = await admin.storage.listBuckets();
  if (!buckets?.some((b) => b.name === "resume")) {
    await admin.storage.createBucket("resume", {
      public: true,
      fileSizeLimit: 5 * 1024 * 1024,
      allowedMimeTypes: ["application/pdf"],
    });
  }
}

export async function uploadResume(formData: FormData) {
  await assertAdmin();
  const file = formData.get("file") as File | null;
  if (!file) throw new Error("No file provided");
  if (file.type !== "application/pdf") throw new Error("Only PDF files are accepted");
  if (file.size > 5 * 1024 * 1024) throw new Error("File must be under 5 MB");

 const supabase = createServerSupabase();
await ensureResumeBucket();

const admin = createAdminClient();

const { error: uploadError } = await admin.storage
  .from("resume")
  .upload("resume.pdf", file, {
    upsert: true,
    contentType: "application/pdf",
  });

if (uploadError) throw new Error(uploadError.message);

const { data: urlData } = admin.storage
  .from("resume")
  .getPublicUrl("resume.pdf");
  
  const publicUrl = urlData.publicUrl;

  const { error: updateError } = await supabase
    .from("site_settings")
    .update({ resume_url: publicUrl })
    .eq("id", 1);

  if (updateError) throw new Error(updateError.message);

  revalidatePath("/admin/settings");
  revalidatePath("/");
  return { url: publicUrl };
}

export async function deleteResume() {
  await assertAdmin();
  const supabase = createServerSupabase();

  const { error: removeError } = await supabase.storage.from("resume").remove(["resume.pdf"]);
  if (removeError && !removeError.message.includes("not found")) throw new Error(removeError.message);

  const { error: updateError } = await supabase
    .from("site_settings")
    .update({ resume_url: "" })
    .eq("id", 1);

  if (updateError) throw new Error(updateError.message);

  revalidatePath("/admin/settings");
  revalidatePath("/");
}

export async function getResumeInfo() {
  await assertAdmin();
  const supabase = createServerSupabase();

  const { data: settings } = await supabase
    .from("site_settings")
    .select("resume_url")
    .eq("id", 1)
    .single();

  const url = (settings as { resume_url: string } | null)?.resume_url ?? "";

  let fileName = "";
  let size = 0;
  if (url) {
    const { data: fileInfo } = await supabase.storage.from("resume").list("", { search: "resume.pdf" });
    if (fileInfo && fileInfo.length > 0) {
      fileName = fileInfo[0]?.name ?? "resume.pdf";
      size = fileInfo[0]?.metadata?.size ?? 0;
    }
  }

  return { url, fileName, size };
}
