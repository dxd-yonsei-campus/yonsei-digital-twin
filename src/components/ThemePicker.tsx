import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { theme } from '@/store';
import { useStore } from '@nanostores/react';
import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';

type ThemePickerProps = {
  className?: string;
};

const ThemePicker = ({ className }: ThemePickerProps) => {
  const currentTheme = useStore(theme);
  const [isRendered, setIsRendered] = React.useState(false);

  useEffect(() => {
    setIsRendered(true);
  }, []);

  if (!isRendered) {
    return <Button variant="ghost" size="icon" className={className}></Button>;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => theme.set(currentTheme === 'light' ? 'dark' : 'light')}
      className={className}
    >
      <svg
        className={cn('size-5.5')}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <Sun
          className={cn(
            'rotate-0 opacity-100 transition-all duration-300 dark:rotate-90 dark:opacity-0',
          )}
        />
        <Moon
          className={cn(
            'rotate-90 opacity-0 transition-all duration-300 dark:rotate-0 dark:opacity-100',
          )}
        />
      </svg>
    </Button>
  );
};

export default ThemePicker;
