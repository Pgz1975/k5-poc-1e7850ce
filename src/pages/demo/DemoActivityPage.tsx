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
import { StoryPlayer } from "@/components/demo/DemoPlayers/StoryPlayer";
import { WritingPlayer } from "@/components/demo/DemoPlayers/WritingPlayer";
import { SpellingCoachPlayer } from "@/components/demo/DemoPlayers/SpellingCoachPlayer";

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
      case "story":
        return (
          <StoryPlayer
            {...baseProps}
            content={activity.content as any}
          />
        );
      case "writing":
        return (
          <WritingPlayer
            {...baseProps}
            content={activity.content as any}
          />
        );
      case "spelling":
        return (
          <SpellingCoachPlayer
            {...baseProps}
            content={activity.content as any}
          />
        );
      default:
        return (
          <Card className="p-16 text-center space-y-6 bg-white border-4 border-gray-800 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <Construction className="w-20 h-20 mx-auto text-[hsl(45,100%,45%)]" />
            <h2 className="text-3xl font-black text-gray-900">Demo Coming Soon</h2>
            <p className="text-lg text-gray-600 font-medium max-w-md mx-auto">
              The {activity.demo_type} demo is not implemented yet. Check back later!
            </p>
          </Card>
        );
    }
  }, [activity]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[hsl(329,100%,95%)] via-[hsl(45,100%,95%)] to-[hsl(125,100%,95%)]">
      <Header />
      <main className="flex-1 py-12">
        <div className="container max-w-5xl px-4 md:px-6 mx-auto space-y-8">
          {/* Back Button */}
          <Button
            variant="outline"
            className="w-fit px-6 py-6 text-base font-bold border-4 border-gray-800 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all duration-200 bg-white"
            onClick={() => navigate("/demo")}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to demos
          </Button>

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 className="w-16 h-16 animate-spin text-[hsl(329,100%,45%)]" />
              <p className="text-xl font-bold text-gray-700">Loading demo...</p>
            </div>
          ) : !activity ? (
            /* Error State */
            <Card className="p-16 text-center space-y-6 bg-white border-4 border-gray-800 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="text-6xl">😕</div>
              <h2 className="text-3xl font-black text-gray-900">Demo not found</h2>
              <p className="text-lg text-gray-600 font-medium max-w-md mx-auto">
                This demo activity may have been removed. Please return to the demo list.
              </p>
            </Card>
          ) : (
            /* Player Content */
            player
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
