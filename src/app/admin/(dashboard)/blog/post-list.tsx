"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Edit, Trash2, ExternalLink, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { deletePost, togglePostPublish } from "@/features/admin/actions";
import { toast } from "sonner";

interface Post {
  id: string;
  title: string;
  slug: string;
  status: string;
  published_at: string | null;
}

export function AdminPostList({ posts }: { posts: Post[] }) {
  const router = useRouter();
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      await deletePost(id);
      toast.success("Post deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete post");
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: string) => {
    setTogglingId(id);
    try {
      await togglePostPublish(id, currentStatus);
      toast.success(
        currentStatus === "published" ? "Post unpublished" : "Post published",
      );
      router.refresh();
    } catch {
      toast.error("Failed to update post status");
    } finally {
      setTogglingId(null);
    }
  };

  if (posts.length === 0) {
    return (
      <div className="glass rounded-xl p-12 text-center">
        <p className="text-muted-foreground mb-4">No posts yet.</p>
        <Button asChild>
          <Link href="/admin/blog/new">Write your first post</Link>
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
              Status
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
          {posts.map((post) => (
            <tr
              key={post.id}
              className="border-b border-border/50 hover:bg-accent/50 transition-colors"
            >
              <td className="p-4 font-medium">{post.title}</td>
              <td className="p-4 hidden md:table-cell">
                <Badge
                  variant={post.status === "published" ? "default" : "outline"}
                >
                  {post.status}
                </Badge>
              </td>
              <td className="p-4 hidden sm:table-cell text-muted-foreground">
                {post.published_at
                  ? formatDate(post.published_at)
                  : "\u2014"}
              </td>
              <td className="p-4">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleTogglePublish(post.id, post.status)}
                    disabled={togglingId === post.id}
                    title={post.status === "published" ? "Unpublish" : "Publish"}
                  >
                    {togglingId === post.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : post.status === "published" ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  {post.status === "published" && (
                    <Button variant="ghost" size="icon" asChild>
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/blog/${post.id}`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(post.id, post.title)}
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
