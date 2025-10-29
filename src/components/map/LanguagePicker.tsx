import { languages, ui } from '@/i18n/ui';
import { cn } from '@/lib/utils';

interface LanguagePickerProps {
  lang: keyof typeof ui;
  redirectPath: string;
  className?: string;
}

const LanguagePicker = ({
  lang,
  redirectPath,
  className,
}: LanguagePickerProps) => {
  return (
    <div className={cn('flex gap-1.5', className)}>
      {Object.entries(languages).map(([l]) => (
        <div
          key={l}
          className={cn(
            'transition-colors',
            lang === l ? 'text-foreground' : 'text-muted-foreground/70',
            { 'hover:text-muted-foreground': lang !== l },
          )}
        >
          <a href={`/${l}/${redirectPath}`}>{l.toUpperCase()}</a>
        </div>
      ))}
    </div>
  );
};

export default LanguagePicker;
