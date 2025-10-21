import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/contexts/LanguageContext";
import { FileText, Image, HelpCircle } from "lucide-react";

interface ContentItemProps {
  item: any;
  type: 'text' | 'image' | 'question';
  selected: boolean;
  onToggle: () => void;
}

export function ContentItem({ item, type, selected, onToggle }: ContentItemProps) {
  const { t } = useLanguage();

  const getIcon = () => {
    switch (type) {
      case 'text':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'image':
        return <Image className="h-5 w-5 text-green-500" />;
      case 'question':
        return <HelpCircle className="h-5 w-5 text-purple-500" />;
    }
  };

  return (
    <div
      className={`
        border rounded-lg p-3 cursor-pointer transition-all
        ${selected ? 'border-primary bg-primary/5 shadow-sm' : 'border-border hover:border-primary/50 bg-card'}
      `}
      onClick={onToggle}
    >
      <div className="flex items-start gap-2">
        <Checkbox
          checked={selected}
          onCheckedChange={onToggle}
          onClick={(e) => e.stopPropagation()}
          className="mt-0.5"
        />

        <div className="flex-1 min-w-0">
          {type === 'text' && (
            <p className="text-sm line-clamp-2">{item.content}</p>
          )}

          {type === 'image' && (
            <div className="flex gap-3 items-start">
              <img
                src={item.url}
                alt={item.alt_text || 'PDF Image'}
                className="h-24 w-24 object-cover rounded border flex-shrink-0"
                onError={(e) => {
                  console.error('Image failed to load:', item.url);
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%23999"%3EImage%3C/text%3E%3C/svg%3E';
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-2">{item.alt_text}</p>
                {item.caption && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{item.caption}</p>
                )}
              </div>
            </div>
          )}

          {type === 'question' && (
            <div>
              <p className="font-medium mb-2 text-sm">{item.question_text}</p>
              {item.options && item.options.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {item.options.map((opt: any, i: number) => (
                    <span
                      key={i}
                      className={`text-xs px-2 py-0.5 rounded ${
                        i === item.correct_answer
                          ? 'bg-success/20 text-success-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {i === item.correct_answer && '✓ '}
                      {opt}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
