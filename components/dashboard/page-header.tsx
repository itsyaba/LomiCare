import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  italicAccent,
  sub,
  right,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  italicAccent?: string;
  sub?: string;
  right?: React.ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div>
        {eyebrow && (
          <p className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            <span className="size-1.5 rounded-full bg-secondary" />
            {eyebrow}
          </p>
        )}
        <h1 className="mt-3 font-serif text-4xl font-light leading-[1.05] tracking-tight text-foreground sm:text-5xl">
          {title}
          {italicAccent && (
            <>
              {" "}
              <span className="italic text-primary">{italicAccent}</span>
            </>
          )}
        </h1>
        {sub && (
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            {sub}
          </p>
        )}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </header>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  right,
  className,
}: {
  eyebrow?: string;
  title: string;
  right?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-end justify-between gap-3 border-b border-border/60 pb-3",
        className,
      )}
    >
      <div>
        {eyebrow && (
          <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-1 font-serif text-xl font-medium text-foreground">
          {title}
        </h2>
      </div>
      {right && <div>{right}</div>}
    </div>
  );
}

export function AmbientBackdrop({
  variant = "warm",
}: {
  variant?: "warm" | "cool";
}) {
  return (
    <>
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -top-32 -left-20 -z-10 h-[420px] w-[420px] rounded-full blur-3xl",
          variant === "warm"
            ? "bg-[radial-gradient(circle,rgba(232,184,75,0.22),transparent_65%)]"
            : "bg-[radial-gradient(circle,rgba(74,124,89,0.18),transparent_65%)]",
        )}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-20 -z-10 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(200,98,42,0.12),transparent_65%)] blur-3xl"
      />
    </>
  );
}
