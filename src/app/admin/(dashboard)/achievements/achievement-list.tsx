"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { deleteAchievement } from "@/features/admin/actions";
import { toast } from "sonner";

interface Achievement {
  id: string;
  title: string;
  type: string;
  date: string;
}

export function AdminAchievementList({
  achievements,
}: {
  achievements: Achievement[];
}) {
  const router = useRouter();

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      await deleteAchievement(id);
      toast.success("Achievement deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete achievement");
    }
  };

  if (achievements.length === 0) {
    return (
      <div className="glass rounded-xl p-12 text-center">
        <p className="text-muted-foreground mb-4">
          No achievements yet.
        </p>
        <Button asChild>
          <Link href="/admin/achievements/new">Add Achievement</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left p-4 font-medium text-muted-foreground">
              Title
            </th>
            <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">
              Type
            </th>
            <th className="text-left p-4 font-medium text-muted-foreground hidden sm:table-cell">
              Date
            </th>
            <th className="text-right p-4 font-medium text-muted-foreground">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {achievements.map((a) => (
            <tr
              key={a.id}
              className="border-b border-border/50 hover:bg-accent/50 transition-colors"
            >
              <td className="p-4 font-medium">{a.title}</td>
              <td className="p-4 hidden md:table-cell">
                <Badge
                  variant={a.type === "hackathon" ? "indigo" : "purple"}
                >
                  {a.type}
                </Badge>
              </td>
              <td className="p-4 hidden sm:table-cell text-muted-foreground">
                {formatDate(a.date)}
              </td>
              <td className="p-4">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/achievements/${a.id}`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(a.id, a.title)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
