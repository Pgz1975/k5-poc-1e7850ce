import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface AudioWaveformProps {
  frequencyData: Uint8Array;
  audioLevel: number;
  isActive: boolean;
  className?: string;
}

export function AudioWaveform({
  frequencyData,
  audioLevel,
  isActive,
  className,
}: AudioWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.fillStyle = "#f8f9fa";
      ctx.fillRect(0, 0, width, height);

      if (!isActive) {
        ctx.strokeStyle = "#e0e0e0";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
        return;
      }

      const barWidth = width / frequencyData.length;
      const barSpacing = 2;

      for (let i = 0; i < frequencyData.length; i++) {
        const value = frequencyData[i];
        const percent = value / 255;
        const barHeight = percent * height;
        const x = i * (barWidth + barSpacing);
        const y = (height - barHeight) / 2;

        const hue = 200 + percent * 60;
        ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
        ctx.fillRect(x, y, barWidth, barHeight);
      }

      const levelPercent = Math.max(0, Math.min(1, (audioLevel + 60) / 60));
      ctx.fillStyle = levelPercent > 0.5 ? "#22c55e" : "#f59e0b";
      ctx.fillRect(0, height - 4, width * levelPercent, 4);
    };

    draw();
    const interval = setInterval(draw, 50);
    return () => clearInterval(interval);
  }, [frequencyData, audioLevel, isActive]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={120}
      className={cn("w-full rounded-lg", className)}
    />
  );
}
