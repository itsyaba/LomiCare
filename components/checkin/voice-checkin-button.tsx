"use client";

import { useState, useRef } from "react";
import { Mic, MicOff, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/useLanguage";

export function VoiceCheckInButton({
  onExtract,
}: {
  onExtract: (data: {
    mood?: number;
    energy?: number;
    stress?: number;
    sleepHours?: number | null;
    cleanedNote: string;
  }) => void;
}) {
  const { language } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Voice check-in is not supported in this browser. You can still type your note.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === "am" ? "am-ET" : "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: any) => {
      setIsListening(false);
      toast.error("Speech recognition error: " + event.error);
    };
    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIsProcessing(true);
      
      try {
        const res = await fetch("/api/checkin/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcript, language }),
        });
        const data = await res.json();
        
        if (data.error) throw new Error(data.error);
        
        onExtract(data.extracted);
        toast.success("Voice processed successfully");
      } catch (err: any) {
        toast.error("Extraction failed: " + err.message);
        onExtract({ cleanedNote: transcript }); // Fallback
      } finally {
        setIsProcessing(false);
      }
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={isListening ? stopListening : startListening}
      disabled={isProcessing}
      className={`gap-2 ${isListening ? "border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600" : ""}`}
    >
      {isProcessing ? (
        <Loader2 className="size-4 animate-spin" />
      ) : isListening ? (
        <MicOff className="size-4" />
      ) : (
        <Mic className="size-4" />
      )}
      {isProcessing ? "Processing..." : isListening ? "Listening..." : "Voice Check-in"}
      {!isProcessing && !isListening && <Sparkles className="size-3 ml-1 text-muted-foreground" />}
    </Button>
  );
}
