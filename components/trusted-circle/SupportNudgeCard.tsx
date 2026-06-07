"use client";

import { useState } from "react";
import { UsersRound, Copy, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/useLanguage";
import { Textarea } from "@/components/ui/textarea";

export function SupportNudgeCard() {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [nudge, setNudge] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const generateNudge = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/trusted-circle/nudge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template: "I had a stressful day. Can you check in on me?", language }),
      });
      const data = await res.json();
      if (data.nudge) setNudge(data.nudge);
    } catch (err) {
      toast.error("Failed to generate nudge");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!nudge) return;
    navigator.clipboard.writeText(nudge.message);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-primary text-lg">
          <UsersRound className="size-5" />
          {language === "am" ? "የታመነ ሰው ድጋፍ" : "Trusted Circle Nudge"}
        </CardTitle>
        <CardDescription>
          {language === "am" 
            ? "በቀላሉ ለምትወዱት ሰው አጭር መልእክት እንድትልኩ እንረዳዎታለን።"
            : "Reach out to someone you trust without having to find the right words."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!nudge ? (
          <Button variant="outline" onClick={generateNudge} disabled={loading} className="w-full">
            {loading ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
            {language === "am" ? "መልእክት አዘጋጅ" : "Draft a quick message"}
          </Button>
        ) : (
          <div className="space-y-3">
            <Textarea 
              value={nudge.message} 
              onChange={(e) => setNudge({ ...nudge, message: e.target.value })}
              className="resize-none min-h-[80px]"
            />
            <div className="flex gap-2">
              <Button onClick={handleCopy} className="flex-1 gap-2" variant="secondary">
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                {copied ? "Copied" : "Copy Message"}
              </Button>
              <Button 
                onClick={() => window.open(`sms:?body=${encodeURIComponent(nudge.message)}`)}
                className="flex-1"
              >
                Send SMS
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0 text-[10px] text-muted-foreground text-center">
        Selam never shares your private journal notes unless you choose to copy and send them yourself.
      </CardFooter>
    </Card>
  );
}
