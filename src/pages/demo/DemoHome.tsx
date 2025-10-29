import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AIDemoBadge } from "@/components/demo/AIDemoBadge";
import { Loader2, Mic, Sparkles } from "lucide-react";

type DemoActivity =
  Database["public"]["Tables"]["demo_activities"]["Row"];

const demoTypeLabels: Record<string, string> = {
  readflow: "ReadFlow - Interactive Reading",
  pronunciation: "Pronunciation Coaching",
  speed_quiz: "Speed Quiz",
  voice_builder: "Voice Builder",
  spelling: "Spelling Coach",
  writing: "Writing Coach",
  story: "Story Explorer",
};

const languageLabels: Record<string, string> = {
  "es-PR": "Puerto Rican Spanish",
  "en-US": "American English",
};

export default function DemoHome() {
  const [activities, setActivities] = useState<DemoActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDemoActivities = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("demo_activities")
        .select("*")
        .order("demo_type", { ascending: true })
        .order("language", { ascending: true });

      if (!error && data) {
        setActivities(data);
      } else {
        console.error("Failed to load demo activities", error);
      }
      setLoading(false);
    };

    fetchDemoActivities();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[hsl(329,100%,95%)] via-[hsl(45,100%,95%)] to-[hsl(125,100%,95%)]">
      <Header />

      <main className="flex-1 py-12">
        <div className="container max-w-6xl px-4 md:px-6 mx-auto space-y-10">
          {/* Hero Section */}
          <div className="text-center space-y-6 py-8">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border-4 border-[hsl(329,100%,85%)] shadow-lg">
              <Sparkles className="h-6 w-6 text-[hsl(329,100%,45%)]" />
              <span className="text-lg font-bold text-[hsl(329,100%,35%)]">AI Demo Lab</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-[hsl(329,100%,45%)] via-[hsl(45,100%,45%)] to-[hsl(125,100%,45%)] bg-clip-text text-transparent">
              OpenAI Realtime Demos
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto font-medium leading-relaxed">
              🎤 Explore voice-first activities powered by the OpenAI Realtime API.<br/>
              These demos are isolated from production and built for rapid experimentation.
            </p>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 className="w-16 h-16 animate-spin text-[hsl(329,100%,45%)]" />
              <p className="text-xl font-bold text-gray-700">Loading demos...</p>
            </div>
          ) : (
            /* Activity Grid */
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
              {activities.map((activity) => (
                <Card 
                  key={activity.id} 
                  className="relative overflow-hidden bg-white border-4 border-gray-800 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-200 p-8"
                >
                  {/* Decorative Background Icon */}
                  <div className="absolute -top-8 -right-8 text-[hsl(329,100%,90%)] opacity-50">
                    <Sparkles className="w-32 h-32" />
                  </div>

                  <div className="relative flex flex-col gap-5">
                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge 
                        variant="outline" 
                        className="px-4 py-1.5 text-sm font-bold border-3 border-[hsl(125,100%,85%)] bg-[hsl(125,100%,95%)] text-[hsl(125,100%,35%)] rounded-full"
                      >
                        {languageLabels[activity.language] ?? activity.language}
                      </Badge>
                      <Badge 
                        variant="secondary" 
                        className="px-4 py-1.5 text-sm font-bold border-3 border-[hsl(45,100%,85%)] bg-[hsl(45,100%,95%)] text-[hsl(45,100%,35%)] rounded-full"
                      >
                        {demoTypeLabels[activity.demo_type] ?? activity.demo_type}
                      </Badge>
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-3">
                      <h2 className="text-2xl font-black text-gray-900 leading-tight">
                        {activity.title}
                      </h2>
                      {activity.description && (
                        <p className="text-base text-gray-600 font-medium leading-relaxed">
                          {activity.description}
                        </p>
                      )}
                    </div>

                    {/* Voice Info */}
                    <div className="flex items-center gap-3 px-4 py-3 bg-[hsl(329,100%,98%)] rounded-2xl border-2 border-[hsl(329,100%,85%)]">
                      <div className="p-2 bg-white rounded-xl border-2 border-[hsl(329,100%,85%)]">
                        <Mic className="w-5 h-5 text-[hsl(329,100%,45%)]" />
                      </div>
                      <span className="text-sm font-bold text-gray-700">
                        Realtime voice session
                      </span>
                    </div>

                    {/* CTA Button */}
                    <Button 
                      asChild 
                      className="w-full h-14 text-lg font-black bg-gradient-to-r from-[hsl(329,100%,45%)] to-[hsl(329,100%,55%)] hover:from-[hsl(329,100%,50%)] hover:to-[hsl(329,100%,60%)] text-white border-4 border-gray-900 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <Link to={`/demo/${activity.demo_type}/${activity.id}`}>
                        🎬 Enter Demo
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
