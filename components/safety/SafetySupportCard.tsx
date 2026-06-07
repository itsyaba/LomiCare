"use client";

import { ShieldCheck, Phone, MessageCircleHeart, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";
import { useRouter } from "next/navigation";

export function SafetySupportCard({
  riskLevel,
}: {
  riskLevel: "medium" | "high" | "low" | "none";
}) {
  const { language } = useLanguage();
  const router = useRouter();

  if (riskLevel === "none" || riskLevel === "low") return null;

  const handleCallEmergency = () => {
    window.location.href = "tel:907"; // standard emergency line in Ethiopia
  };

  const handleMessageTrusted = () => {
    router.push("/dashboard/setting/profile"); // Assuming trusted circle is on profile page
  };

  return (
    <Card className="border-red-200 bg-red-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-700">
          <ShieldCheck className="size-5" />
          {language === "am" ? "የድጋፍ አማራጮች" : "Support and Safety"}
        </CardTitle>
        <CardDescription className="text-red-900/70">
          {language === "am" 
            ? "በአሁኑ ጊዜ አስቸጋሪ ሁኔታ ውስጥ እንዳሉ እናስተውላለን። እባክዎ ለራስዎ እንክብካቤ ያድርጉ። ሰላም የህክምና ባለሙያ ምትክ አይደለም።"
            : "It sounds like you might be going through a really tough moment. Selam is not a replacement for professional help."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {riskLevel === "high" && (
          <Button variant="destructive" className="w-full justify-start gap-2" onClick={handleCallEmergency}>
            <Phone className="size-4" />
            {language === "am" ? "የአደጋ ጊዜ ጥሪ (907 / 911)" : "Call Emergency Services"}
          </Button>
        )}
        <Button variant="outline" className="w-full justify-start gap-2 border-red-200 hover:bg-red-100" onClick={handleMessageTrusted}>
          <UsersRound className="size-4 text-red-600" />
          {language === "am" ? "ለታመነ ሰው መልእክት ላክ" : "Message a Trusted Contact"}
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-2 text-red-700 hover:bg-red-100 hover:text-red-800">
          <MessageCircleHeart className="size-4" />
          {language === "am" ? "የመሬት ላይ ልምምድ ጀምር" : "Start a Grounding Exercise"}
        </Button>
      </CardContent>
    </Card>
  );
}
