import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPosts } from "@/features/blog/queries";
import { PageHeader } from "@/components/shared/page-header";
import { Section } from "@/components/shared/section";
import { GlowCard } from "@/components/shared/glow-card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight, FileText } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { EmptyState } from "@/components/shared/empty-state";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Technical articles, tutorials, and thoughts on software development and AI.",
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <>
      <PageHeader
        title="Blog"
        description="Thoughts, tutorials, and insights on full-stack development, AI, and building things."
      />
      <Section>
        {posts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <GlowCard key={post.id} delay={i * 0.1}>
                <Link href={`/blog/${post.slug}`} className="block">
                  {post.cover_image && (
                    <div className="relative w-full h-44 overflow-hidden">
                      <Image
                        src={post.cover_image}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-[10px]">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {post.published_at && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" aria-hidden="true" />
                          {formatDate(post.published_at)}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" aria-hidden="true" />
                        {post.reading_time} min read
                      </span>
                    </div>

                    <div className="mt-4 flex items-center text-sm text-primary font-medium">
                      Read more
                      <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </div>
                  </div>
                </Link>
              </GlowCard>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No posts yet"
            description="Blog posts will appear here once published."
            icon={<FileText className="h-8 w-8" />}
          />
        )}
      </Section>
    </>
  );
}
