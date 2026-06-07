import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Does Selam really understand Amharic?",
    a: "Yes. Voice check-ins, ritual prompts, and AI responses are all designed Amharic-first, with English available alongside. You can switch mid-sentence and Selam will follow.",
  },
  {
    q: "Is my check-in data private?",
    a: "Your check-ins are private to you. Trusted circle members only ever see the gentle nudges you send them — never the raw entries or AI conversation.",
  },
  {
    q: "Is this a replacement for therapy?",
    a: "No. Selam is a daily companion, not a clinician. When our safety layer detects a crisis signal, we surface professional help and trusted contacts immediately.",
  },
  {
    q: "How does retreat mode work with Kuriftu?",
    a: "Guests at participating Kuriftu Resorts get a guided in-stay experience: morning intentions, evening reflections, and rituals shaped around the resort's pace.",
  },
  {
    q: "What does Selam cost?",
    a: "The core companion is free during our pilot. Retreat mode is included with eligible Kuriftu stays. We will share clear pricing before introducing any paid tier.",
  },
];

export default function FAQ() {
  return (
    <section className="border-t border-border/60 bg-background py-24">
      <div className="container mx-auto grid max-w-6xl gap-16 px-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.22em] text-secondary">
            Questions
          </p>
          <h2 className="font-serif text-4xl font-light leading-tight text-foreground sm:text-5xl">
            Honest answers,
            <br />
            <span className="italic">no clinical jargon.</span>
          </h2>
          <p className="mt-6 max-w-md text-sm leading-6 text-muted-foreground">
            Something missing? Reach out — we'd rather have the conversation
            than guess what you need.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f, i) => (
            <AccordionItem
              key={f.q}
              value={`item-${i}`}
              className="border-border/60"
            >
              <AccordionTrigger className="py-6 text-left font-serif text-lg text-foreground hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-sm leading-6 text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
