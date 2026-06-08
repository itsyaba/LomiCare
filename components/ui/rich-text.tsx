import { Fragment, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Lightweight inline markdown renderer for AI-generated text.
 *
 * Handles the emphasis markers Selam emits — `**bold**` and `*italic*` /
 * `_italic_` — without pulling in a full markdown dependency. Cultural words
 * the AI italicises (e.g. *berbere*, *injera*, *buna*) get highlighted instead
 * of showing their raw asterisks. Newlines are preserved by callers via
 * `whitespace-pre-line`.
 */

type RichTextProps = {
  text?: string | null;
  className?: string;
};

// Matches **bold**, *italic*, or _italic_ (non-greedy, no nested markers).
const TOKEN = /(\*\*[^*]+\*\*|\*[^*\n]+\*|_[^_\n]+_)/g;

function parse(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const parts = text.split(TOKEN);

  parts.forEach((part, i) => {
    if (!part) return;

    if (part.startsWith("**") && part.endsWith("**")) {
      nodes.push(
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>,
      );
      return;
    }

    if (
      (part.startsWith("*") && part.endsWith("*")) ||
      (part.startsWith("_") && part.endsWith("_"))
    ) {
      nodes.push(
        <em key={i} className="font-medium italic text-primary">
          {part.slice(1, -1)}
        </em>,
      );
      return;
    }

    nodes.push(<Fragment key={i}>{part}</Fragment>);
  });

  return nodes;
}

export function RichText({ text, className }: RichTextProps) {
  if (!text) return null;

  const content = parse(text);

  if (!className) return <>{content}</>;

  return <span className={cn(className)}>{content}</span>;
}
