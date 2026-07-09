"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, CheckCircle, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleMessageRead, deleteMessage } from "@/features/admin/actions";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export function AdminMessagesList({
  messages,
}: {
  messages: Message[];
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleToggleRead = async (id: string, current: boolean) => {
    setTogglingId(id);
    try {
      await toggleMessageRead(id, current);
      router.refresh();
    } catch {
      toast.error("Failed to update message");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    try {
      await deleteMessage(id);
      toast.success("Message deleted");
      if (selected === id) setSelected(null);
      router.refresh();
    } catch {
      toast.error("Failed to delete message");
    }
  };

  if (messages.length === 0) {
    return (
      <div className="glass rounded-xl p-12 text-center">
        <Mail className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">No messages yet.</p>
      </div>
    );
  }

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="space-y-4">
      {unreadCount > 0 && (
        <p className="text-sm text-muted-foreground">
          {unreadCount} unread {unreadCount === 1 ? "message" : "messages"}
        </p>
      )}

      <div className="glass rounded-xl overflow-hidden">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`border-b border-border/50 last:border-0 transition-colors ${
              !msg.is_read ? "bg-primary/5" : ""
            }`}
          >
            <button
              type="button"
              onClick={() =>
                setSelected(selected === msg.id ? null : msg.id)
              }
              className="w-full text-left p-4 hover:bg-accent/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    {!msg.is_read && (
                      <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    )}
                    <p className="font-medium truncate">{msg.name}</p>
                    <span className="text-xs text-muted-foreground">
                      {msg.email}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {msg.message}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDate(msg.created_at)}
                  </span>
                </div>
              </div>
            </button>

            {selected === msg.id && (
              <div className="px-4 pb-4">
                <div className="glass rounded-lg p-4 mb-3">
                  <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleRead(msg.id, msg.is_read)}
                    disabled={togglingId === msg.id}
                  >
                    {togglingId === msg.id ? (
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    ) : (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    )}
                    {msg.is_read ? "Mark unread" : "Mark read"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(msg.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
