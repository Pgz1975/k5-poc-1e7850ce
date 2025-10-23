import { ModelType } from '@/lib/speech/types/ModelType';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ModelSelectorProps {
  value: ModelType;
  onChange: (model: ModelType) => void;
  disabled?: boolean;
  showCostBadge?: boolean;
}

export function ModelSelector({ value, onChange, disabled, showCostBadge = true }: ModelSelectorProps) {
  const getModelInfo = (model: ModelType) => {
    switch(model) {
      case ModelType.WEB_SPEECH:
        return { label: '🌐 Web Speech API', cost: 'FREE', color: 'success' };
      case ModelType.GPT4O_MINI_REALTIME:
        return { label: '🤖 GPT-4o Mini', cost: '~$0.06/min', color: 'secondary' };
      case ModelType.GPT4O_REALTIME:
        return { label: '🚀 GPT-4o Realtime', cost: '~$0.60/min', color: 'destructive' };
      case ModelType.GPT4O_REALTIME_LEGACY:
        return { label: '📦 GPT-4o Legacy', cost: '~$0.60/min', color: 'secondary' };
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Speech Model</label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-3 w-3 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Choose between free browser-based or premium AI models</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.values(ModelType).map(model => {
            const info = getModelInfo(model);
            return (
              <SelectItem key={model} value={model}>
                <div className="flex items-center justify-between w-full gap-4">
                  <span>{info.label}</span>
                  {showCostBadge && (
                    <Badge variant={info.color as any} className="ml-auto">
                      {info.cost}
                    </Badge>
                  )}
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
