export type Tip = {
  category: string;
  title: string;
  body: string;
  emoji: string;
};

export function TipCard({ tip }: { tip: Tip }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-6 backdrop-blur transition-colors hover:bg-card">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          {tip.category}
        </span>
        <span aria-hidden className="text-2xl">
          {tip.emoji}
        </span>
      </div>
      <h3 className="mt-4 font-serif text-xl font-medium leading-snug text-foreground">
        {tip.title}
      </h3>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{tip.body}</p>
    </article>
  );
}
