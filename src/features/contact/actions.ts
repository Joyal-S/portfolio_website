"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { sendContactNotification } from "@/lib/email";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  message: z.string().min(1, "Message is required").max(5000),
});

export async function submitContactForm(formData: FormData) {
  const validated = contactSchema.parse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  const supabase = createServerSupabase();

  const { error } = await supabase.from("messages").insert({
    name: validated.name,
    email: validated.email,
    message: validated.message,
  });

  if (error) {
    return { error: "Failed to send message. Please try again." };
  }

  await sendContactNotification({
    name: validated.name,
    email: validated.email,
    message: validated.message,
  });

  return { success: true };
}
