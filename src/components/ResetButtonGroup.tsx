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
import { campusNameToDisplayableName } from '@/lib/mapUtils';

const ResetButtonGroup = () => {
  const $selectedCampus = useStore(selectedCampus);
  return (
    <ButtonGroup>
      <Button variant="outline" id="reset-view">
        <HomeIcon />
        {campusNameToDisplayableName[$selectedCampus]}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <ChevronUp />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuRadioGroup
            value={$selectedCampus}
            onValueChange={(campus) => selectedCampus.set(campus as CampusName)}
          >
            {campuses.map((campus) => {
              return (
                <DropdownMenuRadioItem key={campus} value={campus}>
                  {campusNameToDisplayableName[campus]}
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
