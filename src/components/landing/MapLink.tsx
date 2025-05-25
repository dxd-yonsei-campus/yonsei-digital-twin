import { Button } from '@/components/ui/button';
import { campusNameToDisplayableName } from '@/lib/mapUtils';
import { selectedCampus } from '@/store';
import type { CampusName } from '@/types/map';

type MapLinkProps = {
  campus: CampusName;
};

const MapLink = ({ campus }: MapLinkProps) => {
  return (
    <Button
      variant="default"
      className="w-full cursor-pointer sm:w-fit"
      asChild
    >
      <a onClick={() => selectedCampus.set(campus)} href="/map">
        {campusNameToDisplayableName[campus]} Campus
      </a>
    </Button>
  );
};

export default MapLink;
