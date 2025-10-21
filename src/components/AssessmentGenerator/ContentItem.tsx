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
        border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md
        ${selected ? 'border-primary bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
      `}
      onClick={onToggle}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={selected}
          onCheckedChange={onToggle}
          onClick={(e) => e.stopPropagation()}
          className="mt-1"
        />

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {getIcon()}
            <span className="text-sm text-muted-foreground">
              {t('Página', 'Page')} {item.page_number} • {type}
            </span>
          </div>

          {type === 'text' && (
            <p className="text-sm line-clamp-3">{item.content}</p>
          )}

          {type === 'image' && (
            <div className="flex gap-3 items-center">
              <img
                src={item.url}
                alt={item.alt_text || 'PDF Image'}
                className="h-20 w-20 object-cover rounded"
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{item.alt_text}</p>
                {item.caption && (
                  <p className="text-xs text-muted-foreground mt-1">{item.caption}</p>
                )}
              </div>
            </div>
          )}

          {type === 'question' && (
            <div>
              <p className="font-medium mb-2">{item.question_text}</p>
              {item.options && (
                <div className="flex flex-wrap gap-2">
                  {item.options.map((opt: any, i: number) => (
                    <span
                      key={i}
                      className={`text-xs px-2 py-1 rounded ${
                        i === item.correct_answer
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-700'
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
