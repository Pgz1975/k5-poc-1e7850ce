import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface DraggableItem {
  id: string;
  content: string | { type: "image"; url: string };
  label?: string;
  correctZone?: string;
  type?: string;
}

interface MatchContent {
  mode: string;
  question: string;
  questionText?: string;
  draggableItems: DraggableItem[];
  dropZones: any[];
  allowMultiplePerZone: boolean;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          persistSession: false,
        },
      }
    );

    console.log("🔍 Scanning for duplicate images in drag-drop exercises...");

    // Get all drag-drop match exercises
    const { data: exercises, error: fetchError } = await supabaseClient
      .from("manual_assessments")
      .select("id, title, content")
      .eq("type", "exercise")
      .eq("subtype", "drag_drop");

    if (fetchError) {
      throw fetchError;
    }

    const fixes: any[] = [];
    const duplicatesFound: any[] = [];

    for (const exercise of exercises || []) {
      const content = exercise.content as MatchContent;
      
      // Only check match mode exercises
      if (content?.mode !== "match" || !content.draggableItems) {
        continue;
      }

      // Extract image URLs
      const imageUrls: string[] = [];
      for (const item of content.draggableItems) {
        let url = "";
        if (typeof item.content === "string") {
          url = item.content;
        } else if (item.content && typeof item.content === "object" && "url" in item.content) {
          url = item.content.url;
        }
        imageUrls.push(url);
      }

      // Check for duplicates
      const uniqueUrls = new Set(imageUrls);
      if (uniqueUrls.size < imageUrls.length) {
        console.log(`⚠️ Duplicate found in: ${exercise.title} (${exercise.id})`);
        console.log(`   Images: ${imageUrls.length}, Unique: ${uniqueUrls.size}`);
        
        duplicatesFound.push({
          id: exercise.id,
          title: exercise.title,
          totalImages: imageUrls.length,
          uniqueImages: uniqueUrls.size,
          duplicateUrls: imageUrls.filter((url, index) => imageUrls.indexOf(url) !== index),
        });

        // For now, just log - don't auto-fix as we need different images
        // In production, you would need to fetch new images from Pexels
        console.log(`   Note: Automated fix requires fetching new images from Pexels API`);
      }
    }

    console.log(`\n✅ Scan complete. Found ${duplicatesFound.length} exercises with duplicates.`);

    return new Response(
      JSON.stringify({
        success: true,
        scanned: exercises?.length || 0,
        duplicatesFound: duplicatesFound.length,
        duplicates: duplicatesFound,
        message: duplicatesFound.length > 0 
          ? "Duplicates found. Please regenerate content or manually replace duplicate images."
          : "No duplicates found!",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("❌ Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
