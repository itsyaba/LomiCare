import Link from "next/link";

type Variant = "login" | "register";

const COPY: Record<
  Variant,
  { eyebrow: string; title: React.ReactNode; sub: string; footerQ: string; footerCta: string; footerHref: string }
> = {
  login: {
    eyebrow: "ሰላም · welcome back",
    title: (
      <>
        A quiet
        <br />
        <span className="italic text-primary">return.</span>
      </>
    ),
    sub: "Sign in to pick up your check-ins, rituals, and the people who keep you well.",
    footerQ: "New to Selam?",
    footerCta: "Create an account",
    footerHref: "/register",
  },
  register: {
    eyebrow: "ሰላም · begin softly",
    title: (
      <>
        Start your daily
        <br />
        <span className="italic text-primary">check-in.</span>
      </>
    ),
    sub: "A culturally aware companion for wellness — in Amharic or English, at your own pace.",
    footerQ: "Already have an account?",
    footerCta: "Log in",
    footerHref: "/login",
  },
};

export function AuthShell({
  variant,
  children,
}: {
  variant: Variant;
  children: React.ReactNode;
}) {
  const copy = COPY[variant];

  return (
    <div className="relative isolate min-h-svh w-full overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-32 -z-10 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(232,184,75,0.32),transparent_60%)] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-32 -z-10 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(74,124,89,0.22),transparent_65%)] blur-3xl"
      />

      <div className="grid min-h-svh lg:grid-cols-2">
        {/* Brand pane */}
        <aside className="relative flex flex-col justify-between border-b border-border/60 px-8 py-10 lg:border-b-0 lg:border-r lg:px-14 lg:py-16">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-serif text-xl tracking-tight text-foreground"
            >
              <span className="size-2 rounded-full bg-primary" />
              Selam
            </Link>
            <Link
              href="/"
              className="text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
            >
              ← Home
            </Link>
          </div>

          <div className="mx-auto max-w-md py-12 lg:py-0">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-[11px] font-medium tracking-wide text-muted-foreground backdrop-blur">
              <span className="size-1.5 rounded-full bg-secondary" />
              {copy.eyebrow}
            </p>
            <h1 className="font-serif text-5xl font-light leading-[1.05] tracking-tight text-foreground lg:text-6xl">
              {copy.title}
            </h1>
            <p className="mt-6 max-w-sm text-base leading-7 text-muted-foreground">
              {copy.sub}
            </p>

            <div className="mt-12 hidden grid-cols-3 gap-px overflow-hidden rounded-xl border border-border/60 bg-border/60 lg:grid">
              {[
                { k: "voice", v: "Amharic-first" },
                { k: "ai", v: "Gentle AI" },
                { k: "circle", v: "Family-rooted" },
              ].map((item) => (
                <div
                  key={item.k}
                  className="bg-background/80 p-4 backdrop-blur"
                >
                  <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    {item.k}
                  </p>
                  <p className="mt-1 font-serif text-base text-foreground">
                    {item.v}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <p className="hidden text-xs text-muted-foreground lg:block">
            Built for Ethiopia, by Ethiopians.
          </p>
        </aside>

        {/* Form pane */}
        <main className="relative flex items-center justify-center px-6 py-12 lg:px-14 lg:py-16">
          <div className="w-full max-w-sm">
            {children}
            <p className="mt-10 text-center text-sm text-muted-foreground">
              {copy.footerQ}{" "}
              <Link
                href={copy.footerHref}
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                {copy.footerCta}
              </Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
