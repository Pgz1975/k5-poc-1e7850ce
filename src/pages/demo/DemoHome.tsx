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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      <Header />

      <main className="flex-1 py-12">
        <div className="container max-w-6xl px-4 md:px-6 mx-auto space-y-10">
          {/* Hero Section */}
          <div className="text-center space-y-4 py-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full border border-purple-200">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-semibold text-purple-700">AI Demo Lab</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
              OpenAI Realtime Demos
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore voice-first activities powered by the OpenAI Realtime API.
              Isolated demos built for rapid experimentation.
            </p>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
              <p className="text-base font-medium text-gray-600">Loading demos...</p>
            </div>
          ) : (
            /* Activity Grid */
            <div className="grid gap-6 md:grid-cols-2">
              {activities.map((activity, index) => {
                // Only enable first two pronunciation demos
                const isPronunciation = activity.demo_type === "pronunciation";
                const isFirstTwo = index < 2;
                const isEnabled = isPronunciation && isFirstTwo;

                return (
                  <Card 
                    key={activity.id} 
                    className={`relative overflow-hidden bg-white border border-gray-200 rounded-xl transition-shadow duration-200 p-6 ${
                      isEnabled ? 'hover:shadow-lg' : 'opacity-60'
                    }`}
                  >
                    {/* Decorative Background Icon */}
                    <div className="absolute -top-4 -right-4 text-purple-100 opacity-40">
                      <Sparkles className="w-24 h-24" />
                    </div>

                    <div className="relative flex flex-col gap-4">
                      {/* Badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className="px-3 py-1 text-xs font-semibold border-green-200 bg-green-50 text-green-700 rounded-full"
                        >
                          {languageLabels[activity.language] ?? activity.language}
                        </Badge>
                        <Badge 
                          variant="secondary" 
                          className="px-3 py-1 text-xs font-semibold border-blue-200 bg-blue-50 text-blue-700 rounded-full"
                        >
                          {demoTypeLabels[activity.demo_type] ?? activity.demo_type}
                        </Badge>
                        {!isEnabled && (
                          <Badge 
                            variant="outline" 
                            className="px-3 py-1 text-xs font-semibold border-orange-200 bg-orange-50 text-orange-700 rounded-full"
                          >
                            Coming Soon
                          </Badge>
                        )}
                      </div>

                      {/* Title & Description */}
                      <div className="space-y-2">
                        <h2 className="text-xl font-bold text-gray-900">
                          {activity.title}
                        </h2>
                        {activity.description && (
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {activity.description}
                          </p>
                        )}
                      </div>

                      {/* Voice Info */}
                      <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-lg border border-purple-100">
                        <Mic className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-gray-700">
                          Realtime voice session
                        </span>
                      </div>

                      {/* CTA Button */}
                      {isEnabled ? (
                        <Button 
                          asChild 
                          className="w-full mt-2"
                        >
                          <Link to={`/demo/${activity.demo_type}/${activity.id}`}>
                            Enter Demo
                          </Link>
                        </Button>
                      ) : (
                        <Button 
                          disabled 
                          className="w-full mt-2"
                        >
                          In Development
                        </Button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
