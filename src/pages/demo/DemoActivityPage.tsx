import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Construction } from "lucide-react";
import { ReadFlowPlayer } from "@/components/demo/DemoPlayers/ReadFlowPlayer";
import { PronunciationPlayer } from "@/components/demo/DemoPlayers/PronunciationPlayer";
import { SpeedQuizPlayer } from "@/components/demo/DemoPlayers/SpeedQuizPlayer";

type DemoActivity =
  Database["public"]["Tables"]["demo_activities"]["Row"];

export default function DemoActivityPage() {
  const params = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const [activity, setActivity] = useState<DemoActivity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      if (!params.id) return;
      setLoading(true);
      const { data, error } = await supabase
        .from("demo_activities")
        .select("*")
        .eq("id", params.id)
        .maybeSingle();

      if (!error && data) {
        setActivity(data);
      } else {
        console.error("Failed to load demo activity", error);
      }
      setLoading(false);
    };

    fetchActivity();
  }, [params.id]);

  const player = useMemo(() => {
    if (!activity) return null;

    const baseProps = {
      activityId: activity.id,
      language: activity.language,
    };

    switch (activity.demo_type) {
      case "readflow":
        return (
          <ReadFlowPlayer
            {...baseProps}
            content={activity.content as any}
          />
        );
      case "pronunciation":
        return (
          <PronunciationPlayer
            {...baseProps}
            content={activity.content as any}
          />
        );
      case "speed_quiz":
        return (
          <SpeedQuizPlayer
            {...baseProps}
            content={activity.content as any}
          />
        );
      default:
        return (
          <Card className="p-12 text-center space-y-4">
            <Construction className="w-12 h-12 mx-auto text-muted-foreground" />
            <h2 className="text-2xl font-semibold">Demo Coming Soon</h2>
            <p className="text-muted-foreground">
              The {activity.demo_type} demo is not implemented yet. Check back later.
            </p>
          </Card>
        );
    }
  }, [activity]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 via-white to-blue-50">
      <Header />
      <main className="flex-1 py-10">
        <div className="container max-w-4xl px-4 md:px-6 mx-auto space-y-6">
          <Button
            variant="ghost"
            className="w-fit"
            onClick={() => navigate("/demo")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to demos
          </Button>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : !activity ? (
            <Card className="p-12 text-center space-y-4">
              <h2 className="text-2xl font-semibold">Demo not found</h2>
              <p className="text-muted-foreground">
                This demo activity may have been removed. Please return to the demo list.
              </p>
            </Card>
          ) : (
            player
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
