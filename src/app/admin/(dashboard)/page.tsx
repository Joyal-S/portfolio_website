import { createServerSupabase } from "@/lib/supabase/server";
import {
  FolderKanban,
  Award,
  Trophy,
  FileText,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";

async function safeCount(supabase: ReturnType<typeof createServerSupabase>, table: string) {
  try {
    const { count } = await supabase.from(table).select("*", { count: "exact", head: true });
    return count ?? 0;
  } catch {
    return 0;
  }
}

async function getStats() {
  const supabase = createServerSupabase();

  const [projects, certificates, achievements, posts, messages, unread] = await Promise.all([
    safeCount(supabase, "projects"),
    safeCount(supabase, "certificates"),
    safeCount(supabase, "achievements"),
    safeCount(supabase, "posts"),
    safeCount(supabase, "messages"),
    (async () => {
      try {
        const { count } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .eq("is_read", false);
        return count ?? 0;
      } catch {
        return 0;
      }
    })(),
  ]);

  return {
    projects,
    certificates,
    achievements,
    posts,
    messages,
    unread,
  };
}

const cards = [
  {
    title: "Projects",
    icon: FolderKanban,
    href: "/admin/projects",
    color: "text-purple-400 bg-purple-500/10",
  },
  {
    title: "Certificates",
    icon: Award,
    href: "/admin/certificates",
    color: "text-emerald-400 bg-emerald-500/10",
  },
  {
    title: "Achievements",
    icon: Trophy,
    href: "/admin/achievements",
    color: "text-amber-400 bg-amber-500/10",
  },
  {
    title: "Blog Posts",
    icon: FileText,
    href: "/admin/blog",
    color: "text-blue-400 bg-blue-500/10",
  },
  {
    title: "Messages",
    icon: MessageSquare,
    href: "/admin/messages",
    color: "text-rose-400 bg-rose-500/10",
  },
];

export default async function AdminDashboardPage() {
  const stats = await getStats();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome to your portfolio admin panel.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          const count =
            stats[card.title.toLowerCase().replace(" ", "") as keyof typeof stats] ?? 0;
          const isUnread = card.title === "Messages" && stats.unread > 0;

          return (
            <Link
              key={card.href}
              href={card.href}
              className="glass rounded-xl p-6 glass-hover"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${card.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <p className="text-2xl font-bold">{count}</p>
                </div>
              </div>
              {isUnread && (
                <p className="mt-2 text-xs text-rose-400">
                  {stats.unread} unread{" "}
                  {stats.unread === 1 ? "message" : "messages"}
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
