import Link from "next/link";
import { Plus } from "lucide-react";
import { getAdminPosts } from "@/features/blog/queries";
import { Button } from "@/components/ui/button";
import { AdminPostList } from "./post-list";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await getAdminPosts();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Blog Posts</h1>
          <p className="text-muted-foreground mt-1">
            Manage your blog posts.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/blog/new">
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Link>
        </Button>
      </div>

      <AdminPostList posts={posts} />
    </div>
  );
}
