import { ButtonGroup } from '@/components/ui/button-group';
import { Button } from '@/components/ui/button';
import { ChevronUp, HomeIcon } from 'lucide-react';

const ResetButtonGroup = () => {
  return (
    <ButtonGroup>
      <Button variant="outline" id="reset-view">
        <HomeIcon />
        Sinchon
      </Button>
      <Button variant="outline" size="icon">
        <ChevronUp />
      </Button>
    </ButtonGroup>
  );
};

export default ResetButtonGroup;
