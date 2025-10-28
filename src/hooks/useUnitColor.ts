import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// V2 Color Schemes matching StudentLessonsProgress-v2.tsx
const unitColorSchemes = [
  {
    // Unit 1 - Pink
    bg: "bg-[hsl(329,100%,71%)]",
    border: "border-[hsl(329,100%,65%)]",
    text: "text-[hsl(329,100%,40%)]",
    shadow: "shadow-[0_6px_0_hsl(329,100%,60%)]",
    iconBg: "bg-[hsl(329,100%,65%)]",
    headerBg: "bg-[hsl(329,100%,65%)]",
  },
  {
    // Unit 2 - Orange
    bg: "bg-[hsl(11,100%,67%)]",
    border: "border-[hsl(11,100%,65%)]",
    text: "text-[hsl(11,100%,40%)]",
    shadow: "shadow-[0_6px_0_hsl(11,100%,60%)]",
    iconBg: "bg-[hsl(11,100%,65%)]",
    headerBg: "bg-[hsl(11,100%,65%)]",
  },
  {
    // Unit 3 - Amber
    bg: "bg-[hsl(27,100%,71%)]",
    border: "border-[hsl(27,100%,65%)]",
    text: "text-[hsl(27,100%,40%)]",
    shadow: "shadow-[0_6px_0_hsl(27,100%,60%)]",
    iconBg: "bg-[hsl(27,100%,65%)]",
    headerBg: "bg-[hsl(27,100%,65%)]",
  },
  {
    // Unit 4 - Green
    bg: "bg-[hsl(125,100%,71%)]",
    border: "border-[hsl(125,100%,65%)]",
    text: "text-[hsl(125,100%,35%)]",
    shadow: "shadow-[0_6px_0_hsl(125,100%,60%)]",
    iconBg: "bg-[hsl(125,100%,65%)]",
    headerBg: "bg-[hsl(125,100%,65%)]",
  },
  {
    // Unit 5 - Cyan
    bg: "bg-[hsl(176,84%,71%)]",
    border: "border-[hsl(176,84%,65%)]",
    text: "text-[hsl(176,84%,35%)]",
    shadow: "shadow-[0_6px_0_hsl(176,84%,60%)]",
    iconBg: "bg-[hsl(176,84%,65%)]",
    headerBg: "bg-[hsl(176,84%,65%)]",
  },
  {
    // Unit 6 - Purple
    bg: "bg-[hsl(250,100%,75%)]",
    border: "border-[hsl(250,100%,70%)]",
    text: "text-[hsl(250,100%,40%)]",
    shadow: "shadow-[0_6px_0_hsl(250,100%,65%)]",
    iconBg: "bg-[hsl(250,100%,70%)]",
    headerBg: "bg-[hsl(250,100%,70%)]",
  },
];

type ColorScheme = {
  bg: string;
  border: string;
  text: string;
  shadow: string;
  iconBg: string;
  headerBg: string;
};

export const useUnitColor = (assessmentId: string | undefined) => {
  const { data: colorScheme, isLoading } = useQuery({
    queryKey: ['unit-color', assessmentId],
    queryFn: async () => {
      if (!assessmentId) return unitColorSchemes[0]; // Default to Unit 1 (Pink)

      // Step 1: Fetch assessment to check if it has a parent_lesson_id
      const { data: assessment, error: assessmentError } = await supabase
        .from('manual_assessments')
        .select('parent_lesson_id')
        .eq('id', assessmentId)
        .maybeSingle();

      if (assessmentError) {
        console.error('Error fetching assessment:', assessmentError);
        return unitColorSchemes[0]; // Fallback to Unit 1
      }

      // Step 2: Determine which ID to use for lesson_ordering query
      const lessonId = assessment?.parent_lesson_id || assessmentId;

      // Step 3: Query lesson_ordering to get domain_order
      const { data: ordering, error: orderingError } = await supabase
        .from('lesson_ordering')
        .select('domain_order')
        .eq('assessment_id', lessonId)
        .maybeSingle();

      if (orderingError) {
        console.error('Error fetching lesson ordering:', orderingError);
        return unitColorSchemes[0]; // Fallback to Unit 1
      }

      // Step 4: Map domain_order (1-6) to color scheme index (0-5)
      const domainOrder = ordering?.domain_order;
      if (!domainOrder || domainOrder < 1 || domainOrder > 6) {
        console.warn(`Invalid domain_order: ${domainOrder}, falling back to Unit 1`);
        return unitColorSchemes[0]; // Fallback to Unit 1
      }

      // Step 5: Return the corresponding color scheme
      return unitColorSchemes[domainOrder - 1];
    },
    enabled: !!assessmentId,
  });

  return {
    colorScheme: colorScheme || unitColorSchemes[0],
    isLoading,
  };
};
