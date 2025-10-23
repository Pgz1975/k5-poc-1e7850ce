import { ModelType } from '@/lib/speech/types/ModelType';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface CostComparisonProps {
  currentModel: ModelType;
  sessionMinutes?: number;
  studentsCount?: number;
}

export function CostComparison({ 
  currentModel, 
  sessionMinutes = 10, 
  studentsCount = 100000 
}: CostComparisonProps) {
  const calculateCost = (model: ModelType): number => {
    const costPerMinute = {
      [ModelType.WEB_SPEECH]: 0,
      [ModelType.GPT4O_MINI_REALTIME]: 0.06,
      [ModelType.GPT4O_REALTIME]: 0.60,
      [ModelType.GPT4O_REALTIME_LEGACY]: 0.60
    };

    return costPerMinute[model] * sessionMinutes * studentsCount;
  };

  const models = [
    { type: ModelType.WEB_SPEECH, name: 'Web Speech API', color: 'hsl(var(--success))' },
    { type: ModelType.GPT4O_MINI_REALTIME, name: 'GPT-4o Mini', color: 'hsl(var(--secondary))' },
    { type: ModelType.GPT4O_REALTIME, name: 'GPT-4o Realtime', color: 'hsl(var(--destructive))' }
  ];

  const maxCost = Math.max(...models.map(m => calculateCost(m.type)));

  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold mb-3">💰 Cost Comparison (Annual Estimate)</h3>
      <div className="space-y-3">
        {models.map(model => {
          const cost = calculateCost(model.type);
          const percentage = maxCost > 0 ? (cost / maxCost) * 100 : 0;
          const isActive = model.type === currentModel;

          return (
            <div 
              key={model.type} 
              className={`space-y-1 transition-all ${
                isActive ? 'ring-2 ring-primary rounded-md p-2 bg-primary/5' : ''
              }`}
            >
              <div className="flex justify-between text-sm">
                <span className="font-medium">{model.name}</span>
                <span className={cost === 0 ? 'text-success font-bold' : 'text-foreground'}>
                  {cost === 0 ? 'FREE' : `$${cost.toLocaleString()}/year`}
                </span>
              </div>
              <Progress value={percentage} className="h-2" />
            </div>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground mt-3">
        Based on {studentsCount.toLocaleString()} students, {sessionMinutes} min/session
      </p>
    </Card>
  );
}
