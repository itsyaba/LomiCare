import {
  AmbientBackdrop,
  PageHeader,
} from "@/components/dashboard/page-header";
import { ChatWindow } from "@/components/chat/chat-window";

export default function ChatPage() {
  return (
    <main className="relative isolate space-y-8 px-4 pb-12 lg:px-6">
      <AmbientBackdrop variant="warm" />

      <PageHeader
        eyebrow="conversation"
        title="Speak with"
        italicAccent="Selam."
        sub="Type or talk — in Amharic or English. No judgement, no logging beyond what you share."
      />

      <section className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur">
        <ChatWindow />
      </section>
    </main>
  );
}
