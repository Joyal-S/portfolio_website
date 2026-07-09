import { getAdminPost } from "@/features/blog/queries";
import { notFound } from "next/navigation";
import { PostForm } from "./post-form";
import type { Post } from "@/types/database-generated";

interface Props {
  params: { id: string };
}

export default async function AdminPostEditPage({ params }: Props) {
  const isNew = params.id === "new";
  let post = null;

  if (!isNew) {
    post = await getAdminPost(params.id);
    if (!post) notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          {isNew ? "New Post" : "Edit Post"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {isNew ? "Write a new blog post." : `Editing: ${(post as Post)?.title}`}
        </p>
      </div>

      <PostForm post={post as Post | null} isNew={isNew} />
    </div>
  );
}
