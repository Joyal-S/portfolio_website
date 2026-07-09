"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createPost, updatePost } from "@/features/admin/actions";
import { toast } from "sonner";
import { slugify, estimateReadingTime } from "@/lib/utils";
import { FileUpload } from "@/components/shared/file-upload";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  tags: z.string(),
  status: z.enum(["draft", "published"]),
  cover_image: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

import type { Post } from "@/types/database-generated";

export function PostForm({
  post,
  isNew,
}: {
  post: Post | null;
  isNew: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState(post?.cover_image ?? "");
  const slugManuallyEdited = useRef(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: post?.title ?? "",
      slug: post?.slug ?? "",
      excerpt: post?.excerpt ?? "",
      tags: post?.tags?.join(", ") ?? "",
      status: (post?.status as "draft" | "published") ?? "draft",
      cover_image: post?.cover_image ?? "",
    },
  });

  const onTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue("title", e.target.value);
      if (!slugManuallyEdited.current && isNew) {
        setValue("slug", slugify(e.target.value));
      }
    },
    [setValue, isNew],
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
      }),
      Image,
      Link,
      Placeholder.configure({
        placeholder: "Start writing your post...",
      }),
    ],
    content: (post?.content ?? {
      type: "doc",
      content: [{ type: "paragraph" }],
    }) as unknown as never,
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none focus:outline-none min-h-[400px] px-4 py-4",
      },
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!editor) return;

    setLoading(true);
    try {
      const tagsArray = data.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      const content = editor.getJSON() as Record<string, unknown>;
      const readingTime = estimateReadingTime(JSON.stringify(content));

      const payload = {
        title: data.title,
        slug: data.slug || slugify(data.title),
        excerpt: data.excerpt,
        content,
        tags: tagsArray,
        status: data.status,
        cover_image: coverImageUrl || null,
        reading_time: readingTime,
        published_at:
          data.status === "published"
            ? (post?.published_at ?? new Date().toISOString())
            : null,
      };

      if (isNew) {
        await createPost(payload);
        toast.success("Post created");
      } else if (post) {
        await updatePost(post.id, payload);
        toast.success("Post updated");
      }

      router.push("/admin/blog");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-4xl"
    >
      <div className="glass rounded-xl p-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              {...register("title")}
              placeholder="My Amazing Blog Post"
              onChange={onTitleChange}
            />
            {errors.title && (
              <p className="text-xs text-destructive">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Slug</label>
            <Input
              {...register("slug")}
              placeholder="my-amazing-post"
              onChange={(e) => {
                slugManuallyEdited.current = true;
                setValue("slug", slugify(e.target.value));
              }}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <select
              {...register("status")}
              className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Excerpt</label>
          <Textarea
            {...register("excerpt")}
            placeholder="A short summary of your post..."
            rows={2}
          />
          {errors.excerpt && (
            <p className="text-xs text-destructive">
              {errors.excerpt.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Tags</label>
          <Input
            {...register("tags")}
            placeholder="React, TypeScript, Next.js"
          />
          <p className="text-xs text-muted-foreground">
            Comma-separated tags
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Cover Image</label>
          <FileUpload
            bucket="posts"
            value={coverImageUrl}
            onChange={(v) => setCoverImageUrl(v as string)}
            accept="image/*"
          />
        </div>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <div className="flex items-center gap-1 px-4 py-2 border-b border-border bg-muted/30">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              editor?.chain().focus().toggleBold().run()
            }
            className={editor?.isActive("bold") ? "bg-primary/10" : ""}
          >
            B
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              editor?.chain().focus().toggleItalic().run()
            }
            className={
              editor?.isActive("italic") ? "bg-primary/10" : ""
            }
          >
            <em>I</em>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              editor
                ?.chain()
                .focus()
                .toggleHeading({ level: 2 })
                .run()
            }
            className={
              editor?.isActive("heading", { level: 2 })
                ? "bg-primary/10"
                : ""
            }
          >
            H2
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              editor
                ?.chain()
                .focus()
                .toggleHeading({ level: 3 })
                .run()
            }
            className={
              editor?.isActive("heading", { level: 3 })
                ? "bg-primary/10"
                : ""
            }
          >
            H3
          </Button>
          <span className="text-muted-foreground mx-1">|</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              editor?.chain().focus().toggleBulletList().run()
            }
            className={
              editor?.isActive("bulletList") ? "bg-primary/10" : ""
            }
          >
            List
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              editor?.chain().focus().toggleCodeBlock().run()
            }
            className={
              editor?.isActive("codeBlock") ? "bg-primary/10" : ""
            }
          >
            Code
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              const url = window.prompt("Enter URL:");
              if (url) {
                editor?.chain().focus().setLink({ href: url }).run();
              }
            }}
            className={
              editor?.isActive("link") ? "bg-primary/10" : ""
            }
          >
            Link
          </Button>
        </div>
        <EditorContent editor={editor} />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {isNew ? "Create Post" : "Save Changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/blog")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
