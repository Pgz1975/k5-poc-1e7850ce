import { DOMAIN_THEMES } from "@/config/domainThemes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DomainSelectorProps {
  value: string | null;
  onValueChange: (value: string) => void;
  language?: string;
}

export const DomainSelector = ({ value, onValueChange, language = 'es' }: DomainSelectorProps) => {
  // Get Spanish domains (filter out English names)
  const domains = Object.keys(DOMAIN_THEMES)
    .filter(key => 
      !key.includes('Awareness') && 
      !key.includes('Phonics') && 
      !key.includes('Comprehension') && 
      !key.includes('Vocabulary') && 
      !key.includes('Syllable')
    )
    .sort((a, b) => DOMAIN_THEMES[a].order - DOMAIN_THEMES[b].order);

  return (
    <Select value={value || undefined} onValueChange={onValueChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Seleccionar dominio" />
      </SelectTrigger>
      <SelectContent>
        {domains.map((domain) => {
          const theme = DOMAIN_THEMES[domain];
          const Icon = theme.icon;
          return (
            <SelectItem key={domain} value={domain}>
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4" style={{ color: theme.color }} />
                <span>{domain}</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
