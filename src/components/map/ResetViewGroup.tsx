import { ButtonGroup } from '@/components/ui/button-group';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronUp, HomeIcon } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { selectedCampus } from '@/store';
import { campuses, type CampusName } from '@/types/map';
import { flyToCampus } from '@/lib/mapApi';
import type { ui } from '@/i18n/ui';
import { useTranslations } from '@/i18n/utils';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

type ResetButtonGroupProps = {
  lang: keyof typeof ui;
};

const ResetButtonGroup = ({ lang }: ResetButtonGroupProps) => {
  const [isRendered, setIsRendered] = useState(false);
  const $selectedCampus = useStore(selectedCampus);
  const t = useTranslations(lang);

  useEffect(() => {
    setIsRendered(true);
  }, []);

  return (
    <ButtonGroup
      className={cn(
        isRendered ? 'opacity-100' : 'opacity-0',
        'transition-opacity duration-75',
      )}
    >
      <Button
        className={cn('w-9', lang === 'en' ? 'xs:w-26' : 'xs:w-20')}
        variant="outline"
        onClick={() => flyToCampus($selectedCampus, true)}
      >
        <HomeIcon />
        <span className={'sr-only xs:not-sr-only'}>
          {isRendered ? t($selectedCampus) : ''}
        </span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <ChevronUp />
            <span className="sr-only">Select Campus</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuRadioGroup
            value={$selectedCampus}
            onValueChange={(campus) => {
              selectedCampus.set(campus as CampusName);
              flyToCampus(campus as CampusName);
            }}
          >
            {campuses.map((campus) => {
              return (
                <DropdownMenuRadioItem key={campus} value={campus}>
                  {t(campus)}
                </DropdownMenuRadioItem>
              );
            })}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
};

export default ResetButtonGroup;
