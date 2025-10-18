import { Card } from "@/components/ui/card";

interface IllustrationPanelProps {
  imagePath: string;
}

export const IllustrationPanel = ({ imagePath }: IllustrationPanelProps) => {
  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg border-2 border-primary/10 h-[300px] flex items-center justify-center">
      <div className="relative w-full h-full">
        <img
          src={imagePath}
          alt="Exercise illustration"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
    </Card>
  );
};
