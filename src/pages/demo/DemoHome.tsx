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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 via-white to-blue-50">
      <Header />

      <main className="flex-1 py-10">
        <div className="container max-w-5xl px-4 md:px-6 mx-auto space-y-8">
          <div className="text-center space-y-4">
            <AIDemoBadge className="mx-auto w-fit" />
            <h1 className="text-4xl font-bold tracking-tight text-primary">
              OpenAI Realtime Demo Lab
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore isolated voice-first activities powered by the OpenAI Realtime API.
              These demos are completely separate from production lessons and designed for
              rapid experimentation.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {activities.map((activity) => (
                <Card key={activity.id} className="p-6 relative overflow-hidden">
                  <div className="absolute -top-6 -right-6 text-purple-200">
                    <Sparkles className="w-20 h-20" />
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {languageLabels[activity.language] ?? activity.language}
                      </Badge>
                      <Badge variant="secondary">
                        {demoTypeLabels[activity.demo_type] ?? activity.demo_type}
                      </Badge>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">{activity.title}</h2>
                      {activity.description && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {activity.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Mic className="w-4 h-4" />
                      <span>Realtime voice session with isolated demo storage</span>
                    </div>
                    <Button asChild>
                      <Link to={`/demo/${activity.demo_type}/${activity.id}`}>
                        Enter Demo
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
