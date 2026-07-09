"use client";

import { useMemo } from "react";
import { generateHTML } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";

interface TipTapRendererProps {
  content: Record<string, unknown>;
}

export function TipTapRenderer({ content }: TipTapRendererProps) {
  const html = useMemo(() => {
    try {
      return generateHTML(content, [
        StarterKit.configure({
          heading: {
            levels: [1, 2, 3, 4],
          },
        }),
        Image.configure({
          inline: false,
        }),
        Link.configure({
          openOnClick: true,
        }),
      ]);
    } catch {
      return "<p>Could not render content</p>";
    }
  }, [content]);

  return (
    <div
      className="prose-config"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
