import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { languages, ui } from '@/i18n/ui';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type LanguagePickerProps = {
  className?: string;
  redirectPath?: string;
  children?: React.ReactElement;
  align?: 'center' | 'start' | 'end' | undefined;
  lang: keyof typeof ui;
};

const LanguagePicker = ({
  className,
  children,
  redirectPath,
  align = 'start',
  lang: currentLang,
}: LanguagePickerProps) => {
  // This is a controlled component as uncontrolled dropdown does not seem to work well with Safari.
  // See: https://github.com/radix-ui/primitives/issues/2580
  const [open, setOpen] = React.useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        className={className}
        asChild
        onClick={() => setOpen(!open)}
      >
        <Button variant="ghost">{children ? children : `Language`}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        className={cn(
          'w-34',
          { 'mr-4': align === 'end' },
          { 'ml-4': align === 'start' },
        )}
      >
        <DropdownMenuRadioGroup
          value={currentLang}
          onValueChange={(lang) => {
            window.location.href = `/${lang}/${redirectPath || ''}`;
          }}
        >
          {Object.entries(languages).map(([lang, label]) => (
            <DropdownMenuRadioItem key={lang} value={lang}>
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguagePicker;
