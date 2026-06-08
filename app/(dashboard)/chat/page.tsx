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
        title="A few minutes with"
        italicAccent="Selam."
        sub="Type or speak — in Amharic or English. Selam knows the fasts, the foods, the proverbs. No diagnosis, no scripts."
      />

      <section>
        <ChatWindow />
      </section>
    </main>
  );
}
