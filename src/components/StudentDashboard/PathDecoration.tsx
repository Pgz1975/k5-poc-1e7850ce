import { cn } from "@/lib/utils";

interface PathDecorationProps {
  type: "thick-leaf" | "forest-leaf" | "three-leaves" | "oval-leaf" | "twin-leaves" | "split-leaf" | "small-leaves" | "tree";
  position: "left" | "right";
  color?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const PathDecoration = ({ 
  type, 
  position, 
  color = "#AAD15D",
  size = "md",
  className 
}: PathDecorationProps) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  };
  
  const svgPaths: Record<string, string> = {
    "thick-leaf": "/design elements/svgs/reshot-icon-thick-leaf-VRTC7E3JP5.svg",
    "forest-leaf": "/design elements/svgs/reshot-icon-forest-leaf-LSCJ9B4X6H.svg",
    "three-leaves": "/design elements/svgs/reshot-icon-three-leaves-KD6UVGSNFP.svg",
    "oval-leaf": "/design elements/svgs/reshot-icon-oval-leaf-J5NGAV7Q2Y.svg",
    "twin-leaves": "/design elements/svgs/reshot-icon-twin-leaves-258L6V4RY3.svg",
    "split-leaf": "/design elements/svgs/reshot-icon-split-leaf-GV53AWKBCS.svg",
    "small-leaves": "/design elements/svgs/reshot-icon-small-leaves-P4MUEALCWH.svg",
    "tree": "/design elements/svgs/reshot-icon-tree-2RGUBYTHQZ.svg"
  };
  
  return (
    <div 
      className={cn(
        "absolute z-0 opacity-20 pointer-events-none",
        sizeClasses[size],
        position === "left" ? "-left-6" : "-right-6",
        className
      )}
      style={{ 
        filter: `drop-shadow(0 2px 4px rgba(0,0,0,0.1))`,
      }}
    >
      <img 
        src={svgPaths[type]} 
        alt="" 
        className="w-full h-full object-contain"
        style={{
          filter: `brightness(0) saturate(100%) invert(64%) sepia(38%) saturate(443%) hue-rotate(38deg) brightness(93%) contrast(87%)`
        }}
      />
    </div>
  );
};
