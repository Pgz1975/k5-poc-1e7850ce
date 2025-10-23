import { ModelMetadata } from '@/lib/speech/types/ModelMetadata';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PerformanceMetricsProps {
  metadata: ModelMetadata;
  latency?: number;
}

export function PerformanceMetrics({ metadata, latency }: PerformanceMetricsProps) {
  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold mb-3">📊 Performance Metrics</h3>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-muted-foreground">Accuracy:</span>
          <div className="font-medium">{(metadata.accuracy * 100).toFixed(0)}%</div>
        </div>
        <div>
          <span className="text-muted-foreground">Latency:</span>
          <div className="font-medium">{latency || metadata.averageLatency}ms</div>
        </div>
        <div className="col-span-2">
          <span className="text-muted-foreground">Provider:</span>
          <div className="font-medium capitalize">{metadata.provider}</div>
        </div>
        <div className="col-span-2">
          <span className="text-muted-foreground">Features:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {metadata.features.map(feature => (
              <Badge key={feature} variant="secondary" className="text-xs">
                {feature.replace(/-/g, ' ')}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
