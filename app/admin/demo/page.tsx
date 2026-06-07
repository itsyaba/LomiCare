import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3, HeartPulse, Coffee, ShieldCheck, UsersRound } from "lucide-react";

export default function DemoAnalyticsPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Selam Impact Analytics</h1>
        <p className="text-muted-foreground mt-2">Privacy-preserving wellness insights for partners.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Check-ins</CardTitle>
            <BarChart3 className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Mood</CardTitle>
            <HeartPulse className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.2 / 10</div>
            <p className="text-xs text-muted-foreground">Stable across users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ritual Completion Rate</CardTitle>
            <Coffee className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">Highest: Buna Pause</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Language Usage</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Amharic (Am)</span>
                    <span className="font-bold">54%</span>
                  </div>
                  <Progress value={54} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>English (En)</span>
                    <span className="font-bold">46%</span>
                  </div>
                  <Progress value={46} />
                </div>
             </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Safety Layer Interventions</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2"><ShieldCheck className="size-4 text-red-500" /> High Risk Diverted</span>
                    <span className="font-bold">14 events</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2"><UsersRound className="size-4 text-blue-500" /> Trusted Circle Nudges Sent</span>
                    <span className="font-bold">284 nudges</span>
                  </div>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8 text-center text-sm text-muted-foreground">
        Designed for resort partners, wellness retreats, and hospitality experiences.
      </div>
    </div>
  );
}
