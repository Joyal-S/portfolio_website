import { createServerSupabase } from "@/lib/supabase/server";
import { AdminMessagesList } from "./messages-list";

export const dynamic = "force-dynamic";

async function getMessages() {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  return data ?? [];
}

export default async function AdminMessagesPage() {
  const messages = await getMessages();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground mt-1">
          Messages from your contact form.
        </p>
      </div>

      <AdminMessagesList messages={messages} />
    </div>
  );
}
