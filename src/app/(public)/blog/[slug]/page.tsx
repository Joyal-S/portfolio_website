import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { getPostBySlug } from "@/features/blog/queries";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/layout/container";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import { TipTapRenderer } from "./tiptap-renderer";

export const dynamic = "force-dynamic";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="pt-28 md:pt-32 pb-20">
      <Container>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to blog
        </Link>

        <article className="max-w-3xl mx-auto">
          <header className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag: string) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              {post.title}
            </h1>

            <p className="text-lg text-muted-foreground mb-6">
              {post.excerpt}
            </p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {post.published_at && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {formatDate(post.published_at)}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {post.reading_time} min read
              </span>
            </div>
          </header>

          {post.cover_image && (
            <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden mb-8">
              <Image
                src={post.cover_image}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          )}

          <Separator className="mb-8" />

          <div className="prose prose-invert max-w-none">
            <TipTapRenderer content={post.content as Record<string, unknown>} />
          </div>
        </article>
      </Container>
    </div>
  );
}
