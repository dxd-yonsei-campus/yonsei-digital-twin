import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { theme } from '@/store';
import { useStore } from '@nanostores/react';

type ThemePickerProps = {
  className?: string;
};

const ThemePicker = ({ className }: ThemePickerProps) => {
  const currentTheme = useStore(theme);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => theme.set(currentTheme === 'light' ? 'dark' : 'light')}
      className={className}
      aria-label="theme"
    >
      <Sun className="absolute size-5.5 rotate-0 opacity-100 transition-all duration-300 dark:rotate-45 dark:opacity-0" />
      <Moon className="absolute size-5.5 rotate-45 opacity-0 transition-all duration-300 dark:rotate-0 dark:opacity-100" />
    </Button>
  );
};

export default ThemePicker;
